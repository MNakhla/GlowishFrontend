import * as React from "react";
import { useState } from "react";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { ThemeProvider } from "@mui/material/styles";
import { styledTheme } from "./styles";
import { CalendarPickerSkeleton } from "@mui/x-date-pickers/CalendarPickerSkeleton";
import { formatDateFromDate, getFreelancerDate } from "../../utils/functions";
import { startOfToday, addMonths, isSameDay, isToday } from "date-fns";
import { CircleOutlined, CircleTwoTone, Edit } from "@mui/icons-material";
import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { CalendarPicker } from "@mui/x-date-pickers";
import circleDoubleIcon from "../../assets/circleDoubleIcon.png";

const MuiCalendar = ({
  freelancer,
  specificEdittedDates,
  edittable,
  handleEditSpecificFreelancerDate,
  clickedDate,
  setClickedDate,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // const [highlightedDays, setHighlightedDays] = useState([]);
  const [value, setValue] = useState(startOfToday());
  // const [month, setMonth] = useState(startOfToday().getMonth());

  React.useEffect(() => {}, [specificEdittedDates]);

  const handleMonthChange = (date) => {};

  const viewDescription = !edittable ? (
    <CardContent>
      <Typography variant="subtitle2" color="LightGray">
        <CircleTwoTone fontSize="inherit" style={{ color: "LightGray" }} />{" "}
        &nbsp; Off / Fully Booked
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        <CircleOutlined fontSize="inherit" /> &nbsp; On The Move
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        <CircleTwoTone fontSize="inherit" style={{ color: "red" }} /> &nbsp; At
        a Salon
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        <Badge overlap="circular" color="secondary" variant="dot">
          <CircleOutlined fontSize="inherit" />
        </Badge>{" "}
        &nbsp; Chosen Day
      </Typography>
    </CardContent>
  ) : (
    <CardContent>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="Gray">
            <CircleTwoTone fontSize="inherit" style={{ color: "Gray" }} />{" "}
            &nbsp; Off Day
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <CircleOutlined fontSize="inherit" /> &nbsp; On The Move
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <CircleTwoTone fontSize="inherit" style={{ color: "red" }} /> &nbsp;
            At a Salon
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            <img src={circleDoubleIcon} height={"13px"} /> &nbsp; Slots Booked
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <CircleOutlined fontSize="inherit" /> &nbsp; No Bookings Yet
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <Badge overlap="circular" color="secondary" variant="dot">
              <CircleOutlined fontSize="inherit" />
            </Badge>{" "}
            &nbsp; Editted Day
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <strong>Note:</strong> You cannot change the location on booked
            days.
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  );

  return (
    <Card>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={styledTheme}>
            <CalendarPicker
              open={true}
              maxDate={addMonths(startOfToday().setDate(1), 2)}
              minDate={startOfToday().setDate(1)}
              value={value}
              loading={isLoading}
              onChange={(newValue) => {
                const specEdittedDate = specificEdittedDates?.find((specDate) =>
                  isSameDay(
                    formatDateFromDate(specDate.date),
                    formatDateFromDate(newValue)
                  )
                );
                const edittedBefore = specEdittedDate !== undefined;
                const freelancerDateToEdit = edittedBefore
                  ? specEdittedDate
                  : getFreelancerDate(freelancer, newValue);
                if (!edittable) setClickedDate(freelancerDateToEdit);
                handleEditSpecificFreelancerDate(freelancerDateToEdit);
              }}
              onMonthChange={handleMonthChange}
              renderInput={(params) => <TextField {...params} />}
              renderLoading={() => <CalendarPickerSkeleton />}
              renderDay={(day, _value, DayComponentProps) => {
                const specEdittedDate = specificEdittedDates?.find((specDate) =>
                  isSameDay(
                    formatDateFromDate(specDate.date),
                    formatDateFromDate(day)
                  )
                );
                const edittedBefore = specEdittedDate !== undefined;
                const freelancerDate = edittedBefore
                  ? specEdittedDate
                  : getFreelancerDate(freelancer, day);
                // if (isToday(day))
                // console.log("test freelancerDate", freelancerDate);
                let disabled = undefined;
                let color = undefined;
                let border = undefined;
                if (edittable) {
                  //freelancer editting availability view
                  disabled = freelancerDate.bHasPassed;
                  color = freelancerDate.bOffDay
                    ? "lightgray"
                    : freelancerDate.locationStatus === "AtSalon"
                    ? "pink"
                    : undefined;
                  border = freelancerDate.bHasAppointments
                    ? "2px solid black"
                    : undefined;
                } else {
                  //customer viewing/booking view
                  disabled =
                    freelancerDate.bHasPassed ||
                    freelancerDate.bOffDay ||
                    freelancerDate.bFullyBooked;
                  color =
                    freelancerDate.bOffDay || freelancerDate.bFullyBooked
                      ? "lightgray"
                      : freelancerDate.locationStatus === "AtSalon"
                      ? "pink"
                      : undefined;
                }

                DayComponentProps.disabled = disabled;

                return (
                  <Badge
                    key={day.toString()}
                    overlap="circular"
                    color="secondary"
                    variant={
                      edittedBefore ||
                      (!edittable &&
                        clickedDate !== null &&
                        isSameDay(
                          formatDateFromDate(freelancerDate.date),
                          formatDateFromDate(clickedDate.date)
                        ))
                        ? "dot"
                        : undefined
                    }
                    badgeContent={
                      edittedBefore ? (
                        <Edit sx={{ fontSize: "10px" }}></Edit>
                      ) : undefined
                    }
                  >
                    <PickersDay
                      sx={{ border: border, backgroundColor: color }}
                      {...DayComponentProps}
                    />
                  </Badge>
                );
              }}
            ></CalendarPicker>
          </ThemeProvider>
        </LocalizationProvider>
      </CardContent>

      <Divider></Divider>

      {viewDescription}
    </Card>
  );
};

export default MuiCalendar;
