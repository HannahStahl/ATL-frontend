import React, { useState } from "react";
import { API, Auth } from "aws-amplify";
import { PageHeader, FormControl, HelpBlock } from "react-bootstrap";
import { EditForm, LoaderButton } from "atl-components";
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
    email: { label: "Email", type: "email", required: true }
  };

  const renderEmailConfirmationForm = () => (
    <form onSubmit={verifyNewEmail}>
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
          <tr><td colSpan={2}><HelpBlock>Check your new email for a verification code.</HelpBlock></td></tr>
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
        Verify
      </LoaderButton>
    </form>
  );

  return (
    <div>
      <PageHeader>Your Profile</PageHeader>
      {emailCodeSent ? renderEmailConfirmationForm() : (
        <React.Fragment>
          <EditForm
            fields={columns}
            original={profile}
            save={saveProfile}
            isLoading={isLoading}
          /> 
          <div className="link-below-button">
            <a href="/change-password">Need to change your password?</a>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
