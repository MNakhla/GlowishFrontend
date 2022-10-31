import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { createFilterOptions } from "@mui/material";
import { getLocationCoordinates } from "../../../services/externalApi/ptv";
import styles from "./styles.js";
import useClasses from "../../../hooks/useClasses";

const LocationAutocomplete = ({
  locationOptions,
  setChosenLocationObject,
  chosenLocationObject,
  setLocationOptions,
  handleLocChange,
  locString,
  setLongitude,
  setLatitude,
  disabled,

  freelancerBaseLocationEdit,
  bookLocationEdit,
  errorBook,
}) => {
  // console.log("default", locString);
  const classes = useClasses(styles);
  const filterOptions = createFilterOptions({
    stringify: (option) => locString,
  });

  let timer; // Timer identifier
  const waitTime = 1000;

  React.useEffect(() => {
    const input = document.querySelector("#loc");
    input.addEventListener("keyup", (e) => {
      const text = e.currentTarget.value;

      // Clear timer
      clearTimeout(timer);

      // Wait for X ms and then process the request
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setTimeout(async () => {
        let res = await getLocationCoordinates(text);
        if (res.locations.length !== 0 && setLongitude && setLatitude) {
          setLongitude(res.locations[0].referencePosition.longitude);
          setLatitude(res.locations[0].referencePosition.latitude);
        }
        await setLocationOptions(Object.entries(res)[0][1]);
      }, waitTime);
    });
  }, [timer]);

  return (
    <Autocomplete
      disablePortal
      freeSolo
      id="loc"
      options={locationOptions}
      getOptionLabel={(option) => {
        if (option.hasOwnProperty("formattedAddress")) {
          return option.formattedAddress;
        }
        return option;
      }}
      onChange={(event, newValue) => {
        // console.log("location object", newValue);
        setChosenLocationObject(newValue);
        handleLocChange(newValue?.formattedAddress);
        if (newValue === null) {
          setLocationOptions([]);
          handleLocChange("");
        }
      }}
      defaultValue={
        chosenLocationObject
          ? chosenLocationObject
          : { formattedAddress: locString }
      }
      value={
        chosenLocationObject
          ? chosenLocationObject.formattedAddress
          : { formattedAddress: locString }
      }
      className={classes.autoComplete}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          id="loc-text"
          error={
            ((freelancerBaseLocationEdit || bookLocationEdit) &&
              (!chosenLocationObject ||
                chosenLocationObject.formattedAddress === "" ||
                chosenLocationObject.formattedAddress !== locString)) ||
            errorBook
          }
          helperText={errorBook || "Note: You must choose from dropdown list"}
          onChange={(e) => {
            handleLocChange(e.target.value);
            if (e.target.value.length <= 0) {
              setLocationOptions([]);
              handleLocChange("");
            }
          }}
        />
      )}
      filterOptions={filterOptions}
      disabled={disabled}
    />
  );
};

export default LocationAutocomplete;
