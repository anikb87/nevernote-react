import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./Login";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const isLoggedIn = localStorage.getItem("nevernote-user");

root.render(isLoggedIn ? <App /> : <Login onLogin={() => window.location.reload()} />);
