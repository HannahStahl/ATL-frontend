import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "react-bootstrap";

export default function Home() {
  return (
    <div className="Home">
      <div className="lander">
        <PageHeader>Welcome to the Austin Tennis League!</PageHeader>
        <Link to="/player-signup" className="btn btn-info btn-lg">
          Sign up to play
        </Link>
      </div>
    </div>
  );
}
