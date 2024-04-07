import { Box, Button, Heading, Text, VStack, useToast, Center } from '@chakra-ui/react';
import { MediaRenderer, useAddress, useClaimConditions, useContract } from "@thirdweb-dev/react";
import { NFT, toEther } from "@thirdweb-dev/sdk";
import { BUSINESSES_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../constants/contracts";
import { useState } from "react";

type Props = {
    nft: NFT;
};

export default function NFTCard({ nft }: Props) {
    const address = useAddress();
    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS, "edition-drop");
    const { data: claimCondition } = useClaimConditions(businessesContract, nft.metadata.id);
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);

    const [claimState, setClaimState] = useState<"init" | "nftClaim" | "staking">("init");
    const toast = useToast();

    const handleClaim = async () => {
        if (!address) return;

        setClaimState("nftClaim");
        try {
            await businessesContract?.erc1155.claim(nft.metadata.id, 1);
            toast({ title: "NFT claimed", status: "success" });

            setClaimState("staking");
            const isApproved = await businessesContract?.isApproved(address, STAKING_CONTRACT_ADDRESS);
            if (!isApproved) {
                await businessesContract?.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
            }
            await stakingContract?.call("stake", [nft.metadata.id, 1]);
            toast({ title: "NFT staked", status: "success" });
        } catch (error) {
            console.error(error);
            // Updated error handling
            if (error instanceof Error) {
                toast({ title: "An error occurred", description: error.message, status: "error" });
            } else {
                // Fallback error handling if the error is not an instance of Error
                toast({ title: "An error occurred", status: "error" });
            }
        } finally {
            setClaimState("init");
        }
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="5">
            <Center>
                <MediaRenderer src={nft.metadata.image} />
            </Center>
            <VStack spacing={4} mt="4">
                <Heading size="md">{nft.metadata.name}</Heading>
                {claimCondition && claimCondition.length > 0 && (
                    claimCondition.map((condition, index) => (
                        <Box key={index}>
                            <Text>Cost: {toEther(condition.price)} {condition.currencyMetadata.symbol}</Text>
                            <Text>Earns: {parseFloat(toEther(condition.price)) * 0.1} {condition.currencyMetadata.symbol}/hour</Text>
                        </Box>
                    ))
                )}
                <Button
                    colorScheme="blue"
                    onClick={handleClaim}
                    isLoading={claimState !== "init"}
                    loadingText={claimState === "nftClaim" ? "Purchasing content..." : "Staking content..."}
                >
                    Buy Now
                </Button>
            </VStack>
        </Box>
    );
}
