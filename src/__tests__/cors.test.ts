import { cors } from '../cors';

test('Check cors', () => {
  const mycors = cors();
  expect(mycors).toBeTruthy();

  const next = jest.fn();
  const req = jest.fn();
  const res = { header: jest.fn() };

  mycors(req, res, next);

  expect(req).toBeCalledTimes(0);
  expect(next).toBeCalledTimes(1);

  expect(res.header).toBeCalledTimes(2);
  expect(res.header).toBeCalledWith('Access-Control-Allow-Origin', '*');
  expect(res.header).toBeCalledWith('Access-Control-Allow-Headers', '*');
});
