import React from "react";
import {
  Button,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { Map, SearchBox } from "../../components";
import { services } from "../../utils/constants";
import {
  getAllFreelancers,
  searchByDateAndLoc,
} from "../../services/api/freelancer.services";
import { getLocationCoordinates } from "../../services/externalApi/ptv";
import ResultCard from "../../components/search/ResultCard";
import FilterPopup from "../../components/search/FilterPopup";
import InfiniteScroll from "react-infinite-scroll-component";
import DaySwitch from "../../components/search/DaySwitch";
import SortPopup from "../../components/search/SortPopup";
import Navbar from "../../components/common/layout/Navbar";
import Loading from "../../components/common/Loading/Loading";
import styles from "./styles";
import useClasses from "../../hooks/useClasses";
import makeup from "../../assets/makeup.webp";
import nails from "../../assets/nails.webp";
import logo from "../../assets/Makeup&SalonLogo.png";
import hoda from "../../assets/hoda.png";
import mariz from "../../assets/mariz.png";
import maria from "../../assets/maria.png";

const SearchFreelancer = () => {
  const classes = useClasses(styles);
  const [isLoading, setIsLoading] = React.useState(true);
  const [freelancers, setFreelancers] = React.useState([]);
  const [serviceIndex, setServiceIndex] = React.useState(0);
  const [serviceName, setServiceName] = React.useState(services[0]);
  const [chosenDate, setChosenDate] = React.useState(new Date());
  const [dateLocSearchFreelancers, setDateLocSearchFreelancers] =
    React.useState([]);
  const [searchClicked, setSearchClicked] = React.useState(false);
  const [searchOptionIndex, setSearchOptionIndex] = React.useState(0);
  const [longitude, setLongitude] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
  const [chosenFreelancer, setChosenFreelancer] = React.useState(null);
  const [locString, setLocString] = React.useState("");
  const [mapZoom, setMapZoom] = React.useState(10);
  const [chosenFreelancerSearchTrig, setChosenFreelancerSearchTrig] =
    React.useState(null);
  const [chosenLocationObject, setChosenLocationObject] = React.useState();
  const [locationOptions, setLocationOptions] = React.useState([]);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filteredFreelancers, setFilteredFreelancers] = React.useState([]);
  const [filterSubmit, setFilterSubmit] = React.useState(false);
  const [sort, setSort] = React.useState("");
  const [sortSubmit, setSortSubmit] = React.useState(false);
  const [showDateSwitch, setShowDateSwitch] = React.useState(false);

  const [currFreelancers, setCurrFreelancers] = React.useState([]);

  //infiniteScroll
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const pageLimit = 2;
  const [sliceEnd, setSliceEnd] = React.useState(pageLimit);

  const handleServiceChange = (event, newValue) => {
    setServiceIndex(newValue);
    setServiceName(services[newValue]);
  };

  const handleSearchByChange = (event, newValue) => {
    setSearchOptionIndex(newValue);
  };

  const handleLocChange = (newValue) => {
    setLocString(newValue);
  };

  const handleDateChange = (date) => {
    setChosenDate(date);
  };

  const handleSearchChange = () => {
    setChosenFreelancerSearchTrig(chosenFreelancer);
    setIsLoading(true);
    setSliceEnd(pageLimit);
    setHasMore(true);
    setSort("");
    setSortSubmit(false);
    setSearchClicked(true);
    setFilterSubmit(false);
    setMapZoom(searchOptionIndex === 0 ? 20 : 10);
    setShowDateSwitch(true);
  };

  const handleReset = () => {
    setFilterSubmit(false);
    setSortSubmit(false);
    setSort("");
    setFilteredFreelancers(dateLocSearchFreelancers);
    setPage(1);
    setSliceEnd(pageLimit);
    setHasMore(true);
  };

  const fetchNextPage = () => {
    // fetching next page
    let totalDisplayed = page * pageLimit;

    if (currFreelancers.length - totalDisplayed < pageLimit) {
      // more than pageLimit
      setSliceEnd(currFreelancers.length);
      setPage(page + 1);
      setHasMore(false);
    } else {
      totalDisplayed = page * pageLimit;
      if (totalDisplayed >= currFreelancers.length) {
        setHasMore(false);
      } else {
        //  less than pageLimit
        setPage(page + 1);
        setSliceEnd(pageLimit * (page + 1));
      }
    }
  };

  React.useEffect(() => {
    setCurrFreelancers(
      searchOptionIndex === 0 && chosenFreelancerSearchTrig !== null
        ? [chosenFreelancerSearchTrig]
        : filterSubmit || sortSubmit
        ? filteredFreelancers
        : dateLocSearchFreelancers
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dateLocSearchFreelancers,
    filteredFreelancers,
    chosenFreelancerSearchTrig,
    searchClicked,
  ]);

  React.useEffect(() => {
    async function getFreelancers() {
      await getAllFreelancers()
        .then(async (freelancers) => {
          await setFreelancers(freelancers);
          await setDateLocSearchFreelancers(freelancers);
          setIsLoading(false);
        })
        .catch((err) => {
          alert("cannot get freelancers");
        });
    }
    getFreelancers();
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      if (searchOptionIndex === 1) {
        await getLocationCoordinates(locString)
          .then((result) => {
            if (result.locations.length !== 0) {
              setLongitude(result.locations[0].referencePosition.longitude);
              setLatitude(result.locations[0].referencePosition.latitude);
            }
          })
          .then(async () => {
            const searchedFreelancers = await searchByDateAndLoc(
              latitude,
              longitude,
              chosenDate,
              serviceName
            ).catch((err) => {
              alert("cannot search for freelancers");
            });
            setDateLocSearchFreelancers(searchedFreelancers);
            setFilteredFreelancers(searchedFreelancers);
          });
      } else {
        setLongitude(
          chosenFreelancer?.defaultAvailability?.centerLocation?.longitude
        );
        setLatitude(
          chosenFreelancer?.defaultAvailability?.centerLocation?.latitude
        );
      }
      setIsLoading(false);
      setSearchClicked(false);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchClicked]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {/* root */}
      <Grid container direction="column" spacing={5}>
        {/* header */}
        <Navbar />
        <Grid item sx={{ mt: -7 }}>
          <ImageList
            cols={3}
            sx={{ width: "100%", height: 300, overflow: "hidden" }}
          >
            <ImageListItem>
              <img src={makeup} width="100vh/3" alt="" />
            </ImageListItem>
            <ImageListItem sx={{ verticalAlign: "center" }}>
              <img src={logo} width="100vh/3" alt="" />
            </ImageListItem>
            <ImageListItem>
              <img src={nails} width="100vh/3" alt="" />
            </ImageListItem>
          </ImageList>
        </Grid>
        {/* search box & map */}
        <Grid item>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            {/* search box */}
            <Grid item xs={4} className={classes.searchBoxGrid}>
              <SearchBox
                setLocationOptions={setLocationOptions}
                locationOptions={locationOptions}
                setChosenLocationObject={setChosenLocationObject}
                chosenLocationObject={chosenLocationObject}
                searchOptionIndex={searchOptionIndex}
                handleSearchByChange={handleSearchByChange}
                handleSearchChange={handleSearchChange}
                freelancers={freelancers}
                chosenFreelancer={chosenFreelancer}
                setChosenFreelancer={setChosenFreelancer}
                chosenDate={chosenDate}
                handleDateChange={handleDateChange}
                handleLocChange={handleLocChange}
                locString={locString}
                serviceIndex={serviceIndex}
                handleServiceChange={handleServiceChange}
              />
            </Grid>
            {/* map */}
            <Grid item xs={6}>
              <Typography variant="h6">
                {searchOptionIndex === 1
                  ? `${currFreelancers?.length} freelancers found in your area`
                  : ""}
              </Typography>
              <Map
                searchOptionIndex={searchOptionIndex}
                longitude={longitude}
                latitude={latitude}
                markersRes={
                  currFreelancers
                  // searchOptionIndex === 0 && chosenFreelancerSearchTrig !== null
                  //   ? [chosenFreelancerSearchTrig]
                  //   : dateLocSearchFreelancers
                }
                mapZoom={mapZoom}
                searchClicked={searchClicked}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* filter, sort & reset */}
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="flex-start">
            {/* filter */}
            <Grid
              item
              sx={{
                pl: "70px",
                display: searchOptionIndex === 0 ? "none" : undefined,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setFilterOpen(true);
                }}
              >
                <Typography>Filter</Typography>
              </Button>

              <FilterPopup
                setSliceEnd={setSliceEnd}
                setHasMore={setHasMore}
                setPage={setPage}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                dateLocSearchFreelancers={dateLocSearchFreelancers}
                setFilteredFreelancers={setFilteredFreelancers}
                setFilterSubmit={setFilterSubmit}
                filterSubmit={filterSubmit}
                sort={sort}
                sortSubmit={sortSubmit}
              />
            </Grid>

            {/* sort */}

            <Grid
              item
              sx={{
                pl: "10px",
                display: searchOptionIndex === 0 ? "none" : undefined,
              }}
            >
              <SortPopup
                currFreelancers={currFreelancers}
                setFilteredFreelancers={setFilteredFreelancers}
                setSortSubmit={setSortSubmit}
                sort={sort}
                setSort={setSort}
              />
            </Grid>
            {/* Reset */}
            <Grid
              item
              sx={{
                ml: 1,
                display: searchOptionIndex === 0 ? "none" : undefined,
              }}
            >
              <Button variant="outlined" onClick={handleReset}>
                <Typography>Reset</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* day switch & freelancers result cards */}
        <Grid item>
          <Grid container direction="column" alignItems="center">
            {/* day switch */}
            <Grid
              item
              className={
                searchOptionIndex === 0 ||
                // currFreelancers.length === 0 ||
                !showDateSwitch
                  ? classes.daySwitch
                  : undefined
              }
            >
              <DaySwitch
                locString={locString}
                searchOptionIndex={searchOptionIndex}
                handleDateChange={handleDateChange}
                handleSearchChange={handleSearchChange}
                chosenDate={chosenDate}
                chosenLocationObject={chosenLocationObject}
              />
            </Grid>
            {/* freelancers result cards */}
            {currFreelancers.length > 0 ? (
              <Grid
                item
                id="freelancerResCards"
                className={classes.freelancerResCards}
              >
                <InfiniteScroll
                  style={{
                    overflow: "hidden",
                    width: "90vw",
                  }}
                  scrollableTarget="freelancerResCards"
                  dataLength={sliceEnd}
                  next={fetchNextPage}
                  hasMore={hasMore}
                  loader={
                    currFreelancers.length > 0 && (
                      <Typography gutterBottom textAlign="center">
                        Loading More Freelancers...
                      </Typography>
                    )
                  }
                  endMessage={
                    currFreelancers.length > 0 && (
                      <Typography gutterBottom textAlign="center">
                        Yay! You have seen all freelancers for this search..😊
                      </Typography>
                    )
                  }
                >
                  {currFreelancers
                    .slice(0, sliceEnd)
                    .map((freelancerSearched) => (
                      <ResultCard
                        freelancer={freelancerSearched}
                        chosenDate={chosenDate}
                      />
                    ))}
                </InfiniteScroll>
              </Grid>
            ) : (
              <Grid item sx={{ pb: 5, pt: 5 }}>
                <Typography variant="h6" gutterBottom>
                  No freelancers found !
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item id="About-us" sx={{ backgroundColor: "#223140" }}>
          <Grid container spacing={4} direction="column">
            <Grid item sx={{ ml: 5, mr: 5 }}>
              <Typography color="white" variant="h2">
                About us
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 5, mr: 5 }}>
              <Typography color="white" variant="body">
                GloWish is a double-benefit freelancing platform to help
                emerging artists and beauty-service seekers to connect and
                manage bookings through an automated appointment system. We
                offer benefits for both makeup artists and hairdressers
                especially the ones who newly joined a freelancing career path,
                as well as for customers seeking beauty-related services, not
                only to help young professionals to show their talents and
                convince customers to book appointments with them but also to
                help customers to choose the most suitable person for the target
                service with creating a beauty-hub connecting both beauty
                seekers and makers.
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" color="white" sx={{ mr: 5, ml: 5 }}>
                Glowish Developers
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={5} justifyContent="space-evenly">
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item>
                      <img src={maria} alt="Maria" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="white">
                        Maria Nakhla
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item>
                      <img src={mariz} alt="Mariz" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="white">
                        Mariz Samir
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item>
                      <img src={hoda} alt="Hoda" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="white">
                        Hoda Hamdy
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchFreelancer;
