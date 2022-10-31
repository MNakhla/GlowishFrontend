import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

const EditFreelancerInfoForm = ({
  show,
  freelancer,
  handleUpdateFreelancerInfo,
  handleToggleEditInfoForm,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: freelancer.firstName,
      lastName: freelancer.lastName,
      phone: freelancer.phone,
      bio: freelancer.bio,
      facebookURL: freelancer.facebookURL,
      instagramURL: freelancer.instagramURL,
    },
  });

  const handleCancel = () => {
    handleToggleEditInfoForm();
  };

  const handleSubmitUpdatedInfo = (formData) => {
    handleUpdateFreelancerInfo(formData);
  };

  React.useEffect(() => {
    reset({
      firstName: freelancer.firstName,
      lastName: freelancer.lastName,
      phone: freelancer.phone,
      bio: freelancer.bio,
      facebookURL: freelancer.facebookURL,
      instagramURL: freelancer.instagramURL,
    });
  }, [show, freelancer]);

  return (
    <Dialog open={show}>
      <DialogTitle>Update your information:</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              type="text"
              defaultValue={getValues("firstName")}
              fullWidth
              variant="standard"
              error={errors.firstName}
              helperText={errors.firstName?.message}
              {...register("firstName", {
                required: "First name is required",
                maxLength: {
                  value: 9,
                  message: "Maximum 9 characters",
                },
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              label="Last Name"
              type="text"
              defaultValue={getValues("lastName")}
              fullWidth
              variant="standard"
              error={errors.lastName}
              helperText={errors.lastName?.message}
              {...register("lastName", {
                required: "Last name is required",
                maxLength: {
                  value: 9,
                  message: "Maximum 9 characters",
                },
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              multiline
              label="Bio"
              type="text"
              defaultValue={getValues("bio")}
              fullWidth
              variant="standard"
              error={errors.bio}
              helperText={errors.bio?.message}
              {...register("bio", {
                required: "Bio is required",
                minLength: {
                  value: 20,
                  message: "Minimum 20 characters",
                },
                maxLength: {
                  value: 400,
                  message: "Maximum 400 characters",
                },
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Phone Number"
              defaultValue={getValues("phone")}
              variant="standard"
              error={errors.phone}
              helperText={errors.phone?.message}
              {...register("phone", {
                pattern: {
                  value:
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                  message:
                    "Please enter a valid phone number format eg. +491780000000",
                },
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Facebook URL:"
              type="text"
              defaultValue={getValues("facebookURL")}
              fullWidth
              error={errors.facebookURL}
              helperText={errors.facebookURL?.message}
              variant="standard"
              {...register("facebookURL", {
                pattern: {
                  value:
                    /https?:\/\/(www\.)?facebook.com\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
                  message: `Please enter a valid facebook URL eg.https://www.facebook.com/${freelancer.firstName}.${freelancer.lastName}`,
                },
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Instagram URL:"
              type="text"
              defaultValue={getValues("instagramURL")}
              error={errors.instagramURL}
              helperText={errors.instagramURL?.message}
              fullWidth
              variant="standard"
              {...register("instagramURL", {
                pattern: {
                  value:
                    /https?:\/\/(www\.)?instagram.com\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
                  message: `Please enter a valid instagram URL eg.https://www.instagram.com/${freelancer.firstName}.${freelancer.lastName}`,
                },
              })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"space-between"}>
          <Button onClick={() => handleCancel()}>Cancel</Button>
          <Button
            onClick={handleSubmit((formData) =>
              handleSubmitUpdatedInfo(formData)
            )}
          >
            Submit
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default EditFreelancerInfoForm;
