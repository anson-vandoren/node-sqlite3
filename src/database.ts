import { DatabaseHeader } from "./databaseHeader";
import { Pager } from "./pager";

export class Database {
  private _header: DatabaseHeader;
  private _filePath: string;
  private pager: Pager;

  public get header(): DatabaseHeader {
    return this._header;
  }

  constructor(path: string) {
    this._filePath = path;
    this.pager = new Pager(path);
    this._header = this.readHeader()
  }

  private readHeader(): DatabaseHeader {
    const buf = this.pager.getPage(0);
    return DatabaseHeader.fromBuffer(buf);
  }
}
