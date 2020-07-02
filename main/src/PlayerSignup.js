import React from "react";
import { useHistory } from "react-router-dom";
import { PageHeader } from "react-bootstrap";
import Player from "./Player";

export default function PlayerSignup() {
  const history = useHistory();
  return (
    <div>
      <PageHeader>New Player Registration</PageHeader>
      <Player onFinish={() => history.push("/")} />
    </div>
  );
}
