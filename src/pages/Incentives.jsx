import React, { useEffect, useState } from "react";
import {
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, VStack, HStack, Heading, useToast, Text, Select
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import api from "../api";
import { saveAs } from "file-saver";

const MotionBox = motion(Box);

export default function Incentives() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: "", type: "general" });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("title");
  const toast = useToast();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/incentives");
      setList(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to fetch incentives.", status: "error" });
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast({ title: "Title is required", status: "warning" });
      return;
    }

    try {
      if (editing) {
        await api.put(`/incentives/${editing}`, form);
        toast({ title: "Incentive updated", status: "success" });
        setEditing(null);
      } else {
        await api.post("/incentives", form);
        toast({ title: "Incentive added", status: "success" });
      }
      setForm({ title: "", type: "general" });
      fetchAll();
    } catch (err) {
      console.error(err);
      toast({ title: "Action failed", status: "error" });
    }
  };

  const handleEdit = (inc) => {
    setEditing(inc.id);
    setForm({ title: inc.title, type: inc.type });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incentive?")) return;
    try {
      await api.delete(`/incentives/${id}`);
      toast({ title: "Incentive deleted", status: "success" });
      fetchAll();
    } catch (err) { console.error(err); toast({ title: "Delete failed", status: "error" }); }
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Title", "Type"],
      ...list.map(i => [i.id, i.title, i.type])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "incentives.csv");
  };

  const filteredList = list
    .filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.type?.toLowerCase() ?? "").includes(search.toLowerCase())
    )
    .sort((a, b) => (a[sortField] ?? "").localeCompare(b[sortField] ?? ""));

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading mb={6} color="blue.800">Incentives</Heading>

      {/* Search, sort, export */}
      <HStack mb={6} spacing={4} flexWrap="wrap">
        <Input placeholder="Search by title or type" value={search} onChange={e => setSearch(e.target.value)} maxW="300px" borderWidth={2} borderColor="blue.300" />
        <Select value={sortField} onChange={e => setSortField(e.target.value)} maxW="200px" borderWidth={2} borderColor="blue.300">
          <option value="title">Sort by Title</option>
          <option value="type">Sort by Type</option>
        </Select>
        <Button colorScheme="green" onClick={handleExport}>Export CSV</Button>
      </HStack>

      {/* Form */}
      <Box mb={6} p={4} borderRadius="md" shadow="md" bg="gray.50" borderWidth={1} borderColor="blue.200">
        <form onSubmit={handleSubmit}>
          <HStack spacing={4} flexWrap="wrap">
            <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxW="300px" required borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} maxW="200px" borderWidth={2} borderColor="blue.300" />
            <Button type="submit" colorScheme="blue">{editing ? "Update" : "Add"} Incentive</Button>
          </HStack>
        </form>
      </Box>

      {loading ? <Spinner size="xl" /> : (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Table */}
          <Table variant="simple" mb={4} display={{ base: "none", md: "table" }} borderWidth={2} borderColor="blue.200">
            <Thead bg="blue.800" color="white">
              <Tr>
                <Th borderColor="blue.300">ID</Th>
                <Th borderColor="blue.300">Title</Th>
                <Th borderColor="blue.300">Type</Th>
                <Th borderColor="blue.300">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredList.map(i => (
                <Tr key={i.id} borderWidth={1} borderColor="blue.100" _hover={{ bg: "blue.50" }}>
                  <Td borderColor="blue.200">{i.id}</Td>
                  <Td borderColor="blue.200">{i.title}</Td>
                  <Td borderColor="blue.200">{i.type}</Td>
                  <Td borderColor="blue.200">
                    <Button size="sm" colorScheme="cyan" mr={2} onClick={() => handleEdit(i)}>Edit</Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(i.id)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Mobile Cards */}
          <VStack spacing={4} display={{ base: "flex", md: "none" }}>
            {filteredList.map(i => (
              <Box key={i.id} p={4} bg="white" shadow="md" borderRadius="md" w="100%" borderWidth={2} borderColor="blue.200">
                <Text><strong>ID:</strong> {i.id}</Text>
                <Text><strong>Title:</strong> {i.title}</Text>
                <Text><strong>Type:</strong> {i.type}</Text>
                <HStack mt={2}>
                  <Button size="sm" colorScheme="cyan" onClick={() => handleEdit(i)}>Edit</Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDelete(i.id)}>Delete</Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </MotionBox>
      )}
    </Box>
  );
}
