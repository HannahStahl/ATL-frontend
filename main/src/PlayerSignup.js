import React, { useState } from "react";
import { PageHeader } from "react-bootstrap";
import { EditForm } from "atl-components";
import { API } from "aws-amplify";

export default function PlayerSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [playerRegistered, setPlayerRegistered] = useState(false);

  const columns = {
    "firstName": { label: "First Name", type: "text", required: true },
    "lastName": { label: "Last Name", type: "text", required: true },
    "phone": { label: "Phone", type: "text" },
    "email": { label: "Email", type: "email", required: true },
    "rating": { label: "Rating", type: "number", required: true },
    "selfRated": { label: "Self-Rated?", type: "text" }, // TODO make this a checkbox
    "gender": { label: "Gender", type: "text", required: true },
    "birthYear": { label: "Birth Year", type: "number", required: true },
    "usta": { label: "USTA?", type: "text" }, // TODO make this a checkbox
    "ustaLevel": { label: "USTA Level", type: "text" },
    "ustaYear": { label: "USTA Year", type: "number" },
    "experience": { label: "Experience", type: "textarea" },
    "comments": { label: "Comments", type: "textarea" },
  };

  const createPlayer = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    await API.post("atl-backend", "createPlayer", { body });
    setIsLoading(false);
    setPlayerRegistered(true);
  };

  return (
    <div>
      {playerRegistered ? (
        <React.Fragment>
          <PageHeader>Thanks for signing up!</PageHeader>
          <div>
            <p>We'll be in touch soon.</p>
            <a href="/">Back to home page</a>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <PageHeader>New Player Registration</PageHeader>
          <EditForm
            fields={columns}
            save={createPlayer}
            isLoading={isLoading}
          />
        </React.Fragment>
      )}
    </div>
  );
}
