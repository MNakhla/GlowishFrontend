import { Edit, Facebook, Instagram, LocationOn } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

const FreelancerInfo = ({ freelancer, handleToggleEditInfoForm, editable }) => {
  return (
    <Card id="bio" style={{ height: "240px" }}>
      <CardActionArea>
        {editable && (
          <IconButton
            onClick={() => handleToggleEditInfoForm()}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
            }}
          >
            <Edit />
          </IconButton>
        )}
      </CardActionArea>
      <CardContent>
        <Typography
          gutterBottom
          variant="h3"
          component="div"
          sx={{ fontFamily: "Georgia", color: "#223140" }}
        >
          {freelancer.firstName} {freelancer.lastName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ wordWrap: "break-word" }}
        >
          {freelancer.bio}
        </Typography>
      </CardContent>
      <Grid container justifyContent="space-between">
        <Grid item>
          <CardActions>
            {freelancer.facebookURL !== "" && (
              <IconButton
                variant="contained"
                href={freelancer.facebookURL}
                aria-label="facebook-link"
                target="_blank"
                style={{ color: "#3b5998" }}
              >
                <Facebook />
              </IconButton>
            )}
            {freelancer.instagramURL !== "" && (
              <IconButton
                aria-label="instagram-link"
                href={freelancer.instagramURL}
                target="_blank"
                style={{ color: " #833AB4" }}
              >
                <Instagram />
              </IconButton>
            )}
          </CardActions>
        </Grid>
        <Grid item>
          <CardContent>
            <Typography gutterBottom variant="h7" component="div">
              {freelancer.defaultAvailability && <LocationOn />}
              {freelancer.defaultAvailability?.centerLocation.address}
            </Typography>
            {freelancer.phone !== "" && (
              <Typography gutterBottom variant="h7" component="div">
                {freelancer.phone}
              </Typography>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default FreelancerInfo;
