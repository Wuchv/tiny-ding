import { Subject } from 'rxjs';

enum ERxEvent {
  AUDIO_CLOSE = 'audio_close',
  READ_IMAGE_CACHE_ERROR = 'read_image_cache_error',
}

const subject: Subject<Rxjs.INext> = new Subject();

export const useSubject = (): [Subject<Rxjs.INext>, typeof ERxEvent] => {
  return [subject, ERxEvent];
};
