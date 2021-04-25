import { RxDocument, RxChangeEvent } from 'rxdb';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { database } from '../../db';

enum EWriteOperation {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

class DBManager implements RxDB.IDBManager {
  protected localDatabase: RxDB.LocalDatabaseType;
  protected collection: valueOf<RxDB.ICollection>;

  constructor() {
    this.localDatabase = database;
  }

  public get insert$() {
    return this.collection.$.pipe(
      filter(
        (changeEvent: RxChangeEvent) =>
          changeEvent.operation === EWriteOperation.INSERT
      )
    );
  }

  public get update$(): Observable<RxChangeEvent> {
    return this.collection.$.pipe(
      filter(
        (changeEvent: RxChangeEvent) =>
          changeEvent.operation === EWriteOperation.UPDATE
      )
    );
  }

  public async getAllDocuments(): Promise<RxDB.IDocument[]> {
    return (await this.collection.dump()).docs;
  }

  public async insert(
    doc: RxDB.IDocument
  ): Promise<RxDocument<RxDB.IDocument, any>> {
    return await this.collection.insert(doc as any);
  }

  public async upsert(
    doc: RxDB.IDocument
  ): Promise<RxDocument<RxDB.IDocument, any>> {
    return await this.collection.upsert(doc);
  }

  public async bulkInsert(docs: RxDB.IDocument[]): Promise<any> {
    return await this.collection.bulkInsert(docs as any);
  }

  public async findOne(
    primaryId: string
  ): Promise<RxDocument<RxDB.IDocument, any>> {
    return await this.collection.findOne(primaryId).exec();
  }

  public async findWithOneKey(key: string, value: any) {
    return await this.collection.find().where(key).eq(value).exec();
  }
}

export default DBManager;
