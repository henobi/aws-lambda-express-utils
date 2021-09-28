# WORK IN PROGRESS !

# AWS Lambda Express Utils

This package is a collection of useful and well-tested wrappers to enhance the AWS Lambda coding experience and code quality.

### CORS

```javascript
// without this package
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// with this package
import { cors } from 'aws-lambda-express-utils';
app.use(cors());
```

### Access Cognito user

#### Configuration

Please make sure the User Pool ID is set to the environment variable `AUTH_USERPOOLID` in the lambda so this plugin is able to access it via `process.env.AUTH_USERPOOLID`.

Policies!!!

#### Usage:

```javascript
import { cognitoMiddleware } from 'aws-lambda-express-utils';

app.use(cognitoMiddleware);

// Or if you would like to apply the middleware only to some routes
// app.use('/hello-user', applyCognitoUser);

app.get('/hello-user', async (req, res) => {
  req.user.getUsername();
  req.user.getUserSub();
  await req.user.getAttribute('email'); // foo@bar.com
  await req.user.getAttribute('given_name'); // Susan
  await req.user.getGroups(); // e.g. [{GroupName: 'moderator', ...}]
});
```
