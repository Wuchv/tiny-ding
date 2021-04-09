import * as React from 'react';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useSubject, ofAction } from '@src/hooks/useSubject';
import { EMsgType } from '@src/modules/MessageCenter';
import { IToolbar } from '..';

type IUpload = Pick<IToolbar, 'sendMessage'>;

export const Uploader: React.FunctionComponent<IUpload> = React.memo(
  ({ sendMessage }) => {
    const [globalSubject$, RxEvent] = useSubject();
    const [file, setFile] = React.useState<File>(null);
    const inputFileRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const sub = globalSubject$
        .pipe(ofAction(RxEvent.GET_FILE_FROM_TOOLBAR))
        .subscribe(
          (next) =>
            !!file &&
            globalSubject$.next({
              action: RxEvent.UPLOAD_FILE_FROM_TOOLBAR,
              id: next.payload,
              payload: file,
            })
        );

      return () => sub.unsubscribe();
    }, [file]);

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
