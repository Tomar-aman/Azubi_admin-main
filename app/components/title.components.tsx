"use client";

import { Typography } from "@mui/material";
interface Props {
  heading: string;
  icon?: React.ReactNode;
}

const Title = (props: Props) => {
  return (
    <>
      <Typography
        variant="h2"
        sx={{ fontWeight: 600, mb: 3,mt: 1, fontSize: "32px", color:"#2894A2", }}
      >
        {props.icon} {props.heading}
      </Typography>
    </>
  );
};
export default Title;
