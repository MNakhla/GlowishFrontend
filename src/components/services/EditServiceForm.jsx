import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Alert,
  AlertTitle,
  Collapse,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import hairIcon from "../../assets/hair.png";
import makeupIcon from "../../assets/makeup.png";
import nailIcon from "../../assets/nail.png";

const EditServiceForm = ({
  show,
  isNewService,
  serviceToUpdate,
  handleToggleEditServiceForm,
  handleAdd,
  handleUpdate,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceCategory: isNewService ? "Hair" : serviceToUpdate.serviceCategory,
      name: isNewService ? "" : serviceToUpdate.name,
      price: isNewService ? "" : serviceToUpdate.price,
      estimatedTime: isNewService ? "" : serviceToUpdate.estimatedTime,
    },
  });

  const [showEstimatedTimeWarningAlert, toggleEstimateTimeWarningAlert] =
    useState(false);

  const handleSubmitService = (formData) => {
    if (formData.estimatedTime % 15 !== 0) {
      setValue(
        "estimatedTime",
        Math.round(getValues("estimatedTime") / 15) * 15
      );
      toggleEstimateTimeWarningAlert(true);
      return;
    }

    if (isNewService)
      handleAdd({
        name: formData.name,
        price: formData.price,
        estimatedTime: formData.estimatedTime,
        serviceCategory: formData.serviceCategory,
      });
    else
      handleUpdate({
        ...serviceToUpdate,
        name: formData.name,
        price: formData.price,
        estimatedTime: formData.estimatedTime,
        serviceCategory: formData.serviceCategory,
      });

    setValue("name", "");
    setValue("price", "");
    setValue("estimatedTime", "");
    clearErrors();
    toggleEstimateTimeWarningAlert(false);
  };
  const handleCancel = () => {
    setValue("name", "");
    setValue("price", "");
    setValue("estimatedTime", "");
    clearErrors();
    toggleEstimateTimeWarningAlert(false);
    handleToggleEditServiceForm();
  };

  useEffect(() => {
    setValue(
      "serviceCategory",
      isNewService ? "Hair" : serviceToUpdate.serviceCategory
    );
    setValue("name", isNewService ? "" : serviceToUpdate.name);
    setValue("price", isNewService ? "" : serviceToUpdate.price);
    setValue(
      "estimatedTime",
      isNewService ? "" : serviceToUpdate.estimatedTime
    );
  }, [show]);

  return (
    <div>
      <Dialog open={show}>
        <Collapse in={showEstimatedTimeWarningAlert}>
          <Alert
            severity="warning"
            onClose={() => {
              toggleEstimateTimeWarningAlert(false);
            }}
          >
            <AlertTitle>Service Time</AlertTitle>
            The service time must be approximated to the nearest 15 min. The
            service time is now set to{" "}
            <strong>{getValues("estimatedTime")} min</strong>
          </Alert>
        </Collapse>

        <DialogTitle>
          {isNewService ? "Add Service" : "Edit Service"}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="service-category"
            select
            defaultValue={getValues("serviceCategory")}
            helperText="Please select service category"
            {...register("serviceCategory")}
          >
            <MenuItem value={"Hair"}>
              <img src={hairIcon} height="20px" />
              &nbsp; Hair
            </MenuItem>
            <MenuItem value={"Makeup"}>
              <img src={makeupIcon} height="20px" />
              &nbsp; Makeup
            </MenuItem>
            <MenuItem value={"Nails"}>
              <img src={nailIcon} height="20px" />
              &nbsp; Nails
            </MenuItem>
          </TextField>
          <TextField
            autoFocus
            margin="dense"
            id="service-name"
            label="Service Name"
            type="text"
            defaultValue={getValues("name")}
            fullWidth
            variant="standard"
            error={errors.name}
            helperText={errors.name?.message}
            {...register("name", {
              required: "The name is required",
              maxLength: {
                value: 16,
                message: "Maximum 16 characters",
              },
            })}
          />
          <TextField
            autoFocus
            margin="dense"
            id="service-price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={getValues("price")}
            InputProps={{ endAdornment: <InputAdornment>€</InputAdornment> }}
            error={errors.price}
            helperText={errors.price?.message}
            {...register("price", {
              required: "The price is required",
              min: {
                value: 1,
                message: "Price cannot be less than 1€",
              },
            })}
          />
          <TextField
            autoFocus
            margin="dense"
            id="service-estimated-time"
            label="Estimated Time in mins"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={getValues("estimatedTime")}
            InputProps={{ endAdornment: <InputAdornment>min</InputAdornment> }}
            error={errors.estimatedTime}
            helperText={errors.estimatedTime?.message}
            {...register("estimatedTime", {
              required: "The estimated service time is required",
              min: {
                value: 15,
                message: "The service time cannot be less than 15 min",
              },
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancel()}>Cancel</Button>
          {isNewService ? (
            <Button
              onClick={handleSubmit((formData) =>
                handleSubmitService(formData)
              )}
            >
              Add
            </Button>
          ) : (
            <Button
              onClick={handleSubmit((formData) =>
                handleSubmitService(formData)
              )}
            >
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditServiceForm;
