// verifyApplicant.jsx
import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Divider,
  List,
  ListIcon,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "../../AuthAxios.js";
import DashboardReviewer from "./dashboardReviewer.jsx";

const VerifyApplicant = ({ loggedInReviewerId }) => {
  const [applicants, setApplicants] = useState([]);
  const showToast = useToast();

  // to get all applicants
  console.log(localStorage.getItem("userToken"));

  useEffect(() => {
    axios
      .get("/users/allapplicant")
      .then((response) => {
        console.log(response.data);
        setApplicants(
          response.data.data
            .filter((applicant) => applicant.isVarified === false)
            .map((applicant) => {
              return {
                id: applicant._id,
                name: applicant.name,
                email: applicant.email, 
                contact: applicant.mobile,
                apostolate: applicant.apostolate,
                status: "pending",
              };
            })
        );
      })
      .catch((error) =>
        // console.log(error);
        showToast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 500,
        })
      );
  }, [showToast]);

  const handleVerify = (applicantId) => {
    // Update the status of the applicant to "Verified"
    axios
      .put("/users/applicantvarify", {
        applicant: applicantId,
      })
      .then((res) => {
        console.log(res);
        setApplicants((prevApplicants) =>
          prevApplicants.filter((applicant) => applicant.id !== applicantId)
        );
      })
      .catch((error) => {
        showToast({
          title: "Error verifying user",
          status: "error",
          duration: 500,
        });
      });
  };
  // Create a function for addition
  const handleDecline = (applicantId) => {
    // Update the status of the applicant to "Declined"
    axios
      .delete("/users/applicantunvarify", {
        applicant: applicantId,
      })
      .then(() =>
        setApplicants((prevApplicants) =>
          prevApplicants.filter((applicant) => applicant.id !== applicantId)
        )
      )
      .catch((_) =>
        showToast({
          title: "Error unvarifying applicant",
          duration: 5000,
          status: "error",
        })
      );
  };

  return (
    <ChakraProvider>
      <Flex w="100vw" h="full" >
        <VStack w="30%" h="100vh" overflowY="scroll">
          <DashboardReviewer></DashboardReviewer>
        </VStack>
      <Box p={4}  w="70%" h='100vh' overflowY={'scroll'} overflowX={'hidden'} bg="gray.100" borderRadius="lg">
        <Heading as="h1" size="xl" mb={6} textAlign="center" color="blue.500">
          Verify Applicants
        </Heading>

        <List spacing={3} width="100%">
          {applicants.length > 0 ? (
            applicants.map((applicant) => (
              <Box
                key={applicant.id}
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                width="100%"
              >
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="blue.500">
                    {applicant.name}
                  </Heading>
                  <VStack align="flex-end" spacing={2}>
                  <Text fontSize="md" color="gray.600">
                    Status: {applicant.status}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Email: {applicant.email}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Contact: {applicant.contact}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Appostolate: {applicant.apostolate}
                  </Text>
                  </VStack>
                </Flex>
                <Divider mt={4} mb={4} />
                <VStack spacing={3}>
                  <Button
                    leftIcon={<ListIcon as={FaCheck} />}
                    colorScheme="green"
                    onClick={() => handleVerify(applicant.id)}
                  >
                    Verify
                  </Button>
                  <Button
                    leftIcon={<ListIcon as={FaTimes} />}
                    colorScheme="red"
                    onClick={() => handleDecline(applicant.id)}
                  >
                    Decline
                  </Button>
                </VStack>
              </Box>
            ))
          ) : (
            <Text textAlign="center" color="gray.600">
              No applicants for the logged-in reviewer.
            </Text>
          )}
        </List>
      </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default VerifyApplicant;
