import Mock from 'mockjs';

export const LoginMock = () => {
  Mock.mock('api/login', 'get', {
    code: 200,
    test: 1,
  });
};
