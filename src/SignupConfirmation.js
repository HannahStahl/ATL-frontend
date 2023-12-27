import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { DateUtils } from '@aws-amplify/core';
import { FormControl, HelpBlock, PageHeader } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoaderButton from "./LoaderButton";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default function SignupConfirmation({ email, password, onConfirmationSuccess }) {
  const history = useHistory();
  const { setProfile, userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  }

  const handleConfirmationSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      if (password) {
        await Auth.signIn(email, password);
        await Auth.currentAuthenticatedUser({
          bypassCache: true
        }).then((user) => {
          DateUtils.setClockOffset(-(user.signInUserSession.clockDrift * 1000));
        });
        setProfile({ email });
        userHasAuthenticated(true);
      }
      setIsLoading(false);
      await onConfirmationSuccess();
    } catch (e) {
      onError(e);
      if (e.code === "NotAuthorizedException") {
        // Incorrect password was entered on previous screen;
        // redirect to login, where they can reset password if needed
        if (window.location.pathname === "/login") {
          window.location.reload();
        } else {
          history.push("/login");
        }
      } else {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="container">
      <PageHeader>Confirm your Account</PageHeader>
      <form onSubmit={handleConfirmationSubmit} className="max-width-form">
        <div className="centered-content">
          <p>A confirmation code has been sent to your email inbox and should arrive within 1 minute.</p>
        </div>
        <table className="form-table">
          <tbody>
            <tr className="form-field-with-note">
              <td className="form-label">Confirmation Code</td>
              <td className="form-field">
                <FormControl
                  autoFocus
                  type="tel"
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  value={confirmationCode}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
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
    </div>
  );
}
