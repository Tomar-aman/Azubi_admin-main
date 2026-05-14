"use client";

import { FormHelperText, 
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

interface Contact {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  message: Yup.string().required("Message is required"),
});

const AddEditContacts = (props: any) => {
  const formik = useFormik<Contact>({
    initialValues: {
      name: props.name,
      phoneNumber: props.phoneNumber,
      email: props.email,
      message: props.message,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await props.handleClose();
    },
  });

  useEffect(() => {
    props.setName(formik.values.name);
    props.setPhoneNumber(formik.values.phoneNumber);
    props.setEmail(formik.values.email);
    props.setMessage(formik.values.message);
  }, [
    formik.values.name,
    formik.values.phoneNumber,
    formik.values.email,
    formik.values.message,
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={"column"} spacing={2}>
        <Typography variant="h3">Contact</Typography>

        <TextField
          sx={{
            "& .MuiInputBase-root": {
              border: "1px solid #646464 !important",
              fontSize: "16px !important",
              fontWeight: "500 !important",
              "& .MuiInputBase-input": {
                padding: "10px 12px ",
              },
            },
            "& .MuiFormHelperText-root": {
              marginLeft: "5px",
              color: "#FFA500",
              fontWeight: "500",
            },
          }}
          fullWidth
          id="name"
          placeholder="Name"
          autoComplete="off"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}

          error={formik.touched.name && Boolean(formik.errors.name)}

          helperText={formik.touched.name && (formik.errors.name as string)}

        />

        <TextField
          sx={{
            "& .MuiInputBase-root": {
              border: "1px solid #646464 !important",
              fontSize: "16px !important",
              fontWeight: "500 !important",
              "& .MuiInputBase-input": {
                padding: "10px 12px ",
              },
            },
            "& .MuiFormHelperText-root": {
              marginLeft: "5px",
              color: "#FFA500",
              fontWeight: "500",
            },
          }}
          fullWidth
          id="phoneNumber"
          placeholder="Phone Number"
          autoComplete="off"
          name="phoneNumber"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneNumber}

          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}

          helperText={formik.touched.phoneNumber && (formik.errors.phoneNumber as string)}

        />

        <TextField
          sx={{
            "& .MuiInputBase-root": {
              border: "1px solid #646464 !important",
              fontSize: "16px !important",
              fontWeight: "500 !important",
              "& .MuiInputBase-input": {
                padding: "10px 12px ",
              },
            },
            "& .MuiFormHelperText-root": {
              marginLeft: "5px",
              color: "#FFA500",
              fontWeight: "500",
            },
          }}
          fullWidth
          id="email"
          placeholder="Email"
          autoComplete="off"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}

          error={formik.touched.email && Boolean(formik.errors.email)}

          helperText={formik.touched.email && (formik.errors.email as string)}

        />

        <TextareaAutosize
          placeholder="Message"
          autoComplete="off"
          name="message"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
          style={{
            border: formik.touched.message && Boolean(formik.errors.message) ? "1px solid #d32f2f" : "1px solid #646464",
            fontSize: "16px",
            fontWeight: "500",
            padding: "10px 12px",
            width: "100%",
            resize: "vertical",
          }}
        />
        {formik.touched.message && formik.errors.message && (
          <FormHelperText error sx={{ ml: "5px", color: "#d32f2f", fontWeight: "500" }}>
            {formik.errors.message as string}
          </FormHelperText>
        )}

        <Stack
          direction={"row"}
          spacing={2}
          sx={{ pt: 4, px: 4 }}
          justifyContent={"center"}
        >
          {/* <Button
            fullWidth
            onClick={() => {
              console.log(formik.handleSubmit());
            }}
            className="modalBtn"
            disabled={props.loading}
          >
            {props.loading ? "Saving..." : "Save"}
          </Button> */}
          <Button
            fullWidth
            onClick={props.clearAllState}
            className="modalBtn"
            disabled={props.loading}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
export default AddEditContacts;
