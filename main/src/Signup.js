import React, { useState } from "react";
import { Auth, API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { FormControl, PageHeader, HelpBlock } from "react-bootstrap";
import { LoaderButton } from "atl-components";
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
    if (accessCode !== process.env.REACT_APP_ACCESS_CODE) {
      onError("Incorrect access code");
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
        body: { firstName, lastName, email, phone }
      });
      userHasAuthenticated(true);
      history.push("/");
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
            <tr>
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
            <tr><td colSpan={2}><HelpBlock>Check your email for the code.</HelpBlock></td></tr>
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
            <tr>
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
    <div className="Signup">
      <PageHeader>Create an Account</PageHeader>
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
