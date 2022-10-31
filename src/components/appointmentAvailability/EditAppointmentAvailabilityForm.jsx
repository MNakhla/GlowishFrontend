import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { isSameDay } from "date-fns";
import React from "react";
import { useState, useEffect } from "react";
import FreelancerDate from "../../utils/FreelancerDate";
import { getDateDisplay } from "../../utils/functions";
import MuiCalendar from "../calendar/MuiCalendar";
import EditDefaultAvailabilityForm from "./EditDefaultAvailabilityForm";
import EditSpecificDateAvailabilityForm from "./EditSpecificDateAvailabilityForm";

const EditAppointmentAvailabilityForm = ({
  freelancer,
  show,
  handleToggleEditAppointmentAvailabilityForm,
  handleAddNewFreelancerDefaultAvailability,
  handleUpdateFreelancerDefaultAvailability,
  handleAddNewFreelancerSpecificDateAvailability,
  handleUpdateFreelancerSpecificDateAvailability,
  handleUpdateFreelancerAppointmentAvailability,
}) => {
  //#region states
  const [stage, setStage] = useState(1);
  const [confirmPendingFreelancer, setConfirmPendingFreelancer] =
    useState(freelancer);
  const [alreadyHasDefaultAvaiability, setAlreadyHasDefaultAvailability] =
    useState(true);
  const [newFreelancerDefaultAvailability, setFreelancerDefaultAvailability] =
    useState(freelancer.defaultAvailability);

  const [freelancerDateToEdit, setFreelancerDateToEdit] = useState(undefined);
  const [
    newFreelancerSpecificEdittedDates,
    setNewFreelancerSpecificEdittedDates,
  ] = useState([]);
  //#endregion

  //#region form control functions
  const handleNextStage = (newFreelancerAvailability) => {
    if (stage === 1) {
      //hold editted default availability until confirm
      setFreelancerDefaultAvailability(newFreelancerAvailability);
      setConfirmPendingFreelancer({
        ...freelancer,
        defaultAvailability: newFreelancerAvailability,
      });
    } else {
      //push editted specificDate availability until confirm
      let freelancerEdittedDate = new FreelancerDate();
      freelancerEdittedDate = newFreelancerAvailability;

      //case: it has been editted before
      if (
        newFreelancerSpecificEdittedDates.find((freelancerDate) =>
          isSameDay(freelancerDate.date, freelancerEdittedDate.date)
        ) !== undefined
      ) {
        let newFreelancerSpecificEdittedDatesUpdated =
          newFreelancerSpecificEdittedDates.map((oldSpec) => {
            if (isSameDay(oldSpec.date, freelancerEdittedDate.date)) {
              return freelancerEdittedDate;
            } else {
              return oldSpec;
            }
          });
        setNewFreelancerSpecificEdittedDates(
          newFreelancerSpecificEdittedDatesUpdated
        );
      } //case: newly editted
      else {
        let newFreelancerSpecificEdittedDatesUpdated = [
          ...newFreelancerSpecificEdittedDates,
        ];
        newFreelancerSpecificEdittedDatesUpdated.push(freelancerEdittedDate);
        setNewFreelancerSpecificEdittedDates(
          newFreelancerSpecificEdittedDatesUpdated
        );
      }
    }
    //view summary of edits
    setStage(2);
  };

  const handleBack = () => setStage(1);

  const handleCancel = () => {
    if (stage === 1) {
      //cancel everything
      setFreelancerDefaultAvailability(freelancer.defaultAvailability); //reset default availability
      setNewFreelancerSpecificEdittedDates([]); //reset editted specificDate availabilities
      handleToggleEditAppointmentAvailabilityForm();
    } else {
      //cancel editting specificDate, drop edits, and go back to summary
      setStage(2);
    }
  };

  const handleConfirm = () => {
    //make api requests to add/update default & specific availabilities based on edits
    handleUpdateFreelancerAppointmentAvailability(
      alreadyHasDefaultAvaiability,
      newFreelancerDefaultAvailability,
      newFreelancerSpecificEdittedDates
    );
  };

  const handleEditSpecificFreelancerDate = (freelancerDate) => {
    setStage(3);
    setFreelancerDateToEdit(freelancerDate);
  };
  //#endregion

  useEffect(() => {
    //on opening the form
    setStage(1);
    setNewFreelancerSpecificEdittedDates([]);
    setAlreadyHasDefaultAvailability(
      freelancer.defaultAvailability !== undefined
    );
    setFreelancerDefaultAvailability(freelancer.defaultAvailability);
  }, [show, freelancer]);

  useEffect(() => {
    //on changing the default availability (opening the page or editting)
    setConfirmPendingFreelancer({
      ...freelancer,
      defaultAvailability: newFreelancerDefaultAvailability,
    });
  }, [newFreelancerDefaultAvailability]);

  useEffect(() => {}, [newFreelancerSpecificEdittedDates]);

  return (
    <Dialog open={show} fullWidth maxWidth={"sm"}>
      {/* stage 1: edit default availability */}
      {stage === 1 ? (
        <>
          <DialogTitle>Default Location and Working Hours</DialogTitle>
          <EditDefaultAvailabilityForm
            freelancer={confirmPendingFreelancer}
            handleNextStage={handleNextStage}
            handleCancel={handleCancel}
          ></EditDefaultAvailabilityForm>
        </>
      ) : /* stage 2: calendar summary + choose specific date to edit */
      stage === 2 ? (
        <>
          <DialogTitle>Choose a Specific Date to Edit:</DialogTitle>
          <DialogContent>
            <MuiCalendar
              freelancer={confirmPendingFreelancer}
              specificEdittedDates={newFreelancerSpecificEdittedDates}
              edittable={true}
              handleEditSpecificFreelancerDate={
                handleEditSpecificFreelancerDate
              }
            ></MuiCalendar>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent={"space-between"}>
              <Button onClick={() => handleBack()}>Back</Button>
              <Button onClick={() => handleConfirm()}>Confirm</Button>
            </Grid>
          </DialogActions>
        </>
      ) : (
        /* stage 3: edit specific freelancer date */
        <>
          <DialogTitle>
            {freelancerDateToEdit
              ? getDateDisplay(freelancerDateToEdit.date)
              : "Today"}
          </DialogTitle>

          <EditSpecificDateAvailabilityForm
            freelancer={freelancer}
            freelancerDateToEdit={freelancerDateToEdit}
            handleNextStage={handleNextStage}
            handleCancelStage={handleCancel}
          ></EditSpecificDateAvailabilityForm>
        </>
      )}
    </Dialog>
  );
};

export default EditAppointmentAvailabilityForm;
