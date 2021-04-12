import * as React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../src/pages/Login';

describe('Login Test', () => {
  const container = shallow(<Login />);

  it('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });
});
