import React, { useEffect, useState } from "react";
import {
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, VStack, HStack, Heading, useToast, Text, Select
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import api from "../api";
import { saveAs } from "file-saver";

const MotionBox = motion(Box);

export default function Investors() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", investment: "" });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const toast = useToast();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/investors");
      setList(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to fetch investors.", status: "error" });
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: "Name and Email are required", status: "warning" });
      return;
    }

    try {
      if (editing) {
        await api.put(`/investors/${editing}`, form);
        toast({ title: "Investor updated", status: "success" });
        setEditing(null);
      } else {
        await api.post("/investors", form);
        toast({ title: "Investor added", status: "success" });
      }
      setForm({ name: "", email: "", phone: "", company: "", investment: "" });
      fetchAll();
    } catch (err) {
      console.error(err);
      toast({ title: "Action failed", status: "error" });
    }
  };

  const handleEdit = (inv) => {
    setEditing(inv.id);
    setForm({ name: inv.name, email: inv.email, phone: inv.phone || "", company: inv.company || "", investment: inv.investment || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this investor?")) return;
    try {
      await api.delete(`/investors/${id}`);
      toast({ title: "Investor deleted", status: "success" });
      fetchAll();
    } catch (err) { console.error(err); toast({ title: "Delete failed", status: "error" }); }
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Name", "Email", "Phone", "Company", "Investment"],
      ...list.map(i => [i.id, i.name, i.email, i.phone, i.company, i.investment])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "investors.csv");
  };

  const filteredList = list
    .filter(inv =>
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      (inv.company?.toLowerCase() ?? "").includes(search.toLowerCase())
    )
    .sort((a, b) => (a[sortField] ?? "").localeCompare(b[sortField] ?? ""));

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading mb={6} color="blue.800">Investors</Heading>

      {/* Search, sort, export */}
      <HStack mb={6} spacing={4} flexWrap="wrap">
        <Input placeholder="Search by name or company" value={search} onChange={e => setSearch(e.target.value)} maxW="300px" borderWidth={2} borderColor="blue.300" />
        <Select value={sortField} onChange={e => setSortField(e.target.value)} maxW="200px" borderWidth={2} borderColor="blue.300">
          <option value="name">Sort by Name</option>
          <option value="company">Sort by Company</option>
        </Select>
        <Button colorScheme="green" onClick={handleExport}>Export CSV</Button>
      </HStack>

      {/* Inline form */}
      <Box mb={6} p={4} borderRadius="md" shadow="md" bg="gray.50" borderWidth={1} borderColor="blue.200">
        <form onSubmit={handleSubmit}>
          <HStack spacing={4} flexWrap="wrap">
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxW="200px" required borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} maxW="250px" required borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxW="180px" borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} maxW="200px" borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Investment" value={form.investment} onChange={e => setForm({ ...form, investment: e.target.value })} maxW="180px" borderWidth={2} borderColor="blue.300" />
            <Button type="submit" colorScheme="blue">{editing ? "Update" : "Add"} Investor</Button>
          </HStack>
        </form>
      </Box>

      {loading ? <Spinner size="xl" /> : (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Desktop Table */}
          <Table variant="simple" mb={4} display={{ base: "none", md: "table" }} borderWidth={2} borderColor="blue.200">
            <Thead bg="blue.800" color="white">
              <Tr>
                <Th borderColor="blue.300">ID</Th>
                <Th borderColor="blue.300">Name</Th>
                <Th borderColor="blue.300">Email</Th>
                <Th borderColor="blue.300">Phone</Th>
                <Th borderColor="blue.300">Company</Th>
                <Th borderColor="blue.300">Investment</Th>
                <Th borderColor="blue.300">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredList.map(inv => (
                <Tr key={inv.id} borderWidth={1} borderColor="blue.100" _hover={{ bg: "blue.50" }}>
                  <Td borderColor="blue.200">{inv.id}</Td>
                  <Td borderColor="blue.200">{inv.name}</Td>
                  <Td borderColor="blue.200">{inv.email}</Td>
                  <Td borderColor="blue.200">{inv.phone}</Td>
                  <Td borderColor="blue.200">{inv.company}</Td>
                  <Td borderColor="blue.200">{inv.investment}</Td>
                  <Td borderColor="blue.200">
                    <Button size="sm" colorScheme="cyan" mr={2} onClick={() => handleEdit(inv)}>Edit</Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(inv.id)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Mobile Cards */}
          <VStack spacing={4} display={{ base: "flex", md: "none" }}>
            {filteredList.map(inv => (
              <Box key={inv.id} p={4} bg="white" shadow="md" borderRadius="md" w="100%" borderWidth={2} borderColor="blue.200">
                <Text><strong>ID:</strong> {inv.id}</Text>
                <Text><strong>Name:</strong> {inv.name}</Text>
                <Text><strong>Email:</strong> {inv.email}</Text>
                <Text><strong>Phone:</strong> {inv.phone}</Text>
                <Text><strong>Company:</strong> {inv.company}</Text>
                <Text><strong>Investment:</strong> {inv.investment}</Text>
                <HStack mt={2}>
                  <Button size="sm" colorScheme="cyan" onClick={() => handleEdit(inv)}>Edit</Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDelete(inv.id)}>Delete</Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </MotionBox>
      )}
    </Box>
  );
}
