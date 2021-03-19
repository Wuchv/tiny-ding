import * as React from 'react';
import { Input, Button } from 'antd';
import MessageCenter, { EMsgType } from '@src/modules/MessageCenter';

import { useReduxData } from '@src/hooks/useRedux';

import './style.less';

// const fs = require('fs');

interface IInputField {}

export const InputField: React.FunctionComponent<IInputField> = React.memo(
  () => {
    const { uid, currentTo, nickname, avatarUrl } = useReduxData()[1];
    const [textAreaContent, setTextAreaContent] = React.useState<string>('');

    const fileDrop = React.useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        console.log(files);
      }
    }, []);

    const sendMessage = React.useCallback(() => {
      MessageCenter.sendMsg({
        fromId: uid,
        toId: currentTo,
        sender: nickname || uid,
        avatarUrl,
        msgType: EMsgType.TEXT,
        content: textAreaContent,
      });
      setTextAreaContent('');
    }, [textAreaContent]);

    return (
      <div className="input-field-container">
        <div className="tool-container">工具栏</div>
        <Input.TextArea
          className="textarea"
          placeholder="请输入消息"
          autoSize={{ minRows: 3, maxRows: 3 }}
          value={textAreaContent}
          onChange={(e) => setTextAreaContent(e.currentTarget.value)}
          onDrop={fileDrop}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        <div className="submit-container">
          <Button
            type="primary"
            disabled={!textAreaContent}
            onClick={() => sendMessage()}
          >
            发送
          </Button>
        </div>
      </div>
    );
  }
);
