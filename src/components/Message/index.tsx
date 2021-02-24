import * as React from 'react';
import { IMessage, EMsgType } from '@src/modules/MessageCenter';
import { useReduxData } from '@src/hooks/useRedux';
import { resolveTimestamp } from '@src/utils';
import { Avatar } from '@src/components/Avatar';

import { Typography, Card } from 'antd';

import './style.less';

const TextMessage: React.FunctionComponent<Partial<IMessage>> = React.memo(
  ({ content }) => {
    return <div className="text-massage">{content}</div>;
  }
);

export const Message: React.FunctionComponent<IMessage> = React.memo(
  ({ msgId, msgType, from, sender, avatarUrl, timestamp, content }) => {
    const [, { uid }] = useReduxData();

    const MessageContent: JSX.Element = React.useMemo(() => {
      let result: JSX.Element = null;
      if (msgType === EMsgType.TEXT) {
        result = <TextMessage content={content} />;
      }
      return result;
    }, [msgId, msgType, content]);

    const messageTime = React.useMemo(() => {
      const { M, D, h, m } = resolveTimestamp(timestamp);
      const { M: _M, D: _D } = resolveTimestamp(Date.now());
      if (M === _M && D === _D) {
        return `${h}:${m}`;
      } else {
        return `${M}月${D}日`;
      }
    }, [timestamp]);

    return (
      <div className={`message-container ${uid === from ? 'rt' : ''}`}>
        <Avatar text={sender} src={avatarUrl} />
        <div className="message-body">
          <div className="message-meta">
            <Typography.Text type="secondary">{sender}</Typography.Text>
            <Typography.Text className="message-timestamp" type="secondary">
              {messageTime}
            </Typography.Text>
          </div>
          {MessageContent}
        </div>
      </div>
    );
  }
);
