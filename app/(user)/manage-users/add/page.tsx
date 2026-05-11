"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import { useRouter } from "next/navigation";
import { StyledManageForm } from "@/app/components/form.styled";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createManagedUser,
  getManagedUserById,
  updateManagedUser,
} from "@/app/api/managedUser/managedUser";
import { ManagedUserFormValues } from "@/app/api/managedUser/managedUser.types";
import { SIDEBAR_TABS } from "@/app/ulits/sidebarTabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomLoader from "@/app/components/SpinLoader";
import { useSelector } from "react-redux";

const AddUserPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEdit = Boolean(id);

  // @ts-ignore
  const currentUser = useSelector((state: any) => state.user?.data);
  const userPermissions = currentUser?.permissions;

  // Only allow assigning permissions that the current user actually has
  const availableTabs = SIDEBAR_TABS.filter(tab => 
    !userPermissions || userPermissions.includes(tab.key)
  );

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isEdit
      ? Yup.string()
      : Yup.string().min(6, "Min 6 characters").required("Password is required"),
    permissions: Yup.array().of(Yup.string()),
  });

  const formik = useFormik<ManagedUserFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      permissions: [],
      status: "Active",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEdit) {
          const payload: any = {
            username: values.username,
            email: values.email,
            permissions: values.permissions,
            status: values.status,
          };
          if (values.password) payload.newPassword = values.password;
          const res = await updateManagedUser(id, payload);
          if (res.remote === "success") {
            toast.success("User updated successfully!");
            setTimeout(() => router.push("/manage-users"), 1200);
          } else {
            toast.error(res.error?.errors?.message ?? "Update failed");
          }
        } else {
          const res = await createManagedUser(values);
          if (res.remote === "success") {
            toast.success("User created! Welcome email sent.");
            setTimeout(() => router.push("/manage-users"), 1200);
          } else {
            toast.error(res.error?.errors?.message ?? "Create failed");
          }
        }
      } catch (e) {
        toast.error("Something went wrong");
      }
      setLoading(false);
    },
  });

  const togglePermission = (key: string) => {
    const current = formik.values.permissions;
    if (current.includes(key)) {
      formik.setFieldValue("permissions", current.filter((p) => p !== key));
    } else {
      formik.setFieldValue("permissions", [...current, key]);
    }
  };

  const selectAll = () => {
    formik.setFieldValue("permissions", SIDEBAR_TABS.map((t) => t.key));
  };
  const clearAll = () => {
    formik.setFieldValue("permissions", []);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    if (userId) {
      setId(userId);
      (async () => {
        setLoading(true);
        const res = await getManagedUserById(userId);
        if (res.remote === "success") {
          const u = res.data.data;
          formik.setFieldValue("username", u.username);
          formik.setFieldValue("email", u.email);
          formik.setFieldValue("permissions", u.permissions);
          formik.setFieldValue("status", u.status);
        }
        setLoading(false);
      })();
    }
  }, []);

  return (
    <>
      {loading && (
        <Box sx={{ position: "fixed", inset: 0, zIndex: 10 }}>
          <CustomLoader />
        </Box>
      )}
      <Title
        heading={isEdit ? "Edit User" : "Add User"}
        icon={
          <IconButton onClick={() => router.push("/manage-users")} disableRipple>
            <SVG.ArrowBack className="svgActive" />
          </IconButton>
        }
      />
      <Card sx={{ borderRadius: "10px" }} elevation={0}>
        <CardContent>
          <StyledManageForm>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                {/* USERNAME */}
                <Grid item xs={12} lg={2}><label>Username</label></Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    fullWidth
                    placeholder="Enter username"
                    {...formik.getFieldProps("username")}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                  />
                </Grid>

                {/* EMAIL */}
                <Grid item xs={12} lg={2}><label>Email</label></Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="example@domain.com"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                {/* PASSWORD */}
                <Grid item xs={12} lg={2}>
                  <label>{isEdit ? "New Password (optional)" : "Password"}</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder={isEdit ? "Leave blank to keep current password" : "Min 6 characters"}
                    {...formik.getFieldProps("password")}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((s) => !s)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* STATUS */}
                <Grid item xs={12} lg={2}><label>Status</label></Grid>
                <Grid item xs={12} lg={10}>
                  <Stack direction="row" spacing={2}>
                    {(["Active", "Inactive"] as const).map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        clickable
                        color={formik.values.status === s ? "primary" : "default"}
                        onClick={() => formik.setFieldValue("status", s)}
                      />
                    ))}
                  </Stack>
                </Grid>

                {/* PERMISSIONS */}
                <Grid item xs={12} lg={2}><label>Tab Permissions</label></Grid>
                <Grid item xs={12} lg={10}>
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      p: 2,
                      background: "#f9f9f9",
                    }}
                  >
                    <Stack direction="row" spacing={1} mb={1.5}>
                      <Button size="small" variant="outlined"
                        onClick={() => formik.setFieldValue("permissions", availableTabs.map((t) => t.key))}>
                        Select All
                      </Button>
                      <Button size="small" variant="outlined" color="error"
                        onClick={() => formik.setFieldValue("permissions", [])}>
                        Clear All
                      </Button>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: "auto", alignSelf: "center" }}>
                        {formik.values.permissions.length} / {availableTabs.length} selected
                      </Typography>
                    </Stack>
                    <Grid container spacing={1}>
                      {availableTabs.map((tab) => (
                        <Grid item xs={12} sm={6} md={4} key={tab.key}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formik.values.permissions.includes(tab.key)}
                                onChange={() => togglePermission(tab.key)}
                                sx={{ color: "#0096A4", "&.Mui-checked": { color: "#0096A4" } }}
                              />
                            }
                            label={tab.label}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>

                {/* SUBMIT */}
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined" onClick={() => router.push("/manage-users")}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || formik.isSubmitting}
                      sx={{ background: "#0096A4", "&:hover": { background: "#007a8a" } }}
                    >
                      {isEdit ? "Update User" : "Create User & Send Email"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </StyledManageForm>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
};

export default AddUserPage;
