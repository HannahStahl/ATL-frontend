import React from "react";
import { PageHeader } from "react-bootstrap";

export default function Rules() {
  return (
    <div className="container">
      <PageHeader>ATL Rules Handbook</PageHeader>
      <embed src="ATL Rules.pdf" style={{ width: "100%", height: "1000px" }} />
    </div>
  );
};
