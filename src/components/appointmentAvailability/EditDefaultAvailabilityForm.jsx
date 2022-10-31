import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Collapse,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { React, useState, useEffect } from "react";
import {
  dateDayIntToString,
  dateDayStringToInt,
  getSlotTimeStringArray,
} from "../../utils/functions";
import { useForm } from "react-hook-form";
import LocationAutocomplete from "../common/LocationAutocomplete/LocationAutocomplete";

export class FreelancerDefaultAvailability {
  constructor(preliminaryDefaultAvailability) {
    if (preliminaryDefaultAvailability === undefined) {
      this.locationStatus = "AtSalon";
      this.centerLocation = { address: "", longitude: "", latitude: "" };
      this.workingHours = { startTime: "08:00", endTime: "17:00" };
      this.lunchBreakHours = { startTime: "12:00", endTime: "13:00" };
      this.offDays = ["Sat", "Sun"];
      this.areaRadius = "";
    } else {
      this.locationStatus = preliminaryDefaultAvailability.locationStatus;
      this.centerLocation = preliminaryDefaultAvailability.centerLocation;
      this.workingHours = preliminaryDefaultAvailability.workingHours;
      this.lunchBreakHours = preliminaryDefaultAvailability.lunchBreakHours;
      this.offDays = preliminaryDefaultAvailability.offDays;
      this.areaRadius = preliminaryDefaultAvailability.areaRadius;
    }
  }
}

