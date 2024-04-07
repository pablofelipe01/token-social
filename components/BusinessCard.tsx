import { Box, Text, Button, useToast, useColorMode, Spinner } from '@chakra-ui/react';
import { MediaRenderer } from "@thirdweb-dev/react";
import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useAddress, useContract, useNFT, useContractRead } from "@thirdweb-dev/react";
import { BUSINESSES_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../constants/contracts";

// Props for the BusinessCard component
type Props = {
    tokenId: number;
};

export default function BusinessCard({ tokenId }: Props) {
    const toast = useToast();
    const address = useAddress();
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const [isClaiming, setIsClaiming] = useState(false);
    const { colorMode } = useColorMode();

    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS);
    const { data: nft } = useNFT(businessesContract, tokenId);

    const { contract: stakingContact } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: businessRewards } = useContractRead(
        stakingContact,
        "getStakeInfoForToken",
        [tokenId, address]
    );

    useEffect(() => {
        if (!stakingContact || !address) return;

        const loadClaimableRewards = async () => {
            const stakeInfo = await stakingContact.call("getStakeInfoForToken", [tokenId, address]);
            setClaimableRewards(stakeInfo[1]);
        };

        loadClaimableRewards();
        const intervalId = setInterval(loadClaimableRewards, 1000);
        return () => clearInterval(intervalId);
    }, [stakingContact, address, tokenId]);

    const truncateRevenue = (revenue: BigNumber) => ethers.utils.formatEther(revenue).slice(0, 6);

    const handleClaimRevenue = async () => {
        // Ensure stakingContact is defined before proceeding
        if (!stakingContact) {
            toast({
                title: "Error",
                description: "Staking contract is not loaded.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsClaiming(true); // Start loading
        try {
            await stakingContact.call("claimRewards", [tokenId]);
            toast({
                title: "Revenue claimed successfully.",
                description: "Your revenue has been claimed.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error claiming revenue.",
                description: "An error occurred while claiming revenue.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error claiming revenue:", error);
        }
        setIsClaiming(false); // Stop loading
    };

    return (
        <Box bg="#6564646c" p="4" borderRadius="md" boxShadow="xl" border="1px" borderColor="rgba(255, 255, 255, 0.2)">
            <MediaRenderer src={nft?.metadata.image} style={{ width: '100%', height: 'auto', borderRadius: "10px" }} />
            <Box m="2" color={colorMode === 'light' ? 'white' : 'white'}>
                <Text fontSize="lg" fontWeight="bold">{nft?.metadata.name}</Text>
                {businessRewards && businessRewards[1].gt(0) && (
                    <Text>Qty: {businessRewards[0].toNumber()}</Text>
                )}
                {claimableRewards && (
                    <Text>Revenue: {truncateRevenue(claimableRewards)}</Text>
                )}
            </Box>
            <Button
                colorScheme="blue"
                onClick={handleClaimRevenue}
                mt="4"
                isDisabled={isClaiming}
            >
                {isClaiming ? <Spinner size="sm" /> : "Claim Revenue"}
            </Button>
        </Box>
    );
}
