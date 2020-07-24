import React from "react";
import { PageHeader } from "react-bootstrap";

export default function Payment() {
  return (
    <div className="container">
      <PageHeader>Payment</PageHeader>
      <div className="centered-content">
        <div>
          <h3>Option 1: Pay by check</h3>
          <p className="no-margin-bottom">Please write a check for <b>$200</b> if paying the full amount, or <b>$100</b> if paying half.</p>
          <p>All checks must be made out to <b>Austin Tennis League</b>.</p>
          <p className="no-margin-bottom">Checks can be dropped off at Pharr Tennis Center or mailed to the following address:</p>
          <p>Austin Tennis League<br />PO Box 300035<br />Austin, TX 78703</p>
          <h3>Option 2: Pay with PayPal</h3>
          <p className="no-margin-bottom">You can pay <b>$206.28</b> via PayPal below, or <b>$103.30</b> if only paying half.</p>
          <p>Note that you do not have to have a PayPal account to use PayPal. All you need is a credit card.</p>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="hannahstahl14@gmail.com" />
            <input type="hidden" name="lc" value="US" />
            <input type="hidden" name="item_name" value="Fee Payment" />
            <input type="hidden" name="button_subtype" value="services" />
            <input type="hidden" name="no_note" value="0" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="bn" value="PP-BuyNowBF:btn_paynowCC_LG.gif:NonHostedGuest" />
            <table className="paypal-table">
              <tbody>
                <tr>
                  <td>
                    <input type="hidden" name="on0" value="Please make your payment via PayPal below." />
                  </td>
                </tr>
                <tr>
                  <td>
                    <select name="os0">
                      <option value="Full Payment:">Full Payment: $206.28 USD</option>
                      <option value="Half Payment:">Half Payment: $103.30 USD</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="paypal-form-label">
                    <input type="hidden" name="on1" value="Team Name:" />
                    Team Name:
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="text" name="os1" maxLength="200" />
                  </td>
                </tr>
                <tr>
                  <td className="paypal-form-label">
                    <input type="hidden" name="on2" value="Your Name:" />
                    Your Name:
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="text" name="os2" maxLength="200" />
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="hidden" name="option_select0" value="Full Payment:" />
            <input type="hidden" name="option_amount0" value="206.28" />
            <input type="hidden" name="option_select1" value="Half Payment:" />
            <input type="hidden" name="option_amount1" value="103.30" />
            <input type="hidden" name="option_index" value="0" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_paynowCC_LG.gif" border="0" name="submit" alt="Pay Now" />
            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>
      </div>
    </div>
  );
}
