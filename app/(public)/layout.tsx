"use client";

import { Box } from "@mui/material";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", flexGrow: 1, background: "#fff", overflow: "hidden" }}>
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            height: "100%",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
