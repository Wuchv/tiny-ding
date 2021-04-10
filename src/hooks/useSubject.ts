import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

enum ERxEvent {
  AUDIO_CLOSE = 'audio_close',
  READ_IMAGE_CACHE_ERROR = 'read_image_cache_error',
  GET_FILE = 'get_file',
  UPLOAD_FILE = 'upload_file',
}

const subject: Subject<Rxjs.INext> = new Subject();

export const useSubject = (): [Subject<Rxjs.INext>, typeof ERxEvent] => {
  return [subject, ERxEvent];
};

export const ofAction = (action: ERxEvent, id: string = null) => (
  source: Observable<Rxjs.INext>
) =>
  source.pipe(
    filter((next) => {
      let result = next.action === action;
      if (id && next.id) {
        result = result && next.id === id;
      }
      return result;
    })
  );
