import * as React from 'react';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useUploadFile } from '@src/hooks/useUploadFile';
import { EMsgType } from '@src/modules/RemoteGlobal';
import { IToolbar } from '..';

type IUpload = Pick<IToolbar, 'sendMessage'>;

export const Uploader: React.FunctionComponent<IUpload> = React.memo(
  ({ sendMessage }) => {
    const inputFileRef = React.useRef<HTMLInputElement>(null);
    const [, setFile] = useUploadFile();

    const fileChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (inputFileRef.current) {
          const file: File = e.currentTarget.files[0];
          setFile(file);
          sendMessage(null, EMsgType.FILE, {
            url: null,
            name: file.name,
            size: file.size,
            type: file.type,
          });
          inputFileRef.current.value = null;
        }
      },
      [inputFileRef]
    );

    return (
      <>
        <label htmlFor="folder">
          <FolderOpenOutlined />
        </label>
        <input
          id="folder"
          ref={inputFileRef}
          type="file"
          style={{ display: 'none' }}
          onChange={fileChange}
        />
      </>
    );
  }
);
