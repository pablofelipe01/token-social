import React from 'react';
import {
  Flex,
  Box,
  Text,
  Button,
  IconButton,
  useColorMode,
  Image,
  VStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { ConnectWallet, useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import { TOKEN_CONTRACT_ADDRESS } from "../constants/contracts";
import NextLink from "next/link";

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    // Updated ref type to HTMLDivElement
    const btnRef = React.useRef<HTMLDivElement | null>(null);
    const address = useAddress();
    const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);

    const truncateNumber = (num: string) => {
        return num.slice(0, 6);
    }

    return (
        <>
            <Flex align="center" justify="space-between" p={4} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderBottom="1px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}>
                <Box display={{ base: 'block', md: 'none' }} ref={btnRef} onClick={onOpen}>
                    <IconButton
                        icon={<HamburgerIcon />}
                        variant="outline"
                        aria-label="Open Menu"
                    />
                </Box>
                <Flex display={{ base: 'none', md: 'flex' }} align="center" justify="space-between" flex={1}>
                    {address && (
                        <>
                            <Image src="/logo.png" alt="Logo" boxSize="50px"/>
                            <Flex>
                                <NextLink href="/" passHref>
                                    <Button as="a" px={2} variant="ghost">
                                        Cuenta
                                    </Button>
                                </NextLink>
                                <NextLink href="/shop" passHref>
                                    <Button as="a" px={2} variant="ghost">
                                        Premium
                                    </Button>
                                </NextLink>
                                <Button as="a" href="https://dex-social.vercel.app/" px={2} variant="ghost" target="_blank" rel="noopener noreferrer">
                                    DEX
                                </Button>

                            </Flex>
                            <Flex align="center">
                                {tokenBalance && (
                                    <Text mr={4}>{truncateNumber(tokenBalance?.displayValue)} {tokenBalance?.symbol}</Text>
                                )}
                                <ConnectWallet />
                                <IconButton
                                    aria-label="Toggle dark mode"
                                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                    onClick={toggleColorMode}
                                    ml={4}
                                />
                            </Flex>
                        </>
                    )}
                </Flex>
            </Flex>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>[Creator`s Name]</DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={4}>
                            <NextLink href="/" passHref>
                                <Button as="a" w="full" variant="ghost">
                                    Account
                                </Button>
                            </NextLink>
                            <NextLink href="/shop" passHref>
                                <Button as="a" w="full" variant="ghost">
                                    Premium
                                </Button>
                            </NextLink>

                            <Button as="a" href="https://dex-social.vercel.app/" px={2} variant="ghost" target="_blank" rel="noopener noreferrer">
                                    DEX
                                </Button>
                            {address && tokenBalance && (
                                <Text w="full" textAlign="center">{truncateNumber(tokenBalance?.displayValue)} {tokenBalance?.symbol}</Text>
                            )}
                            <ConnectWallet />
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter justifyContent="start">
                        <IconButton
                            aria-label="Toggle dark mode"
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                        />
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Navbar;
