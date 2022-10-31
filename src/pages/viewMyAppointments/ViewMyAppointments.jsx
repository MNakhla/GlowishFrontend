import React from "react";
import Navbar from "../../components/common/layout/Navbar";
import { useParams } from "react-router-dom";
import { getCustomer } from "../../services/api/customer.services";
import { Grid, Typography } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import AppointmentCard from "../../components/viewMyAppointments/AppointmentCard";
import useClasses from "../../hooks/useClasses";
import styles from "./styles";
import Loading from "../../components/common/Loading/Loading";

const ViewMyAppointments = () => {
  const classes = useClasses(styles);
  const { customerId } = useParams();
  const [customer, setCustomer] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const pageLimit = 2;
  const [sliceEnd, setSliceEnd] = React.useState(pageLimit);

  React.useEffect(() => {
    async function getMyCustomer() {
      const res = await getCustomer(customerId).catch((err) => {
        alert("cannot get customer");
      });
      setCustomer(res);
    }
    getMyCustomer();
  }, []);
  const fetchNextPage = () => {
    // fetching next page
    let totalDisplayed = page * pageLimit;

    if (customer.appointments.length - totalDisplayed < pageLimit) {
      // more than pageLimit
      setSliceEnd(customer.appointments.length);
      setPage(page + 1);
      setHasMore(false);
    } else {
      totalDisplayed = page * pageLimit;
      if (totalDisplayed >= customer.appointments.length) {
        setHasMore(false);
      } else {
        //  less than pageLimit
        setPage(page + 1);
        setSliceEnd(pageLimit * (page + 1));
      }
    }
  };
  if (customer === null) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      {customer.appointments.length > 0 ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          id="customerAppointmentCards"
          className={classes.customerAppointmentCards}
        >
          <InfiniteScroll
            style={{
              overflow: "hidden",
              width: "90vw",
            }}
            scrollableTarget="customerAppointmentCards"
            dataLength={sliceEnd}
            next={fetchNextPage}
            hasMore={hasMore}
            loader={
              customer.appointments.length > 0 && (
                <Typography gutterBottom textAlign="center">
                  Loading More Freelancers...
                </Typography>
              )
            }
            endMessage={
              customer.appointments.length > 0 && (
                <Typography gutterBottom textAlign="center">
                  You have seen all of your appointments 😊
                </Typography>
              )
            }
          >
            {customer.appointments.slice(0, sliceEnd).map((appointment) => (
              <AppointmentCard currAppointment={appointment} />
            ))}
          </InfiniteScroll>
        </Grid>
      ) : (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <Grid item sx={{ pb: 5, pt: 5 }} width="100%">
            <Typography variant="h4" gutterBottom textAlign="center">
              You have no appointments yet, Book your first one now!
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ViewMyAppointments;
