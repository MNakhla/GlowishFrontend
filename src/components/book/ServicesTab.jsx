import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import ServicesList from "./ServicesList";

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ServicesTab(props) {
  const { servicesTypes, currentTab, setCurrentTab, checked, handleToggle } =
    props;

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Grid item xs={1}>
      <Grid
        container
        justifyContent="center"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tabs value={currentTab} onChange={handleChange}>
          {Object.keys(servicesTypes).map((k, i) => {
            return <Tab key={`servicetab_${i}`} label={k} {...a11yProps(i)} />;
          })}
        </Tabs>
      </Grid>
      {Object.entries(servicesTypes).map(([typ, services], i) => {
        return (
          <Grid key={`gridstype_${i}`} container justifyContent="center">
            <TabPanel
              value={currentTab}
              index={i}
              children={
                <ServicesList
                  services={services}
                  handleToggle={handleToggle}
                  checked={checked[typ]}
                />
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
