import CognitoUser from './CognitoUser';

const cognitoMiddleware = (req, res, next) => {
  const sub = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1];
  const username = '1234566';

  req.user = new CognitoUser({ sub, username });

  next();
};

export default cognitoMiddleware;
