import React from 'react';
import ReactDOM from 'react-dom';
import { Amplify, Auth } from 'aws-amplify';
import { DateUtils } from '@aws-amplify/core';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import config from './config';
import * as serviceWorker from './serviceWorker';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "atl-backend",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

Auth.currentAuthenticatedUser({
  bypassCache: true
}).then((user) => {
  DateUtils.setClockOffset(-(user.signInUserSession.clockDrift * 1000));
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
