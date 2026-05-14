"use client";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SVG } from "../components/icon";
import SidebarMenu from "../components/Sidebar/page";
import AuthChecker from "./authChecker";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { QRCodeDownload } from "../components/QRCodeDownload";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isToggle, setIsToggle] = useState(true);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const [showBranding, setShowBranding] = useState<boolean | null>(null);
  const [isUserDomain, setIsUserDomain] = useState(false);
  
  // @ts-ignore
  const currentUser = useSelector((state: any) => state.user?.data);
  const userId = currentUser?._id;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const userDomain = process.env.NEXT_PUBLIC_MANAGED_USER_DOMAIN || "kundenzugang";
      const employeeDomain = process.env.NEXT_PUBLIC_MANAGED_EMPLOYEE_DOMAIN || "wohnzugang";
      
      if (host.includes(userDomain)) {
        setIsUserDomain(true);
      }
      
      if (host.includes(userDomain) || host.includes(employeeDomain)) {
        setShowBranding(false);
      } else {
        setShowBranding(true);
      }
    }
  }, []);

  if (showBranding === null) return <Box sx={{ height: "100vh", background: "#e5f3f3" }} />;

  const handleToggle = () => {
    setIsToggle(!isToggle);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <AppBar
        position="static"
        sx={{
          background: "#e5f3f3",
          color: "#000",
          boxShadow: "none",
          padding: "19px 18px",
        }}
      >
        {!loading && <AuthChecker />}
        <Toolbar
          sx={{ minHeight: "auto !important", padding: "0px !important" }}
        >
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              width: isToggle ? "259px" : "37px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {showBranding && (
              <Image
                src={isToggle ? "/logo.png" : "/logo.png"}
                alt=""
                width={isToggle ? 210 : 28}
                height={isToggle ? 44 : 30.7}
                style={{objectFit:"contain"}}
              />
            )}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => handleToggle()}
            >
              <SVG.Menu />
            </IconButton>
          </Box>
          {/* <div>
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              onClick={handleMenu}
            >
              <Avatar
                sx={{ background: "#0096A4", height: "45px", width: "45px" }}
              >
                A
              </Avatar>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M6.25 9.375L12.5 15.625L18.75 9.375"
                  stroke="#646464"
                  strokeWidth="1.69167"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Stack>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div> */}
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexGrow: 1, background:"#e5f3f3", overflow: "hidden" }}>
        {isToggle ? (
          <Box
            sx={{
              width: "259px",
              p: 0,
              transition: "all 0.5s",
              flexShrink: "0",
              height: "100%",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#0096A4",
                borderRadius: "10px",
              },
            }}
          >
            {userId && isUserDomain && (
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center", pt: 3, pb: 2 }}>
                <QRCodeDownload value={userId} fileName={`qr_${currentUser?.username || "user"}`} displaySize={160} />
              </Box>
            )}
            <SidebarMenu />
          </Box>
        ) : (
          ""
        )}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            pt: 2,
            background: "#fff",
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
