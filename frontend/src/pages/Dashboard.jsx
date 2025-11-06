import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/auth/login");

    const fetchUser = async () => {
      try {
        const res = await api.get("/portfolio/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        nav("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0a0a0a",
          color: "white",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );

  if (!user)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#0a0a0a",
          color: "white",
        }}
      >
        <Typography>User not found or session expired.</Typography>
        <Button
          variant="outlined"
          onClick={() => nav("/auth/login")}
          sx={{ mt: 2, color: "white", borderColor: "#555" }}
        >
          Go to Login
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#0a0a0a",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDEBAR */}
      <Box
        sx={{
          width: "280px",
          backgroundColor: "#111",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
        }}
      >
        <Avatar
          src={user.profilePhoto}
          sx={{
            width: 90,
            height: 90,
            bgcolor: "#222",
            mb: 1,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {user.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#bbb" }}>
          {user.headline || "Developer"}
        </Typography>

        <Divider sx={{ width: "100%", my: 1, bgcolor: "#333" }} />

        <Typography variant="subtitle2" sx={{ alignSelf: "flex-start", ml: 1 }}>
          Skills
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            justifyContent: "flex-start",
          }}
        >
          {user.skills?.length > 0 ? (
            user.skills.map((s, i) => (
              <Chip
                key={i}
                label={s}
                size="small"
                sx={{ bgcolor: "#222", color: "#fff" }}
              />
            ))
          ) : (
            <Typography variant="caption" sx={{ color: "#666" }}>
              No skills
            </Typography>
          )}
        </Box>

        <Divider sx={{ width: "100%", my: 1, bgcolor: "#333" }} />

        <Typography variant="subtitle2" sx={{ alignSelf: "flex-start", ml: 1 }}>
          Projects
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          {user.projects?.length > 0 ? (
            user.projects.map((p, idx) => (
              <Box
                key={idx}
                sx={{
                  bgcolor: "#1a1a1a",
                  borderRadius: 2,
                  p: 1.5,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {p.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#aaa", fontSize: "0.8rem" }}
                >
                  {p.description}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {p.technologies?.map((t, i) => (
                    <Chip
                      key={i}
                      label={t}
                      size="small"
                      sx={{
                        bgcolor: "#333",
                        color: "#fff",
                        mr: 0.5,
                        mt: 0.5,
                        fontSize: "0.7rem",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="caption" sx={{ color: "#666" }}>
              No projects
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          sx={{
            mt: "auto",
            color: "white",
            borderColor: "#555",
            "&:hover": { borderColor: "#888" },
          }}
          onClick={() => {
            localStorage.clear();
            nav("/auth/login");
          }}
        >
          Logout
        </Button>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          p: 5,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome back, {user.name.split(" ")[0]} 👋
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#ccc", maxWidth: "800px", lineHeight: 1.6 }}
        >
          {user.about || "No about section yet. You can add more details later."}
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "#333", width: "100%" }} />

        <Typography variant="h5" sx={{ mb: 1 }}>
          Your Links
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#9af", textDecoration: "none" }}
            >
              GitHub: {user.github}
            </a>
          )}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#9af", textDecoration: "none" }}
            >
              LinkedIn: {user.linkedin}
            </a>
          )}
        </Box>
      </Box>
    </Box>
  );
}
