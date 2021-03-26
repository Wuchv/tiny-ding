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
    const [imgBase64, setImgBase64] = React.useState<string>('');
    const [width, setWidth] = React.useState<number>(100);

    React.useEffect(() => {
      //获取到image的宽高，然后转成base64，防止请求两次图片
      let canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img: HTMLImageElement = new Image();
      img.src = content;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const URLData = canvas.toDataURL('image/png');
        if (img.width && img.height) {
          const aspectRatio = img.width / img.height;
          setWidth(351 * (aspectRatio > 1 ? 1 : aspectRatio));
          setImgBase64(URLData);
        }
        canvas = null;
      };
      img.onerror = () => {
        canvas = null;
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
