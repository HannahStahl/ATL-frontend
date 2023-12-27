import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { FormControl, PageHeader } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import PasswordInstructions from "./PasswordInstructions";
import SignupConfirmation from "./SignupConfirmation";
import { onError } from "./libs/errorLib";

export default function Signup() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userIsUnconfirmed, setUserIsUnconfirmed] = useState(false);

  function validateForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      onError("Passwords do not match");
      setIsLoading(false);
    } else {
      try {
        await Auth.signUp({ username: email, password: password });
        setUserIsUnconfirmed(true);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
  }

  return userIsUnconfirmed ? (
    <SignupConfirmation
      email={email}
      password={password}
      onConfirmationSuccess={() => history.push("/portal")}
    />
  ) : (
    <div className="container Signup">
      <PageHeader>Create an Account</PageHeader>
      <form onSubmit={handleSubmit} className="max-width-form">
        <table className="form-table">
          <tbody>
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
              <td className="form-label">Password</td>
              <td className="form-field">
                <FormControl
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>
            <tr className="form-field-with-note">
              <td className="form-label">Confirm Password</td>
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
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create Account
        </LoaderButton>
      </form>
    </div>
  );
}
