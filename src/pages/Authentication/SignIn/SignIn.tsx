import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { CircularProgress, styled } from "@mui/material";
import { loginMutationFn } from "../../../services/api";
import { useMutation } from "@tanstack/react-query";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(12, 8),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const signInData = {
      email,
      password,
    };

    mutate(signInData, {
      onSuccess: (data) => {
        const receivedToken = data.token;
        const userRole = data.role;

        localStorage.setItem("token", receivedToken);
        if (userRole !== "factory") {
          setError("User role not allowed");
        } else {
          setError("");
          navigate("/");
        }
      },
      onError: (error) => {
        console.error(error.message);
        setError("Invalid email or password");
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, []);

  return (
    <Stack>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('./banners/login-banner.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.75,
          }}
        />
        <Card
          variant="outlined"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                maxWidth: 280,
                mx: "auto",
              }}
            >
              <img
                src="/yellowcamper-logo.svg"
                alt="admin-dashboard-starter"
                className="object-contain img-fluid"
              />
            </Box>
            <Typography variant="h1" align="center">
              admin-dashboard-starter
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                textAlign: "center",
              }}
            >
              Sign in to continue
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <FormControl>
              <FormLabel
                htmlFor="email"
                sx={{
                  mb: 1,
                }}
              >
                Email
              </FormLabel>
              <TextField
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="password"
                sx={{
                  mb: 1,
                }}
              >
                Password
              </FormLabel>
              <TextField
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            {error && <Typography color="error">{error}</Typography>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending}
              startIcon={isPending && <CircularProgress size={16} />}
            >
              Sign in
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </Stack>
  );
}
