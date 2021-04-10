import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useSubject, ofAction } from './useSubject';

export const useUploadFile = (): [File, Dispatch<SetStateAction<File>>] => {
  const [file, setFile] = useState<File>(null);
  const [globalSubject$, RxEvent] = useSubject();

  useEffect(() => {
    const sub = globalSubject$
      .pipe(ofAction(RxEvent.GET_FILE))
      .subscribe((next) => {
        !!file &&
          globalSubject$.next({
            action: RxEvent.UPLOAD_FILE,
            id: next.payload,
            payload: file,
          });
        setFile(null);
      });

    return () => sub.unsubscribe();
  }, [file]);

  return [file, setFile];
};
