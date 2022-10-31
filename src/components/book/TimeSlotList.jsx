import React from "react";
import { List, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function TimeSlotList(props) {
  const { value, onChange, items } = props;
  return (
    <List sx={{ overflow: "auto", maxHeight: 200, width: "70%" }}>
      <ToggleButtonGroup
        orientation="vertical"
        value={value}
        exclusive={true}
        onChange={onChange}
        fullWidth
      >
        {items.map((item, idx) => {
          return (
            <ToggleButton key={idx} value={idx}>
              <Typography>{item}</Typography>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </List>
  );
}
