import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Add from "./components/Add";
import ShowAllInfo from "./components/ShowAllInfo";
import { useStateContext } from "./components/StateProvider";
import axios from "axios";

function App() {
  const [{ places }, dispatch] = useStateContext();

  useEffect(() => {
    //call get method to get all place details
    async function fetchdata() {
      await axios
        .get("http://localhost:3001")
        .then((res) => {
          dispatch({
            type: "setplaces",
            places: res.data,
          });
        })
        .catch((err) =>
          console.log("Getting error when fetching places: ", err)
        );
    }
    if (places == null) {
      fetchdata();
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>

          <Route exact path="/profile/add">
            <Add />
          </Route>

          <Route exact path="/info">
            <ShowAllInfo />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
