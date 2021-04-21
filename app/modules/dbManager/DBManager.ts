import { RxDocument } from 'rxdb';
import { database } from '../../db';

class DBManager implements RxDB.IDBManager {
  protected localDatabase: RxDB.LocalDatabaseType;
  protected collection: valueOf<RxDB.ICollection>;

  constructor() {
    this.localDatabase = database;
  }

  public getCollection() {
    return this.collection;
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
}

export default DBManager;
