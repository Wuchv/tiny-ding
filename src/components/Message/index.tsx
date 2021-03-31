import * as React from 'react';
import { Subscription } from 'rxjs';
import { EMsgType } from '@src/modules/MessageCenter';
import { useReduxData } from '@src/hooks/useRedux';
import { resolveTimestamp } from '@src/utils';
import { imageToBase64 } from '@src/modules/RxSubject';
import { Avatar } from '@src/components/Avatar';
import { errorImg } from '@src/public/base64Img';

import { Typography, Image as AntdImage } from 'antd';

import './style.less';

const TextMessage: React.FC<Partial<IMessage>> = React.memo(({ content }) => {
  return <Typography.Text className="text-massage">{content}</Typography.Text>;
});

const ImageMessage: React.FC<Partial<IMessage>> = React.memo(
  ({ content, attachment }) => {
    const [imgBase64, setImgBase64] = React.useState<string>('');
    const [width, setWidth] = React.useState<number>(100);

    React.useEffect(() => {
      let imgSub: Subscription = null;
      if (attachment.cache) {
        const img: HTMLImageElement = new Image();
        img.src = attachment.cache;
        img.onload = () => {
          if (img.width && img.height) {
            const aspectRatio = img.width / img.height;
            setWidth(351 * (aspectRatio > 1 ? 1 : aspectRatio));
            setImgBase64(attachment.cache);
          }
        };
        img.onerror = () => {
          //TODO: cache异常处理
        };
      } else {
        const img$ = imageToBase64(content);
        imgSub = img$.subscribe(({ payload }) => {
          const { base64, width, height } = payload;
          if (width && height) {
            const aspectRatio = width / height;
            setWidth(351 * (aspectRatio > 1 ? 1 : aspectRatio));
            setImgBase64(base64);
          }
        });
      }
      return () => {
        imgSub && imgSub.unsubscribe();
      };
    }, [content]);

    return (
      <AntdImage
        className="image-message"
        width={width}
        src={imgBase64}
        fallback={errorImg}
      />
    );
  }
);

const FileMessage: React.FC<Partial<IMessage>> = React.memo(({ content }) => {
  return <div>file:{content}</div>;
});

export const Message: React.FC<IMessage> = React.memo((msg) => {
  const {
    msgId,
    msgType,
    fromId,
    sender,
    avatarUrl,
    timestamp,
    content,
    attachment,
  } = msg;
  const [, { uid }] = useReduxData();

  const MessageContent: JSX.Element = React.useMemo(() => {
    let result: JSX.Element = null;
    if (msgType === EMsgType.TEXT) {
      result = <TextMessage content={content} />;
    } else if (msgType === EMsgType.IMAGE) {
      result = <ImageMessage content={content} attachment={attachment} />;
    } else if (msgType === EMsgType.FILE) {
      result = <FileMessage content={content} />;
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
});
