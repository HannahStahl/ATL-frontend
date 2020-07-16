import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormControl, PageHeader } from "react-bootstrap";
import { LoaderButton } from "atl-components";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <PageHeader>Login</PageHeader>
      <form onSubmit={handleSubmit}>
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
          <a href="/signup">Need to create an account?</a>
        </div>
      </form>
    </div>
  );
}
