import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useStyles from "./Styles";
import Input from "./Input";
import { signup, signin } from "../../actions/auth";

const initialState = {
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const switchMode = () => {
    // console.log(isSignup);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };
  // useEffect(() => {
  //   console.log("Fruit ", isSignup);
  // }, [isSignup]);
  const googleSuccess = async (res) => {
    console.log(res);
    var token = res?.credential;
    var result = jwt_decode(token);
    try {
      dispatch({ type: "AUTH", data: { result, token } });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    // console.log(result);
  };
  const googleFailure = (error) => {
    console.log(error);
  };
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography varient="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            varient="contained"
            color="primary"
            className={classes.submit}
            style={{ backgroundColor: "#3e50b5", color: "white" }}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <Grid container justify="center" className={classes.googleButton}>
            <Grid item width="100%">
              <GoogleLogin
                onSuccess={(res) => googleSuccess(res)}
                onError={(error) => googleFailure(error)}
                size="large"
              />
            </Grid>
          </Grid>
          {/* <Button
            className={classes.googleButton}
            color="primary"
            fullWidth
            onClick={() => login()}
            // onClick={renderProps.onClick}
            // disabled={renderProps.disabled}
            startIcon={<Icon />}
            varient="contained"
            style={{ backgroundColor: "#3e50b5", color: "white" }}
          >
            Google Sign In
          </Button> */}
          {/* <GoogleLogin
            clientId="664180484654-j8ft8uga9fnr4vmdg1b50j2gbod1tjj2.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                varient="contained"
                style={{ backgroundColor: "#3e50b5", color: "white" }}
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          /> */}
          <Grid container justify="center">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
