import { Avatar, Button, Grid, Tooltip, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import React from "react";
import styles from "./styles";
import useClasses from "../../hooks/useClasses";
import { useNavigate } from "react-router-dom";
import {
  convertDate,
  translateScheduleSlotIndexToSlotTimeString,
  translateSlotTimeStringToScheduleSlotIndex,
} from "../../utils/functions";
import {
  fullRefund,
  partialRefund,
  updatePaymentStatus,
} from "../../services/api/payment.services";
import { cancelAppointment } from "../../services/api/appointment.services";
import AlertCancelAppointment from "./AlertCancelAppointment";
import { SocketContext } from "../../utils/socket";

const AppointmentCard = ({ currAppointment }) => {
  const classes = useClasses(styles);
  const [appointment, setAppointment] = React.useState(currAppointment);
  const appointmentDate = new Date(appointment.date);
  const todayDate = new Date();
  const diffTime = Math.abs(todayDate - appointmentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const [open, setOpen] = React.useState(false);
  const socket = React.useContext(SocketContext);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancelAppointment = async () => {
    const startTime = appointment.startTime;
    const endTime = appointment.endTime;
    let currSpecificDateAvailability =
      await appointment.freelancer.specificDateAvailability.filter(
        (specificDateAvailability) =>
          specificDateAvailability.date === appointment.date
      )[0];
    let currSchedule = currSpecificDateAvailability.schedule;
    // console.log(currSchedule);
    for (
      let st = translateSlotTimeStringToScheduleSlotIndex(startTime);
      translateScheduleSlotIndexToSlotTimeString(st) !== endTime;

    ) {
      currSchedule[st[0]][st[1]] = "available";
      if (st[1] + 1 === currSchedule[0].length) {
        st[0] += 1;
        st[1] = 0;
      } else st[1] += 1;
    }
    // console.log(currSchedule);
    if (diffDays > 4) {
      await fullRefund(
        appointment.customer,
        appointment.payment.paymentIntentId
      )
        .then(async (res) => {
          // console.log(res);
          await updatePaymentStatus(
            appointment.customer,
            appointment.payment.paymentIntentId,
            "early_cancellation"
          )
            .then(async (res) => {
              await cancelAppointment(appointment._id, appointment.customer, {
                specificDateAvailabilityId: currSpecificDateAvailability._id,
                schedule: currSchedule,
              })
                .then(async () => {
                  setAppointment({ ...appointment, cancelled: true });

                  socket?.emit(
                    "updateNotifications",
                    appointment.customer,
                    "customer"
                  );
                  socket?.emit(
                    "updateNotifications",
                    appointment.freelancer._id,
                    "freelancer"
                  );
                })
                .catch((err) => {
                  alert("Error cancelling appointment");
                });
            })
            .catch((err) => {
              alert("Error cancelling appointment");
            });
        })
        .catch((err) => {
          alert("Error cancelling appointment");
        });
    } else {
      await partialRefund(
        appointment.customer,
        appointment.payment.paymentIntentId,
        Math.round(appointment.price * 0.4) * 100
      )
        .then(async (res) => {
          // console.log(res);
          await updatePaymentStatus(
            appointment.customer,
            appointment.payment.paymentIntentId,
            "late_cancellation"
          )
            .then(async (res) => {
              await cancelAppointment(appointment._id, appointment.customer, {
                specificDateAvailabilityId: currSpecificDateAvailability._id,
                schedule: currSchedule,
              })
                .then(async () => {
                  setAppointment({ ...appointment, cancelled: true });

                  socket?.emit(
                    "updateNotifications",
                    appointment.customer,
                    "customer"
                  );
                  socket?.emit(
                    "updateNotifications",
                    appointment.freelancer._id,
                    "freelancer"
                  );
                })
                .catch((err) => {
                  alert("Error cancelling appointment");
                });
            })
            .catch((err) => {
              alert("Error cancelling appointment");
            });
        })
        .catch((err) => {
          alert("Error cancelling appointment");
        });
    }
  };
  // console.log(appointment.services);
  return (
    // root
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
      className={classes.resultCardRoot}
    >
      {/* 1st column: avatar, name  */}
      <Grid item xs={1.5} className={classes.resultCardColGrid}>
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          className={classes.resultCardColGrid}
        >
          {/* avatar */}
          <Grid item>
            <Tooltip title="View Profile" placement="top">
              <Avatar
                src={appointment?.freelancer?.profilePicture}
                className={classes.resultCardAvatar}
                onClick={() => {
                  navigate(
                    `/freelancerProfile/${appointment?.freelancer?._id}`
                  );
                }}
              />
            </Tooltip>
          </Grid>
          {/* name */}
          <Grid item>
            <Typography className={classes.resultCardName}>
              {appointment.freelancer?.firstName}{" "}
              {appointment.freelancer?.lastName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {/* 2nd column: Appointment Details */}
      <Grid item xs={4} className={classes.resultCardColGrid}>
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="space-evenly"
          className={classes.resultCardColGrid}
        >
          <Grid item>
            <Typography
              variant="body2"
              className={classes.resultCardBio}
              sx={{ color: appointment?.cancelled ? "red" : "green" }}
            >
              {appointment?.cancelled ? "Cancelled" : "Booked"}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction="row" sx={{ height: 10 }}>
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.resultCardBio}>
                  Date: {convertDate(appointment?.date)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.resultCardBio}>
                  Time: {appointment?.startTime} : {appointment?.endTime}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <LocationOnIcon />
              </Grid>

              <Grid item>{appointment?.location.address}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              Total Cost: {appointment?.price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {/* 3rd column: services details */}
      <Grid item xs={5} className={classes.resultCardColGrid}>
        <Grid
          container
          direction="column"
          justifyContent="space-around"
          sx={{ minHeight: "100%" }}
        >
          <Grid item xs={7}>
            <Grid
              container
              direction="column"
              className={classes.resultCard3rdColGrid}
            >
              {/* header */}
              <Grid item className={classes.resultCardHeader}>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  className={classes.resultCardHeaderGrid}
                >
                  {/* service title */}
                  <Grid item className={classes.resultCardServicesGrid}>
                    <Typography
                      className={classes.resultCardServicesTypo}
                      variant="body2"
                    >
                      Services
                    </Typography>
                  </Grid>
                  {/* price title */}
                  <Grid item className={classes.resultCardServicesGrid}>
                    <Typography
                      className={classes.resultCardServicesTypo}
                      variant="body2"
                    >
                      Price
                    </Typography>
                  </Grid>
                  {/* duration title */}
                  <Grid item className={classes.resultCardServicesGrid}>
                    <Typography
                      className={classes.resultCardServicesTypo}
                      variant="body2"
                    >
                      Estimated Time
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* services */}
              <Grid item className={classes.resultCardServices}>
                {appointment?.services?.map((service) => (
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="space-evenly"
                      className={classes.resultCardServicesGridRes}
                    >
                      {/* service name */}
                      <Grid item className={classes.resultCardServicesResGrid}>
                        <Typography variant="body2">{service.name}</Typography>
                      </Grid>
                      {/* service price */}
                      <Grid item className={classes.resultCardServicesResGrid}>
                        <Typography variant="body2">
                          {service.price}€
                        </Typography>
                      </Grid>
                      {/* service duration */}
                      <Grid item className={classes.resultCardServicesResGrid}>
                        <Typography variant="body2">
                          {service.estimatedTime}min
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid item alignSelf="center" xs={5}>
            {!appointment.cancelled &&
            new Date(appointment.date) > new Date() ? (
              <Button
                variant="contained"
                sx={{ backgroundColor: "red" }}
                onClick={handleClickOpen}
              >
                <Typography variant="body2">Cancel Appointment</Typography>
              </Button>
            ) : (
              !appointment.cancelled &&
              new Date(appointment.date).getDate() === new Date().getDate() && (
                <Typography variant="body2" sx={{ color: "red" }}>
                  This appointment cannot be cancelled because it is today!
                </Typography>
              )
            )}
            <AlertCancelAppointment
              diffDays={diffDays}
              appointmentPrice={appointment.price}
              open={open}
              setOpen={setOpen}
              handleCancelAppointment={handleCancelAppointment}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AppointmentCard;
