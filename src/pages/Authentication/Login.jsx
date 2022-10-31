import React from "react";
import {
  TextField,
  Typography,
  Button,
  Grid,
  FormLabel,
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { logIn } from "../../services/api/auth.services";
import { useForm } from "react-hook-form";
import Navbar from "../../components/common/layout/Navbar";
import { SocketContext } from "../../utils/socket";

export default function Login() {
  const location = useLocation();
  // console.log(location);
  const [userType, setUserType] = React.useState("customer");
  const [loginError, setLoginError] = React.useState(false);
  const socket = React.useContext(SocketContext);

  const handleChange = (event) => {
    setUserType(event.target.value);
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const goToSignUp = () => {
    navigate("/signup");
  };

  const tryLogin = (data) => {
    logIn({
      email: data.email,
      password: data.password,
      userType: userType,
    })
      .then((res) => {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("userType", res.userType);
        let newPage =
          res.userType === "freelancer"
            ? `/freelancerProfile/${res.userId}`
            : "/search";
        if (location.state && location.state.from) {
          newPage = location.state.from;
        }
        socket?.emit("setUser", res.userId, res.userType);
        navigate(`${newPage}`, {
          replace: true,
        });
      })
      .catch((err) => {
        console.log("login error" + err);
        // 404 email, 403 password
        if (err.response.status === 404) {
          setError("email", { message: "Email address does't exist" }, true);
        } else if (err.response.status === 403) {
          setError(
            "password",
            { message: "Wrong password for this email" },
            true
          );
        } else {
          setLoginError(true);
        }
      });
  };

  return (
    <Grid container>
      <Navbar />
      <Grid item xs={3}></Grid>
      <Grid
        margin={2}
        sx={{ bgcolor: "#ebebeb" }}
        container
        alignItems="center"
        spacing={6}
        direction="column"
        justifyContent="center"
        width="50%"
      >
        <Collapse in={loginError}>
          <Alert severity="error">
            Something went wrong! Please try again!
          </Alert>
        </Collapse>
        {location?.state?.message && (
          <Alert severity="error">{location?.state?.message}</Alert>
        )}

        <Grid item>
          <Typography variant="h3" color="primary" textAlign="center">
            Welcome Back!
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" color="primary">
            Login now with your credentials
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            required
            label="Email address"
            type="email"
            error={errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Please enter your Glowish account's email address",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label="Password"
            type="password"
            error={errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Please enter your account's correct password",
              minLength: {
                value: 8,
                message: "Please enter a password with at least 8 characters",
              },
            })}
          />
        </Grid>
        <Grid item>
          <FormControl>
            <FormLabel>Log in as:</FormLabel>

            <RadioGroup
              defaultValue="customer"
              row
              value={userType}
              onChange={handleChange}
            >
              <FormControlLabel
                value="customer"
                control={<Radio />}
                label="Customer"
              />
              <FormControlLabel
                value="freelancer"
                control={<Radio />}
                label="Freelancer"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <Button onClick={handleSubmit(tryLogin)} variant="contained">
            Log in
          </Button>
        </Grid>
        <Grid item>
          <Typography>Don't have an account yet?</Typography>
          <Button type="submit" onClick={goToSignUp}>
            Signup now
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
