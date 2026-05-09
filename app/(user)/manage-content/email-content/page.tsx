"use client";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import { Box, Button, Grid, TextField } from "@mui/material";
import "./style.css";
import {
  AboutTeamCard,
  ContactUs,
  ContactUsUpdateField,
  Counter,
  EmailContent,
  JobWallContent,
  JobWallUpdateField,
} from "@/app/api/manageContent/manageContent.Types";
import { v4 } from "uuid";
import {
  EditContactUsContact,
  editEmailContents,
  EditJobWallContent,
  getAllContactUsContent,
  getAllEmailContent,
  getAllJobWallContent,
} from "@/app/api/manageContent/manageContent";
import { cardFactory } from "@/app/ulits/customMethods";
import TextEditor from "../textEditor/textEditor";

function Page() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [state, setState] = useState<EmailContent>({
    application: {
      upperContent: "",
      lowerContent: "",
      coverLetterDynamicText: "",
    },
    appointment: {
      upperContent: "",
      lowerContent: "",
      appointmentLetterDynamicText: "",
    },
  });

  const handleChangeForObjectType = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetState: keyof EmailContent
  ): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        //@ts-ignore
        setState((prevState) => ({
          ...prevState,
          //@ts-ignore
          [targetState]: { ...prevState[targetState], [name]: files[0] },
        }));
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      //@ts-ignore
      setState((prevState) => ({
        ...prevState,
        //@ts-ignore
        [targetState]: { ...prevState[targetState], [name]: value },
      }));
    }
  };

  const handleChangeForSingleLevelType = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState((prevState) => ({
          ...prevState,
          [name]: files[0],
        }));
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleChangeForArrayType = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    targetState: keyof EmailContent
  ) => {
    const { target } = e;
    const { name, value, files } = target;
    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState({
          ...state,
          //@ts-ignore
          [targetState]: state[targetState].map((acc, idx) =>
            index === idx ? { ...acc, [name]: files[0] } : acc
          ),
        });
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      setState({
        ...state,
        //@ts-ignore
        [targetState]: state[targetState].map((acc, idx) =>
          index === idx ? { ...acc, [name]: value } : acc
        ),
      });
    }
  };

  const updateContent = async (data: any, operation: keyof EmailContent) => {
    const response = await editEmailContents(data, operation);
    if (response.remote === "success") {
      const notify = () => toast.info("update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a job market");
      notify();
    }
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    operation: keyof EmailContent
  ) => {
    e.preventDefault();
    setEditLoading(true);
    if (operation === "application") {
      const { application } = state;
      await updateContent(application, operation);
    }
    if (operation === "appointment") {
      const { appointment } = state;
      await updateContent(appointment, operation);
    }
    setEditLoading(false);
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllEmailContent();
    if (response.remote === "success") {
      if (response.data.data) {
        const { application, appointment } = response.data.data;
        setState({
          ...state,
          application: application ? { ...application } : state.application,
          appointment: appointment ? { ...appointment } : state.appointment,
        });
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetAllContent();
  }, []);
  console.log({ state });
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Email content" />
      <form
        onSubmit={(e) => {
          handleUpdate(e, "application");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item lg={12}>
            <Title heading="Job application mail content" />
          </Grid>
          <Grid item lg={12}>
            <label>Upper content</label>
            <TextEditor
              content={state.application?.upperContent || ""}
              setContent={(data) => {
                let e: any = { target: { name: "upperContent", value: data } };
                handleChangeForObjectType(e, "application");
              }}
            />
          </Grid>

          <Grid item lg={12}>
            <label>Below content</label>
            <TextEditor
              content={state.application?.lowerContent || ""}
              setContent={(data) => {
                let e: any = { target: { name: "lowerContent", value: data } };
                handleChangeForObjectType(e, "application");
              }}
            />
          </Grid>

          <Grid item lg={12}>
            <label>cover letter text</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="coverLetterDynamicText"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "application");
              }}
              value={state?.application?.coverLetterDynamicText}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "appointment");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item lg={12}>
            <Title heading="company appointment mail content" />
          </Grid>
          <Grid item lg={12}>
            <label>Upper content</label>
            <TextEditor
              content={state.appointment?.upperContent || ""}
              setContent={(data) => {
                let e: any = { target: { name: "upperContent", value: data } };
                handleChangeForObjectType(e, "appointment");
              }}
            />
          </Grid>

          <Grid item lg={12}>
            <label>Below content</label>
            <TextEditor
              content={state.appointment?.lowerContent || ""}
              setContent={(data) => {
                let e: any = { target: { name: "lowerContent", value: data } };
                handleChangeForObjectType(e, "appointment");
              }}
            />
          </Grid>

          <Grid item lg={12}>
            <label>Appointment letter text</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="appointmentLetterDynamicText"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "appointment");
              }}
              value={state?.appointment?.appointmentLetterDynamicText}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </>
  );
}

export default Page;
