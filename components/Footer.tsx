import { Box, Text, Link, VStack, HStack } from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <Box as="footer" bg="gray.100" color="gray.600" py={4}>
            <VStack spacing={4}>
                <Text>© 2024 [creator`s Name]. All rights reserved.</Text>
                <HStack spacing={10}>
                    <Link href="/terms" color="blue.500">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" color="blue.500">
                        Privacy Policy
                    </Link>
                </HStack>
                <HStack spacing={4}>
                    <Link href="https://twitter.com" isExternal>
                        <FaTwitter size="1.5em" />
                    </Link>
                    <Link href="https://facebook.com" isExternal>
                        <FaFacebook size="1.5em" />
                    </Link>
                    <Link href="https://instagram.com" isExternal>
                        <FaInstagram size="1.5em" />
                    </Link>
                </HStack>
            </VStack>
        </Box>
    );
};

export default Footer;
