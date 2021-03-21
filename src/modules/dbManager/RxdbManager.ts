class RxdbManager {
  protected localDatabase: RxDB.LocalDatabaseType;
  protected collection: valueOf<RxDB.ICollection>;

  constructor() {
    this.localDatabase = window.$client.localDatabase;
  }

  public getCollection() {
    return this.collection;
  }

  public getCollection$() {
    return this.collection.$;
  }

  public async getAllDocuments(): Promise<RxDB.IDocument[]> {
    return (await this.collection.dump()).docs;
  }

  public async insert(doc: RxDB.IDocument): Promise<RxDB.IDocument> {
    return await this.collection.insert(doc as any);
  }

  public async upsert(doc: RxDB.IDocument): Promise<RxDB.IDocument> {
    return await this.collection.upsert(doc);
  }

  public async bulkInsert(docs: RxDB.IDocument[]): Promise<any> {
    return await this.collection.bulkInsert(docs as any);
  }
}

export default RxdbManager;
