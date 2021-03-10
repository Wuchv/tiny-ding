class RxdbManager {
  protected localDatabase: RxDB.LocalDatabaseType;
  protected collection: valueOf<RxDB.ICollection>;

  constructor() {
    this.localDatabase = window.$client.localDatabase;
  }

  public async getAllDocuments(): Promise<RxDB.IDocument[]> {
    return (await this.collection.dump()).docs;
  }

  public async upsert(doc: RxDB.IDocument): Promise<RxDB.IDocument> {
    return await this.collection.upsert(doc);
  }
}

export default RxdbManager;
