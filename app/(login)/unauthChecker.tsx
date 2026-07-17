"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsLogin } from "../redux/auth/authSlice";

// Routes that should never be used as a "return here after login" target.
const isLoginOrReset = (route: string) =>
  !route ||
  route === "/" ||
  route.startsWith("/?") ||
  route === "/reset-password" ||
  route.startsWith("/reset-password?");

function AuthChecker() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const previousRoute: string = useSelector(
    (state: RootState) => state.currentRoute.route
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("x-access");
    if (!token) return;

    // A valid session already exists — reflect it in state...
    dispatch(setIsLogin(true));

    // ...and never leave an already-authenticated user sitting on the login
    // page. (reset-password keeps working since we only redirect away from "/".)
    if (pathname === "/") {
      const target = isLoginOrReset(previousRoute) ? "/dashboard" : previousRoute;
      router.push(target);
    }
  }, [dispatch, previousRoute, router, pathname]);

  return <div></div>;
}

export default AuthChecker;
