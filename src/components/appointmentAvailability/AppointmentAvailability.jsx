import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material/";
import { CircleOutlined, CircleTwoTone } from "@mui/icons-material/";
import {
  dateDayIntToFullString,
  getAllFreelancerDatesThisWeek,
} from "../../utils/functions";
import { getDay } from "date-fns";
import { useNavigate } from "react-router-dom";

const AppointmentAvailability = ({
  editable,
  freelancer,
  handleToggleEditAppointmentAvailabilityForm,
}) => {
  const navigate = useNavigate();
  const weekFreelancerDates = freelancer.defaultAvailability
    ? getAllFreelancerDatesThisWeek(freelancer)
    : undefined;
  return (
    <Card id="appointment-availability">
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          Appointment availability:
        </Typography>

        {freelancer.defaultAvailability ? (
          <div>
            <List disablePadding dense={true}>
              {weekFreelancerDates.map((freelancerDate) => (
                <ListItem>
                  <ListItemText>
                    <Typography
                      variant="subtitle2"
                      color={
                        freelancerDate.bOffDay || freelancerDate.bFullyBooked
                          ? "LightGray"
                          : "text.Secondary"
                      }
                    >
                      {freelancerDate.bOffDay || freelancerDate.bFullyBooked ? (
                        <CircleTwoTone
                          fontSize="inherit"
                          style={{ color: "LightGray" }}
                        />
                      ) : freelancerDate.locationStatus === "OnTheMove" ? (
                        <CircleOutlined fontSize="inherit" />
                      ) : (
                        <CircleTwoTone
                          fontSize="inherit"
                          style={{ color: "red" }}
                        />
                      )}
                      &nbsp;{" "}
                      {dateDayIntToFullString(getDay(freelancerDate.date))}
                    </Typography>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
            <Divider />
            <CardContent>
              <Typography variant="subtitle2" color="LightGray">
                <CircleTwoTone
                  fontSize="inherit"
                  style={{ color: "LightGray" }}
                />{" "}
                &nbsp; Unavailable
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                <CircleOutlined fontSize="inherit" /> &nbsp; On The Move
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                <CircleTwoTone fontSize="inherit" style={{ color: "red" }} />{" "}
                &nbsp; At a Salon
              </Typography>
            </CardContent>
          </div>
        ) : (
          // we assume that this is the freelancer view, since incomplete profiles don't show up to customers
          <Typography gutterBottom variant="subtitle2" component="div">
            You haven't created your schedule yet! Click the button below to
            create your schedule.
          </Typography>
        )}
        <Divider />
        <CardActions>
          {editable ? (
            <Button
              onClick={() => handleToggleEditAppointmentAvailabilityForm()}
            >
              {freelancer.defaultAvailability
                ? "View & Edit"
                : "Create Schedule"}
            </Button>
          ) : !editable &&
            localStorage.getItem("userType") === "customer" &&
            freelancer.completed ? (
            <Button
              onClick={() => {
                navigate(`/book/${freelancer._id}`);
              }}
            >
              Book Appointment
            </Button>
          ) : undefined}
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default AppointmentAvailability;
