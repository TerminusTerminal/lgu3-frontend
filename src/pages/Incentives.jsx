import React, { useEffect, useState } from "react";
import {
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, VStack, HStack, Heading, useToast, Text, Select, Switch
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import api from "../api";
import { saveAs } from "file-saver";

const MotionBox = motion(Box);

export default function Incentives() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    max_amount: "",
    duration_months: "",
    conditions: "",
    active: true,
  });
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
      setForm({
        title: "",
        description: "",
        type: "",
        max_amount: "",
        duration_months: "",
        conditions: "",
        active: true,
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      toast({ title: "Action failed", status: "error" });
    }
  };

  const handleEdit = (inc) => {
    setEditing(inc.id);
    setForm({
      title: inc.title,
      description: inc.description || "",
      type: inc.type || "",
      max_amount: inc.max_amount || "",
      duration_months: inc.duration_months || "",
      conditions: inc.conditions || "",
      active: inc.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incentive?")) return;
    try {
      await api.delete(`/incentives/${id}`);
      toast({ title: "Incentive deleted", status: "success" });
      fetchAll();
    } catch (err) {
      console.error(err);
      toast({ title: "Delete failed", status: "error" });
    }
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Title", "Description", "Type", "Max Amount", "Duration (Months)", "Conditions", "Active", "Created At", "Updated At"],
      ...list.map(i => [
        i.id,
        i.title,
        i.description,
        i.type,
        i.max_amount,
        i.duration_months,
        i.conditions,
        i.active ? "Yes" : "No",
        i.created_at,
        i.updated_at,
      ])
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

      <HStack mb={6} spacing={4} flexWrap="wrap">
        <Input
          placeholder="Search by title or type"
          value={search}
          onChange={e => setSearch(e.target.value)}
          maxW="300px"
          borderWidth={2}
          borderColor="blue.300"
        />
        <Select
          value={sortField}
          onChange={e => setSortField(e.target.value)}
          maxW="200px"
          borderWidth={2}
          borderColor="blue.300"
        >
          <option value="title">Sort by Title</option>
          <option value="type">Sort by Type</option>
        </Select>
        <Button colorScheme="green" onClick={handleExport}>Export CSV</Button>
      </HStack>

      <Box mb={6} p={4} borderRadius="md" shadow="md" bg="gray.50" borderWidth={1} borderColor="blue.200">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} flexWrap="wrap">
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
            </HStack>
            <Input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <HStack spacing={4}>
              <Input placeholder="Max Amount" type="number" value={form.max_amount} onChange={e => setForm({ ...form, max_amount: e.target.value })} />
              <Input placeholder="Duration (Months)" type="number" value={form.duration_months} onChange={e => setForm({ ...form, duration_months: e.target.value })} />
            </HStack>
            <Input placeholder="Conditions" value={form.conditions} onChange={e => setForm({ ...form, conditions: e.target.value })} />
            <HStack>
              <Text>Active:</Text>
              <Switch isChecked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
            </HStack>
            <Button type="submit" colorScheme="blue">{editing ? "Update" : "Add"} Incentive</Button>
          </VStack>
        </form>
      </Box>

      {loading ? <Spinner size="xl" /> : (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Table variant="simple" mb={4} borderWidth={2} borderColor="blue.200" size="sm">
            <Thead bg="blue.800" color="white">
              <Tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Type</Th>
                <Th>Max Amount</Th>
                <Th>Duration (Months)</Th>
                <Th>Conditions</Th>
                <Th>Active</Th>
                <Th>Created At</Th>
                <Th>Updated At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredList.map(i => (
                <Tr key={i.id} _hover={{ bg: "blue.50" }}>
                  <Td>{i.id}</Td>
                  <Td>{i.title}</Td>
                  <Td>{i.description}</Td>
                  <Td>{i.type}</Td>
                  <Td>{i.max_amount}</Td>
                  <Td>{i.duration_months}</Td>
                  <Td>{i.conditions}</Td>
                  <Td>{i.active ? "Yes" : "No"}</Td>
                  <Td>{i.created_at}</Td>
                  <Td>{i.updated_at}</Td>
                  <Td>
                    <Button size="xs" colorScheme="cyan" mr={2} onClick={() => handleEdit(i)}>Edit</Button>
                    <Button size="xs" colorScheme="red" onClick={() => handleDelete(i.id)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <VStack spacing={4} display={{ base: "flex", md: "none" }}>
            {filteredList.map(i => (
              <Box key={i.id} p={4} bg="white" shadow="md" borderRadius="md" borderWidth={1} borderColor="blue.200">
                <Text><b>Title:</b> {i.title}</Text>
                <Text><b>Description:</b> {i.description}</Text>
                <Text><b>Type:</b> {i.type}</Text>
                <Text><b>Max Amount:</b> {i.max_amount}</Text>
                <Text><b>Duration:</b> {i.duration_months} months</Text>
                <Text><b>Conditions:</b> {i.conditions}</Text>
                <Text><b>Active:</b> {i.active ? "Yes" : "No"}</Text>
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
