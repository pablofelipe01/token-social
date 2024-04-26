import { Box, Grid, Text } from '@chakra-ui/react';
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { STAKING_CONTRACT_ADDRESS } from "../constants/contracts";
import BusinessCard from "./BusinessCard"; // Update the import path as necessary
import { BigNumber } from 'ethers'; // Import BigNumber from ethers

const Businesses = () => {
    const address = useAddress();
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS); // Corrected a typo here from stakingContact to stakingContract
    const { data: stakedTokens, isLoading: loadingBusinesses } = useContractRead(stakingContract, "getStakeInfo", [address]);

    return (
        <Box width={{ base: "100%", md: "50%" }} p={4}>
            <Text fontSize="2xl" mb="4" color="blue.500" fontWeight="bold" textAlign="center" textTransform="uppercase" letterSpacing="wider">Contenido Exclusivo</Text>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                {!loadingBusinesses ? (
                    stakedTokens && stakedTokens[0].length > 0 ? stakedTokens[0].map((tokenId: BigNumber) => (
                        <BusinessCard key={tokenId.toString()} tokenId={tokenId.toNumber()} />
                    )) : <Text fontSize="lg" color="gray.600" textAlign="center">Aún No tienes contenido exclusivo 😔</Text>

                ) : <Text>Loading Exclusive Content...</Text>}
            </Grid>
        </Box>
    );
};

export default Businesses;
