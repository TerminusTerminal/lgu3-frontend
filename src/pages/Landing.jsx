import React from "react";
import { Box, Button, Flex, Heading, Text, VStack, HStack, Container, SimpleGrid, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaClipboardList, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import Topbar from "../components/Topbar";

const MotionBox = motion(Box);

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaUsers,
      title: "Investor Management",
      description: "Track and manage all your investors efficiently.",
      action: () => navigate("/investors"),
      buttonText: "Go to Investors",
    },
    {
      icon: FaClipboardList,
      title: "Application Processing",
      description: "Submit, review, and approve applications seamlessly.",
      action: () => navigate("/applications"),
      buttonText: "Go to Applications",
    },
    {
      icon: FaChartLine,
      title: "Reports & Analytics",
      description: "Generate detailed reports and analytics easily.",
      action: () => navigate("/reports"),
      buttonText: "View Reports",
    },
  ];

  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, blue.100)">
      <Topbar />

      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        py={20}
        px={10}
        maxW="1200px"
        mx="auto"
      >
        <VStack align="start" spacing={6} maxW="600px">
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading as="h1" size="2xl" color="blue.800">
              Welcome to LGU Management System
            </Heading>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Text fontSize="lg" color="blue.700">
              Manage investors, incentives, applications, and reports efficiently with a single dashboard.
            </Text>
          </MotionBox>

          <HStack spacing={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button colorScheme="blue" size="lg" onClick={() => navigate("/login")}>
                Login
              </Button>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button variant="outline" colorScheme="blue" size="lg" onClick={() => navigate("/register")}>
                Register
              </Button>
            </MotionBox>
          </HStack>
        </VStack>

        <MotionBox
          mt={{ base: 10, md: 0 }}
          flex="1"
          textAlign="center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Box bg="blue.200" rounded="2xl" h="300px" w={{ base: "100%", md: "80%" }} mx="auto" shadow="xl" />
        </MotionBox>
      </Flex>

      <Container maxW="1200px" mt={20} mb={20}>
        <Heading textAlign="center" mb={10} color="blue.800">
          Key Features
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {features.map((feature, i) => (
            <MotionBox
              key={i}
              bg="white"
              p={6}
              rounded="xl"
              shadow="md"
              textAlign="center"
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Icon as={feature.icon} boxSize={10} color="blue.500" mb={4} />
              <Heading size="md" mb={2}>{feature.title}</Heading>
              <Text mb={4}>{feature.description}</Text>
              <Button colorScheme="blue" size="sm" onClick={feature.action}>{feature.buttonText}</Button>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      <Box bg="blue.50" py={6} textAlign="center" borderTop="1px solid" borderColor="blue.100">
        <Text color="blue.700">&copy; {new Date().getFullYear()} LGU Management System. All rights reserved.</Text>
      </Box>
    </Box>
  );
}
