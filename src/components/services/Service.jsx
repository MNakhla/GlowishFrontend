import { DeleteSharp, Edit } from "@mui/icons-material";
import {
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import hairIcon from "../../assets/hair.png";
import makeupIcon from "../../assets/makeup.png";
import nailIcon from "../../assets/nail.png";
import { getTimeDisplay } from "../../utils/functions";

const Service = ({
  editable,
  service,
  handleDelete,
  handleToggleUpdateServiceForm,
}) => {
  const { _id, serviceCategory, name, price, estimatedTime } = service;
  const imgIcon =
    serviceCategory === "Hair"
      ? hairIcon
      : serviceCategory === "Makeup"
      ? makeupIcon
      : nailIcon;

  return (
    <Grid container justifyContent="space-between" alignItems={"center"}>
      <Grid item xs={4}>
        <CardContent>
          <Grid container direction="row" columnSpacing={2}>
            <Grid item>
              <img src={imgIcon} height="40px" />
            </Grid>
            <Grid item alignSelf={"center"}>
              <Typography variant="subtitle2">
                &nbsp;
                {name}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Grid>
      <Grid item xs={3}>
        <CardContent>
          <Typography variant="h9" component="div" textAlign={"center"}>
            {price}€
          </Typography>
        </CardContent>
      </Grid>
      <Grid item xs={3.5}>
        <CardContent>
          <Typography variant="h9" component="div" textAlign={"center"}>
            {getTimeDisplay(estimatedTime)}
          </Typography>
        </CardContent>
      </Grid>
      <Grid item xs={1.5}>
        {editable && (
          <CardActions>
            <IconButton onClick={() => handleToggleUpdateServiceForm(_id)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(_id)}>
              <DeleteSharp />
            </IconButton>
          </CardActions>
        )}
      </Grid>
    </Grid>
  );
};

export default Service;
