"use client";

import CustomLoader from "@/app/components/SpinLoader";
import Title from "@/app/components/title.components";
import { Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

import {
  EditContactModel,
  getContactModel,
} from "@/app/api/manageContent/manageContent";
import { ContactModelType } from "@/app/api/manageContent/manageContent.Types";
import dynamic from "next/dynamic";
import TextEditor from "../textEditor/textEditor";

const ManageFooter = () => {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [state, setState] = useState<ContactModelType>({
    _id: "",
    heading: "",
    subHeading: "",
    text: "",
    firstInputText: "",
    secondInputText: "",
    thirdInputText: "",
    fourthInputText: "",
    bottomHeading: "",
    firstCheckboxText: "",
    secondCheckboxText: "",
    thirdCheckboxText: "",
    fourthCheckboxText: "",
    submitButtonText: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (section: string) => {
    setEditLoading((prev) => ({ ...prev, [section]: true }));
    try {
      const response = await EditContactModel(state);
      if (response.remote === "success") {
        toast.info("Update successful!");
      } else {
        toast.error("Error updating footer content");
      }
    } catch (error) {
      console.error("Error updating footer content:", error);
    } finally {
      setEditLoading((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    try {
      const response = await getContactModel();
      if (response.remote === "success" && response.data.data) {
        console.log(response.data.data);
        setState(response.data.data as unknown as ContactModelType);
      }
    } catch (error) {
      console.error("Error getting footer content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllContent();
  }, []);

  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Contact Model" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate("section1");
        }}
      >
        <Grid container spacing={2} className="section-border">
          <Grid item xs={12}>
            <Title heading="Contact BUSINESSES Model" />
          </Grid>

          {/* First Section */}
          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              id="heading"
              name="heading"
              onChange={handleChange}
              value={state?.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>SubHeading</label>
            <TextField
              fullWidth
              id="subHeading"
              name="subHeading"
              onChange={handleChange}
              value={state?.subHeading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Text</label>
            <TextField
              fullWidth
              type="text"
              id="text"
              name="text"
              onChange={handleChange}
              value={state?.text}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Your Name</label>
            <TextField
              fullWidth
              type="firstInputText"
              id="firstInputText"
              name="firstInputText"
              onChange={handleChange}
              value={state?.firstInputText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Email</label>
            <TextField
              type="text"
              fullWidth
              id="secondInputText"
              name="secondInputText"
              onChange={handleChange}
              value={state?.secondInputText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Your telephone number</label>
            <TextField
              fullWidth
              id="thirdInputText"
              name="thirdInputText"
              onChange={handleChange}
              value={state?.thirdInputText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Your company / company name</label>
            <TextField
              fullWidth
              id="fourthInputText"
              name="fourthInputText"
              onChange={handleChange}
              value={state?.fourthInputText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>CheckBox Heading</label>
            <TextField
              fullWidth
              id="bottomHeading"
              name="bottomHeading"
              onChange={handleChange}
              value={state?.bottomHeading}
            />
          </Grid>
          <Grid item lg={4}>
            <label>First CheckBox Text</label>
            <TextField
              fullWidth
              id="firstCheckboxText"
              name="firstCheckboxText"
              onChange={handleChange}
              value={state?.firstCheckboxText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Second CheckBox Text</label>
            <TextField
              fullWidth
              id="secondCheckboxText"
              name="secondCheckboxText"
              onChange={handleChange}
              value={state?.secondCheckboxText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Third CheckBox Text</label>
            <TextField
              fullWidth
              id="thirdCheckboxText"
              name="thirdCheckboxText"
              onChange={handleChange}
              value={state?.thirdCheckboxText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Fourth CheckBox Text</label>
            <TextField
              fullWidth
              id="fourthCheckboxText"
              name="fourthCheckboxText"
              onChange={handleChange}
              value={state?.fourthCheckboxText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button Text</label>
            <TextField
              fullWidth
              id="submitButtonText"
              name="submitButtonText"
              onChange={handleChange}
              value={state?.submitButtonText}
            />
          </Grid>
          <Grid item lg={4} style={{ height: "300px", width: "100%" }}>
            <label>Bottom Bar Text</label>
            <TextEditor
              content={state.content}
              setContent={(value: any) => {
                const e = {
                  target: { name: "content", value },
                };
                handleChange(e as any);
              }}
            />{" "}
          </Grid>

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading["section1"] ? "Updating..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastContainer />
    </>
  );
};

export default ManageFooter;
