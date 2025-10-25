const dev = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://74w86cvgdk.execute-api.us-east-1.amazonaws.com/dev/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_T7RNtjSjL",
    APP_CLIENT_ID: "5ngii5r8ostvao26h5olb5t4vd",
    IDENTITY_POOL_ID: "us-east-1:ff559f05-ac79-4fd0-a1d7-19477e39ae78"
  },
  adminEmail: "hls62@cornell.edu"
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
  adminEmail: "atl@atltennis.org"
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  weatherUrl: "https://api.openweathermap.org/data/3.0/onecall?lat=30.27&lon=-97.74&appid=044de181891b481b0eb773aa67c52058&exclude=current,daily,minutely&units=imperial",
  weatherIconBaseUrl: "https://openweathermap.org/img/wn",
  cloudfrontUrl: "https://d3ei5u4i73hour.cloudfront.net",
  ...config
};
