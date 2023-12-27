import React, { useState } from "react";
import { API, Auth } from "aws-amplify";
import { PageHeader, FormControl, HelpBlock } from "react-bootstrap";
import EditForm from "./EditForm";
import LoaderButton from "./LoaderButton";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default function Profile() {
  const { profile, setProfile } = useAppContext();
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const completeSaveProfile = async (newProfile) => {
    setIsLoading(true);
    const body = newProfile || updatedProfile;
    await API.put("atl-backend", `update/user/${body.userId}`, { body });
    setProfile(body);
    setEmailCodeSent(false);
    setEmailCode("");
    setIsLoading(false);
  };

  const saveProfile = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    setUpdatedProfile(body);
    if (body.email !== profile.email) {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: body.email });
      setEmailCodeSent(true);
      setIsLoading(false);
    }
    else completeSaveProfile(body);
  };

  const validateConfirmationForm = () => emailCode.length > 0;

  const verifyNewEmail = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", emailCode);
      completeSaveProfile();
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  const columns = {
    firstName: { label: "First Name", type: "text", required: true },
    lastName: { label: "Last Name", type: "text", required: true },
    email: { label: "Email", type: "email", required: true },
    phone: { label: "Phone Number", type: "text", required: true, placeholder: "xxx-xxx-xxxx" }
  };

  const renderEmailConfirmationForm = () => (
    <form onSubmit={verifyNewEmail} className="max-width-form">
    <div className="centered-content">
      <p>A confirmation code has been sent to your email inbox and should arrive within 1 minute.</p>
    </div>
      <table className="form-table">
        <tbody>
          <tr>
            <td className="form-label">Email Confirmation Code</td>
            <td className="form-field">
              <FormControl
                autoFocus
                type="tel"
                onChange={(e) => setEmailCode(e.target.value)}
                value={emailCode}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <HelpBlock className="no-margin-bottom">Enter the code that was emailed to you.</HelpBlock>
            </td>
          </tr>
        </tbody>
      </table>
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        bsStyle="primary"
        isLoading={isLoading}
        disabled={!validateConfirmationForm()}
      >
        Submit
      </LoaderButton>
    </form>
  );

  return (
    <div className="container">
      <PageHeader>Your Profile</PageHeader>
      {emailCodeSent ? renderEmailConfirmationForm() : (
        <div className="max-width-form">
          <EditForm
            fields={columns}
            original={profile}
            save={saveProfile}
            isLoading={isLoading}
          />
          <div className="link-below-button">
            <a href="/change-password">Need to change your password?</a>
          </div>
        </div>
      )}
    </div>
  );
}
