import * as React from 'react';
import { EMsgType } from '@src/modules/MessageCenter';
import { useReduxData } from '@src/hooks/useRedux';
import { resolveTimestamp } from '@src/utils';
import { Avatar } from '@src/components/Avatar';
import { errorImg } from '../../public/base64Img';

import { Typography, Image as AntdImage } from 'antd';

import './style.less';

const TextMessage: React.FunctionComponent<Partial<IMessage>> = React.memo(
  ({ content }) => {
    return (
      <Typography.Text className="text-massage">{content}</Typography.Text>
    );
  }
);

const ImageMessage: React.FunctionComponent<Partial<IMessage>> = React.memo(
  ({ content }) => {
    //TODO:会实例化两个image对象，待优化；可能获取不到宽高，image图片加载是异步的
    const img: HTMLImageElement = new Image();
    img.src = content;
    let aspectRatio = 1;
    let width = 100;
    if (img.width != 0 && img.height != 0) {
      aspectRatio = img.width / img.height;
      width = 351 * (aspectRatio > 1 ? 1 : aspectRatio);
    }
    return (
      <AntdImage
        className="image-message"
        width={width}
        src={content}
        fallback={errorImg}
      />
    );
  }
);

export const Message: React.FunctionComponent<IMessage> = React.memo(
  ({ msgId, msgType, fromId, sender, avatarUrl, timestamp, content }) => {
    const [, { uid }] = useReduxData();

    const MessageContent: JSX.Element = React.useMemo(() => {
      let result: JSX.Element = null;
      if (msgType === EMsgType.TEXT) {
        result = <TextMessage content={content} />;
      } else if (msgType === EMsgType.IMAGE) {
        result = <ImageMessage content={content} />;
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
      <div className={`message-container ${uid === fromId ? 'rt' : ''}`}>
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
