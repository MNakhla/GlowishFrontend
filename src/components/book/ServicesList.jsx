import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Box } from "@mui/material";

const serviceCard = (service) => {
  return (
    <Box>
      <Typography sx={{ fontWeight: "bold" }}>{service.name}</Typography>
      <Typography>Estimated Time: {service.estimatedTime} min</Typography>
      <Typography>Cost: {service.price} Eur</Typography>
    </Box>
  );
};
export default function ServicesList(props) {
  const { services, checked, handleToggle } = props;

  return (
    <List
      sx={{
        overflow: "auto",
        maxHeight: 360,
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      {services.map((service, idx) => {
        const labelId = `checkbox-list-label-${idx}`;

        return (
          <ListItem key={idx} disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(idx)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="end"
                  checked={checked.has(idx)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} children={serviceCard(service)} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
