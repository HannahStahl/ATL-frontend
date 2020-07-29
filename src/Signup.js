import React, { useState } from "react";
import { Auth, API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { FormControl, PageHeader, HelpBlock } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default function Signup() {
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  function validateForm() {
    return (
      accessCode.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      phone.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    );
  }

  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const accessCodes = [
      process.env.REACT_APP_CAPTAIN_ACCESS_CODE,
      process.env.REACT_APP_ADMIN_ACCESS_CODE,
      process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE,
    ];
    if (!accessCodes.includes(accessCode)) {
      onError("Invalid access code");
      setIsLoading(false);
    } else if (password !== confirmPassword) {
      onError("Passwords do not match");
      setIsLoading(false);
    } else {
      try {
        const newUser = await Auth.signUp({
          username: email, password: password,
        });
        setIsLoading(false);
        setNewUser(newUser);
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      await API.post("atl-backend", "create/user", {
        body: {
          firstName,
          lastName,
          email,
          phone,
          isCaptain: (
            accessCode === process.env.REACT_APP_CAPTAIN_ACCESS_CODE ||
            accessCode === process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE
          ),
          isAdmin: (
            accessCode === process.env.REACT_APP_ADMIN_ACCESS_CODE ||
            accessCode === process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE
          )
        }
      });
      userHasAuthenticated(true);
      history.push("/portal");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
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
                <HelpBlock>Check your email for the code.</HelpBlock>
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
          Verify
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <tbody>
            <tr>
              <td className="form-label">Access Code</td>
              <td className="form-field">
                <FormControl
                  autoFocus
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="form-label">First Name</td>
              <td className="form-field">
                <FormControl
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="form-label">Last Name</td>
              <td className="form-field">
                <FormControl
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="form-label">Email</td>
              <td className="form-field">
                <FormControl
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="form-label">Phone</td>
              <td className="form-field">
                <FormControl
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="xxx-xxx-xxxx"
                />
              </td>
            </tr>
            <tr className="form-field-with-note">
              <td className="form-label">Password</td>
              <td className="form-field">
                <FormControl
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <HelpBlock>
                  Password must contain all of the following:<br />
                  - at least 8 characters<br />
                  - at least 1 number<br />
                  - at least 1 special character<br />
                  - at least 1 uppercase letter<br />
                  - at least 1 lowercase letter<br />
                </HelpBlock>
              </td>
            </tr>
            <tr>
              <td className="form-label">Confirm Password</td>
              <td className="form-field">
                <FormControl
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
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
          disabled={!validateForm()}
        >
          Create Account
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="container Signup">
      <PageHeader>Create an Account</PageHeader>
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
