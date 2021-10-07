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

// TODO: Check middleware with mock user
