import * as React from 'react';
import { Input, Button, message } from 'antd';
import MessageCenter, { EMsgType } from '@src/modules/MessageCenter';
import FileUploader from '@src/modules/FileUploader';
import { useReduxData } from '@src/hooks/useRedux';

import './style.less';

// const fs = require('fs');

interface IInputField {}

export const InputField: React.FC<IInputField> = React.memo(
  () => {
    const { uid, currentTo, nickname, avatarUrl } = useReduxData()[1];
    const [textAreaContent, setTextAreaContent] = React.useState<string>('');

    const fileDrop = React.useCallback(async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file: File = files[0];
        const [err, result] = await FileUploader.putObject(
          file,
          `${uid}:${currentTo}:${Date.now()}`
        );
        if (err) {
          message.error(err);
          return;
        }
        if (file.type.includes('image')) {
          sendMessage(result.url, EMsgType.IMAGE);
        } else {
          sendMessage(result.name, EMsgType.FILE, result);
        }
      }
    }, []);

    const sendMessage = React.useCallback(
      (
        content: string,
        msgType: EMsgType = EMsgType.TEXT,
        attachment?: IAttachment
      ) => {
        MessageCenter.sendMsg({
          fromId: uid,
          toId: currentTo,
          sender: nickname || uid,
          avatarUrl,
          msgType,
          content,
          attachment,
        });
      },
      []
    );

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
            onClick={() => {
              sendMessage(textAreaContent);
              setTextAreaContent('');
            }}
          >
            发送
          </Button>
        </div>
      </div>
    );
  }
);
