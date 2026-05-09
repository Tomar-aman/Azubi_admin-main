import {
  Box,
  Button,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
const StyledTextarea = styled(TextareaAutosize)({
  border: "1px solid #646464",
  fontSize: "16px",
  fontWeight: "500",
  padding: "10px 12px",
  "&:focus": {
    outline: "none",
    borderColor: "#FFA500",
    boxShadow: "0 0 0 2px #FFA50020",
  },
});
interface ApplicationTip {
  title: string;
  description: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const AddEditApplicationTips = (props: any) => {
  const formik = useFormik<ApplicationTip>({
    initialValues: {
      title: props.title,
      description: props.description,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await props.handleClose();
    },
  });

  useEffect(() => {
    props.setTitle(formik.values.title);
    props.setDescription(formik.values.description);
  }, [formik.values.title, formik.values.description]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={"column"} spacing={2}>
        <Typography variant="h3">Add Application Tip</Typography>

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
          id="title"
          placeholder="Title"
          autoComplete="off"
          name="title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <div style={{ color: "red" }}>{formik.errors.title}</div>
        )}

        <StyledTextarea
          minRows={3}
          maxRows={6}
          id="description"
          placeholder="Description"
          autoComplete="off"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description && (
          <div style={{ color: "red" }}>{formik.errors.description}</div>
        )}

        <Stack
          direction={"row"}
          spacing={2}
          sx={{ pt: 4, px: 4 }}
          justifyContent={"center"}
        >
          <Button
            fullWidth
            onClick={() => {
              console.log(formik.handleSubmit());
            }}
            className="modalBtn"
            disabled={props.loading}
          >
            {props.loading ? "Saving..." : "Save"}
          </Button>
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

export default AddEditApplicationTips;
