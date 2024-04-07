import { Box, Flex, Heading, Text, Stack } from '@chakra-ui/react';
import { MediaRenderer, useAddress, useContract, useOwnedNFTs, useTokenBalance } from "@thirdweb-dev/react";
import { TOKEN_CONTRACT_ADDRESS, WORKER_CONTRACT_ADDRESS } from "../constants/contracts";

const Worker = () => {
    const address = useAddress();
    const { contract: workerContract } = useContract(WORKER_CONTRACT_ADDRESS);
    const { data: ownedWorkers, isLoading: loadingWorker } = useOwnedNFTs(workerContract, address);
    const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);

    const truncateNumber = (num: string) => num.slice(0, 6);

    return (
        <Box width={{ base: "90%", md: "75%", lg: "50%" }} mx="auto">
            {!loadingWorker ? (
                ownedWorkers && ownedWorkers.length > 0 ? (
                    ownedWorkers.map((worker) => (
                        <Stack key={worker.metadata.id} spacing="4" p={{ base: "3", md: "5" }} borderWidth="1px" borderRadius="lg" overflow="hidden" my="4">
                            <Box>
                                <Heading size="md" mb="2">Super Fan Account</Heading>
                                <Box borderRadius="10px" overflow="hidden">
                                    <MediaRenderer 
                                        src={worker.metadata.image}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Text fontWeight="bold">{worker.metadata.name} - ID: #{worker.metadata.id}</Text>
                                {tokenBalance && (
                                    <Text>Balance: {truncateNumber(tokenBalance?.displayValue as string)} {tokenBalance?.symbol}</Text>
                                )}
                            </Box>
                        </Stack>
                    ))
                ) : (
                    <Text textAlign="center">No Fan Found.</Text>
                )
            ) : (
                <Text textAlign="center">Loading Fan...</Text>
            )}
        </Box>
    );
};

export default Worker;
