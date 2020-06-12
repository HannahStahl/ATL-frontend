import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Home.css";

export default function Home() {
  const { isAuthenticated } = useAppContext();

  function renderLander() {
    return (
      <div className="lander">
        <h1>Austin Tennis League</h1>
        <p>Captain's Corner</p>
        <div>
          <Link to="/captain-login" className="btn btn-info btn-lg">
            Log in
          </Link>
          <Link to="/captain-signup" className="btn btn-success btn-lg">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  function renderHomePage() {
    return (
      <div>
        <PageHeader>Welcome to Austin Tennis League!</PageHeader>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderHomePage() : renderLander()}
    </div>
  );
}
