import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertCancelAppointment({
  diffDays,
  appointmentPrice,
  open,
  setOpen,
  handleCancelAppointment,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to cancel this appointment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {diffDays > 4
              ? `You will have full refund of ${appointmentPrice}€ for this appointment.`
              : `You will have partial refund of ${Math.round(
                  appointmentPrice * 0.4
                )}€ for this appointment, because it is less than 4 days away.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => {
              handleCancelAppointment();
              handleClose();
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
