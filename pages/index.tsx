import { useUser } from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getUser } from "./api/auth/[...thirdweb]";
import Worker from "../components/Worker";
import Businesses from "../components/Businesses";
import { Box, Flex, ChakraProvider, useBreakpointValue } from "@chakra-ui/react";

const Home: NextPage = () => {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  // Use the `useBreakpointValue` hook to adjust flex direction based on the viewport size
  // Explicitly handle `undefined` by providing a default value
  const flexDir = useBreakpointValue({ base: 'column', md: 'row' }) || 'column';

  return (
    <ChakraProvider>
      <Box>
        <Flex
          direction={flexDir as any} // Dynamically adjust based on screen size, with 'column' as the default
          align="flex-start"
          justify="flex-start"
          width="100%"
        >
          <Worker />
          <Businesses />
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Home;

// Server-side function remains the same
export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
