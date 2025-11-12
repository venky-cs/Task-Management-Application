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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().min(6).max(20).required("Password is required"),
});

export default function SignIn() {
  const { signIn, loading: authLoading, user } = useContext(AuthContext);
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

  const togglePassword = () => setShowPassword((p) => !p);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const res = await signIn(values.email, values.password);
      if (res.ok) {
        setToast({
          open: true,
          type: "success",
          message: "Signed in successfully!",
        });
        setTimeout(() => {
          resetForm();
          navigate("/", { replace: true });
        }, 1000);
      } else {
        setToast({ open: true, type: "error", message: res.error });
      }
    },
  });

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
          <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 2, width: "100%" }}
          >
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
                "Sign In"
              )}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  Don’t have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for success/error */}
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
