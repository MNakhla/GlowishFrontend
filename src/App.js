import "./App.css";
import React from "react";
import {
  SearchFreelancer,
  BookAppointment,
  FreelancerProfile,
  Signup,
  Login,
} from "./pages";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import decode from "jwt-decode";
import io from "socket.io-client";
import { SocketContext } from "./utils/socket";
import ViewMyAppointments from "./pages/viewMyAppointments/ViewMyAppointments";

const ProtectedRoute = ({ children, pageType, accessToken }) => {
  const location = useLocation();
  let token = localStorage.getItem("accessToken");
  if (token) {
    const decodedToken = decode(token);
    if (
      decodedToken.id === localStorage.getItem("userId")
      // && decodedToken.exp < Date.now() / 1000
    ) {
      if (pageType && pageType !== localStorage.getItem("userType")) {
        return (
          <Navigate
            to="/login"
            replace
            state={{
              from: location.pathname,
              message: `Only ${pageType}s can access this page`,
            }}
          />
        );
      }
      return children;
    }
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{
        from: location.pathname,
        message: "Only logged in users can access this page",
      }}
    />
  );
};
function App() {
  const socket = io.connect(process.env.REACT_APP_BACKEND_API, {
    autoConnect: true,
    transports: ["websocket"],
  });
  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      if (localStorage.getItem("userId")) {
        socket?.emit(
          "setUser",
          localStorage.getItem("userId"),
          localStorage.getItem("userType")
        );
      }
    });
    socket.on("reconnect", () => {
      console.log("reconnected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("reconnect");
      socket.off("disconnect");
      socket.off("newNotification");
      socket.off("newProfilePicture");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        {/* <Route path="/" exact element={} /> */}
        <Route path="/signup/" exact element={<Signup />} />
        {/* <Route path="/login/" exact element={<Login />} /> */}
        <Route path="/search/" exact element={<SearchFreelancer />} />
        <Route path="/" exact element={<SearchFreelancer />} />
        <Route
          path="/book/:freelancerId"
          element={
            <ProtectedRoute
              pageType="customer"
              accessToken={localStorage.getItem("accessToken")}
            >
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancerProfile/:freelancerId"
          exact
          element={
            <ProtectedRoute accessToken={localStorage.getItem("accessToken")}>
              <FreelancerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myAppointments/:customerId"
          exact
          element={
            <ProtectedRoute accessToken={localStorage.getItem("accessToken")}>
              <ViewMyAppointments />
            </ProtectedRoute>
          }
        />
        <Route path="/*" exact element={<Login />} />
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
