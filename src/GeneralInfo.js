import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

export default function GeneralInfo() {
  return (
    <div className="container">
      <PageHeader>League Information</PageHeader>
      <h3>Format:</h3>
      <p>
        Each team fields two singles and two doubles matches each Saturday (6 players).
        A team typically consists of 10 to 17 players, insuring that a full team will be fielded for each match.
        Matches are played at the public tennis centers, clubs and school courts.
      </p>
      <h3>Rules & Regulations:</h3>
      <p>
        Unless otherwise provided by the <a download href="ATL Rules.pdf">ATL rules</a>, the <a href="https://www.usta.com/en/home/about-usta/who-we-are/national/officiating-rules-and-regulations.html">rules of the United States Tennis Association</a> (USTA) and the <a href="https://www.usta.com/content/dam/usta/pdfs/2015_Code.pdf">Code of Tennis</a> shall govern league play.
        Knotty problems can be referenced when unusual events occur that are not covered by any of the above.
        If there are situations that need personal attention, please call one of the ATL Committee members.
      </p>
      <h3>Committee Members:</h3>
      {content.committee.map((member) => <p key={member} className="committee-member">{member}</p>)}
    </div>
  );
}
