import Mock from 'mockjs';

export const LoginMock = () => {
  Mock.mock('api/login', 'get', {
    status: 200,
    data: {
      err: '',
      uid: '123456',
      nickname: 'aaaa',
    },
  });
};
