import { Grid, IconButton } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { months } from "../../utils/constants";

const DaySwitch = ({
  locString,
  searchOptionIndex,
  handleDateChange,
  handleSearchChange,
  chosenDate,
  chosenLocationObject,
}) => {
  const [currDate, setCurrDate] = React.useState(chosenDate);

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Grid item>
        {/* day before */}
        <IconButton
          onClick={() => {
            if (new Date(currDate - 1) > new Date()) {
              setCurrDate(new Date(currDate.setDate(currDate.getDate() - 1)));
              handleDateChange(currDate);
              handleSearchChange();
            }
          }}
          disabled={
            locString === chosenLocationObject?.formattedAddress ||
            searchOptionIndex === 0
              ? false
              : true
          }
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      {/* searched date */}
      <Grid item>
        {`${currDate.getDate()} ${
          months[currDate.getMonth()]
        } ${currDate.getFullYear()}`}
      </Grid>
      {/* day after */}
      <Grid item>
        <IconButton
          onClick={() => {
            setCurrDate(new Date(currDate.setDate(currDate.getDate() + 1)));
            handleDateChange(currDate);
            handleSearchChange();
          }}
          disabled={
            locString === chosenLocationObject?.formattedAddress ||
            searchOptionIndex === 0
              ? false
              : true
          }
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default DaySwitch;
