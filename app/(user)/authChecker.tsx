"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter, usePathname } from "next/navigation";
import { MENU_DATA } from "../components/Sidebar/helper";

function AuthChecker() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const previousRoute: string = useSelector(
    (state: RootState) => state.currentRoute.route
  );
  
  // @ts-ignore
  const currentUser = useSelector((state: any) => state.user?.data);
  const permissions = currentUser?.permissions;
  
  const router = useRouter();
  const pathname = usePathname();

  // 1. Fetch current user if logged in
  useEffect(() => {
    if (!isLogin) {
      router.push("/");
    } else {
      import("@/app/api/user/user").then(({ getCurrentUser }) => {
        getCurrentUser().then((res) => {
          if (res.remote === "success") {
            import("@/app/redux/user/userSlice").then(({ setCurrentUser }) => {
              // @ts-ignore
              dispatch(setCurrentUser(res.data.data));
            });
          }
        });
      });
    }
  }, [isLogin, router, dispatch]);

  // 2. Perform Routing and Permission Checks
  useEffect(() => {
    if (!isLogin || !currentUser) return;

    // Helper to get first allowed route
    const getFirstAllowedRoute = () => {
      if (!permissions || permissions.length === 0) return "/";
      const allowedItem = MENU_DATA.find(
        (item) => item.key && permissions.includes(item.key) && (item.url || item.children)
      );
      if (allowedItem) {
        if (allowedItem.url) return allowedItem.url;
        if (allowedItem.children && allowedItem.children.length > 0) {
          return `/manage-content/${allowedItem.children[0].url}`;
        }
      }
      return null;
    };

    // If permissions array exists (meaning restricted employee/user)
    if (permissions) {
      // Find if current path is allowed
      const matchingMenuItem = MENU_DATA.find((item) => {
        if (item.url && pathname.startsWith(item.url)) {
          return true;
        }
        if (item.children) {
          return item.children.some((child) => pathname.startsWith(`/manage-content/${child.url}`));
        }
        return false;
      });

      const isCurrentRouteAllowed = !matchingMenuItem || !matchingMenuItem.key || permissions.includes(matchingMenuItem.key);

      // If not allowed, redirect to first allowed route
      if (!isCurrentRouteAllowed || (pathname === "/dashboard" && !permissions.includes("dashboard"))) {
        const fallbackRoute = getFirstAllowedRoute();
        if (fallbackRoute && pathname !== fallbackRoute) {
          router.push(fallbackRoute);
        } else if (!fallbackRoute) {
          // Log out if absolutely no permissions are available
          localStorage.clear();
          import("@/app/redux/auth/authSlice").then(({ setIsLogin }) => {
            dispatch(setIsLogin(false));
          });
          router.push("/");
        }
        return;
      }
    }

    // 3. Handle default redirect upon successful login
    if (previousRoute) {
      const isInitialRedirect =
        previousRoute === "/" ||
        previousRoute.startsWith("/?") ||
        previousRoute === "/reset-password" ||
        previousRoute.startsWith("/reset-password?");
      if (isInitialRedirect) {
        if (permissions && !permissions.includes("dashboard")) {
          const fallbackRoute = getFirstAllowedRoute();
          if (fallbackRoute && pathname !== fallbackRoute) {
            router.push(fallbackRoute);
            return;
          }
        } else if (pathname !== "/dashboard") {
          router.push("/dashboard");
        }
      } else if (pathname !== previousRoute) {
        router.push(previousRoute);
      }
    }
  }, [isLogin, currentUser, permissions, pathname, previousRoute, router, dispatch]);

  return null;
}

export default AuthChecker;
