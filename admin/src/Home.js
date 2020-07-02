import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function Home() {
  const { isAuthenticated } = useAppContext();

  function renderLander() {
    return (
      <div>
        <PageHeader>Welcome to the Austin Tennis League!</PageHeader>
        <Link to="/player-signup" className="btn btn-info btn-lg">
          Sign up to play
        </Link>
      </div>
    );
  }

  function renderHomePage() {
    return (
      <div>
        <PageHeader>Welcome to the ATL Admin Portal.</PageHeader>
        <p>Click the icon in the top right to view your profile and league information.</p>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderHomePage() : renderLander()}
    </div>
  );
}