const EditDefaultAvailabilityForm = ({
  freelancer,
  handleNextStage,
  handleCancel,
}) => {
  const slotTimeStringArray = getSlotTimeStringArray();
  const oldFreelancerDefaultAvailability =
    freelancer.defaultAvailability === undefined
      ? new FreelancerDefaultAvailability()
      : new FreelancerDefaultAvailability(freelancer.defaultAvailability);

  //#region location autocomplete
  const [locationOptions, setLocationOptions] = useState([]);
  const [chosenLocationObject, setChosenLocationObject] = useState({
    formattedAddress: oldFreelancerDefaultAvailability.centerLocation.address,
    referencePosition: {
      longitude: oldFreelancerDefaultAvailability.centerLocation.longitude,
      latitude: oldFreelancerDefaultAvailability.centerLocation.latitude,
    },
  });
  const [longitude, setLongitude] = useState(
    oldFreelancerDefaultAvailability.centerLocation.longitude
  );
  const [latitude, setLatitude] = useState(
    oldFreelancerDefaultAvailability.centerLocation.latitude
  );
  const [locString, setLocString] = useState(
    oldFreelancerDefaultAvailability.centerLocation.address
  );
  const handleLocChange = (newValue) => {
    setValue("address", newValue);
    setValue("longitude", longitude);
    setValue("latitude", latitude);
    setLocString(newValue);
  };

  useEffect(() => {}, [chosenLocationObject]);

  //#endregion

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
      locationStatus: oldFreelancerDefaultAvailability.locationStatus,
      address: oldFreelancerDefaultAvailability.centerLocation.address,
      longitude: oldFreelancerDefaultAvailability.centerLocation.longitude,
      latitude: oldFreelancerDefaultAvailability.centerLocation.latitude,
      areaRadius: oldFreelancerDefaultAvailability.areaRadius,
      workingHours: {
        startTime: oldFreelancerDefaultAvailability.workingHours.startTime,
        endTime: oldFreelancerDefaultAvailability.workingHours.endTime,
      },
      lunchBreakHours:
        oldFreelancerDefaultAvailability.lunchBreakHours !== null
          ? {
              startTime:
                oldFreelancerDefaultAvailability.lunchBreakHours.startTime,
              endTime: oldFreelancerDefaultAvailability.lunchBreakHours.endTime,
            }
          : { startTime: "12:00", endTime: "13:00" },
      offDays: [
        oldFreelancerDefaultAvailability.offDays.includes("Sun"),
        oldFreelancerDefaultAvailability.offDays.includes("Mon"),
        oldFreelancerDefaultAvailability.offDays.includes("Tue"),
        oldFreelancerDefaultAvailability.offDays.includes("Wed"),
        oldFreelancerDefaultAvailability.offDays.includes("Thu"),
        oldFreelancerDefaultAvailability.offDays.includes("Fri"),
        oldFreelancerDefaultAvailability.offDays.includes("Sat"),
      ],
    },
  });
  const [noLunchBreak, setNoLunchBreak] = useState(
    oldFreelancerDefaultAvailability.lunchBreakHours === null
  );
  const [tmpLunchBreak, setTmpLunchBreak] = useState({
    startTime: "12:00",
    endTime: "13:00",
  });
  const [
    showWorkingHourStartBeforeEndAlert,
    toggleWorkingHourStartBeforeEndAlert,
  ] = useState(false);
  const [
    showLunchBreakStartBeforeEndAlert,
    toggleLunchBreakStartBeforeEndAlert,
  ] = useState(false);
  const [
    showLunchBreakDuringWorkingHoursAlert,
    toggleLunchBreakDuringWorkingHoursAlert,
  ] = useState(false);

  let showAreaRadius = watch("locationStatus") === "OnTheMove";

  const handleNext = (formData) => {
    const newFreelancerDefaultAvailability = new FreelancerDefaultAvailability(
      oldFreelancerDefaultAvailability
    );
    newFreelancerDefaultAvailability.locationStatus = formData.locationStatus;
    newFreelancerDefaultAvailability.centerLocation.address = formData.address;
    newFreelancerDefaultAvailability.centerLocation.longitude =
      formData.longitude;
    newFreelancerDefaultAvailability.centerLocation.latitude =
      formData.latitude;
    newFreelancerDefaultAvailability.areaRadius = formData.areaRadius;
    newFreelancerDefaultAvailability.workingHours = formData.workingHours;
    newFreelancerDefaultAvailability.lunchBreakHours = noLunchBreak
      ? null
      : formData.lunchBreakHours;
    newFreelancerDefaultAvailability.offDays = formData.offDays
      .map((offDay, index) => {
        return { bOffDay: offDay, index: index };
      })
      .filter((elem) => elem.bOffDay)
      .map((elem) => dateDayIntToString(elem.index));
    handleNextStage(newFreelancerDefaultAvailability);
  };

  const handleCancelStage = () => {
    clearErrors();
    clearAlerts();
    handleCancel();
  };

  const removeLunchBreak = () => {
    setTmpLunchBreak({
      startTime: getValues("lunchBreakHours.startTime"),
      endTime: getValues("lunchBreakHours.endTime"),
    });
    setValue("lunchBreakHours", null);
    setNoLunchBreak(true);
  };
  const addLunchBreak = () => {
    setValue("lunchBreakHours", {
      startTime: tmpLunchBreak.startTime,
      endTime: tmpLunchBreak.endTime,
    });
    setNoLunchBreak(false);
  };

  const clearAlerts = () => {
    toggleLunchBreakDuringWorkingHoursAlert(false);
    toggleLunchBreakStartBeforeEndAlert(false);
    toggleWorkingHourStartBeforeEndAlert(false);
  };

  const onSubmit = (data, e) => {
    clearAlerts();
    if (
      getValues("workingHours.startTime") >= getValues("workingHours.endTime")
    ) {
      toggleWorkingHourStartBeforeEndAlert(true);
      return;
    } else if (getValues("lunchBreakHours") !== null) {
      if (
        getValues("lunchBreakHours.startTime") >=
        getValues("lunchBreakHours.endTime")
      ) {
        toggleLunchBreakStartBeforeEndAlert(true);
        return;
      } else if (
        getValues("lunchBreakHours.startTime") <=
          getValues("workingHours.startTime") ||
        getValues("lunchBreakHours.endTime") >=
          getValues("workingHours.endTime")
      ) {
        toggleLunchBreakDuringWorkingHoursAlert(true);
        return;
      }
    }
    handleNext(data);
  };
  const onError = (errors, e) => console.log(errors, e);

  useEffect(() => {
    reset({
      locationStatus: oldFreelancerDefaultAvailability.locationStatus,
      address: oldFreelancerDefaultAvailability.centerLocation.address,
      longitude: oldFreelancerDefaultAvailability.centerLocation.longitude,
      latitude: oldFreelancerDefaultAvailability.centerLocation.latitude,
      areaRadius: oldFreelancerDefaultAvailability.areaRadius,
      workingHours: {
        startTime: oldFreelancerDefaultAvailability.workingHours.startTime,
        endTime: oldFreelancerDefaultAvailability.workingHours.endTime,
      },
      lunchBreakHours:
        oldFreelancerDefaultAvailability.lunchBreakHours !== null
          ? {
              startTime:
                oldFreelancerDefaultAvailability.lunchBreakHours.startTime,
              endTime: oldFreelancerDefaultAvailability.lunchBreakHours.endTime,
            }
          : { startTime: "12:00", endTime: "13:00" },
      offDays: [
        oldFreelancerDefaultAvailability.offDays.includes("Sun"),
        oldFreelancerDefaultAvailability.offDays.includes("Mon"),
        oldFreelancerDefaultAvailability.offDays.includes("Tue"),
        oldFreelancerDefaultAvailability.offDays.includes("Wed"),
        oldFreelancerDefaultAvailability.offDays.includes("Thu"),
        oldFreelancerDefaultAvailability.offDays.includes("Fri"),
        oldFreelancerDefaultAvailability.offDays.includes("Sat"),
      ],
    });
    clearErrors();
    clearAlerts();
  }, [freelancer]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log(value, name, type)
      if (name === "status") {
        setLocString("");
        if (value === "AtSalon") setValue("areaRadius", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <>
        <DialogContent>
          <Collapse in={showWorkingHourStartBeforeEndAlert}>
            <Alert
              severity="warning"
              onClose={() => {
                toggleWorkingHourStartBeforeEndAlert(false);
              }}
            >
              <AlertTitle>Working Hours</AlertTitle>
              The working day's start time must be before the end time.
            </Alert>
          </Collapse>
          <Collapse in={showLunchBreakStartBeforeEndAlert}>
            <Alert
              severity="warning"
              onClose={() => {
                toggleLunchBreakStartBeforeEndAlert(false);
              }}
            >
              <AlertTitle>Lunch Break</AlertTitle>
              Lunch break's start time must be before the end time.
            </Alert>
          </Collapse>
          <Collapse in={showLunchBreakDuringWorkingHoursAlert}>
            <Alert
              severity="warning"
              onClose={() => {
                toggleLunchBreakDuringWorkingHoursAlert(false);
              }}
            >
              <AlertTitle>Lunch Break</AlertTitle>
              The lunch break must be during the working hours.
            </Alert>
          </Collapse>

          <Card>
            <CardContent>
              <Grid
                container
                alignItems={"flex-start"}
                direction="column"
                spacing={2}
              >
                {/* location status */}
                <Grid item xs={4}>
                  <TextField
                    id="default-location-status"
                    select
                    defaultValue={
                      oldFreelancerDefaultAvailability.locationStatus
                    }
                    size="small"
                    helperText="Please select your default location status"
                    {...register("locationStatus")}
                  >
                    <MenuItem value={"AtSalon"}>At Salon</MenuItem>
                    <MenuItem value={"OnTheMove"}>On the Move</MenuItem>
                  </TextField>
                </Grid>

                {/* location */}
                <Grid item xs={4}>
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
                      freelancerBaseLocationEdit={true}
                    />
                  </Typography>
                </Grid>

                {/* area radius */}
                {showAreaRadius && (
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
                <Grid item xs={8}>
                  <Grid container direction={"row"}>
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1" alignItems={"center"}>
                        Working Hours: &nbsp;
                      </Typography>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <TextField
                        select
                        size="small"
                        defaultValue={
                          oldFreelancerDefaultAvailability.workingHours
                            .startTime
                        }
                        {...register("workingHours.startTime")}
                      >
                        {slotTimeStringArray.map((slotTimeString) => (
                          <MenuItem value={slotTimeString}>
                            {slotTimeString}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1">&nbsp;-&nbsp;</Typography>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <TextField
                        select
                        size="small"
                        defaultValue={
                          oldFreelancerDefaultAvailability.workingHours.endTime
                        }
                        {...register("workingHours.endTime")}
                      >
                        {slotTimeStringArray.map((slotTimeString) => (
                          <MenuItem value={slotTimeString}>
                            {slotTimeString}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>

                {/* lunch break */}
                <Grid item xs={12}>
                  <Grid container direction={"row"}>
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1" alignItems={"center"}>
                        Lunch Break: &nbsp;
                      </Typography>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <TextField
                        select
                        size="small"
                        defaultValue={
                          oldFreelancerDefaultAvailability.lunchBreakHours !==
                          null
                            ? oldFreelancerDefaultAvailability.lunchBreakHours
                                .startTime
                            : "12:00"
                        }
                        disabled={noLunchBreak}
                        {...register("lunchBreakHours.startTime")}
                      >
                        {slotTimeStringArray.map((slotTimeString) => (
                          <MenuItem value={slotTimeString}>
                            {slotTimeString}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1">&nbsp;-&nbsp;</Typography>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <TextField
                        select
                        size="small"
                        defaultValue={
                          oldFreelancerDefaultAvailability.lunchBreakHours !==
                          null
                            ? oldFreelancerDefaultAvailability.lunchBreakHours
                                .endTime
                            : "13:00"
                        }
                        disabled={noLunchBreak}
                        {...register("lunchBreakHours.endTime")}
                      >
                        {slotTimeStringArray.map((slotTimeString) => (
                          <MenuItem value={slotTimeString}>
                            {slotTimeString}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      {noLunchBreak ? (
                        <Button
                          onClick={() => {
                            addLunchBreak();
                          }}
                        >
                          Lunch Break
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            removeLunchBreak();
                          }}
                        >
                          No Lunch Break
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                {/* off days */}
                <Grid item xs={12}>
                  <Grid container direction="row">
                    <Grid item alignSelf={"center"}>
                      <Typography variant="body1" alignItems={"center"}>
                        Off Days: &nbsp;
                      </Typography>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                      <IconButton
                        sx={{
                          backgroundColor: watch(
                            `offDays.${dateDayStringToInt("Mon")}`
                          )
                            ? "gray"
                            : undefined,
                          color: "black",
                          fontSize: "smaller",
                        }}
                        disableRipple
                        onClick={() =>
                          setValue(
                            `offDays.${dateDayStringToInt("Mon")}`,
                            !getValues(`offDays.${dateDayStringToInt("Mon")}`)
                          )
                        }
                      >
                        Mon
                      </IconButton>{" "}
                      &nbsp;
                      <IconButton
                        sx={{
                          backgroundColor: watch(
                            `offDays.${dateDayStringToInt("Tue")}`
                          )
                            ? "gray"
                            : undefined,
                          color: "black",
                          fontSize: "smaller",
                        }}
                        disableRipple
                        onClick={() =>
                          setValue(
                            `offDays.${dateDayStringToInt("Tue")}`,
                            !getValues(`offDays.${dateDayStringToInt("Tue")}`)
                          )
                        }
                      >
                        Tue
                      </IconButton>{" "}
                      &nbsp;
                      <IconButton
                        sx={{
                          backgroundColor: watch(
                            `offDays.${dateDayStringToInt("Wed")}`
                          )
                            ? "gray"
                            : undefined,
                          color: "black",
                          fontSize: "smaller",
                        }}
                        disableRipple
                        onClick={() =>
                          setValue(
                            `offDays.${dateDayStringToInt("Wed")}`,
                            !getValues(`offDays.${dateDayStringToInt("Wed")}`)
                          )
                        }
                      >
                        Wed
                      </IconButton>{" "}
                      &nbsp;
                      <IconButton
                        sx={{
                          backgroundColor: watch(
                            `offDays.${dateDayStringToInt("Thu")}`
                          )
                            ? "gray"
                            : undefined,
                          color: "black",
                          fontSize: "smaller",
                        }}
                        disableRipple
                        onClick={() =>
                          setValue(
                            `offDays.${dateDayStringToInt("Thu")}`,
                            !getValues(`offDays.${dateDayStringToInt("Thu")}`)
                          )
                        }
                      >
                        Thu
                      </IconButton>{" "}
                      &nbsp;
                      <IconButton
                        sx={{
                          backgroundColor: watch(
                            `offDays.${dateDayStringToInt("Fri")}`
                          )
                            ? "gray"
                            : undefined,
                          color: "black",
                          fontSize: "smaller",
                        }}
                        disableRipple
                        onClick={() =>
                          setValue(
                            `offDays.${dateDayStringToInt("Fri")}`,
                            !getValues(`offDays.${dateDayStringToInt("Fri")}`)
                          )
                        }
                      >
                        Fri
                      </IconButton>{" "}
                      &nbsp;
                      <IconButton
                        sx={{
                          backgroundColor: watch(
                            `offDays.${dateDayStringToInt("Sat")}`
                          )
                            ? "gray"
                            : undefined,
                          color: "black",
                          fontSize: "smaller",
                        }}
                        disableRipple
                        onClick={() =>
                          setValue(
                            `offDays.${dateDayStringToInt("Sat")}`,
                            !getValues(`offDays.${dateDayStringToInt("Sat")}`)
                          )
                        }
                      >
                        Sat
                      </IconButton>{" "}
                      &nbsp;
                      <IconButton
                        sx={{
                          backgroundColor: watch(
                            `offDays.${dateDayStringToInt("Sun")}`
                          )
                            ? "gray"
                            : undefined,
                          color: "black",
                          fontSize: "smaller",
                        }}
                        disableRipple
                        onClick={() =>
                          setValue(
                            `offDays.${dateDayStringToInt("Sun")}`,
                            !getValues(`offDays.${dateDayStringToInt("Sun")}`)
                          )
                        }
                      >
                        Sun
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent={"space-between"}>
            <Button onClick={() => handleCancelStage()}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit, onError)}>Next</Button>
          </Grid>
        </DialogActions>
      </>
    </>
  );
};

export default EditDefaultAvailabilityForm;
