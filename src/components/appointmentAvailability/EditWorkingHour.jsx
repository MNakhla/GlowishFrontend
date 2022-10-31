import { AddCircle, RemoveCircle, Edit } from "@mui/icons-material";
import { Badge, Button, Collapse, IconButton, Typography } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import {
  isHourEdittable,
  translateScheduleSlotIndexToSlotTimeString,
} from "../../utils/functions";

const EditWorkingHour = ({ title, hour, hourIndex, handleEditHour }) => {
  const [updatedHour, setUpdatedHour] = useState(hour);
  const [hourStatus, setHourStatus] = useState("available");
  //#region hour helper functions
  const isWholeHourAvailable = (hour) =>
    hour.every((slot) => slot === "available");
  const isWholeHourDisabled = (hour) => {
    return hour.every((slot) => slot === "disabled");
  };
  const hourHasBookings = (hr) => hr.includes("booked");
  //#endregion
  const [hourViewProps, setHourViewProps] = useState({
    titleColor: "black",
    showButtons: false,
    showAddButton: false,
    showRemoveButton: false,
    expanded: false,
    showHasBookingsTitle: hourHasBookings(hour),
  });

  const editHour = () => {
    setHourViewProps({ ...hourViewProps, expanded: !hourViewProps.expanded });
  };
  const addHour = () => {
    setUpdatedHour(["available", "available", "available", "available"]);
    updateHourStatus();
  };
  const removeHour = () => {
    setUpdatedHour(["disabled", "disabled", "disabled", "disabled"]);
    updateHourStatus();
  };
  const addSlot = (slotIndex) => {
    let newUpdatedHour = [...updatedHour];
    newUpdatedHour[slotIndex] = "available";
    // console.log(updatedHour);
    // console.log(newUpdatedHour);
    setUpdatedHour(newUpdatedHour);
    updateHourStatus();
  };
  const removeSlot = (slotIndex) => {
    let newUpdatedHour = [...updatedHour];
    newUpdatedHour[slotIndex] = "disabled";
    // console.log(updatedHour);
    // console.log(newUpdatedHour);
    setUpdatedHour(newUpdatedHour);
    updateHourStatus();
  };

  const updateHourStatus = () => {
    let updatedHourStatus = !isHourEdittable(updatedHour)
      ? "fullyBooked"
      : isWholeHourAvailable(updatedHour)
      ? "available"
      : isWholeHourDisabled(updatedHour)
      ? "disabled"
      : "mixed";
    setHourStatus(updatedHourStatus);
  };

  useEffect(() => {
    setUpdatedHour(hour);
  }, [hour]);

  useEffect(() => {
    updateHourStatus();
    handleEditHour(hourIndex, updatedHour);
  }, [updatedHour]);

  useEffect(() => {
    if (hourStatus === "available") {
      setHourViewProps({
        titleColor: "black",
        showButtons: true,
        showAddButton: false,
        showRemoveButton: true,
        expanded: false,
      });
    } else if (hourStatus === "disabled") {
      setHourViewProps({
        titleColor: "gray",
        showButtons: true,
        showAddButton: true,
        showRemoveButton: false,
        expanded: false,
      });
    } else if (hourStatus === "mixed") {
      setHourViewProps({
        ...hourViewProps,
        titleColor: "#1976d2",
        showButtons: true,
        showAddButton: hourHasBookings(updatedHour) ? false : true,
        showRemoveButton: hourHasBookings(updatedHour) ? false : true,
      });
    } else {
      setHourViewProps({
        ...hourViewProps,
        titleColor: "black",
        showButtons: false,
        showAddButton: false,
        showRemoveButton: false,
      });
    }
  }, [hourStatus]);

  return (
    <div>
      <Typography variant="body2">
        <span style={{ color: hourViewProps.titleColor }}>{title}</span>
        {hourViewProps.showButtons ? (
          <>
            <IconButton
              size="small"
              disabled={!hourViewProps.showAddButton}
              onClick={() => addHour()}
            >
              <AddCircle />
            </IconButton>
            <IconButton
              size="small"
              disabled={!hourViewProps.showRemoveButton}
              onClick={() => removeHour()}
            >
              <RemoveCircle />
            </IconButton>
            <Badge
              badgeContent={
                !(
                  hourViewProps.showAddButton || hourViewProps.showRemoveButton
                ) ? (
                  <Typography
                    variant="outlined"
                    style={{ color: "#d84b4b", fontSize: "7px" }}
                  >
                    Bookings
                  </Typography>
                ) : undefined
              }
            >
              <IconButton size="small" onClick={() => editHour()}>
                <Edit color="primary" />
              </IconButton>
            </Badge>
          </>
        ) : (
          <>
            &nbsp;
            <Button
              disableElevation
              disableFocusRipple
              disabled
              style={{ color: "#d84b4b" }}
            >
              Fully Booked
            </Button>
          </>
        )}
      </Typography>

      <Collapse in={hourViewProps.expanded}>
        {updatedHour.map((slot, slotIndex) => {
          let slotViewProps = {
            titleColor: "black",
            showButtons: true,
            showAddButton: true,
            showRemoveButton: true,
          };
          if (slot === "available")
            slotViewProps = {
              titleColor: "black",
              showButtons: true,
              showAddButton: false,
              showRemoveButton: true,
            };
          else if (slot === "disabled")
            slotViewProps = {
              titleColor: "gray",
              showButtons: true,
              showAddButton: true,
              showRemoveButton: false,
            };
          else
            slotViewProps = {
              titleColor: "black",
              showButtons: false,
              showAddButton: false,
              showRemoveButton: false,
            };
          const startTime = translateScheduleSlotIndexToSlotTimeString([
            hourIndex,
            slotIndex,
          ]);
          const endTime =
            slotIndex <= 2
              ? translateScheduleSlotIndexToSlotTimeString([
                  hourIndex,
                  slotIndex + 1,
                ])
              : translateScheduleSlotIndexToSlotTimeString([
                  hourIndex <= 22 ? hourIndex + 1 : 0,
                  0,
                ]);
          return (
            <div style={{ marginLeft: 20 }}>
              <Typography variant="caption" color={slotViewProps.titleColor}>
                {startTime + " - " + endTime}

                {slotViewProps.showButtons ? (
                  <>
                    <IconButton
                      size="small"
                      disabled={!slotViewProps.showAddButton}
                      onClick={() => addSlot(slotIndex)}
                    >
                      <AddCircle fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={!slotViewProps.showRemoveButton}
                      onClick={() => removeSlot(slotIndex)}
                    >
                      <RemoveCircle fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <Button
                    disableElevation
                    disabled={true}
                    style={{ color: "#d84b4b" }}
                    size="small"
                  >
                    Booked
                  </Button>
                )}
              </Typography>
            </div>
          );
        })}
      </Collapse>
    </div>
  );
};

export default EditWorkingHour;
