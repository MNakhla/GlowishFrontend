import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const ServiceBar = ({ services, serviceIndex, handleServiceChange }) => {
  return (
    <Box>
      <Tabs value={serviceIndex} onChange={handleServiceChange} centered>
        {services.map((service) => (
          <Tab key={service} label={service} />
        ))}
      </Tabs>
    </Box>
  );
};

export default ServiceBar;
