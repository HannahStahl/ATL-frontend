import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { PageHeader, FormControl, HelpBlock } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import { onError } from "./libs/errorLib";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await Auth.forgotPassword(email);
      setCodeSent(true);
    } catch (error) {
      onError(error);
    }
    setSubmitting(false);
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    if (password !== confirmedPassword) {
      onError("Passwords do not match");
    } else {
      try {
        await Auth.forgotPasswordSubmit(email, code, password);
        setPasswordReset(true);
      } catch (error) {
        onError(error);
      }
    }
    setSubmitting(false);
  }

  return (
    <div className="container">
      <PageHeader>Reset Password</PageHeader>
      {passwordReset ? (
        <div className="reset-password-success">
          <p>
            <i className="fas fa-check updated-password" />
            Your password has been reset.
          </p>
          <p>
            <a href="/login">
              Click here to login with your new credentials.
            </a>
          </p>
        </div>
      ) : (
        codeSent ? (
          <form onSubmit={handleConfirmationSubmit} className="forgot-password-form">
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
                      onChange={(e) => setCode(e.target.value)}
                      value={code}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <HelpBlock className="no-margin-bottom">Enter the code that was emailed to you.</HelpBlock>
                  </td>
                </tr>
                <tr className="form-field-with-note">
                  <td className="form-label">New Password</td>
                  <td className="form-field">
                    <FormControl
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <HelpBlock className="no-margin-bottom">
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
                  <td className="form-label">Confirm New Password</td>
                  <td className="form-field">
                    <FormControl
                      type="password"
                      onChange={(e) => setConfirmedPassword(e.target.value)}
                      value={confirmedPassword}
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
              isLoading={submitting}
              disabled={code.length === 0 || password.length === 0 || confirmedPassword.length === 0}
            >
              Submit
            </LoaderButton>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="max-width-form">
            <table className="form-table">
              <tbody>
                <tr>
                  <td className="form-label">Email</td>
                  <td className="form-field">
                    <FormControl
                      autoFocus
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
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
              isLoading={submitting}
              disabled={email.length === 0}
            >
              Submit
            </LoaderButton>
          </form>
        )
      )}
    </div>
  );
}
