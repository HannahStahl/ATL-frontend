import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { DateUtils } from '@aws-amplify/core';
import { useHistory } from "react-router-dom";
import { FormControl, PageHeader } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import SignupConfirmation from "./SignupConfirmation";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default function Login() {
  const history = useHistory();
  const { setProfile, userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userIsUnconfirmed, setUserIsUnconfirmed] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(email, password);
      await Auth.currentAuthenticatedUser({
        bypassCache: true
      }).then((user) => {
        DateUtils.setClockOffset(-(user.signInUserSession.clockDrift * 1000));
      });
      setProfile({ email });
      userHasAuthenticated(true);
      history.push("/portal");
    } catch (e) {
      if (e.code === "UserNotConfirmedException") {
        await Auth.resendSignUp(email);
        setUserIsUnconfirmed(true);
      } else {
        onError(e);
        setIsLoading(false);
      }
    }
  }

  return userIsUnconfirmed ? (
    <SignupConfirmation
      email={email}
      password={password}
      onConfirmationSuccess={() => history.push("/portal")}
    />
  ) : (
    <div className="container">
      <PageHeader>Login</PageHeader>
      <form onSubmit={handleSubmit} className="max-width-form">
        <table className="form-table">
          <tbody>
            <tr>
              <td className="form-label">Email</td>
              <td className="form-field">
                <FormControl
                  autoFocus
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
          Log In
        </LoaderButton>
        <div className="link-below-button">
          <a href="/reset-password">Forgot password?</a>
        </div>
        <div className="link-below-button">
          <a href="/signup">Need to create an account?</a>
        </div>
      </form>
    </div>
  );
}
