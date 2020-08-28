import React from 'react';

const Footer = () => (
  <div className="footer">
    <p>
      {`© Austin Tennis League, ${(new Date()).getFullYear()}. All Rights Reserved.`}
    </p>
    <a href="https://websitesbyhannah.com" target="_blank" rel="noopener noreferrer">
      <p>Websites By Hannah</p>
    </a>
  </div>
);

export default Footer;
