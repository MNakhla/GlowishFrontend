import React from "react";
import {
  TextField,
  Typography,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Alert,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signUp, logIn } from "../../services/api/auth.services";
import { useForm } from "react-hook-form";
import Navbar from "../../components/common/layout/Navbar";
import { SocketContext } from "../../utils/socket";

export default function SignUp() {
  const [userType, setUserType] = React.useState("customer");
  const [signupError, setSignupError] = React.useState(false);
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

  const trySignup = (data) => {
    const password = data.password;
    const email = data.email;
    signUp({
      firstName: data.firstName,
      lastName: data.lastName,
      email: email,
      password: password,
      userType: userType,
    })
      .then((_) => {
        logIn({
          email: email,
          password: password,
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
            socket?.emit("setUser", res.userId, res.userType);
            socket?.emit("updateNotifications", null, null);
            navigate(`${newPage}`, {
              replace: true,
            });
          })
          .catch((err) => {
            setSignupError(true);
          });
      })
      .catch((err) => {
        // 400 email
        if (err.response.status === 400) {
          setError("email", { message: "Email address already exists!" }, true);
        } else {
          setSignupError(true);
        }
      });
  };
  const goToLogin = () => {
    navigate("/login");
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
        {" "}
        <Collapse in={signupError}>
          <Alert severity="error">
            Something went wrong! Please try again!
          </Alert>
        </Collapse>
        <Grid item>
          <Typography variant="h3" color="primary" textAlign="center">
            Welcome to Glowish!
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" color="primary" textAlign="center">
            Start your relaxation experience by creating an account
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            required
            label="First Name"
            {...register("firstName", {
              required: "Please provide your first name",
            })}
            error={errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label="Last Name"
            {...register("lastName", {
              required: "Please provide your last name",
            })}
            error={errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label="Email address"
            type="email"
            {...register("email", {
              required: "Please provide your email address",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label="Password"
            type="password"
            {...register("password", {
              required: "Please provide a password",
              minLength: {
                value: 8,
                message: "Please provide a password with at least 8 characters",
              },
            })}
            error={errors.password}
            helperText={errors.password?.message || "at least 8 characters"}
          />
        </Grid>
        <Grid item>
          <FormControl>
            <FormLabel>Sign up as:</FormLabel>

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
          <Button
            type="submit"
            onClick={handleSubmit(trySignup)}
            variant="contained"
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item>
          <Typography>Already have an account?</Typography>
          <Button onClick={goToLogin}>Login now</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
