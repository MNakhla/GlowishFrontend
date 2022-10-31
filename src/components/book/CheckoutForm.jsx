import React from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import {
  Button,
  Grid,
  Typography,
  Collapse,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";

export default function CheckoutForm(props) {
  const {
    handleSubmitAppointment,
    summaryComponent,
    handleBack,
    showDialog,
    setShowDialog,
    setActiveStep,
  } = props;
  const stripe = useStripe();
  const elements = useElements();
  const [disabled, setDisabled] = React.useState(true);
  const [paymentError, setPaymentError] = React.useState("");

  const handleChange = (event) => {
    setDisabled(!event.complete);
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setDisabled(true);
    await stripe
      .confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (result.error) {
          // console.log(result.error.message);
          setPaymentError(result.error.message);
          setDisabled(false);
        } else {
          // console.log("payment successful");
          setPaymentError("");
          handleSubmitAppointment(result.paymentIntent?.id);
        }
      })
      .catch((error) => {
        // console.log(error.message);
        setPaymentError(error.message);
        setDisabled(false);
      });
  };
  const handleClose = () => {
    setShowDialog(false);
    setActiveStep(0);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4} direction="column">
        <Grid item>
          <Grid container spacing={4} justifyContent="space-evenly">
            <Grid item xs={4}>
              <Grid container direction="column" spacing={5}>
                <Grid item>
                  <Typography variant="h5">Enter Payment Details</Typography>
                </Grid>
                <Grid item>
                  <Collapse in={paymentError !== ""}>
                    <Alert severity="error">
                      Payment Unsuccessful! Please try again!
                    </Alert>
                  </Collapse>
                </Grid>
                <Grid item>
                  <PaymentElement onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container direction="column" spacing={5}>
                <Grid item>
                  <Typography variant="h5">Booking Details</Typography>
                </Grid>
                <Grid item>{summaryComponent}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ m: 10 }}
          >
            <Grid item xs={2}>
              <Button onClick={handleBack} color="inherit">
                Back
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button type="submit" disabled={disabled || !stripe || !elements}>
                Pay and Confirm Appointment
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Dialog open={showDialog} onClose={handleClose}>
          <DialogContent>
            <Alert severity="error">
              Something went wrong. Please try again
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </form>
  );
}
