import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "../utils/axios"; // ✅ uses baseURL: "http://localhost:5000/api"
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Register() {
  const nav = useNavigate();

  // ================= STATES =================
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    headline: "",
    about: "",
    profilePhoto: "",
    github: "",
    linkedin: "",
    skills: [],
    projects: [],
  });

  const fileRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [projectDraft, setProjectDraft] = useState({
    title: "",
    link: "",
    description: "",
    technologies: [],
    techInput: "",
  });
  const maxSummary = 300;

  // ================= HANDLERS =================
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // --- Skills ---
  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || form.skills.includes(v)) return setSkillInput("");
    setForm((p) => ({ ...p, skills: [...p.skills, v] }));
    setSkillInput("");
  };
  const removeSkill = (s) =>
    setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  // --- Projects ---
  const addTechToDraft = () => {
    const t = projectDraft.techInput.trim();
    if (!t || projectDraft.technologies.includes(t))
      return setProjectDraft((d) => ({ ...d, techInput: "" }));
    setProjectDraft((d) => ({
      ...d,
      technologies: [...d.technologies, t],
      techInput: "",
    }));
  };

  const removeTechFromDraft = (t) =>
    setProjectDraft((d) => ({
      ...d,
      technologies: d.technologies.filter((x) => x !== t),
    }));

  const addProject = () => {
    if (!projectDraft.title.trim()) return alert("Project title required");
    setForm((p) => ({
      ...p,
      projects: [...p.projects, { ...projectDraft }],
    }));
    setProjectDraft({
      title: "",
      link: "",
      description: "",
      technologies: [],
      techInput: "",
    });
  };

  const removeProject = (i) =>
    setForm((p) => ({
      ...p,
      projects: p.projects.filter((_, idx) => idx !== i),
    }));

  // --- Photo upload (base64) ---
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(f);
    fileRef.current = f;
  };

  const uploadPhotoBase64 = async () => {
    const f = fileRef.current;
    if (!f) return null;
    setUploadingPhoto(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(f);
      });
      const resp = await axios.post("/upload/profilePhoto", { base64 }); // ✅ no /api prefix
      const url = resp?.data?.url;
      if (!url) throw new Error("No URL returned");
      setForm((p) => ({ ...p, profilePhoto: url }));
      alert("Photo uploaded ✅");
      return url;
    } catch (err) {
      console.error("upload error", err);
      alert("Upload failed");
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  // --- Register submit ---
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password)
      return alert("Name, email, and password are required");

    setLoading(true);
    try {
      if (!form.profilePhoto && fileRef.current) {
        const uploaded = await uploadPhotoBase64();
        if (!uploaded) {
          setLoading(false);
          return;
        }
      }

      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        profilePhoto: form.profilePhoto,
        headline: form.headline,
        about: form.about,
        skills: form.skills,
        projects: form.projects.map((p) => ({
          title: p.title,
          link: p.link,
          description: p.description,
          technologies: p.technologies,
        })),
        github: form.github,
        linkedin: form.linkedin,
      };

      const res = await axios.post("/auth/register", body); // ✅ fixed endpoint
      const { token, user } = res.data;

      if (!token || !user) throw new Error("Invalid response");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      alert("Registered and logged in ✅");
      nav("/app/dashboard");
    } catch (err) {
      console.error("register err", err);
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        "Registration failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // ================= RENDER =================
  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Image */}
      <Grid
        item
        xs={6}
        sx={{
          backgroundImage: `url("https://source.unsplash.com/featured/?portfolio,developer")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Right Form */}
      <Grid
        item
        xs={6}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          elevation={6}
          sx={{ width: 680, p: 4, bgcolor: "#0b0b12", color: "white" }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Create your Portfolio
          </Typography>

          {/* PROFILE PHOTO */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <Avatar
              src={form.profilePhoto || photoPreview}
              sx={{ width: 84, height: 84, bgcolor: "transparent" }}
            />
            <Box sx={{ flex: 1 }}>
              <Button variant="contained" component="label">
                Choose Photo
                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={uploadPhotoBase64}
                disabled={uploadingPhoto || !fileRef.current}
              >
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              </Button>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1, color: "rgba(255,255,255,0.6)" }}
              >
                Optional — you may upload now or later in profile edit
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.06)", my: 2 }} />

          {/* BASIC FIELDS */}
          <Stack spacing={2}>
            {["name", "email", "password", "headline"].map((f) => (
              <TextField
                key={f}
                variant="filled"
                label={f === "name"
                  ? "Full name"
                  : f === "email"
                  ? "Email"
                  : f === "password"
                  ? "Password"
                  : "Headline (e.g. Full Stack Developer)"}
                type={f === "password" ? "password" : "text"}
                name={f}
                value={form[f]}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ style: { color: "#bdbdbd" } }}
                InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
              />
            ))}

            <TextField
              variant="filled"
              label="About (short bio)"
              name="about"
              value={form.about}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  about: e.target.value.slice(0, maxSummary),
                }))
              }
              fullWidth
              multiline
              minRows={3}
              helperText={`${form.about.length}/${maxSummary} chars`}
              InputLabelProps={{ style: { color: "#bdbdbd" } }}
              InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
            />
          </Stack>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.06)", my: 2 }} />

          {/* SOCIAL LINKS */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              variant="filled"
              label="GitHub URL"
              name="github"
              value={form.github}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ style: { color: "#bdbdbd" } }}
              InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
            />
            <TextField
              variant="filled"
              label="LinkedIn URL"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ style: { color: "#bdbdbd" } }}
              InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
            />
          </Stack>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.06)", my: 2 }} />

          {/* SKILLS */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Skills
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
              {form.skills.map((s, i) => (
                <Chip
                  key={i}
                  label={s}
                  onDelete={() => removeSkill(s)}
                  sx={{ bgcolor: "#2b0b3a", color: "#fff", mr: 1, mb: 1 }}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                variant="filled"
                placeholder="Type skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
                sx={{ flex: 1 }}
              />
              <Button variant="contained" onClick={addSkill} startIcon={<AddIcon />}>
                Add
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.06)", my: 2 }} />

          {/* PROJECTS */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Projects
            </Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: "#08050c" }}>
              <Stack spacing={1}>
                <TextField
                  variant="filled"
                  label="Project Title"
                  value={projectDraft.title}
                  onChange={(e) =>
                    setProjectDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
                />
                <TextField
                  variant="filled"
                  label="Project Link"
                  value={projectDraft.link}
                  onChange={(e) =>
                    setProjectDraft((d) => ({ ...d, link: e.target.value }))
                  }
                  InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
                />
                <TextField
                  variant="filled"
                  label="Short description"
                  value={projectDraft.description}
                  onChange={(e) =>
                    setProjectDraft((d) => ({ ...d, description: e.target.value }))
                  }
                  multiline
                  minRows={2}
                  InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
                />
                <Stack direction="row" spacing={1}>
                  <TextField
                    variant="filled"
                    placeholder="Tech stack"
                    value={projectDraft.techInput}
                    onChange={(e) =>
                      setProjectDraft((d) => ({ ...d, techInput: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTechToDraft();
                      }
                    }}
                    InputProps={{ style: { color: "white", background: "#0b0b0b" } }}
                    sx={{ flex: 1 }}
                  />
                  <Button variant="contained" onClick={addTechToDraft}>
                    Add Tech
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  {projectDraft.technologies.map((t, i) => (
                    <Chip
                      key={i}
                      label={t}
                      onDelete={() => removeTechFromDraft(t)}
                      sx={{ bgcolor: "#2b0b3a", color: "#fff", mr: 1, mb: 1 }}
                    />
                  ))}
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="contained" onClick={addProject}>
                    Add Project
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setProjectDraft({
                        title: "",
                        link: "",
                        description: "",
                        technologies: [],
                        techInput: "",
                      })
                    }
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {/* Project list */}
            <Stack spacing={2}>
              {form.projects.map((p, idx) => (
                <Paper key={idx} sx={{ p: 2, bgcolor: "#060312" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {p.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        {p.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                        {p.technologies.map((t, i) => (
                          <Chip
                            key={i}
                            label={t}
                            size="small"
                            sx={{ bgcolor: "#2b0b3a", color: "#fff", mr: 1, mb: 1 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    <IconButton onClick={() => removeProject(idx)} sx={{ color: "#ff6b6b" }}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? "Creating..." : "Create account & Continue"}
            </Button>
            <Button variant="outlined" onClick={() => nav("/auth/login")}>
              Back to Login
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
