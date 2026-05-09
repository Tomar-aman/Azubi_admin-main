"use client";

import React, { useEffect, useState } from 'react'
import "./style.css";
import CustomLoader from '@/app/components/SpinLoader';
import Title from '@/app/components/title.components';
import { Button, Grid, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditMagazineContact, getMagazineContact } from '@/app/api/manageContent/manageContent';
import { MagazineContactType } from '@/app/api/manageContent/manageContent.Types';

const MagazineContact = () => {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState<{ [key: string]: boolean }>({});
  const [state, setState] = useState<MagazineContactType>({
    _id: "",
    inputKey: "",
    inputKey1: "",
    inputKey2: "",
    inputKey3: "",
    inputKey4: "",
    field1: "",
    field2: "",
    field3: "",
    field4: "",
  
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };



  const handleUpdate = async (section: string) => {
    setEditLoading(prev => ({ ...prev, [section]: true }));
    try {
      const response = await EditMagazineContact(state);
      if (response.remote === "success") {
        toast.info("Update successful!");
      } else {
        toast.error("Error updating Magazine content");
      }
    } catch (error) {
      console.error("Error updating Magazine content:", error);
    } finally {
      setEditLoading(prev => ({ ...prev, [section]: false }));
    }
  };



  const handleGetAllContent = async () => {
    setIsLoading(true);
    try {
      const response = await getMagazineContact();
      if (response.remote === "success" && response.data) {
        setState(response.data.data as unknown as MagazineContactType);
      }
    } catch (error) {
      console.error("Error getting Magazine content:", error);
    } finally {
      setIsLoading(false);
    }
  };


console.log("state-----" , state)

  useEffect(() => {
    handleGetAllContent();
  }, []);



  useEffect(() => {
    if (state) {
      setState(state);
    }
  }, [state]);








  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Manage Magazine contact" />

      <form onSubmit={(e) => { e.preventDefault(); handleUpdate('section1'); }}>
        <Grid container spacing={2} className="section-border">
          <Grid item xs={12}>
            <Title heading="Contact Section" />
          </Grid>

          {/* First Section */}
          <Grid item lg={4}>
            <label>Name</label>
            <TextField
              fullWidth
               type="text"
              id="inputKey"
              name="inputKey"
              onChange={handleChange}
              value={state.inputKey}
             
            />
          </Grid>

          <Grid item lg={4}>
            <label>Street</label>
            <TextField
              fullWidth
               type="text"
              id="inputKey1"
              name="inputKey1"
              onChange={handleChange}
              value={state.inputKey1}
              
            />
          </Grid>

          <Grid item lg={4}>
            <label>PLZ</label>
            <TextField
              fullWidth
              type="text"
              id="inputKey2"
              name="inputKey2"
              onChange={handleChange}
              value={state.inputKey2}
             
            />
          </Grid>

          <Grid item lg={4}>
            <label>Email</label>
            <TextField
              fullWidth
              type="text"
              id="inputKey3"
              name="inputKey3"
              onChange={handleChange}
              value={state.inputKey3}
            
            />
          </Grid>

         
          <Grid item lg={4}>
            <label>Name Unternehmen/Schule/Vertriebspartne</label>
            <TextField
              fullWidth
              type='text'
              id="field1"
              name="field1"
              onChange={handleChange}
              value={state.field1}
             
            />
          </Grid>

          <Grid item lg={4}>
            <label>Stadt / Ort </label>
            <TextField
              fullWidth
              type='text'
              id="field2"
              name="field2"
              onChange={handleChange}
              value={state.field2}
              
            />
          </Grid>


          <Grid item lg={4}>
            <label>Region / </label>
            <TextField
              fullWidth
              type='text'
              id="field4"
              name="field4"
              onChange={handleChange}
              value={state.field4}
              
            />
          </Grid>

          <Grid item xs={12}>
              <label>Sub Heading</label>
              <TextField
                fullWidth
                type="text"
                id="inputKey4"
                placeholder="Enter Heading"
                autoComplete="off"
                name="inputKey4"
                onChange={handleChange}
                value={state.inputKey4}
                
              />
            </Grid>


          <Grid item xs={12}>
            <Button type="submit">
              {editLoading['section1'] ? "Updating..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastContainer />
    </>
  )
}

export default MagazineContact;
