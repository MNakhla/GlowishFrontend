import {
  Button,
  Card,
  CardActions,
  CardContent,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { getFreelancerDateDefaults } from "../../utils/functions";
import { EditWorkingHours } from "..";
import { useForm } from "react-hook-form";
import LocationAutocomplete from "../common/LocationAutocomplete/LocationAutocomplete";

export class FreelancerSpecificDateAvailability {
  constructor() {
    this.schedule = [];
    this.centerLocation = { address: "", longitude: "", latitude: "" };
    this.areaRadius = "";
    this.date = new Date();
    this.locationStatus = "AtSalon";
    this.offDay = true;
  }
}
const EditSpecificDateAvailabilityForm = ({
  freelancer,
  freelancerDateToEdit,
  handleNextStage,
  handleCancelStage,
}) => {
  //#region location autocomplete
  const [locationOptions, setLocationOptions] = React.useState([]);
  const [chosenLocationObject, setChosenLocationObject] = React.useState({
    formattedAddress: freelancerDateToEdit.centerLocation.address,
    referencePosition: {
      longitude: freelancerDateToEdit.centerLocation.longitude,
      latitude: freelancerDateToEdit.centerLocation.latitude,
    },
  });
  const [longitude, setLongitude] = React.useState(
    freelancerDateToEdit.centerLocation.longitude
  );
  const [latitude, setLatitude] = React.useState(
    freelancerDateToEdit.centerLocation.latitude
  );
  const [locString, setLocString] = React.useState(
    freelancerDateToEdit.centerLocation.address
  );
  const handleLocChange = (newValue) => {
    setValue("address", newValue);
    setValue("longitude", longitude);
    setValue("latitude", latitude);
    setLocString(newValue);
  };

  React.useEffect(() => {}, [chosenLocationObject]);

  //#endregion
  const [initialSchedule, setInitialSchedule] = useState(
    freelancerDateToEdit.schedule
  );
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: freelancerDateToEdit.bOffDay
        ? "OffDay"
        : freelancerDateToEdit.locationStatus,
      address: freelancerDateToEdit.centerLocation.address,
      longitude: freelancerDateToEdit.centerLocation.longitude,
      latitude: freelancerDateToEdit.centerLocation.latitude,
      areaRadius: freelancerDateToEdit.areaRadius,
      schedule: freelancerDateToEdit.schedule,
    },
  });

  const handleNext = (formData) => {
    const newFreelancerDate = { ...freelancerDateToEdit };
    newFreelancerDate.bOffDay = formData.status === "OffDay";
    if (formData.status !== "OffDay")
      newFreelancerDate.locationStatus = formData.status;
    newFreelancerDate.centerLocation.address = formData.address;
    newFreelancerDate.centerLocation.longitude = formData.longitude;
    newFreelancerDate.centerLocation.latitude = formData.latitude;
    newFreelancerDate.areaRadius = formData.areaRadius;
    newFreelancerDate.schedule = formData.schedule;
    handleNextStage(newFreelancerDate);
  };

  const handleCancel = () => {
    clearErrors();
    reset({
      status: freelancerDateToEdit.bOffDay
        ? "OffDay"
        : freelancerDateToEdit.locationStatus,
      address: freelancerDateToEdit.centerLocation.address,
      longitude: freelancerDateToEdit.centerLocation.longitude,
      latitude: freelancerDateToEdit.centerLocation.latitude,
      areaRadius: freelancerDateToEdit.areaRadius,
      schedule: freelancerDateToEdit.schedule,
    });
    setInitialSchedule(freelancerDateToEdit.schedule);
    handleCancelStage();
  };

  const handleSetDateToDefault = () => {
    const defaultFreelancerDate = getFreelancerDateDefaults(
      freelancer,
      freelancerDateToEdit.date
    );
    setLocString(defaultFreelancerDate.centerLocation.address);
    setChosenLocationObject({
      formattedAddress: defaultFreelancerDate.centerLocation.address,
      referencePosition: {
        longitude: defaultFreelancerDate.centerLocation.longitude,
        latitude: defaultFreelancerDate.centerLocation.latitude,
      },
    });
    reset({
      status: defaultFreelancerDate.bOffDay
        ? "OffDay"
        : defaultFreelancerDate.locationStatus,
      address: defaultFreelancerDate.centerLocation.address,
      longitude: defaultFreelancerDate.centerLocation.longitude,
      latitude: defaultFreelancerDate.centerLocation.latitude,
      areaRadius: defaultFreelancerDate.areaRadius,
      schedule: defaultFreelancerDate.schedule,
    });
    setInitialSchedule(defaultFreelancerDate.schedule);
  };

  const handleEditSchedule = (updatedSchedule) => {
    setValue("schedule", updatedSchedule);
  };

  const onSubmit = (data, e) => {
    if (
      data.status !== "OffDay" &&
      (chosenLocationObject === null ||
        chosenLocationObject.formattedAddress === "" ||
        chosenLocationObject.formattedAddress !== locString)
    ) {
      return;
    }
    handleNext(data);
  };
  const onError = (errors, e) => console.log(errors, e);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "status") {
        setLocString("");
        if (value === "AtSalon") setValue("areaRadius", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    clearErrors();
    reset({
      status: freelancerDateToEdit.bOffDay
        ? "OffDay"
        : freelancerDateToEdit.locationStatus,
      address: freelancerDateToEdit.centerLocation.address,
      longitude: freelancerDateToEdit.centerLocation.longitude,
      latitude: freelancerDateToEdit.centerLocation.latitude,
      areaRadius: freelancerDateToEdit.areaRadius,
      schedule: freelancerDateToEdit.schedule,
    });
    setInitialSchedule(freelancerDateToEdit.schedule);
  }, [freelancerDateToEdit]);

  return (
    <>
      <DialogContent>
        <Card>
          <CardActions>
            <Button
              disabled={freelancerDateToEdit.bHasAppointments}
              onClick={() => handleSetDateToDefault()}
            >
              Set to Default
            </Button>
          </CardActions>
          <CardContent>
            <Grid
              container
              alignItems={"flex-start"}
              direction="column"
              spacing={2}
            >
              {/* status */}
              <Grid item xs={4}>
                <TextField
                  select
                  size="small"
                  disabled={freelancerDateToEdit.bHasAppointments}
                  defaultValue={
                    freelancerDateToEdit.bOffDay
                      ? "OffDay"
                      : freelancerDateToEdit.locationStatus
                  }
                  value={getValues("status")}
                  helperText="Please select a location status or Off Day"
                  {...register("status")}
                >
                  <MenuItem value={"AtSalon"}>At Salon</MenuItem>
                  <MenuItem value={"OnTheMove"}>On the Move</MenuItem>
                  <MenuItem value={"OffDay"}>Off Day</MenuItem>
                </TextField>
              </Grid>

              {/* location */}
              {watch("status") !== "OffDay" && (
                <Grid item xs={8}>
                  <Grid container direction={"row"}>
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1">
                        <LocationAutocomplete
                          chosenLocationObject={chosenLocationObject}
                          setChosenLocationObject={setChosenLocationObject}
                          handleLocChange={handleLocChange}
                          locString={locString}
                          setLongitude={setLongitude}
                          setLatitude={setLatitude}
                          locationOptions={locationOptions}
                          setLocationOptions={setLocationOptions}
                          disabled={freelancerDateToEdit.bHasAppointments}
                          freelancerBaseLocationEdit={true}
                        />
                        {/* <TextField
                          variant="standard"
                          disabled={freelancerDateToEdit.bHasAppointments}
                          error={errors.centerLocationAddress}
                          helperText={errors.centerLocationAddress?.message}
                          {...register("centerLocationAddress", {
                            required: "Location is required",
                          })}
                        ></TextField> */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* area radius */}
              {watch("status") === "OnTheMove" && (
                <Grid item xs={8}>
                  <Grid container direction={"row"}>
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1" alignItems={"center"}>
                        Area Radius: &nbsp;
                      </Typography>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1">
                        <TextField
                          variant="standard"
                          type={"number"}
                          error={errors.areaRadius}
                          helperText={errors.areaRadius?.message}
                          disabled={freelancerDateToEdit.bHasAppointments}
                          {...register("areaRadius", {
                            required: "Area Radius is required",
                          })}
                        ></TextField>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* working hours */}
              {watch("status") !== "OffDay" && (
                <Grid item xs={12}>
                  <Typography variant="body1" alignItems={"center"}>
                    Working Hours:
                  </Typography>
                  <EditWorkingHours
                    inputSchedule={initialSchedule}
                    handleEditSchedule={handleEditSchedule}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"space-between"}>
          <Button onClick={() => handleCancel()}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit, onError)}>Next</Button>
        </Grid>
      </DialogActions>
    </>
  );
};

export default EditSpecificDateAvailabilityForm;
