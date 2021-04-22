import DBManager from './DBManager';

export default class UserManager
  extends DBManager
  implements RxDB.IUserManager {
  constructor() {
    super();
    this.collection = this.localDatabase.users;
  }

  public async getOwnInfo(): Promise<IUser> {
    const allDoc = await this.getAllDocuments();
    const filterDocByToken = allDoc.filter((doc: IUser) => doc.access_token);
    return (filterDocByToken[0] || {}) as IUser;
  }

  public async getOther(): Promise<IUser[]> {
    const allDoc = await this.getAllDocuments();
    return allDoc.filter((doc: IUser) => !doc.access_token) as IUser[];
  }
}
