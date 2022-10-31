import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </BrowserRouter>
);
