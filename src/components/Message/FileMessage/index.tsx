import * as React from 'react';
import moment from 'moment';
import { take } from 'rxjs/operators';
import { Typography, Progress, message } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';
import { useReduxData } from '@src/hooks/useRedux';
import { useSubject, ofAction } from '@src/hooks/useSubject';
import Http, { FILE_HEADER } from '@src/modules/Http';
import {
  ossHost,
  ossOptions,
  policyBase64,
  signature,
} from '../../../../ossConfig';

import './style.less';

export const FileMessage: React.FC<Partial<IMessage>> = React.memo(
  ({ content, fromId, attachment }) => {
    const [, { uid, currentTo }] = useReduxData();
    const [globalSubject$, RxEvent] = useSubject();
    const [percent, setPercent] = React.useState<number>(1);
    const [isDownload, setIsDownload] = React.useState<boolean>(false);
    const [isUploaded, setIsUploaded] = React.useState<boolean>(false);

    const uploadFetch = React.useMemo(
      () =>
        new Http({
          headers: { 'Content-Type': FILE_HEADER },
          baseURL: ossHost,
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
      extraData.append('OSSAccessKeyId', ossOptions.accessKeyId);
      extraData.append('policy', policyBase64);
      extraData.append('signature', signature);
      extraData.append(
        'key',
        `${moment().format('YYYYMMDD')}/${uid}:${currentTo}/${file.name}`
      );
      extraData.append('success_action_status', '200');
      extraData.append('file', file);
      return extraData;
    }, []);

    React.useEffect(() => {
      if (!content || !attachment.url) {
        globalSubject$.next({ action: RxEvent.GET_FILE_FROM_TOOLBAR });

        const sub = globalSubject$
          .pipe(ofAction(RxEvent.UPLOAD_FILE_FROM_TOOLBAR), take(1))
          .subscribe((next: Rxjs.INext) => {
            const file = next.payload;
            if (file) {
              const extraData = getExtraData(file);
              const downloadUrl = `${ossHost}/${extraData.get('key')}`;
              uploadFetch
                .post(null, extraData)
                .then(() => {
                  console.log(downloadUrl);
                })
                .catch((e) => message.error(e));
              //TODO:更新rxdb
            }
          });

        return () => sub.unsubscribe();
      } else {
        if (fromId === uid) {
          setIsUploaded(true);
        }
      }
    }, [content, attachment, fromId, uid, fetch]);

    return (
      <div className="file-message">
        <FileProtectOutlined />
        <div className="file-info">
          <Typography.Text ellipsis={{ tooltip: attachment?.name }}>
            {attachment?.name}
          </Typography.Text>
          {!!percent && <Progress percent={percent} showInfo={false} />}
          {!!isUploaded && <Typography.Text>已上传</Typography.Text>}
        </div>
      </div>
    );
  }
);
