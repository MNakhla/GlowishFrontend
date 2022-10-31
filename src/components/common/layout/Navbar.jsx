import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  Avatar,
  MenuItem,
  ListItemIcon,
  Box,
  Menu,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";

import logo from "../../../assets/logo.svg";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logout from "@mui/icons-material/Logout";
import React, { useState, useContext } from "react";
import styles from "./styles";
import useClasses from "../../../hooks/useClasses";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { updateCustomerNotification } from "../../../services/api/customer.services";
import { updateFreelancerNotification } from "../../../services/api/freelancer.services";
import { formatDistance } from "date-fns";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import { SocketContext } from "../../../utils/socket";
import { HashLink } from "react-router-hash-link";

function formatDate(date, long) {
  return date?.toLocaleString(
    "default",
    long
      ? {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      : {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }
  );
}
function DefaultDialog({ open, read, message, handleClose, markRead }) {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={markRead} disabled={read}>
          Mark as read
        </Button>
      </DialogActions>
    </Dialog>
  );
}
function AppointmentViewDialog({
  open,
  handleClose,
  unRead,
  appointment,
  otherType,
  markRead,
}) {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Your Appointment Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={4} direction="column">
          <Grid item>
            <Typography>
              Appointment Time: {formatDate(new Date(appointment?.date))}{" "}
              {appointment?.startTime}-{appointment?.endTime}
            </Typography>
          </Grid>
          {appointment && (
            <Grid item>
              <Grid container spacing={4}>
                <Grid item>with</Grid>
                <Grid item>
                  <Avatar src={appointment[otherType].profilePicture} />
                </Grid>
                <Grid item>
                  <Typography>
                    {appointment[otherType].firstName}{" "}
                    {appointment[otherType].lastName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item>
            <Typography>Price: {appointment?.price}€</Typography>
          </Grid>
          {appointment?.cancelled &&
            localStorage.getItem("userType") === "customer" && (
              <Grid item>
                <Typography>
                  Refunded Amount:{" "}
                  {appointment.payment.paymentStatus === "early_cancellation"
                    ? appointment?.price
                    : Math.round(appointment?.price * 0.4)}
                  €
                </Typography>
              </Grid>
            )}

          {appointment?.cancelled &&
            localStorage.getItem("userType") === "freelancer" && (
              <Grid item>
                <Typography>
                  An amount of{" "}
                  {appointment.payment.paymentStatus === "early_cancellation"
                    ? appointment?.price
                    : Math.round(appointment?.price * 0.4)}
                  € has been refunded to the customer.
                </Typography>
              </Grid>
            )}
          <Grid item>
            <Typography>
              Status: {appointment?.cancelled ? "Cancelled" : "Active"}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={markRead} disabled={!unRead}>
          Mark as read
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

const Navbar = ({}) => {
  const socket = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifs, setAnchorElNotifs] = useState(null);
  const [appointmentDialogOpen, setAppointmentDialogOpen] =
    React.useState(false);
  const [selectedNotif, setSelectedNotif] = React.useState(null);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userId, setUserId] = useState();
  const [userType, setUserType] = useState();
  const [defaultDialogOpen, setDefaultDialogOpen] = React.useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setUserType(localStorage.getItem("userType"));
    if (userId) {
      setAuth(true);
      setIsLoading(true);
      socket?.emit("getUser", userId, userType, (err, user) => {
        if (err) console.log(err);
        else {
          setName(user?.firstName + user?.lastName);
          updateNotifications(user?.notifications);
          setProfilePic(user?.profilePicture);
          setIsLoading(false);
        }
      });
    } else {
      setAuth(false);
      setName("");
      updateNotifications([]);
      setProfilePic("");
      setIsLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    console.log(
      "auth",
      auth,
      "userid",
      userId,
      "usertype",
      userType,
      "name",
      name,
      "unread",
      unread
    );
  }, [auth, userId, userType, name, unread]);

  useEffect(() => {
    console.log(socket?.id, socket?.userId, localStorage.getItem("userId"));
    socket?.on("newNotifications", (updatedNotifications) => {
      // console.log("new notifs");
      // console.log(updatedNotifications);
      updateNotifications(updatedNotifications);
    });
    socket?.on("newProfilePicture", (updatedProfilePic) => {
      // console.log("new pic");
      setProfilePic(updatedProfilePic);
    });
    socket?.on("newName", (updatedName) => {
      // console.log("new name");
      setName(updatedName);
    });

    socket?.on(
      "newUser",
      (
        newUserId,
        newUserType,
        newName,
        updatedNotifications,
        profilePicUrl
      ) => {
        // console.log("new user");
        setUserId(newUserId);
        setUserType(newUserType);
        setName(newName);
        updateNotifications(updatedNotifications);
        setProfilePic(profilePicUrl);
        setAuth(true);
      }
    );
  }, [socket]);

  const markRead = async () => {
    let method =
      localStorage.getItem("userType") === "freelancer"
        ? updateFreelancerNotification
        : updateCustomerNotification;
    await method(userId, selectedNotif)
      .then((_) => {
        notifications[selectedNotif].read = true;
        setUnread((prevUnread) => prevUnread - 1);
      })
      .catch(() => {});
  };
  const updateNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    setUnread(
      updatedNotifications.reduce((acc, cur) => {
        return acc + (cur.read ? 0 : 1);
      }, 0)
    );
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifsMenu = (event) => {
    setAnchorElNotifs(event.currentTarget);
  };
  const handleCloseNotifsMenu = () => {
    setAnchorElNotifs(null);
  };

  const classes = useClasses(styles);
  return (
    <Grid item xs={12} sx={{ mb: 5 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#223140" }}>
        <Toolbar variant="dense" sx={{ backgroundColor: "#223140" }}>
          {isLoading ? (
            <Skeleton variant="rectangular" />
          ) : (
            <React.Fragment>
              {/* logo */}
              <Avatar sx={{ backgroundColor: "white" }}>
                <img src={logo} height="30" alt="logo" />
              </Avatar>
              {/* search */}
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    color="inherit"
                    sx={{
                      textTransform: "none",
                    }}
                    onClick={() => navigate("/search")}
                  >
                    <Typography variant="body1">Search</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <HashLink
                    to="/#About-us"
                    smooth
                    style={{
                      flexGrow: 1,
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    <Typography variant="body1">About us</Typography>
                  </HashLink>
                </Grid>
              </Grid>
              {/* notifications */}
              {auth ? (
                <IconButton onClick={handleOpenNotifsMenu}>
                  <Badge badgeContent={unread} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </Button>
              )}
              {/* user menu */}
              {auth && (
                <Box>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar src={profilePic} />{" "}
                  </IconButton>
                  <Menu
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">{name}</Typography>
                    <Typography textAlign="center">{userType} view</Typography>
                    {userType === "freelancer" && (
                      <MenuItem
                        key="fProfile"
                        onClick={() => {
                          navigate(`/freelancerProfile/${userId}`);
                        }}
                      >
                        <ListItemIcon>
                          <ManageAccountsIcon fontSize="small" />
                        </ListItemIcon>
                        Edit Profile
                      </MenuItem>
                    )}
                    {userType === "customer" && (
                      <MenuItem
                        onClick={() => {
                          navigate(`/myAppointments/${userId}`);
                        }}
                        key="cAppoint"
                      >
                        <ListItemIcon>
                          <ManageAccountsIcon fontSize="small" />
                        </ListItemIcon>
                        My Appointments
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        navigate(`/login`);
                      }}
                      key="login"
                    >
                      <ListItemIcon>
                        <SwitchAccountIcon fontSize="small" />
                      </ListItemIcon>
                      Switch Accounts
                    </MenuItem>
                    <MenuItem
                      key="logout"
                      onClick={() => {
                        if (auth) {
                          localStorage.removeItem("accessToken");
                          localStorage.removeItem("userId");
                          localStorage.removeItem("userType");
                          setAuth(false);
                          setProfilePic("");
                          setName("");
                          setNotifications([]);
                          navigate("/login");
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>

                  {notifications?.length > 0 && (
                    <Menu
                      anchorEl={anchorElNotifs}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElNotifs)}
                      onClose={handleCloseNotifsMenu}
                    >
                      {notifications?.map((notif, idx) => {
                        return (
                          <MenuItem
                            style={{ whiteSpace: "normal", width: 500 }}
                            onClick={() => {
                              setSelectedNotif(idx);
                              handleCloseNotifsMenu();
                              setAppointmentDialogOpen(
                                notif.appointmentId ? true : false
                              );
                              setDefaultDialogOpen(!notif.appointmentId);
                            }}
                            key={`notif${idx}`}
                          >
                            <Box>
                              <Typography color={notif.read ? "gray" : "black"}>
                                {notif.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color={notif.read ? "gray" : "black"}
                              >
                                {notif.time &&
                                  formatDistance(
                                    new Date(notif.time),
                                    new Date(),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                              </Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  )}
                  <DefaultDialog
                    read={notifications[selectedNotif]?.read}
                    markRead={markRead}
                    message={notifications[selectedNotif]?.message}
                    handleClose={async () => {
                      setDefaultDialogOpen(false);
                    }}
                    open={defaultDialogOpen}
                  />
                  <AppointmentViewDialog
                    appointment={notifications[selectedNotif]?.appointmentId}
                    open={appointmentDialogOpen}
                    handleClose={async () => {
                      setAppointmentDialogOpen(false);
                    }}
                    otherType={
                      localStorage.getItem("userType") === "freelancer"
                        ? "customer"
                        : "freelancer"
                    }
                    unRead={!notifications[selectedNotif]?.read}
                    markRead={markRead}
                  />
                </Box>
              )}
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Navbar;
