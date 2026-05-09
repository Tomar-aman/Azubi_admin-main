"use client";

import CustomLoader from '@/app/components/SpinLoader';
import Title from '@/app/components/title.components';
import { Button, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";

import { EditFooterContents, getFooterContent } from '@/app/api/manageContent/manageContent';
import { FooterContentType } from '@/app/api/manageContent/manageContent.Types';

const ManageFooter = () => {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState<{ [key: string]: boolean }>({});
  const [state, setState] = useState<FooterContentType>({
    _id: "",
    heading1: "",
    section1Title: "",
    section1Address: "",
    section1Phone: "",
    section1Email: "",
    section1WorkingHours: "",
    heading2: "",
    section2Title: "",
    section2Address: "",
    section2Phone: "",
    section2Email: "",
    section2WorkingHours: "",
    heading3: "",
    section3Title: "",
    section3Links: "",
    backgroundColor: "",
    textColor: "",
    linkColor: "",
    borderColor: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setEditLoading(true);
  //   try {
  //     const response = await EditFooterContents(state);
  //     if (response.remote === "success") {
  //       toast.info("Update successful!");
  //     } else {
  //       toast.error("Error updating footer content");
  //     }
  //   } catch (error) {
  //     console.error("Error updating footer content:", error);
  //   } finally {
  //     setEditLoading(false);
  //   }
  // };


  const handleUpdate = async (section: string) => {
    setEditLoading(prev => ({ ...prev, [section]: true }));
    try {
      const response = await EditFooterContents(state);
      if (response.remote === "success") {
        toast.info("Update successful!");
      } else {
        toast.error("Error updating footer content");
      }
    } catch (error) {
      console.error("Error updating footer content:", error);
    } finally {
      setEditLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    try {
      const response = await getFooterContent();
      if (response.remote === "success" && response.data) {
        setState(response.data as unknown as FooterContentType);
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
      <Title heading="Footer dynamic content" />

      <form onSubmit={(e) => { e.preventDefault(); handleUpdate('section1'); }}>
        <Grid container spacing={2} className="section-border">
          <Grid item xs={12}>
            <Title heading="Druck & Konzeption" />
          </Grid>

          {/* First Section */}
          <Grid item lg={4}>
            <label>Heading1</label>
            <TextField
              fullWidth
              id="heading1"
              name="heading1"
              onChange={handleChange}
              value={state?.heading1}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Heading2</label>
            <TextField
              fullWidth
              id="heading2"
              name="heading2"
              onChange={handleChange}
              value={state?.heading2}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Heading3</label>
            <TextField
              fullWidth
              id="heading3"
              name="heading3"
              onChange={handleChange}
              value={state?.heading3}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Title</label>
            <TextField
              fullWidth
              id="section1Title"
              name="section1Title"
              onChange={handleChange}
              value={state?.section1Title}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Address</label>
            <TextField
              fullWidth
              id="section1Address"
              name="section1Address"
              onChange={handleChange}
              value={state?.section1Address}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Phone</label>
            <TextField
              fullWidth
              type="text"
              id="section1Phone"
              name="section1Phone"
              onChange={handleChange}
              value={state?.section1Phone}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Email</label>
            <TextField
              fullWidth
              type="email"
              id="section1Email"
              name="section1Email"
              onChange={handleChange}
              value={state?.section1Email}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Working Hours</label>
            <TextField
              fullWidth
              id="section1WorkingHours"
              name="section1WorkingHours"
              onChange={handleChange}
              value={state?.section1WorkingHours}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading['section1'] ? "Updating..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>



      <form onSubmit={(e) => { e.preventDefault(); handleUpdate('section2'); }}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Messen & Eventplanung" />
          </Grid>

          <Grid item lg={4}>
            <label>Title</label>
            <TextField
              fullWidth
              required
              id="section2Title"
              autoComplete="off"
              name="section2Title"
              value={state?.section2Title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Address</label>
            <TextField
              fullWidth
              required
              type='text'
              id="section2Address"
              autoComplete="off"
              name="section2Address"
              value={state?.section2Address}
              onChange={handleChange}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Phone</label>
            <TextField
              fullWidth
              type="text"
              required
              id="section2Phone"
              autoComplete="off"
              name="section2Phone"
              value={state?.section2Phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Email</label>
            <TextField
              fullWidth
              type="email"
              required
              id="section2Email"
              autoComplete="off"
              name="section2Email"
              value={state?.section2Email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Working Hours</label>
            <TextField
              fullWidth
              type="text"
              required
              id="section2WorkingHours"
              autoComplete="off"
              name="section2WorkingHours"
              value={state?.section2WorkingHours}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading['section2'] ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>
{/* 
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate('section3'); }}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Impressum & Co." />
          </Grid>

          <Grid item lg={4}>
            <label>Title</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
            />
          </Grid>

          <Grid item lg={4}>
            <label>Address</label>
            <TextField
              fullWidth
              required
              type='text'
              id="section3Links"
              autoComplete="off"
              name="section3Links"
              value={state?.section3Links}
              onChange={handleChange}
            />
          </Grid>

         
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form> */}

      <form onSubmit={(e) => { e.preventDefault(); handleUpdate('section3'); }}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Card Color Change" />
          </Grid>

        
          <Grid item lg={4}>
            <label>Background color</label>
            <TextField
              fullWidth
              type="color"
              required
              id="backgroundColor"
              autoComplete="off"
              name="backgroundColor"
              value={state?.backgroundColor}
              onChange={handleChange}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              type="text"
              id="textColor"
              autoComplete="off"
              name="textColor"
              value={state?.textColor}
              onChange={handleChange}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Sub Heading</label>
            <TextField
              fullWidth
              type="text"
              id="linkColor"
              autoComplete="off"
              name="linkColor"
              value={state?.linkColor}
              onChange={handleChange}
            />
          </Grid>

          <Grid item lg={4}>
          <label>Button Text</label>
            <TextField
              fullWidth
              type="text"
              id="borderColor"
              autoComplete="off"
              name="borderColor"
              value={state?.borderColor}
              onChange={handleChange}
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
  )
}

export default ManageFooter;
