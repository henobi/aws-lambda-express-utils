import { cognitoMiddleware } from '../cognito';
import { cors } from '../cors';

import * as indexExport from '../index';

test('Check exports', () => {
  expect(indexExport.cors).toBe(cors);
  expect(indexExport.cognitoMiddleware).toBe(cognitoMiddleware);
});
