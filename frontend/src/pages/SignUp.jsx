import { useContext, useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .max(20, "Maximum 20 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const { signUp, loading: authLoading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", role: "user" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const res = await signUp(values);
      if (res.ok) {
        setToast({
          open: true,
          type: "success",
          message: "Account created successfully!",
        });
        setTimeout(() => {
          resetForm();
          navigate("/", { replace: true });
        }, 1000);
      } else {
        setToast({
          open: true,
          type: "error",
          message: res.error || "Signup failed",
        });
      }
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, mt: 6, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ bgcolor: "secondary.main", mb: 1 }}>
            <PersonAddAltOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              margin="normal"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1, py: 1.2 }}
              disabled={authLoading}
            >
              {authLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.type}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
