import React, { useRef, useState, ChangeEvent } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const FileUploadButton: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name); // Set the name of the first selected file
    }
  };

  const handleClearFile = () => {
    setFileName(null); // Clear the file name
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click(); // Open the file dialog programmatically
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        height: "50px",
      }}
    >
      <Button
        variant="contained"
        // onClick={handleClick}
        sx={{
          marginRight: "8px",
          backgroundColor: "#8C65A3 !important",
          height: "25px",
          textOverflow: "ellipsis",
          fontSize: "14px",
          lineHeight: "30px",
        }}
      >
        Choose Files
      </Button>

      <Typography
        variant="body2"
        sx={{
          flexGrow: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
          lineHeight: "30px",
        }}
      >
        {fileName || "No file chosen"}
      </Typography>

      {fileName && (
        <IconButton onClick={handleClearFile}>
          <ClearIcon />
        </IconButton>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default FileUploadButton;
