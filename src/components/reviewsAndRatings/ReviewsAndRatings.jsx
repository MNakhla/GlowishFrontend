import {
  Button,
  Card,
  CardContent,
  Grid,
  List,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ReviewsAndRatings = ({
  editable,
  handleToggleEditReviewForm,
  reviewsAndRatings,
}) => {
  return (
    <Card>
      {/* https://mui.com/material-ui/react-rating/ */}

      <CardContent>
        <Grid container justifyContent={"space-between"}>
          <Grid item>
            <Typography variant="h6">Average Rating:</Typography>
            <Rating
              sx={{ fontSize: "30px" }}
              precision={0.5}
              value={
                reviewsAndRatings.reduce(
                  (previousValue, review) => previousValue + review.rating,
                  0
                ) / reviewsAndRatings.length
              }
              readOnly
            />
          </Grid>
          <Grid item>
            {!editable && localStorage.getItem("userType") === "customer" && (
              <Button onClick={() => handleToggleEditReviewForm()}>
                Leave a Review
              </Button>
            )}
          </Grid>
        </Grid>
        <List id="reviews-list">
          <InfiniteScroll
            style={{
              overflow: "auto",
              width: "inherit",
              maxHeight: "500px",
            }}
            scrollableTarget="reviews-list"
            dataLength={5}
            hasMore={false}
          >
            {reviewsAndRatings.map((review) => {
              return (
                <Card>
                  <CardContent>
                    <Rating precision={0.5} value={review.rating} readOnly />
                    <Typography variant="subtitle1">
                      {review.customer.firstName} {review.customer.lastName}
                    </Typography>
                    <Typography variant="subtitle2">
                      <strong>{review.reviewTitle}</strong>
                    </Typography>
                    <Typography variant="body2">
                      {review.reviewContent}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </InfiniteScroll>
        </List>
      </CardContent>
    </Card>
  );
};

export default ReviewsAndRatings;
