import { cognitoMiddleware } from '../index';

test('Check cognito middleware with no user', () => {
  const myCognitoMiddleware = cognitoMiddleware({ userpoolId: 'abc12345' });
  expect(myCognitoMiddleware).toBeTruthy();

  const next = jest.fn();
  const req = {
    apiGateway: {
      event: {
        requestContext: {},
      },
    },
    user: undefined,
  };

  const res = { header: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };

  myCognitoMiddleware(req, res, next);
  expect(req.user).toBeUndefined();
  expect(res.status).toBeCalledWith(403);
  expect(next).toBeCalledTimes(0);
});

test('Check cognito middleware with user 1', () => {
  const myCognitoMiddleware = cognitoMiddleware({ userpoolId: 'abc12345' });
  expect(myCognitoMiddleware).toBeTruthy();

  const next = jest.fn();
  const req = {
    apiGateway: {
      event: {
        requestContext: {
          authorizer: {
            claims: {
              sub: '134',
            },
          },
        },
      },
    },
    user: undefined,
  };

  const res = { header: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };

  myCognitoMiddleware(req, res, next);
  expect(req.user).toBeTruthy();
  expect(res.status).toBeCalledTimes(0);
  expect(next).toBeCalledTimes(1);
});

test('Check cognito middleware with user 2', () => {
  const myCognitoMiddleware = cognitoMiddleware({ userpoolId: 'abc12345' });
  expect(myCognitoMiddleware).toBeTruthy();

  const next = jest.fn();

  const req = {
    apiGateway: {
      event: {
        requestContext: {
          identity: {
            cognitoAuthenticationProvider: ':CognitoSignIn:abc12345',
          },
        },
      },
    },
    user: undefined,
  };

  const res = { header: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };

  myCognitoMiddleware(req, res, next);
  expect(req.user).toBeTruthy();
  expect(res.status).toBeCalledTimes(0);
  expect(next).toBeCalledTimes(1);
});
