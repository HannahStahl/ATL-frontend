const dev = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://xb2xxard1i.execute-api.us-east-1.amazonaws.com/dev/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_N9by3INq3",
    APP_CLIENT_ID: "1hgb01cpifnluc7h86ji5mqk2",
    IDENTITY_POOL_ID: "us-east-1:1ae64b29-c29b-46ce-b3e3-c94d22ba2f68"
  },
  adminApi: "https://25t0bu2t54.execute-api.us-east-1.amazonaws.com/dev"
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
  },
  adminApi: "https://bemqwompbh.execute-api.us-east-1.amazonaws.com/prod"
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  ...config
};
