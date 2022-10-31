import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  List,
  ListItem,
  Button,
  Divider,
} from "@mui/material/";

import Service from "./Service";
import InfiniteScroll from "react-infinite-scroll-component";

const ServicesAndPrices = ({
  services,
  editable,
  handleDelete,
  handleToggleAddServiceForm,
  handleToggleUpdateServiceForm,
}) => {
  return (
    <Card >
      <CardContent id="services-and-prices">
        <Typography gutterBottom variant="h6" component="div">
          Services and Prices:
        </Typography>

        {services ? (
          <List id="services-list">
            <InfiniteScroll
                style={{
                  overflow: "auto",
                  width: "inherit",
                  maxHeight:'500px'
                }}
                scrollableTarget="services-list"
                dataLength={5}
                hasMore={false}
              >
            <ListItem>
              <Grid
                container
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Grid item xs={4}>
                  <Typography variant="subtitle2" component="div">
                    <strong> &nbsp; &nbsp; Service</strong>
                  </Typography>

                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      textAlign={"center"}
                    >
                      <strong>Price</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={3.5}>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      textAlign={"center"}
                    >
                      <strong>Estimated Time</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={1.5}></Grid>
                </Grid>
              </ListItem>
              {services.map((service) => (
                <div key={service._id}>
                  <ListItem>
                    <Service
                      editable={editable}
                      service={service}
                      handleToggleUpdateServiceForm={
                        handleToggleUpdateServiceForm
                      }
                      handleDelete={handleDelete}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </InfiniteScroll>
          </List>
        ) : (
          <Typography gutterBottom variant="subtitle2" component="div">
            No services yet! Click the button below to add a new service.
          </Typography>
        )}
      </CardContent>
      {editable && (
        <CardActions alignItems={"center"} justifyContent={"center"}>
          <Button
            onClick={() => handleToggleAddServiceForm()}
            variant="text"
            fullWidth
          >
            Add Service
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ServicesAndPrices;
