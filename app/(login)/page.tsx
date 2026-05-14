"use client";

import { SVG } from "@/app/components/icon";
import { FormHelperText, 
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ForgotPassword from "./forgot-password";
import { useRouter } from "next/navigation";
import { LoginRequestDto } from "@/app/api/auth/auth.types";
import { loginUser } from "@/app/api/auth/auth";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../redux/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoginLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("password is required"),
  });
  const formik = useFormik<LoginRequestDto>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(setIsLoading(false));
      setLoginLoading(true);
      const payload: LoginRequestDto = {
        email: values.email,
        password: values.password,
      };
      // Call your login API here
      const result = await loginUser(payload);
      if (result.remote === "success") {
        localStorage.setItem("x-access", result.data.data.accessToken);
        localStorage.setItem("x-refresh", result.data.data.refreshToken);

        router.push("/dashboard");
      } else {
        console.error("Login failed:", result);
        setError(result.error.errors.message || "Login failed");
      }
      setLoginLoading(false);
    },
  });
  
  const [showBranding, setShowBranding] = useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const userDomain = process.env.NEXT_PUBLIC_MANAGED_USER_DOMAIN || "kundenzugang";
      const employeeDomain = process.env.NEXT_PUBLIC_MANAGED_EMPLOYEE_DOMAIN || "wohnzugang";

      if (host.includes(userDomain) || host.includes(employeeDomain)) {
        setShowBranding(false);
      } else {
        setShowBranding(true);
      }
    }
  }, []);

  if (showBranding === null) return null;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (props: any) => {
    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (event.key === "Enter") {
      formik.handleSubmit();
    }
  };

  return (
    <>
      {/* {loading && <SpinLoader />} */}
      {error && (
        <div>
          <ErrorAlert severity="error" message={error} />
        </div>
      )}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "50px 0px",
        }}
      >
        <Container>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid
              item
              xs={12}
              lg={showBranding ? 6 : 12}
              sx={{ display: "flex" }}
              justifyContent={"center"}
            >
              {showBranding && <SVG.LoginBg />}
            </Grid>
            <Grid item xs={12} lg={showBranding ? 6 : 12}>
              <Typography
                component={"h1"}
                sx={{ marginBottom: "25px", textAlign: "center" }}
              >
                {showBranding && (
                  <Image
                    src="/logo.png"
                    alt=""
                    width={300}
                    height={74}
                    style={{ objectFit: "contain" }}
                  />
                )}
              </Typography>
              <Typography variant="h2" sx={{ textAlign: "center" }}>
                Welcome Back !
              </Typography>
              {validationErrors.password}
              <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBottom: "25px" }}
              >
                LogIn to your Account
              </Typography>
              <Stack direction={"column"} spacing={3}>
                <TextField
                  id="outlined-basic"
                  placeholder="example@gmail.com"
                  autoComplete="off"
                  name="email"
                  onKeyDown={(e: any) => {
                    handleKeyDown(e);
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      marginLeft: "5px",
                      color: "#FFA500",
                      fontWeight: "500",
                    },
                  }}

                  error={formik.touched.email && Boolean(formik.errors.email)}

                  helperText={formik.touched.email && (formik.errors.email as string)}

                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  name="password"
                  onKeyDown={(e: any) => {
                    handleKeyDown(e);
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      marginLeft: "5px",
                      color: "#FFA500",
                      fontWeight: "500",
                    },
                  }}

                  error={formik.touched.password && Boolean(formik.errors.password)}

                  helperText={formik.touched.password && (formik.errors.password as string)}

                />

                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "right",
                    cursor: "pointer",
                    fontWeight: "500",
                    marginTop: "0px !important",
                  }}
                  color="primary.main"
                  onClick={handleClickOpen}
                >
                  Forgot Password?
                </Typography>
                <Button
                  // variant="contained"
                  className="modalBtn"
                  sx={{ fontSize: "32px", fontWeight: 700 }}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  {loading && (
                    <RotatingLines
                      visible={true}
                      width="40"
                      strokeWidth="4"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                      strokeColor="#fff"
                    />
                  )}
                  <span style={{ marginLeft: "5px" }}>Log In</span>
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
        <ForgotPassword open={open} handleClose={handleClose} />
      </Box>
    </>
  );
};
export default Login;
