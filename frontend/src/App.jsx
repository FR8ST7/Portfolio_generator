import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditAbout from "./pages/EditAbout";
import EditSkills from "./pages/EditSkills";

const darkTheme = createTheme({
  palette: { mode: "dark" },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* App */}
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/edit/about" element={<EditAbout />} />
          <Route path="/app/edit/skills" element={<EditSkills />} />

          {/* Default redirect */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
