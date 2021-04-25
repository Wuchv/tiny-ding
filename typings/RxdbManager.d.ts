import { Observable } from 'rxjs';
import { RxDocument, RxChangeEvent } from 'rxdb';

export interface DBManager {
  insert$: Observable<RxChangeEvent>;
  update$: Observable<RxChangeEvent>;
  getAllDocuments(): Promise<RxDB.IDocument[]>;
  insert(doc: RxDB.IDocument): Promise<RxDocument<RxDB.IDocument, any>>;
  upsert(doc: RxDB.IDocument): Promise<RxDocument<RxDB.IDocument, any>>;
  bulkInsert(docs: RxDB.IDocument[]): Promise<any>;
  findOne(primaryId: string): Promise<RxDocument<RxDB.IDocument, any>>;
  findWithOneKey(
    key: string,
    value: any
  ): Promise<RxDocument<RxDB.IDocument, any>>;
}

export interface UserManager extends DBManager {
  getOwnInfo(): Promise<IUser>;
  getOther(): Promise<IUser[]>;
}

export interface MessageManager extends DBManager {
  collectionFilterById$(
    uid: string,
    currentTo: string
  ): Observable<RxChangeEvent>;
  filterMsgByCid(fromId: string, toId: string): Promise<IMessage[]>;
}

export interface ConversationManager extends DBManager {
  // generateConversation(): void;
  getLatestConversation(): Promise<{
    currentCid?: string;
    currentTo?: string;
    currentConversationTitle?: string;
  }>;
}
