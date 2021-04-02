import { filter } from 'rxjs/operators';
import { RxChangeEvent, RxDocument } from 'rxdb';

enum EWriteOperation {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
class RxdbManager {
  protected localDatabase: RxDB.LocalDatabaseType;
  protected collection: valueOf<RxDB.ICollection>;

  constructor() {
    this.localDatabase = window.$client.localDatabase;
  }

  public getCollection() {
    return this.collection;
  }

  public get insert$() {
    return this.collection.$.pipe(
      filter(
        (changeEvent: RxChangeEvent) =>
          changeEvent.operation === EWriteOperation.INSERT
      )
    );
  }

  public get update$() {
    return this.collection.$.pipe(
      filter(
        (changeEvent: RxChangeEvent) =>
          changeEvent.operation === EWriteOperation.UPDATE
      )
    );
  }

  public getCollection$() {
    return this.collection.$;
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
}

export default RxdbManager;
