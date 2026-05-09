"use client";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import { Button, TextField } from "@mui/material";
import {
  EditApplyFormContents,
  getAllApplyFormContents,
} from "@/app/api/manageContent/manageContent";
function ApplyFormContent() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    number: "",
    about_me: "",
    letter: "",
    id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    const response = await EditApplyFormContents(state);
    if (response.remote === "success") {
      const notify = () => toast.info("update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a job market");
      notify();
    }
    setEditLoading(false);
  };


  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllApplyFormContents();
    if (response.remote === "success") {
      console.log({ response });
      //@ts-ignore
      if (response.data.data) setState(response.data.data);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetAllContent();
  }, []);
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Apply Form Content" />

      <form onSubmit={handleUpdate}>
        <label>Name</label>
        <TextField
          fullWidth
          required
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="name"
          onChange={handleChange}
          value={state?.name}
        />

        <label>email</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="email"
          onChange={handleChange}
          value={state?.email}
        />

        <label>number</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="number"
          onChange={handleChange}
          value={state?.number}
        />

        <label>about</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="about_me"
          onChange={handleChange}
          value={state?.about_me}
        />

        <label>letter</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="letter"
          onChange={handleChange}
          value={state?.letter}
        />

        <Button type="submit">{editLoading ? "Update..." : "Update"}</Button>
      </form>
      <ToastContainer />
    </>
  );
}

export default ApplyFormContent;
