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
  createManagedEmployee,
  getManagedEmployeeById,
  updateManagedEmployee,
  ManagedEmployeeFormValues,
} from "@/app/api/managedEmployee/managedEmployee";
import { SIDEBAR_TABS } from "@/app/ulits/sidebarTabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomLoader from "@/app/components/SpinLoader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";

const AddEmployeePage = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  // @ts-ignore
  const currentUser = useSelector((state: any) => state.user?.data);
  const userPermissions = currentUser?.permissions;

  // Only allow assigning permissions that the current user actually has
  // (if userPermissions is undefined, it's the main admin who has access to all)
  const availableTabs = SIDEBAR_TABS.filter(tab => 
    !userPermissions || userPermissions.includes(tab.key)
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    position: Yup.string(),
    phoneNo: Yup.string(),
    permissions: Yup.array().of(Yup.string()),
  });

  const formik = useFormik<ManagedEmployeeFormValues>({
    initialValues: {
      name: "",
      email: "",
      phoneNo: "",
      position: "",
      permissions: [],
      status: "Active",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEdit) {
          const res = await updateManagedEmployee(id, values);
          if (res.remote === "success") {
            toast.success("Employee updated successfully!");
            setTimeout(() => router.push("/manage-employees"), 1200);
          } else {
            toast.error(res.error?.errors?.message ?? "Update failed");
          }
        } else {
          const res = await createManagedEmployee(values);
          if (res.remote === "success") {
            toast.success("Employee created successfully!");
            setTimeout(() => router.push("/manage-employees"), 1200);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get("id");
    if (empId) {
      setId(empId);
      (async () => {
        setLoading(true);
        const res = await getManagedEmployeeById(empId);
        if (res.remote === "success") {
          const e = res.data.data;
          formik.setFieldValue("name", e.name);
          formik.setFieldValue("email", e.email);
          formik.setFieldValue("phoneNo", e.phoneNo ?? "");
          formik.setFieldValue("position", e.position ?? "");
          formik.setFieldValue("permissions", e.permissions);
          formik.setFieldValue("status", e.status);
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
        heading={isEdit ? "Edit Employee" : "Add Employee"}
        icon={
          <IconButton onClick={() => router.push("/manage-employees")} disableRipple>
            <SVG.ArrowBack className="svgActive" />
          </IconButton>
        }
      />
      <Card sx={{ borderRadius: "10px" }} elevation={0}>
        <CardContent>
          <StyledManageForm>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                {/* NAME */}
                <Grid item xs={12} lg={2}><label>Name</label></Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    fullWidth
                    placeholder="Full name"
                    {...formik.getFieldProps("name")}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>

                {/* EMAIL */}
                <Grid item xs={12} lg={2}><label>Email</label></Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="employee@domain.com"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                {/* POSITION */}
                <Grid item xs={12} lg={2}><label>Position</label></Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    fullWidth
                    placeholder="e.g. Manager, Developer"
                    {...formik.getFieldProps("position")}
                  />
                </Grid>

                {/* PHONE */}
                <Grid item xs={12} lg={2}><label>Phone No.</label></Grid>
                <Grid item xs={12} lg={10}>
                  <PhoneInput
                    regions={"europe"}
                    showDropdown={false}
                    placeholder="Enter phone number"
                    onChange={(value) => {
                      formik.setFieldValue("phoneNo", value);
                    }}
                    countryCodeEditable={false}
                    value={formik.values.phoneNo ?? "+49"}
                    onlyCountries={["de"]}
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
                    <Button variant="outlined" onClick={() => router.push("/manage-employees")}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || formik.isSubmitting}
                      sx={{ background: "#0096A4", "&:hover": { background: "#007a8a" } }}
                    >
                      {isEdit ? "Update Employee" : "Create Employee"}
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

export default AddEmployeePage;
