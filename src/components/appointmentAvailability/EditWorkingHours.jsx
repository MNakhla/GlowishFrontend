import { Card, CardContent } from "@mui/material";
import React from "react";
import { translateScheduleSlotIndexToSlotTimeString } from "../../utils/functions";
import EditWorkingHour from "./EditWorkingHour";

const EditWorkingHours = ({ inputSchedule, handleEditSchedule }) => {
  const [updatedSchedule, setUpdatedSchedule] = React.useState(inputSchedule);
  const handleEditHour = (hourIndex, updatedHour) => {
    const newUpdatedSchedule = [...updatedSchedule];
    newUpdatedSchedule[hourIndex] = updatedHour;
    setUpdatedSchedule(newUpdatedSchedule);
    handleEditSchedule(newUpdatedSchedule);
  };

  React.useEffect(() => {
    setUpdatedSchedule(inputSchedule);
  }, [inputSchedule]);

  return (
    <Card>
      <CardContent>
        {inputSchedule.map((hour, hourIndex) => {
          const startTime = translateScheduleSlotIndexToSlotTimeString([
            hourIndex,
            0,
          ]);
          const endTime = translateScheduleSlotIndexToSlotTimeString([
            hourIndex <= 22 ? hourIndex + 1 : 0,
            0,
          ]);
          const title = startTime + " - " + endTime;
          return (
            <EditWorkingHour
              title={title}
              hour={hour}
              hourIndex={hourIndex}
              handleEditHour={handleEditHour}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EditWorkingHours;
