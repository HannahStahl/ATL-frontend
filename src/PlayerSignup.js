import React, { useState } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import EditForm from "./EditForm";

export default function PlayerSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [playerRegistered, setPlayerRegistered] = useState(false);

  const columns = {
    "firstName": { label: "First Name", type: "text", required: true },
    "lastName": { label: "Last Name", type: "text", required: true },
    "phone": { label: "Phone", type: "text", placeholder: "xxx-xxx-xxxx" },
    "email": { label: "Email", type: "email", required: true },
    "rating": {
      label: "NTRP Rating",
      type: "number",
      required: true,
      helpText: <span>This is used to approximate the division that would be competitive for you. If you don't know or are unfamiliar with the ratings, you can learn more about them <a href="/ratings">here</a>.</span>
    },
    "ratingType": {
      label: "Rating Type",
      type: "dropdown",
      options: [{ value: "U", name: "USTA Rating"}, { value: "S", name: "Self Rating" }] },
    "gender": {
      label: "Gender",
      type: "dropdown",
      required: true,
      options: [{ value: "F", name: "Female" }, {value: "M", name: "Male" }],
      helpText: "Your gender and age will help prospective captains know if you would be a good fit for their teams. ATL is a gender-blind league, but many ATL players also participate in other leagues that do have gender and age limits. This info will help captains in those leagues know more about you."
    },
    "birthYear": { label: "Birth Year", type: "number", required: true },
    "usta": {
      label: "Have you played any USTA adult leagues?",
      type: "dropdown",
      options: [{ value: "Y", name: "Yes" }, { value: "N", name: "No" }]
    },
    "ustaLevel": { label: "If so, at what USTA level?", type: "text" },
    "ustaYear": { label: "What was the last year you played USTA?", type: "number" },
    "experience": {
      label: "What is your highest level of tennis experience?",
      type: "textarea",
      placeholder: "E.g. only played casually, played high school tennis, played tennis in college, etc."
    },
    "comments": {
      label: "Comments",
      type: "textarea",
      placeholder: "Describe your playing background and any other information you want to share about your interests in joining the league."
    },
  };

  const createPlayer = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    await API.post("atl-backend", "createPlayer", { body });
    setIsLoading(false);
    setPlayerRegistered(true);
  };

  return (
    <div className="container">
      {playerRegistered ? (
        <>
          <PageHeader>Thanks for signing up!</PageHeader>
          <div className="link-below-button">
            <p>We'll be in touch soon.</p>
            <a href="/">Back to home page</a>
          </div>
        </>
      ) : (
        <>
          <PageHeader>New Player Registration</PageHeader>
          <p>
            Enter your info here if you would like to play in the league.
            This list is made available to team captains who are looking to recruit players.
          </p>
          <p>
            All information entered is kept in the strictest confidence and used only for ATL matters.
            No information will be sold or given to third parties.
          </p>
          <EditForm
            fields={columns}
            save={createPlayer}
            isLoading={isLoading}
            buttonText="Submit"
            labelsAbove
          />
        </>
      )}
    </div>
  );
}
