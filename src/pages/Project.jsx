import React, { useEffect, useState } from "react";
import {
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, VStack, HStack, Heading, useToast, Text, Select
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import api from "../api";
import { saveAs } from "file-saver";

const MotionBox = motion(Box);

export default function Projects() {
  const [list, setList] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [form, setForm] = useState({
    investor_id: "",
    name: "",
    sector: "",
    investment_amount: "",
    location: "",
    description: "",
    status: ""
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [filter, setFilter] = useState("active");
  const toast = useToast();

  useEffect(() => {
    fetchAll();
    fetchInvestors();
  }, [filter]);

  // ✅ Fetch all projects (filtered by archived or active)
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects?archived=${filter === "archived"}`);
      const data = res.data.data ?? res.data;
      setList(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to fetch projects.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch investors for dropdown
  const fetchInvestors = async () => {
    try {
      const res = await api.get("/investors");
      const data = res.data.data ?? res.data;
      setInvestors(data);
    } catch (err) {
      console.error("Error fetching investors:", err);
      toast({ title: "Failed to load investors.", status: "error" });
    }
  };

  // ✅ Handle form submit for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.investor_id || !form.name) {
      toast({ title: "Investor and Project Name are required", status: "warning" });
      return;
    }

    try {
      if (editing) {
        await api.put(`/projects/${editing}`, form);
        toast({ title: "Project updated", status: "success" });
        setEditing(null);
      } else {
        await api.post("/projects", form);
        toast({ title: "Project added", status: "success" });
      }
      setForm({
        investor_id: "",
        name: "",
        sector: "",
        investment_amount: "",
        location: "",
        description: "",
        status: ""
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      toast({ title: "Action failed", status: "error" });
    }
  };

  // ✅ Edit project
  const handleEdit = (prj) => {
    setEditing(prj.id);
    setForm({
      investor_id: prj.investor_id || "",
      name: prj.name,
      sector: prj.sector || "",
      investment_amount: prj.investment_amount || "",
      location: prj.location || "",
      description: prj.description || "",
      status: prj.status || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Archive project
  const handleArchive = async (id) => {
    if (!window.confirm("Archive this project?")) return;
    try {
      await api.post(`/projects/${id}/archive`);
      toast({ title: "Project archived", status: "success" });
      fetchAll();
    } catch (err) {
      console.error(err);
      toast({ title: "Archive failed", status: "error" });
    }
  };

  // ✅ Restore project
  const handleRestore = async (id) => {
    if (!window.confirm("Restore this project?")) return;
    try {
      await api.post(`/projects/${id}/restore`);
      toast({ title: "Project restored", status: "success" });
      fetchAll();
    } catch (err) {
      console.error(err);
      toast({ title: "Restore failed", status: "error" });
    }
  };

  // ✅ Export to CSV
  const handleExport = () => {
    const csv = [
      ["ID", "Investor", "Name", "Sector", "Investment Amount", "Location", "Description", "Status"],
      ...list.map(p => [
        p.id,
        investors.find(inv => inv.id === p.investor_id)?.name || "",
        p.name,
        p.sector,
        p.investment_amount,
        p.location,
        p.description,
        p.status
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "projects.csv");
  };

  // ✅ Search + Sort
  const filteredList = list
    .filter(prj =>
      prj.name.toLowerCase().includes(search.toLowerCase()) ||
      (prj.location?.toLowerCase() ?? "").includes(search.toLowerCase())
    )
    .sort((a, b) => (a[sortField] ?? "").localeCompare(b[sortField] ?? ""));

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading mb={6} color="blue.800">Projects</Heading>

      {/* Search, filter, sort, export */}
      <HStack mb={6} spacing={4} flexWrap="wrap">
        <Input
          placeholder="Search by name or location"
          value={search}
          onChange={e => setSearch(e.target.value)}
          maxW="300px"
          borderWidth={2}
          borderColor="blue.300"
        />
        <Select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          maxW="200px"
          borderWidth={2}
          borderColor="blue.300"
        >
          <option value="active">Active Projects</option>
          <option value="archived">Archived Projects</option>
        </Select>
        <Select
          value={sortField}
          onChange={e => setSortField(e.target.value)}
          maxW="200px"
          borderWidth={2}
          borderColor="blue.300"
        >
          <option value="name">Sort by Name</option>
          <option value="sector">Sort by Sector</option>
        </Select>
        <Button colorScheme="green" onClick={handleExport}>Export CSV</Button>
      </HStack>

      {/* Inline Form */}
      <Box mb={6} p={4} borderRadius="md" shadow="md" bg="gray.50" borderWidth={1} borderColor="blue.200">
        <form onSubmit={handleSubmit}>
          <HStack spacing={4} flexWrap="wrap">
            <Select
              placeholder="Select Investor"
              value={form.investor_id}
              onChange={e => setForm({ ...form, investor_id: e.target.value })}
              maxW="200px"
              borderWidth={2}
              borderColor="blue.300"
              required
            >
              {investors.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.name}</option>
              ))}
            </Select>
            <Input placeholder="Project Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxW="200px" required borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Sector" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} maxW="180px" borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Investment Amount" value={form.investment_amount} onChange={e => setForm({ ...form, investment_amount: e.target.value })} maxW="180px" borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} maxW="180px" borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxW="250px" borderWidth={2} borderColor="blue.300" />
            <Input placeholder="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} maxW="140px" borderWidth={2} borderColor="blue.300" />
            <Button type="submit" colorScheme="blue">{editing ? "Update" : "Add"} Project</Button>
          </HStack>
        </form>
      </Box>

      {loading ? <Spinner size="xl" /> : (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Table variant="simple" mb={4} borderWidth={2} borderColor="blue.200">
            <Thead bg="blue.800" color="white">
              <Tr>
                <Th>ID</Th>
                <Th>Investor</Th>
                <Th>Name</Th>
                <Th>Sector</Th>
                <Th>Investment</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredList.map(prj => (
                <Tr key={prj.id} _hover={{ bg: "blue.50" }}>
                  <Td>{prj.id}</Td>
                  <Td>{investors.find(inv => inv.id === prj.investor_id)?.name || "—"}</Td>
                  <Td>{prj.name}</Td>
                  <Td>{prj.sector}</Td>
                  <Td>{prj.investment_amount}</Td>
                  <Td>{prj.location}</Td>
                  <Td>{prj.status}</Td>
                  <Td>
                    <Button size="sm" colorScheme="cyan" mr={2} onClick={() => handleEdit(prj)}>Edit</Button>
                    {filter === "archived" ? (
                      <Button size="sm" colorScheme="green" onClick={() => handleRestore(prj.id)}>Restore</Button>
                    ) : (
                      <Button size="sm" colorScheme="red" onClick={() => handleArchive(prj.id)}>Archive</Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </MotionBox>
      )}
    </Box>
  );
}
