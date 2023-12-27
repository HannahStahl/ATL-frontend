import React from "react";
import { HelpBlock } from "react-bootstrap";

export default function PasswordInstructions() {
  return (
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
  );
};
