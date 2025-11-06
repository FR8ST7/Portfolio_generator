// src/pages/register/Step1.jsx
'use client';
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Step1() {
  const router = useRouter();

  const [form, setForm] = useState({
    name:"",
    email:"",
    password:""
  });

  function handleChange(e){
    setForm({...form, [e.target.name]: e.target.value});
  }

  function handleNext(){
    // store in localStorage so step2 can read
    localStorage.setItem("reg_step1", JSON.stringify(form));
    router.push("/register?step=2");
  }

  const disabled = !form.name || !form.email || !form.password;

  return (
    <Box sx={{
      minHeight:"100vh",
      bgcolor:"#0a0a0a",
      color:"white",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    }}>
      <Box sx={{ width:"400px", display:"flex", flexDirection:"column", gap:2 }}>
        <Typography variant="h5" fontWeight={600}>Create Account</Typography>

        <TextField
          variant="outlined"
          fullWidth
          name="name"
          label="Full Name"
          value={form.name}
          onChange={handleChange}
          InputProps={{ style:{ color:"white" } }}
          InputLabelProps={{ style:{ color:"#888" } }}
        />
        <TextField
          variant="outlined"
          fullWidth
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          InputProps={{ style:{ color:"white" } }}
          InputLabelProps={{ style:{ color:"#888" } }}
        />
        <TextField
          variant="outlined"
          type="password"
          fullWidth
          name="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          InputProps={{ style:{ color:"white" } }}
          InputLabelProps={{ style:{ color:"#888" } }}
        />

        <Button
          variant="contained"
          fullWidth
          disabled={disabled}
          onClick={handleNext}
          sx={{ bgcolor:"white", color:"black", fontWeight:600 }}
        >
          Next →
        </Button>
      </Box>
    </Box>
  );
}
