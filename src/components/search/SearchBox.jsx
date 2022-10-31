import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import styles from "./styles";
import useClasses from "../../hooks/useClasses";

import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import ServiceBar from "./ServiceBar";
import { services } from "../../utils/constants";
import { convertDate } from "../../utils/functions";
import LocationAutocomplete from "../common/LocationAutocomplete/LocationAutocomplete";

const SearchBox = ({
  setLocationOptions,
  locationOptions,
  setChosenLocationObject,
  chosenLocationObject,
  searchOptionIndex,
  handleSearchByChange,
  handleSearchChange,
  freelancers,
  chosenFreelancer,
  setChosenFreelancer,
  chosenDate,
  handleDateChange,
  handleLocChange,
  locString,
  serviceIndex,
  handleServiceChange,
}) => {
  const classes = useClasses(styles);
  const [dateFormat] = React.useState(convertDate(chosenDate));

  return (
    // root
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      className={classes.searchBoxRoot}
    >
      {/* search by tabs */}
      <Grid item>
        <BottomNavigation
          showLabels
          value={searchOptionIndex}
          onChange={handleSearchByChange}
        >
          <BottomNavigationAction label="Freelancer" icon={<PersonIcon />} />
          <BottomNavigationAction
            label={`Date & Location`}
            icon={<LocationOnIcon />}
          />
        </BottomNavigation>
      </Grid>

      {searchOptionIndex === 0 ? (
        //  search by freelancer name
        <Grid item>
          <Autocomplete
            disablePortal
            id="freelancerName"
            options={freelancers}
            getOptionLabel={(freelancer) =>
              `${freelancer.firstName} ${freelancer.lastName}`
            }
            onChange={(event, newValue) => {
              setChosenFreelancer(newValue);
            }}
            value={chosenFreelancer}
            className={classes.searchBox0Autocomplete}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img
                  loading="lazy"
                  width="20"
                  src={option.profilePicture}
                  alt=""
                />
                {`${option.firstName} ${option.lastName}`}
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Freelancer" />
            )}
          />
        </Grid>
      ) : (
        // search by service, location and date
        <Grid container direction="column" spacing={5} alignItems="center">
          {/* service tabs */}
          <Grid item>
            <ServiceBar
              services={services}
              serviceIndex={serviceIndex}
              handleServiceChange={handleServiceChange}
            />
          </Grid>
          {/* location */}
          <Grid item>
            <LocationAutocomplete
              locationOptions={locationOptions}
              setChosenLocationObject={setChosenLocationObject}
              setLocationOptions={setLocationOptions}
              handleLocChange={handleLocChange}
              chosenLocationObject={chosenLocationObject}
              locString={locString}
            />
          </Grid>
          {/* date */}
          <Grid item>
            <TextField
              id="date"
              variant="outlined"
              type="date"
              inputProps={{
                min: convertDate(new Date()),
                max: convertDate(
                  new Date(new Date().setMonth(new Date().getMonth() + 3))
                ),
              }}
              onKeyDown={(e) => e.preventDefault()}
              className={classes.searchBox1Date}
              defaultValue={dateFormat}
              onChange={(e) => {
                handleDateChange(new Date(e.target.value));
              }}
            />
          </Grid>
        </Grid>
      )}
      {/* search button */}
      <Grid item>
        <Button
          disabled={
            locString === chosenLocationObject?.formattedAddress ||
            searchOptionIndex === 0
              ? false
              : true
          }
          variant="contained"
          onClick={() => {
            handleSearchChange();
          }}
        >
          <Typography>search</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchBox;
