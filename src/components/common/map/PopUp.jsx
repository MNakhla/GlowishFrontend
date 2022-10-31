import React from "react";
import { Grid, Rating, Stack, Typography, Avatar } from "@mui/material";
import { Popup } from "react-leaflet";
import { weekDays } from "../../../utils/constants";
import { Item, CustomButton } from "../../../elements/popUp";
import styles from "./styles.js";
import useClasses from "../../../hooks/useClasses";
import { useNavigate } from "react-router-dom";

const PopUp = ({ freelancer }) => {
  const navigate = useNavigate();
  const classes = useClasses(styles);
  return (
    <Popup>
      {/* root */}
      <Grid container direction="column">
        {/* avatar, name & bio */}
        <Grid item>
          <Grid
            container
            direction="row"
            alignItems="center"
            // justifyContent="space-between"
          >
            {/* avatar */}
            <Grid item xs={4}>
              <Avatar
                src={freelancer?.profilePicture}
                className={classes.avatar}
              />
            </Grid>
            {/* name & bio*/}
            <Grid item xs={8} sx={{ width: 300 }}>
              <Grid container direction="column">
                {/* name */}
                <Grid item className={classes.popupNameGrid}>
                  <Typography className={classes.popupNameTypo}>
                    {freelancer?.firstName} {freelancer?.lastName}
                  </Typography>
                </Grid>
                {/* bio */}
                <Grid item>
                  <Typography variant="body2" className={classes.popupBioTypo}>
                    {freelancer?.bio}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* freelancer details & services */}
        <Grid item>
          <Grid container direction="row" justifyContent="space-between">
            {/* freelancer details */}
            <Grid item>
              <Grid container direction="column" alignItems="center">
                {/* rating */}
                <Grid item>
                  <Rating
                    precision={0.5}
                    name="read-only"
                    value={freelancer?.averageRating}
                    readOnly
                  />
                </Grid>
                {/* working days */}
                <Grid item className={classes.popupDaysGrid}>
                  <Stack direction="row" spacing={0.5}>
                    {weekDays
                      .filter(
                        (day) =>
                          !freelancer?.defaultAvailability?.offDays.includes(
                            day
                          )
                      )
                      .map((day) => (
                        <Item key={day}>{day}</Item>
                      ))}
                  </Stack>
                </Grid>
                {/* view profile button */}
                <Grid item className={classes.popupButtonGrid}>
                  <CustomButton
                    variant="contained"
                    onClick={() => {
                      navigate(`/freelancerProfile/${freelancer?._id}`);
                    }}
                  >
                    <Typography>view Profile</Typography>
                  </CustomButton>
                </Grid>
              </Grid>
            </Grid>
            {/* freelancer services */}
            <Grid
              item
              className={classes.popupServicesGrid}
              container
              direction="column"
              justifyContent="center"
            >
              <Stack spacing={0.5}>
                {[
                  ...new Set(
                    freelancer?.services.map(
                      (service) => service.serviceCategory
                    )
                  ),
                ].map((category) => (
                  <Item key={category}>{category}</Item>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Popup>
  );
};

export default PopUp;
