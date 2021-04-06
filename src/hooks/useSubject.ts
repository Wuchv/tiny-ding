import { Subject } from 'rxjs';

enum ERxEvent {
  AUDIO_CLOSE = 'audio_close',
  READ_IMAGE_CACHE_ERROR = 'read_image_cache_error',
  GET_FILE_FROM_TOOLBAR = 'get_file_from_toolbar',
  UPLOAD_FILE_FROM_TOOLBAR = 'upload_file_from_toolbar',
}

const subject: Subject<Rxjs.INext> = new Subject();

export const useSubject = (): [Subject<Rxjs.INext>, typeof ERxEvent] => {
  return [subject, ERxEvent];
};
