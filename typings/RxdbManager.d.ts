import { Observable } from 'rxjs';
import { RxDocument, RxChangeEvent } from 'rxdb';

export interface DBManager {
  insert$: Observable<RxDB.IDocument>;
  update$: Observable<RxDB.IDocument>;
  getAllDocuments(
    isToJSON?: boolean
  ): Promise<RxDB.IDocument[] | RxDB.IDocument[] | RxDocument[]>;
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
  unreadDot$(uid: string, currentTo: string): Observable<IMessage>;
  collectionFilterById$(
    uid: string,
    currentTo: string
  ): Observable<RxChangeEvent>;
  filterMsgByCid(fromId: string, toId: string): Promise<IMessage[]>;
  loadMessage(uid: string, lastLogout: number): Promise<IMessage[]>;
}

export interface ConversationManager extends DBManager {
  // generateConversation(): void;
  getLatestConversation(): Promise<{
    currentCid?: string;
    currentTo?: string;
    currentConversationTitle?: string;
    currentConversationAvatar?: string;
  }>;
}
