import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Grid,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

import Slider from "@mui/material/Slider";
import React from "react";
import { sortSearchedFreelancersFunc } from "../../utils/functions";
import styles from "./styles";
import useClasses from "../../hooks/useClasses";

const FilterPopup = ({
  setSliceEnd,
  setHasMore,
  setPage,
  filterOpen,
  setFilterOpen,
  dateLocSearchFreelancers,
  setFilteredFreelancers,
  setFilterSubmit,
  filterSubmit,
  sort,
  sortSubmit,
}) => {
  const classes = useClasses(styles);

  const min = 0;
  const max = 500;
  const step = 1;

  const [atSalonChecked, setAtSalonChecked] = React.useState(false);
  const [onTheMoveChecked, setOnTheMoveChecked] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [price, setPrice] = React.useState(0);

  React.useEffect(() => {
    if (!filterSubmit) {
      setAtSalonChecked(false);
      setOnTheMoveChecked(false);
      setRating(0);
      setPrice(0);
    }
  }, [filterSubmit]);

  const handleAtSalonCheckedChange = (event) => {
    setAtSalonChecked(event.target.checked);
  };

  const handleOnTheMoveCheckedChange = (event) => {
    setOnTheMoveChecked(event.target.checked);
  };

  const handleClose = () => {
    setFilterOpen(false);
  };

  const handleSliderChange = (event, newValue) => {
    setPrice(newValue);
  };

  const handleInputChange = (event) => {
    setPrice(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (price < 0) {
      setPrice(0);
    } else if (price > 500) {
      setPrice(500);
    }
  };

  const submitFilters = async () => {
    let tempFilteredFreelancers = dateLocSearchFreelancers;

    //location
    if (atSalonChecked || onTheMoveChecked) {
      tempFilteredFreelancers = await dateLocSearchFreelancers.filter(
        (freelancer) => {
          //specific date availability

          if (freelancer.locationStatus) {
            // specific date availability
            if (atSalonChecked && onTheMoveChecked) {
              //  atSalonChecked && onTheMoveChecked
              return (
                freelancer.locationStatus === "AtSalon" ||
                freelancer.locationStatus === "OnTheMove"
              );
            } else if (onTheMoveChecked && !atSalonChecked) {
              // onTheMoveChecked && !atSalonChecked
              return freelancer.locationStatus === "OnTheMove";
            } else if (!onTheMoveChecked && atSalonChecked) {
              //  !onTheMoveChecked && atSalonChecked

              return freelancer.locationStatus === "AtSalon";
            }
          }
          // default date availability
          else {
            if (atSalonChecked && onTheMoveChecked) {
              //  atSalonChecked && onTheMoveChecked
              return (
                freelancer.defaultAvailability?.locationStatus === "AtSalon" ||
                freelancer.defaultAvailability?.locationStatus === "OnTheMove"
              );
            } else if (onTheMoveChecked && !atSalonChecked) {
              // onTheMoveChecked && !atSalonChecked
              return (
                freelancer.defaultAvailability?.locationStatus === "OnTheMove"
              );
            } else if (!onTheMoveChecked && atSalonChecked) {
              // !onTheMoveChecked && atSalonChecked
              return (
                freelancer.defaultAvailability?.locationStatus === "AtSalon"
              );
            }
          }

          return freelancer;
        }
      );
    }

    //rating
    if (rating > 0) {
      tempFilteredFreelancers = await tempFilteredFreelancers.filter(
        (freelancer) => {
          return freelancer.averageRating >= rating;
        }
      );
    }

    // price
    if (price > 0) {
      tempFilteredFreelancers = await tempFilteredFreelancers.filter(
        (freelancer) => {
          return (
            Math.max(...freelancer.services.map((service) => service.price)) <=
            price
          );
          // freelancer.services
          // .map((service) => service.price <= price)
          // .includes(true);
        }
      );
    }

    //sort
    if (sortSubmit) {
      tempFilteredFreelancers = await sortSearchedFreelancersFunc(
        sort,
        tempFilteredFreelancers
      );
    }

    setFilteredFreelancers(tempFilteredFreelancers);
    setFilterSubmit(true);
    setPage(1);
    setSliceEnd(2);
    setHasMore(tempFilteredFreelancers.length > 2 ? true : false);
    setFilterOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={filterOpen}>
      {/* root */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="space-around"
        className={classes.filterPopupRoot}
      >
        {/* filter location checkboxes */}
        <Grid item textAlign="center">
          <Typography className={classes.filterPopupTypo}>Location</Typography>
          <Checkbox
            checked={atSalonChecked}
            onChange={handleAtSalonCheckedChange}
            inputProps={{
              label: "Checkbox A",
            }}
          />
          At Salon
          <Checkbox
            checked={onTheMoveChecked}
            onChange={handleOnTheMoveCheckedChange}
          />
          On The Move
        </Grid>
        {/* filter rating */}
        <Grid item>
          <Typography className={classes.filterPopupTypo}>
            Minimum Rating
          </Typography>
          <Rating
            precision={0.5}
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </Grid>
        {/* filter price */}
        <Grid item className={classes.filterPopupPriceGrid}>
          <Typography className={classes.filterPopupTypo}>
            Maximum Service Price
          </Typography>
          <Box className={classes.filterPopupPriceBox}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>$</Grid>
              <Grid item xs>
                <Slider
                  value={typeof price === "number" ? price : 0}
                  onChange={handleSliderChange}
                  min={min}
                  max={max}
                  step={step}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="standard"
                  className={classes.filterPopupPriceInput}
                  value={price}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: step,
                    min: min,
                    max: max,
                    type: "number",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/* submit filters*/}
        <Button variant="contained" onClick={() => submitFilters()}>
          Submit Filters
        </Button>
      </Grid>
    </Dialog>
  );
};

export default FilterPopup;
