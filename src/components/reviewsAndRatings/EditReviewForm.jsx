import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Rating,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

// const reviewsAndRatings = [
//     {
//       customer: "Amanda Holden",
//       rating: 3.5,
//       reviewTitle: "Good Service",
//       reviewContent:
//         "Lovely office and very good treatment. They asked me a lot of questions before starting and I ended up with what I had in mind.",
//     },
//     {
//       customer: "Simon Cowell",
//       rating: 1,
//       reviewTitle: "Very bad experience",
//       reviewContent:
//         "I've never had a service this bad. The freelancer was late to the appointment and refused to give me a discount.",
//     },
//     {
//       customer: "David Williams",
//       rating: 5,
//       reviewTitle: "Wonderful!",
//       reviewContent:
//         "I had a wedding rehearsal dinner and I wanted to look sharp. The service was really good and I felt like I was pampered. I ended up looking great for my event!",
//     },
//   ];

const EditReviewForm = ({
  show,
  handleToggleEditReviewForm,
  handleAddReview,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      reviewTitle: "",
      reviewContent: "",
    },
  });

  const resetForm = () => {
    reset({
      rating: 0,
      reviewTitle: "",
      reviewContent: "",
    });
  };

  return (
    <Dialog open={show} fullWidth maxWidth={"sm"}>
      <DialogTitle>Leave a Review:</DialogTitle>
      <DialogContent>
        <Grid container direction={"column"}>
          <Rating
            precision={0.5}
            onChange={(event, newValue) => {
              setValue("rating", newValue);
            }}
          />
          <TextField
            variant="standard"
            label="Review Title"
            error={errors.reviewTitle}
            helperText={errors.reviewTitle?.message}
            {...register("reviewTitle", {
              required: "The title is required",
              maxLength: {
                value: 20,
                message: "Maximum 20 characters",
              },
              minLength: {
                value: 5,
                message: "Minimum 5 characters",
              },
            })}
          />
          <TextField
            variant="standard"
            label="Review Body"
            multiline
            error={errors.reviewContent}
            helperText={errors.reviewContent?.message}
            {...register("reviewContent", {
              required: "The body is required",
              maxLength: {
                value: 100,
                message: "Maximum 100 characters",
              },
              minLength: {
                value: 10,
                message: "Minimum 10 characters",
              },
            })}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"space-between"}>
          <Grid item>
            <Button
              onClick={() => {
                resetForm();
                handleToggleEditReviewForm();
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleSubmit((formData) => {
                resetForm();
                handleAddReview(formData);
              })}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default EditReviewForm;
