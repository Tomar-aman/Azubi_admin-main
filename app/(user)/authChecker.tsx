"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter } from "next/navigation";

function AuthChecker() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const previousRoute: string = useSelector(
    (state: RootState) => state.currentRoute.route
  );
  const router = useRouter();
  useEffect(() => {
    if (!isLogin) {
      router.push("/");
    } else {
      // Fetch user data if logged in to get permissions
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

      if (previousRoute) {
        router.push(
          previousRoute === "/" || previousRoute === "/reset-password"
            ? "/dashboard"
            : previousRoute
        );
      }
    }
  }, [isLogin, previousRoute, router]);

  return <div></div>;
}

export default AuthChecker;
