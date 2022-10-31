import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactComponent as Logo } from "../../../assets/logo.svg";
import styles from "./styles";
import useClasses from "../../../hooks/useClasses";

const Loading = () => {
  const classes = useClasses(styles);
  return (
    <div className={classes.rootDiv}>
      <div className={classes.secondDiv}>
        <CircularProgress
          variant="indeterminate"
          className={classes.circularProgress}
          size={280}
          thickness={0.5}
        />
        <Logo className={classes.logo} />
      </div>
    </div>
  );
};

export default Loading;
