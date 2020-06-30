import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import EditForm from "../components/EditForm";

export default function Profile() {
  const { profile, setProfile } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const saveProfile = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    await API.put("atl-backend", `update/captain/${body.captainId}`, { body });
    setProfile(body);
    setIsLoading(false);
  };

  const columns = {
    firstName: { label: "First Name", type: "text", required: true },
    lastName: { label: "Last Name", type: "text", required: true },
    phone: { label: "Phone Number", type: "text", required: true },
  };

  return (
    <div>
      <PageHeader>Your Profile</PageHeader>
      <EditForm
        fields={columns}
        original={profile}
        save={saveProfile}
        isLoading={isLoading}
      />
    </div>
  );
}
