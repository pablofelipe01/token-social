import { useContract, useNFTs, useUser } from "@thirdweb-dev/react";
import { BUSINESSES_CONTRACT_ADDRESS } from "../constants/contracts";
import NFTCard from "../components/NFTCard";
import { getUser } from "./api/auth/[...thirdweb]";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Box, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";

export default function Shop() {
    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS);
    const { data: businesses } = useNFTs(businessesContract);
    const { isLoggedIn, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn && !isLoading) {
        router.push("/login");
      }
    }, [isLoggedIn, isLoading, router]);

    const { colorMode } = useColorMode();
    const textColor = { light: 'gray.800', dark: 'white' };

    return (
        <Box padding={5}>
            <Text fontSize="2xl" color={textColor[colorMode]} mb={4}>[Creator`s Name] Premium Content</Text>
            <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} spacing={5} >
                {businesses && businesses.length > 0 ? (
                    businesses.map((business) => (
                       
                        <Box key={business.metadata.id} style={{ width: '100%', height: 'auto', borderRadius: "10px" }}>
                            <NFTCard
                             nft={business}
                            />
                       </Box>

                    ))
                ) : (
                    <Text color={textColor[colorMode]}>No premium content for sale.</Text>
                )}
            </SimpleGrid>
        </Box>
    );
}
