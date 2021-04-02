import * as React from 'react';
import { Input, Button, message } from 'antd';
import MessageCenter, { EMsgType } from '@src/modules/MessageCenter';
import FileUploader from '@src/modules/FileUploader';
import { useReduxData } from '@src/hooks/useRedux';
import { fileToBase64 } from '@src/modules/FileTransform';

import { Toolbar } from '@src/components/Toolbar';

import './style.less';

interface IInputField {}

export const InputField: React.FC<IInputField> = React.memo(() => {
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
        fileToBase64(file, (payload: string) =>
          sendMessage(result.url, EMsgType.IMAGE, result, {
            name: file.name,
            type: file.type,
            data: payload,
          })
        );
      } else {
        sendMessage(result.name, EMsgType.FILE, result);
      }
    }
  }, []);

  const sendMessage = React.useCallback(
    (
      content: string,
      msgType: EMsgType = EMsgType.TEXT,
      attachment: IAttachment = null,
      file: Pick<File, 'name' | 'type'> & { data: any } = null
    ) => {
      MessageCenter.sendMsg(
        {
          fromId: uid,
          toId: currentTo,
          sender: nickname || uid,
          avatarUrl,
          msgType,
          content,
          attachment,
        },
        file
      );
    },
    []
  );

  return (
    <div className="input-field-container">
      <Toolbar sendMessage={sendMessage} uid={uid} currentTo={currentTo} />
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
});
