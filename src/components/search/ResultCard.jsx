import { Avatar, Grid, Rating, Tooltip, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import React from "react";
import styles from "./styles";
import useClasses from "../../hooks/useClasses";
import { useNavigate } from "react-router-dom";
import { convertDate } from "../../utils/functions";

const ResultCard = ({ freelancer, chosenDate }) => {
  const navigate = useNavigate();
  const classes = useClasses(styles);
  return (
    // root
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
      className={classes.resultCardRoot}
    >
      {/* 1st column: avatar, name & rating */}
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
                src={freelancer?.profilePicture}
                className={classes.resultCardAvatar}
                onClick={() => {
                  navigate("/freelancerProfile/" + freelancer?._id);
                }}
              />
            </Tooltip>
          </Grid>
          {/* name */}
          <Grid item>
            <Typography className={classes.resultCardName}>
              {freelancer?.firstName} {freelancer?.lastName}
            </Typography>
          </Grid>
          {/* rating */}
          <Grid item>
            <Rating
              precision={0.5}
              name="read-only"
              value={freelancer?.averageRating}
              readOnly
            />
          </Grid>
        </Grid>
      </Grid>
      {/* 2nd column: bio, location & locationStatus */}
      <Grid item xs={4} className={classes.resultCardColGrid}>
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="space-evenly"
          className={classes.resultCardColGrid}
        >
          {/* bio */}
          <Grid item>
            <Typography variant="body2" className={classes.resultCardBio}>
              {freelancer?.bio}
            </Typography>
          </Grid>
          {/* location */}
          <Grid item>
            <Grid container direction="row" alignItems="center">
              {/* icon */}
              <Grid item>
                <LocationOnIcon />
              </Grid>
              {/* location string */}
              <Grid item>
                <Typography variant="body2">
                  {freelancer.specificDateAvailability.filter(
                    (specificDate) =>
                      convertDate(specificDate.date).toString() ===
                      convertDate(chosenDate).toString()
                  ).length === 1
                    ? freelancer.specificDateAvailability.filter(
                        (specificDate) =>
                          convertDate(specificDate.date).toString() ===
                          convertDate(chosenDate).toString()
                      )[0].centerLocation?.address
                    : freelancer?.defaultAvailability?.centerLocation?.address}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* location status */}
          <Grid item>
            <Typography variant="body2">
              {/* {freelancer?.defaultAvailability?.locationStatus} */}
              {freelancer?.locationStatus
                ? freelancer?.locationStatus
                : freelancer?.defaultAvailability?.locationStatus}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {/* 3rd column: services details */}
      <Grid item xs={5} className={classes.resultCard3rdColGrid}>
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          className={classes.resultCardColGrid}
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
            {freelancer?.services?.map((service) => (
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
                    <Typography variant="body2">{service.price}€</Typography>
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
    </Grid>
  );
};

export default ResultCard;
