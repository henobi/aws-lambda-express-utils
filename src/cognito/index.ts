import CognitoUser from './CognitoUser';

type CognitoMiddlewareParams = {
  userpoolId?: string;
};

export const cognitoMiddleware =
  ({ userpoolId = process.env.AUTH_USERPOOLID }: CognitoMiddlewareParams) =>
  (req: any, res: any, next: any) => {
    // Fetch user ids
    const sub =
      req.apiGateway.event.requestContext?.authorizer?.claims?.sub ??
      req.apiGateway.event.requestContext?.identity?.cognitoAuthenticationProvider?.split(':CognitoSignIn:')[1];

    const username = req.apiGateway.event.requestContext?.authorizer?.claims?.username;

    // No userpool found
    if (!userpoolId) {
      throw new Error('Environment variable AUTH_USERPOOLID is not set.');
    }

    // Using the cognito identity
    if (sub) {
      req.user = new CognitoUser({ sub, username, userpoolId });
    }

    // Not authenticated
    else {
      res.status(403).json({ error: 'Unauthenticated' });
    }

    next();
  };
