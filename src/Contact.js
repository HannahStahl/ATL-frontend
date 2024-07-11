import React from "react";
import { PageHeader } from "react-bootstrap";

export default function Contact() {
  return (
    <div className="container">
      <PageHeader>Contact Us</PageHeader>
      <div className="centered-content">
        <p className="contact-intro">Maggie Yanez is the League Administrator.</p>
      </div>
      <div className="centered-content">
        <table>
          <tbody>
            <tr className="contact-item">
              <td><img src="mailbox.svg" alt="Mail" width={40} /></td>
              <td>
                <p className="no-margin-bottom"><b>Austin Tennis League</b><br />P.O. Box 300035<br />Austin, TX 78703</p>
              </td>
            </tr>
            <tr className="contact-item">
              <td><img src="phone.svg" alt="Phone" width={40} /></td>
              <td><p className="no-margin-bottom">(512) 477-7773</p></td>
            </tr>
            <tr className="contact-item">
              <td><img src="email.svg" alt="Email" width={40} /></td>
              <td className="contact-item-text">
                <p className="no-margin-bottom">
                  <a href="mailto:myanez@pharrtennis.com">myanez@pharrtennis.com</a>
                </p>
                <p className="no-margin-bottom contact-item-separator">- OR -</p>
                <p className="no-margin-bottom">
                  <a href="mailto:webmaster@atltennis.org">webmaster@atltennis.org</a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
