import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function PortalHome() {
  const { profile, loadingData } = useAppContext();

  return !loadingData && profile && (profile.isAdmin || profile.isCaptain) ? (
    <div className="container">
      <PageHeader>
        {profile.isAdmin ? "Welcome to the ATL Admin Portal." : "Welcome to the Captain's Corner!"}
      </PageHeader>
      <p className="link-below-button">
        Click the icon in the top right to view your profile and league information.
      </p>
    </div>
  ) : <div className="container" />;
}
