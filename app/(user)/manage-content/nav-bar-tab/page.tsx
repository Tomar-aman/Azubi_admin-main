"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { getAllTabs, updateTabs } from "@/app/api/manageContent/manageContent";
import { message } from "antd";

const validationSchema = Yup.object({
  tab1: Yup.string().required("Tab 1 is required"),
  tab2: Yup.string().required("Tab 2 is required"),
  tab3: Yup.string().required("Tab 3 is required"),
  tab4: Yup.string().required("Tab 4 is required"),
  tab5: Yup.string().required("Tab 5 is required"),
});

const TabFormComponent = () => {
  const [initialValues, setInitialValues] = useState({
    tab1: "",
    tab2: "",
    tab3: "",
    tab4: "",
    tab5: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response: any = await getAllTabs();
        if (response.remote === "success" && response.data.length > 0) {
          const tabData = response.data[0]; // Assuming you want the first set of tabs
          setInitialValues({
            tab1: tabData.tab1,
            tab2: tabData.tab2,
            tab3: tabData.tab3,
            tab4: tabData.tab4,
            tab5: tabData.tab5,
          });
        }
      } catch (error) {
        setError("Failed to fetch tabs");
      } finally {
        setLoading(false);
      }
    };
    fetchTabs();
  }, []);

  const onSubmit = async (values: any) => {
    const response = await updateTabs(values);
    if(response.remote==="success"){
        message.success("Tabs update successfully")
    }
  };

  if (error) {
    return (
      <Box sx={{ textAlign: "center", padding: 2 }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <Box sx={{ padding: 2 }}>
              <Field
                name="tab1"
                as={TextField}
                label="Tab 1"
                fullWidth
                error={touched.tab1 && Boolean(errors.tab1)}
                helperText={touched.tab1 && errors.tab1}
              />

              <Field
                name="tab2"
                as={TextField}
                label="Tab 2"
                fullWidth
                error={touched.tab2 && Boolean(errors.tab2)}
                helperText={touched.tab2 && errors.tab2}
              />

              <Field
                name="tab3"
                as={TextField}
                label="Tab 3"
                fullWidth
                error={touched.tab3 && Boolean(errors.tab3)}
                helperText={touched.tab3 && errors.tab3}
              />

              <Field
                name="tab4"
                as={TextField}
                label="Tab 4"
                fullWidth
                error={touched.tab4 && Boolean(errors.tab4)}
                helperText={touched.tab4 && errors.tab4}
              />

              <Field
                name="tab5"
                as={TextField}
                label="Tab 5"
                fullWidth
                error={touched.tab5 && Boolean(errors.tab5)}
                helperText={touched.tab5 && errors.tab5}
              />
            </Box>

            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default TabFormComponent;
