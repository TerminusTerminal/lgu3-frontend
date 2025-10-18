import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import api from "../api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading summary...</Text>;

  const investorsOverTime = summary.investors_over_time || [
    { month: "Jan", investors: 10 },
    { month: "Feb", investors: 15 },
    { month: "Mar", investors: 20 },
  ];

  const applicationsStatus = summary.applications_status || [
    { status: "Pending", count: summary.pending_applications || 0 },
    { status: "Approved", count: summary.approved_applications || 0 },
    { status: "Rejected", count: summary.rejected_applications || 0 },
  ];

  const allocatedAmounts = summary.allocated_over_time || [
    { month: "Jan", amount: 10000 },
    { month: "Feb", amount: 25000 },
    { month: "Mar", amount: 40000 },
  ];

  return (
    <Container maxW="container.xl" py={6}>
      <Heading as="h1" size="xl" mb={4}>
        Dashboard
      </Heading>
      <Text mb={6}>Welcome, {localStorage.getItem("user_name") || "User"}</Text>

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
        <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={2}>Investors</Heading>
          <Text>{summary.total_investors ?? 0}</Text>
        </Box>
        <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={2}>Projects</Heading>
          <Text>{summary.total_projects ?? 0}</Text>
        </Box>
        <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={2}>Applications Pending</Heading>
          <Text>{summary.pending_applications ?? 0}</Text>
        </Box>
        <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={2}>Applications Approved</Heading>
          <Text>{summary.approved_applications ?? 0}</Text>
        </Box>
        <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={2}>Total Allocated</Heading>
          <Text>{summary.total_allocated_amount ?? 0}</Text>
        </Box>
        <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={2}>Incentives</Heading>
          <Text>{summary.total_incentives ?? 0}</Text>
        </Box>
      </Grid>

      <Box mt={10}>
        <Heading size="lg" mb={4}>Overview Graphs</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={2}>Investors Over Time</Heading>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={investorsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="investors" stroke="#115272" />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={2}>Applications Status</Heading>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={applicationsStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#115272" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box p={5} borderWidth={1} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={2}>Allocated Amounts</Heading>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={allocatedAmounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#F97316" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Box>
    </Container>
  );
}
