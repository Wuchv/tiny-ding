import * as React from 'react';
import { Input, Button, message } from 'antd';
import imgzip from 'imgzip';
import { MessageCenter, EMsgType } from '@src/modules/RemoteGlobal';
import FileUploader from '@src/modules/FileUploader';
import { useReduxData } from '@src/hooks/useRedux';
import { fileToBase64 } from '@src/modules/FileTransform';
import { useUploadFile } from '@src/hooks/useUploadFile';

import { Toolbar } from '@src/components/Toolbar';

import './style.less';

export const InputField: React.FC<unknown> = React.memo(() => {
  const { uid, currentTo, nickname, avatarUrl, currentCid } = useReduxData()[1];
  const [textAreaContent, setTextAreaContent] = React.useState<string>('');
  const [, setFile] = useUploadFile();

  const fileDrop = React.useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // let compress = new imgzip({ quality: 0.5 });
      // compress.photoCompress(files[0], () => {});
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
          sendMessage(
            result.url,
            EMsgType.IMAGE,
            result,
            {
              name: file.name,
              type: file.type,
              data: payload,
            },
            true
          )
        );
      } else {
        setFile(file);
        sendMessage(null, EMsgType.FILE, {
          url: null,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    }
  }, []);

  const sendMessage = React.useCallback(
    async (
      content: string,
      msgType: EMsgType = EMsgType.TEXT,
      attachment: IAttachment = null,
      file: Pick<File, 'name' | 'type'> & { data?: any } = null,
      iscCache: boolean = false
    ) => {
      const msg = await MessageCenter.insertMsg(
        {
          fromId: uid,
          toId: currentTo,
          sender: nickname || uid,
          avatarUrl,
          msgType,
          content,
          attachment,
        },
        file,
        iscCache
      );
      //FILE类型文件上传文件后再发出msg
      if (msg.msgType !== EMsgType.FILE) {
        MessageCenter.sendMsg(msg);
      }
    },
    [uid, currentTo, nickname, avatarUrl]
  );

  return (
    <div className="input-field-container">
      <Toolbar sendMessage={sendMessage} uid={uid} currentTo={currentTo} />
      <Input.TextArea
        className="textarea"
        placeholder="请输入消息"
        autoSize={{ minRows: 3, maxRows: 3 }}
        value={textAreaContent}
        disabled={!currentCid}
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
