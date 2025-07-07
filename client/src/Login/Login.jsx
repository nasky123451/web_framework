import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import styles from "./Login.module.css"; // ✅ 使用 CSS Modules

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setMessage("登入成功");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={styles.loginBody}>
      <Container maxWidth="xs">
        <div className={styles.loginCard}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Register
            </Button>
          </form>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={isSuccess ? "success" : "error"}
            >
              {message}
            </Alert>
          </Snackbar>
        </div>
      </Container>
    </div>
  );
}

export default Login;
