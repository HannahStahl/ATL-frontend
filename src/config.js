const dev = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://74w86cvgdk.execute-api.us-east-1.amazonaws.com/dev/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_wrFJ8HV2C",
    APP_CLIENT_ID: "1sf1n0igogsfmdpe3vefgsgf55",
    IDENTITY_POOL_ID: "us-east-1:ff559f05-ac79-4fd0-a1d7-19477e39ae78"
  }
};

const prod = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://pii821jv3a.execute-api.us-east-1.amazonaws.com/prod/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_EuSbjVHFK",
    APP_CLIENT_ID: "604177qindrdteu9ntkfjlnaff",
    IDENTITY_POOL_ID: "us-east-1:09e500f1-5e55-486a-aca4-a083c381d904"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  ...config
};