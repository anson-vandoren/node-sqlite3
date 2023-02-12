
export class Database {
  private _header: DatabaseHeader;
  private _filePath: string;

  public get header(): DatabaseHeader {
    return this._header;
  }

  constructor(path: string) {
    this._filePath = path;
    this._header = this.readHeader()
  }

  private readHeader(): DatabaseHeader {
    const buf = Buffer.alloc(100);


    return DatabaseHeader.fromBuffer(buf);
  }
}

class DatabaseHeader {
  public isValid: boolean;
  public pageSize: number;
  public fileFormatWriteVersion: number;
  public fileFormatReadVersion: number;
  public reservedSpaceSize: number;
  public maxEmbeddedPayloadFraction: number;
  public minEmbeddedPayloadFraction: number;
  public leafPayloadFraction: number;
  public fileChangeCounter: number;
  public pageSizeInUse: number;
  public databaseSizeInPages: number;
  public firstFreelistTrunkPage: number;
  public totalFreelistPages: number;
  public schemaCookie: number;
  public schemaFormatNumber: number;
  public defaultPageCacheSize: number;
  public largestRootBTreePageNumber: number;
  public textEncoding: number;
  public userVersion: number;
  public incrementalVacuumMode: number;
  public reservedSpace: Buffer;
  public applicationId: number;
  public versionValidFor: number;
  public sqliteVersionNumber: number;

  constructor() {
    this.isValid = false;
    this.pageSize = 0;
    this.fileFormatWriteVersion = 0;
    this.fileFormatReadVersion = 0;
    this.reservedSpaceSize = -1;
    this.maxEmbeddedPayloadFraction = 0;
    this.minEmbeddedPayloadFraction = 0;
    this.leafPayloadFraction = 0;
    this.fileChangeCounter = -1;
    this.pageSizeInUse = 0;
    this.databaseSizeInPages = -1;
    this.firstFreelistTrunkPage = -1;
    this.totalFreelistPages = -1;
    this.schemaCookie = -1;
    this.schemaFormatNumber = 0;
    this.defaultPageCacheSize = -1;
    this.largestRootBTreePageNumber = -1;
    this.textEncoding = 0;
    this.userVersion = -1;
    this.incrementalVacuumMode = -1;
    this.applicationId = -1;
    this.versionValidFor = -1;
    this.sqliteVersionNumber = -1;
    this.reservedSpace = Buffer.alloc(0);
  } 

  public static fromBuffer(buffer: Buffer): DatabaseHeader {
    const header = new DatabaseHeader();


    return header;
  }
}