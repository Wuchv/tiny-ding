import * as React from 'react';
import { Upload } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useReduxData } from '@src/hooks/useRedux';
import moment from 'moment';
import {
  ossHost,
  ossOptions,
  policyBase64,
  signature,
} from '../../../../ossConfig';

import './style.less';

interface IUpload {}

export const Uploader: React.FunctionComponent<IUpload> = React.memo(() => {
  const [, { uid, currentTo }] = useReduxData();
  const [file, setFile] = React.useState<any>(null);

  const getExtraData = React.useCallback(
    (file: File) => ({
      key: `${moment().format('YYYYMMDD')}/${uid}:${currentTo}/${file.name}`,
      policy: policyBase64,
      OSSAccessKeyId: ossOptions.accessKeyId,
      success_action_status: 200,
      signature,
    }),
    [file]
  );

  const openFolder = React.useCallback(() => {}, []);

  return (
    <>
      <Upload
        name="file"
        action={ossHost}
        onChange={(e) => setFile(e.file)}
        onRemove={console.log}
        showUploadList={false}
        data={getExtraData}
        maxCount={1}
      >
        <FolderOpenOutlined onClick={openFolder} />
      </Upload>
    </>
  );
});
