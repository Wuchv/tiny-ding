import * as React from 'react';
import { Input } from 'antd';

import './style.less';

interface IInputField {}

export const InputField: React.FunctionComponent<IInputField> = React.memo(
  () => {
    return (
      <div className="input-field-container">
        <div>工具栏</div>
        <Input.TextArea
          className="textarea"
          placeholder="请输入消息"
          autoSize={{ minRows: 3, maxRows: 3 }}
        />
      </div>
    );
  }
);
