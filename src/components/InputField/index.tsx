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
    const InputFieldRef: React.RefObject<HTMLDivElement> = React.useRef(null);
    const [textAreaContent, setTextAreaContent] = React.useState<string>('');

    React.useEffect(() => {
      if (InputFieldRef.current) {
        const dragHandler = (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            console.log(files);
          }
        };
        InputFieldRef.current.addEventListener('drop', dragHandler);
        InputFieldRef.current.addEventListener('dragover', (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
        });

        return () =>
          InputFieldRef.current.removeEventListener('drop', dragHandler);
      }
    }, [InputFieldRef.current]);

    const sendMessage = React.useCallback(() => {
      MessageCenter.sendMsg({
        from: uid,
        to: currentTo,
        sender: nickname,
        avatarUrl,
        msgType: EMsgType.TEXT,
        content: textAreaContent,
      });
      setTextAreaContent('');
    }, [textAreaContent]);

    return (
      <div ref={InputFieldRef} className="input-field-container">
        <div className="tool-container">工具栏</div>
        <Input.TextArea
          className="textarea"
          placeholder="请输入消息"
          autoSize={{ minRows: 3, maxRows: 3 }}
          value={textAreaContent}
          onChange={(e) => setTextAreaContent(e.currentTarget.value)}
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
