const dev = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://25t0bu2t54.execute-api.us-east-1.amazonaws.com/dev/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_LFCFSmln2",
    APP_CLIENT_ID: "6os8angd0et8eudg7hqpfbqrfg",
    IDENTITY_POOL_ID: "us-east-1:f572a19a-4feb-407a-ae2e-d2eb4e7d087f"
  },
  captainApi: "https://xb2xxard1i.execute-api.us-east-1.amazonaws.com/dev"
};

const prod = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://bemqwompbh.execute-api.us-east-1.amazonaws.com/prod/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_zVFk26yD6",
    APP_CLIENT_ID: "54dm65q1o5oa6j5okevit0p6nv",
    IDENTITY_POOL_ID: "us-east-1:f79f015c-e8f1-47bf-a4c1-7d113ec257d7"
  },
  captainApi: "https://pii821jv3a.execute-api.us-east-1.amazonaws.com/prod"
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  ...config
};
