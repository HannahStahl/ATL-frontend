import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { PageHeader, FormControl } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import PasswordInstructions from "./PasswordInstructions";
import { onError } from "./libs/errorLib";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  function validateForm() {
    return (
      oldPassword.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    );
  }

  async function handleChangeClick(event) {
    event.preventDefault();
    setIsChanging(true);
    if (password !== confirmPassword) {
      onError("Passwords do not match");
      setIsChanging(false);
    } else {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        await Auth.changePassword(currentUser, oldPassword, password);
        setPasswordReset(true);
      } catch (error) {
        onError(error);
        setIsChanging(false);
      }
    }
  }

  return (
    <div className="container">
      <PageHeader>Change Password</PageHeader>
      {passwordReset ? (
        <div className="reset-password-success">
          <p>
            <i className="fas fa-check updated-password" />
            Your password has been reset.
          </p>
          <p>
            <a href="/profile">Return to profile</a>
          </p>
        </div>
      ) : (
        <form onSubmit={handleChangeClick} className="max-width-form">
          <table className="form-table">
            <tbody>
              <tr>
                <td className="form-label">Current Password</td>
                <td className="form-field">
                  <FormControl
                    autoFocus
                    type="password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    value={oldPassword}
                  />
                </td>
              </tr>
              <tr>
                <td className="form-label">New Password</td>
                <td className="form-field">
                  <FormControl
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </td>
              </tr>
              <tr className="form-field-with-note">
                <td className="form-label">Confirm New Password</td>
                <td className="form-field">
                  <FormControl
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                </td>
              </tr>
              <PasswordInstructions />
            </tbody>
          </table>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isChanging}
            disabled={!validateForm()}
          >
            Submit
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
