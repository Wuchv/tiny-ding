import * as React from 'react';
import axios from 'axios';
import { Typography, Progress, message } from 'antd';
import { FileTextTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import { useReduxData } from '@src/hooks/useRedux';
import { useSubject, ofAction } from '@src/hooks/useSubject';
import {
  MessageCenter,
  FILE_HEADER,
} from '@src/modules/RemoteGlobal';
import { calcFileSize, resolveTimestamp } from '@src/utils';
import {
  ossHost,
  ossOptions,
  policyBase64,
  signature,
} from '../../../../ossConfig';

import './style.less';

export const FileMessage: React.FC<Partial<IMessage>> = React.memo(
  ({ msgId, content, fromId, attachment }) => {
    const [, { uid, currentTo }] = useReduxData();
    const [globalSubject$, RxEvent] = useSubject();
    const [percent, setPercent] = React.useState<number>(1);
    const [isDownload, setIsDownload] = React.useState<boolean>(false);
    const [isUploaded, setIsUploaded] = React.useState<boolean>(false);
    const [isUploadedSuccess, setIsUploadedSuccess] =
      React.useState<boolean>(true);

    const axiosSource = React.useMemo(() => axios.CancelToken.source(), []);

    const createUploadFetch = React.useCallback(
      () =>
        axios.create({
          headers: { 'Content-Type': FILE_HEADER },
          baseURL: ossHost,
          timeout: 0,
          cancelToken: axiosSource.token,
          onUploadProgress: (progressEvent) => {
            let percent =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            if (percent === 100) {
              setPercent(0);
              setIsUploaded(true);
            } else {
              setPercent(percent);
            }
          },
        }),
      []
    );

    const getExtraData = React.useCallback((file: File) => {
      const extraData = new FormData();
      const { Y, M, D } = resolveTimestamp(Date.now());
      extraData.append('OSSAccessKeyId', ossOptions.accessKeyId);
      extraData.append('policy', policyBase64);
      extraData.append('Signature', signature);
      extraData.append('key', `${Y}${M}${D}/${uid}:${currentTo}/${file.name}`);
      extraData.append('success_action_status', '200');
      extraData.append('file', file);
      return extraData;
    }, []);

    React.useEffect(() => {
      if (!content || !attachment.url) {
        const sub = globalSubject$
          .pipe(ofAction(RxEvent.UPLOAD_FILE, msgId))
          .subscribe(async (next: Rxjs.INext) => {
            const file = next.payload;
            if (file) {
              const extraData = getExtraData(file);
              const downloadUrl = `${ossHost}/${extraData.get('key')}`;
              let res = null;
              try {
                res = await createUploadFetch().post(null, extraData);
              } catch (e) {
                message.error(e.message || String(e));
              }

              if (res?.headers?.etag) {
                const msg = await MessageCenter.updateMsg({
                  msgId,
                  content: downloadUrl,
                  attachment: { url: downloadUrl },
                });
                MessageCenter.sendMsg(msg as IMessage);
              } else {
                setIsUploadedSuccess(false);
                if (res) {
                  await message.error(String(res), 1.5);
                }
                MessageCenter.deleteMsg(msgId);
              }
            }
          });

        globalSubject$.next({
          action: RxEvent.GET_FILE,
          payload: msgId,
        });

        return () => sub.unsubscribe();
      } else {
        setIsUploaded(true);
        if (fromId !== uid) {
          setIsDownload(true);
        }
      }
    }, [content, attachment, fromId, uid, msgId]);

    const downloadFile = React.useCallback(async () => {
      if (!isDownload) return;
      const res = await axios.get(content, {
        responseType: 'blob',
      });
      const { data, headers } = res;
      const blob = new Blob([data], { type: headers['content-type'] });
      let dom = document.createElement('a');
      let url = window.URL.createObjectURL(blob);
      dom.href = url;
      dom.download = decodeURI(attachment.name);
      dom.style.display = 'none';
      document.body.appendChild(dom);
      dom.click();
      dom.parentNode.removeChild(dom);
      window.URL.revokeObjectURL(url);
    }, [content, isDownload]);

    return (
      <div className="file-message" onClick={downloadFile}>
        <FileTextTwoTone twoToneColor="#806d9e" />
        <div className="file-info">
          <Typography.Text ellipsis={{ tooltip: attachment?.name }}>
            {attachment?.name}
          </Typography.Text>
          {!!percent && !isUploaded && (
            <div className="upload-progress">
              <Progress
                percent={percent}
                showInfo={false}
                strokeWidth={6}
                strokeLinecap={'round'}
                strokeColor={{ from: '#806d9e', to: '#35c7fd' }}
              />
              <CloseCircleOutlined
                onClick={() => axiosSource.cancel('已取消上传')}
              />
            </div>
          )}
          {isUploaded && (
            <div className="file-info-uploaded">
              <Typography.Text type="secondary">
                {calcFileSize(attachment.size)}
              </Typography.Text>
              {isDownload ? (
                <Typography.Text type="secondary">点击下载</Typography.Text>
              ) : isUploadedSuccess ? (
                <Typography.Text type="success">已上传</Typography.Text>
              ) : (
                <Typography.Text type="danger">上传失败</Typography.Text>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
