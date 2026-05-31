"use client";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import React, { useState } from "react";
import { MENU_DATA } from "./helper";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { SVG } from "../icon";
import { setIsLogin } from "@/app/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const SidebarMenu = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // @ts-ignore
  const currentUser = useSelector((state: any) => state.user?.data);
  const permissions = currentUser?.permissions;

  // Prevent flicker by waiting for Redux to populate currentUser
  if (!currentUser) return null;

  const handleMenu = (id: number) => {
    if (id === openMenu) {
      setOpenMenu(null);
    } else {
      setOpenMenu(id);
    }
  };

  const isSuperadmin = typeof window !== "undefined" && 
    !window.location.hostname.includes(process.env.NEXT_PUBLIC_MANAGED_USER_DOMAIN || "kundenzugang") &&
    !window.location.hostname.includes(process.env.NEXT_PUBLIC_MANAGED_EMPLOYEE_DOMAIN || "wohnzugang");

  const isManagedEmployee = typeof window !== "undefined" && 
    window.location.hostname.includes(process.env.NEXT_PUBLIC_MANAGED_EMPLOYEE_DOMAIN || "wohnzugang");

  const filteredMenuData = MENU_DATA.filter((item) => {
    if (item.label === "Log Out") return true;
    if (item.key === "public-jobs" || item.key === "public-companies") {
      return false;
    }
    if (isSuperadmin || !permissions) return true; // main admin, or old user
    return permissions.includes(item.key as string);
  });

  return (
    <>
      <List>
        {filteredMenuData.map((item, index) => (
          <React.Fragment key={`parent-${index}`}>
            <ListItem
              key={`parent-${index}`}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                className={pathname?.includes(`${item.url}`) ? "activeBg" : ""}
                autoFocus={false}
                disableRipple={true}
                {...(item.url ? { component: Link, href: `${item.url}`, target: item.target } : {})}
                sx={{
                  minHeight: 48,

                  px: 2.5,
                  py: 2,
                  "&.MuiListItemButton-root": {
                    fontSize: "16px",
                    fontWeight: 600,
                    color: pathname?.includes(`${item.url}`)
                      ? "#0096A4"
                      : "#646464",
                    "&:hover": {
                      background: "transparent",
                      color: "#0096A4",
                      "& .MuiListItemIcon-root": {
                        color: "#0096A4",
                      },
                    },
                    "& .MuiTypography-body1": {
                      fontWeight: 600,
                      whiteSpace: "pre-line",
                      lineHeight: 1.2,
                    },
                  },
                }}
                onClick={() => {
                  if (item.label === "Log Out") {
                    localStorage.clear();
                    dispatch(setIsLogin(false));
                  }
                  if (item.children) {
                    handleMenu(item.id);
                  }
                }}
              >
                <ListItemIcon
                  key={item.url}
                  sx={{
                    minWidth: 0,
                    mr: 2,
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span style={{ display: "block", whiteSpace: "pre-line", lineHeight: 1.2 }}>
                      {item.label}
                    </span>
                  }
                />
                {item.children ? (
                  <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
                    <SVG.ArrowDown />
                  </ListItemIcon>
                ) : (
                  ""
                )}
              </ListItemButton>
            </ListItem>
            {openMenu === item.id ? (
              <>
                {item.children ? (
                  <ListItem sx={{ flexDirection: "column" }}>
                    {item.children.map((child, key) => {
                      return (
                        <ListItemButton
                          key={`child-${key}`}
                          sx={{
                            width: "100%",
                            color: "#646464",
                            "&.MuiListItemButton-root": {
                              fontSize: "16px",
                              fontWeight: 600,
                              color: pathname?.includes(`${child.url}`)
                                ? "#0096A4"
                                : "#646464",
                              "&:hover": {
                                background: "transparent",
                                color: "#0096A4",
                                "& .MuiListItemIcon-root": {
                                  color: "#0096A4",
                                },
                              },
                              "& .MuiTypography-body1": {
                                fontWeight: 600,
                              },
                            },
                          }}
                          component={Link}
                          href={`/manage-content/${child.url}`}
                        >
                          <ListItemIcon
                            sx={{ minWidth: "auto", color: "inherit" }}
                          >
                            <SVG.ArrowLeft />
                          </ListItemIcon>
                          <ListItemText key={child.id}>
                            {child.label}
                          </ListItemText>
                        </ListItemButton>
                      );
                    })}
                  </ListItem>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );
};
export default SidebarMenu;
