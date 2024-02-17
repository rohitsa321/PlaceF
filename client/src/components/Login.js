import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import "./Login.css";
import { useStateContext } from "./StateProvider";
import validator from "email-validator";

function Login() {
  const [{}, dispatch] = useStateContext();

  const [data, setData] = useState({ userame: "", email: "", password: "" });
  const [signIn, setSignIn] = useState(false);

  //for checking value is filled or not it
  const [username, setUsername] = useState(false);
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);

  const handleClick = async () => {
    if (signIn) {
      //for first time signin
      if (!data.username || data.username.length < 5) setUsername(true);
      else if (!data.email || !validator.validate(data.email)) setEmail(true);
      else if (!data.password) setPassword(true);
      else if (data.username && data.email && data.password) {
        //call post method to add user
        await axios
          .post("http://localhost:3001/signin", data)
          .then((res) => {
            if (res.status == 201) {
              dispatch({
                type: "setuser",
                user: res.data,
              });
            } else {
              alert(res.data);
            }
          })
          .catch((err) => alert(err));

        setData({ username: "", email: "", password: "" });
      }
    } else {
      //for login purpose
      if (!data.email) setEmail(true);
      else if (!data.password) setPassword(true);
      else if (data.email && data.password) {
        //call post method for checking user
        //and if genuine user than dispatch
        await axios
          .post(
            "http://localhost:3001/login",
            new Object({ email: data.email, password: data.password })
          )
          .then((res) => {
            if (res.status != 200) {
              dispatch({
                type: "setuser",
                user: res.data,
              });
            } else {
              alert(res.data);
            }
          })
          .catch((err) => alert(err));
        setData({ username: "", email: "", password: "" });
      }
    }
  };

  //for switching to login page
  const goOnSignUp = () => {
    setSignIn(false);
    setData({ username: "", email: "", password: "" });
    setUsername(false);
    setEmail(false);
    setPassword(false);
  };

  //for switching to sign page
  const goOnSignIn = () => {
    setSignIn(true);
    setData({ username: "", email: "", password: "" });
    setUsername(false);
    setEmail(false);
    setPassword(false);
  };

  return (
    <div className="login">
      {signIn ? <h3>Sign up</h3> : <h3>Sign in</h3>}
      {signIn ? (
        <TextField
          error={username}
          value={data.username}
          label="Full Name"
          InputProps={{ maxLength: 20, minLength: 5 }}
          onChange={(e) => {
            setData({ ...data, username: e.target.value.trim() });
            if (username) setUsername(false);
          }}
          variant="standard"
        />
      ) : null}
      <TextField
        label="Email"
        value={data.email}
        error={email}
        onChange={(e) => {
          setData({ ...data, email: e.target.value.trim() });
          if (email) {
            setEmail(false);
          }
        }}
        variant="standard"
      />
      <TextField
        error={password}
        label="Password"
        type="password"
        value={data.password}
        onChange={(e) => {
          setData({ ...data, password: e.target.value.trim() });
          if (password) setPassword(false);
        }}
        variant="standard"
      />
      {signIn ? (
        <Button
          onClick={handleClick}
          size="large"
          variant="contained"
          color="primary"
        >
          Sign up
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          size="large"
          variant="contained"
          color="primary"
        >
          Sign In
        </Button>
      )}
      {signIn ? (
        <h5>
          Already have an account! <span onClick={goOnSignUp}>Click here</span>
        </h5>
      ) : (
        <h5>
          Don't have an account! <span onClick={goOnSignIn}>Click here</span>
        </h5>
      )}
    </div>
  );
}

export default Login;
