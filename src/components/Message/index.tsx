import * as React from 'react';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Typography, Image as AntdImage } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';
import { EMsgType } from '@src/modules/MessageCenter';
import { useReduxData } from '@src/hooks/useRedux';
import { resolveTimestamp } from '@src/utils';
import { imageToBase64 } from '@src/modules/FileTransform';
import { Avatar } from '@src/components/Avatar';
import { errorImg } from '@src/public/base64Img';
import { useSubject } from '@src/hooks/useSubject';
import {
  ossHost,
  ossOptions,
  policyBase64,
  signature,
} from '../../../ossConfig';

import { AudioControl } from '../Toolbar/AudioModal';

import './style.less';

const TextMessage: React.FC<Partial<IMessage>> = React.memo(({ content }) => {
  return <Typography.Text className="text-massage">{content}</Typography.Text>;
});

const ImageMessage: React.FC<Partial<IMessage>> = React.memo(
  ({ content, attachment }) => {
    const [imgBase64, setImgBase64] = React.useState<string>('');
    const [width, setWidth] = React.useState<number>(100);
    const [globalSubject$, ERxEvent] = useSubject();

    React.useEffect(() => {
      let cacheErrorSub: Subscription = null;
      if (attachment.cache) {
        cacheErrorSub = globalSubject$
          .pipe(
            filter((next) => next.action === ERxEvent.READ_IMAGE_CACHE_ERROR)
          )
          .subscribe(() => readImgFromUrl());
        readCache();
      } else {
        readImgFromUrl();
      }
      return () => {
        cacheErrorSub && cacheErrorSub.unsubscribe();
      };
    }, [content]);

    const readCache = React.useCallback(async () => {
      const img: HTMLImageElement = new Image();
      const base64Cache = await attachment.cache.getData();
      img.src = base64Cache;
      img.onload = () => {
        if (img.width && img.height) {
          const aspectRatio = img.width / img.height;
          setWidth(351 * (aspectRatio > 1 ? 1 : aspectRatio));
          setImgBase64(base64Cache);
        }
      };
      img.onerror = () => {
        globalSubject$.next({ action: ERxEvent.READ_IMAGE_CACHE_ERROR });
        //TODO:缓存失效后重新缓存
      };
    }, [attachment]);

    const readImgFromUrl = React.useCallback(() => {
      imageToBase64(content, (payload: any) => {
        const { base64, width, height } = payload;
        if (width && height) {
          const aspectRatio = width / height;
          setWidth(351 * (aspectRatio > 1 ? 1 : aspectRatio));
          setImgBase64(base64);
        }
      });
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

const FileMessage: React.FC<Partial<IMessage>> = React.memo(
  ({ content, attachment }) => {
    const [, { uid, currentTo }] = useReduxData();
    const [globalSubject$, ERxEvent] = useSubject();
    const [isDownload, setIsDownload] = React.useState<boolean>(false);
    const [isUpload, setIsUpload] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (!content || !attachment.url) {
        globalSubject$.next({ action: ERxEvent.GET_FILE_FROM_TOOLBAR });

        const sub = globalSubject$
          .pipe(
            filter((next) => next.action === ERxEvent.UPLOAD_FILE_FROM_TOOLBAR)
          )
          .subscribe(console.log);

        return () => sub.unsubscribe();
      } else {
        setIsUpload(true);
      }
    }, []);

    //TODO:axios上传文件并获取进度
    const getExtraData = React.useCallback(
      (file: File) => ({
        key: `${moment().format('YYYYMMDD')}/${uid}:${currentTo}/${file.name}`,
        policy: policyBase64,
        OSSAccessKeyId: ossOptions.accessKeyId,
        success_action_status: 200,
        signature,
      }),
      []
    );

    return (
      <div className="file-message">
        <FileProtectOutlined />
        <div className="file-info">
          <Typography.Text ellipsis={{ tooltip: attachment?.name }}>
            {attachment?.name}
          </Typography.Text>
        </div>
      </div>
    );
  }
);

const AudioMessage: React.FC<Partial<IMessage>> = React.memo(
  ({ content, attachment }) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);

    React.useEffect(() => {
      if (audioRef.current) {
        if (attachment.cache) {
          readCache();
        } else {
          audioRef.current.src = content;
        }
      }
    }, [audioRef]);

    const readCache = React.useCallback(async () => {
      const bufferCache = await attachment.cache.getData();
      audioRef.current.src = bufferCache;
      //TODO:缓存失效后重新缓存
    }, [attachment]);

    return (
      <div className="audio-message">
        <audio ref={audioRef} />
        <AudioControl isShow={true} audioRef={audioRef} />
      </div>
    );
  }
);

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
      result = <FileMessage content={content} attachment={attachment} />;
    } else if (msgType === EMsgType.AUDIO) {
      result = <AudioMessage content={content} attachment={attachment} />;
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
