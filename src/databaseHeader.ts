
enum HeaderOffset {
  MagicString = 0,
  PageSize = 16,
  FileFormatWriteVersion = 18,
  FileFormatReadVersion = 19,
  ReservedSpaceSize = 20,
  MaxEmbeddedPayloadFraction = 21,
  MinEmbeddedPayloadFraction = 22,
  LeafPayloadFraction = 23,
  FileChangeCounter = 24,
  SizeInPages = 28,
  FirstFreelistTrunkPage = 32,
  TotalFreelistPages = 36,
  SchemaCookie = 40,
  SchemaFormatNumber = 44,
  DefaultPageCacheSize = 48,
  LargestRootBTreePageNumber = 52,
  TextEncoding = 56,
  UserVersion = 60,
  IncrementalVacuumMode = 64,
  ApplicationId = 68,
  ReservedExpansion = 72,
  VersionValidFor = 92,
  SqliteVersionNumber = 96,
}

enum HeaderSize {
  MagicString = 16,
  PageSize = 2,
  FileFormatWriteVersion = 1,
  FileFormatReadVersion = 1,
  ReservedSpaceSize = 1,
  MaxEmbeddedPayloadFraction = 1,
  MinEmbeddedPayloadFraction = 1,
  LeafPayloadFraction = 1,
  FileChangeCounter = 4,
  SizeInPages = 4,
  FirstFreelistTrunkPage = 4,
  TotalFreelistPages = 4,
  SchemaCookie = 4,
  SchemaFormatNumber = 4,
  DefaultPageCacheSize = 4,
  LargestRootBTreePageNumber = 4,
  TextEncoding = 4,
  UserVersion = 4,
  IncrementalVacuumMode = 4,
  ApplicationId = 4,
  ReservedExpansion = 20,
  VersionValidFor = 4,
  SqliteVersionNumber = 4,
}

export class DatabaseHeader {
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
  private _magicString: string;

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
    this._magicString = "";
  }

  public static fromBuffer(buf: Buffer): DatabaseHeader {
    const header = new DatabaseHeader();
    const magicBytes = buf.subarray(HeaderOffset.MagicString, HeaderOffset.MagicString + HeaderSize.MagicString - 1); // -1 to exclude null terminator
    header._magicString = magicBytes.toString();
    header.pageSize = buf.readUInt16BE(HeaderOffset.PageSize);
    header.fileFormatWriteVersion = buf.readUInt8(HeaderOffset.FileFormatWriteVersion);
    header.fileFormatReadVersion = buf.readUInt8(HeaderOffset.FileFormatReadVersion);
    header.reservedSpaceSize = buf.readUInt8(HeaderOffset.ReservedSpaceSize);
    header.maxEmbeddedPayloadFraction = buf.readUInt8(HeaderOffset.MaxEmbeddedPayloadFraction);
    header.minEmbeddedPayloadFraction = buf.readUInt8(HeaderOffset.MinEmbeddedPayloadFraction);
    header.leafPayloadFraction = buf.readUInt8(HeaderOffset.LeafPayloadFraction);
    header.fileChangeCounter = buf.readUInt32BE(HeaderOffset.FileChangeCounter);
    header.pageSizeInUse = header.pageSize - header.reservedSpaceSize;
    header.databaseSizeInPages = buf.readUInt32BE(HeaderOffset.SizeInPages);
    header.firstFreelistTrunkPage = buf.readUInt32BE(HeaderOffset.FirstFreelistTrunkPage);
    header.totalFreelistPages = buf.readUInt32BE(HeaderOffset.TotalFreelistPages);
    header.schemaCookie = buf.readUInt32BE(HeaderOffset.SchemaCookie);
    header.schemaFormatNumber = buf.readUInt32BE(HeaderOffset.SchemaFormatNumber);
    header.defaultPageCacheSize = buf.readUInt32BE(HeaderOffset.DefaultPageCacheSize);
    header.largestRootBTreePageNumber = buf.readUInt32BE(HeaderOffset.LargestRootBTreePageNumber);
    header.textEncoding = buf.readUInt32BE(HeaderOffset.TextEncoding);
    header.userVersion = buf.readUInt32BE(HeaderOffset.UserVersion);
    header.incrementalVacuumMode = buf.readUInt32BE(HeaderOffset.IncrementalVacuumMode);
    header.applicationId = buf.readUInt32BE(HeaderOffset.ApplicationId);
    header.reservedSpace = buf.subarray(HeaderOffset.ReservedExpansion, HeaderOffset.ReservedExpansion + HeaderSize.ReservedExpansion);
    header.versionValidFor = buf.readUInt32BE(HeaderOffset.VersionValidFor);
    header.sqliteVersionNumber = buf.readUInt32BE(HeaderOffset.SqliteVersionNumber);
    header.isValid = DatabaseHeader._isValid(header);

    return header;
  }

  private static _isValid(header: DatabaseHeader): boolean {
    if (header._magicString !== "SQLite format 3") return false;

    const validFileFormatVersions = [1, 2];
    if (!validFileFormatVersions.includes(header.fileFormatWriteVersion)) return false;
    if (!validFileFormatVersions.includes(header.fileFormatReadVersion)) return false;

    if (header.reservedSpaceSize < 0) return false;

    if (header.maxEmbeddedPayloadFraction !== 64) return false;
    if (header.minEmbeddedPayloadFraction !== 32) return false;
    if (header.leafPayloadFraction !== 32) return false;

    if (header.fileChangeCounter < 0) return false;
    if (header.databaseSizeInPages < 0) return false;
    if (header.firstFreelistTrunkPage < 0) return false;
    if (header.totalFreelistPages < 0) return false;
    if (header.schemaCookie < 0) return false;
    
    const validSchemaFormatNumbers = [1, 2, 3, 4];
    if (!validSchemaFormatNumbers.includes(header.schemaFormatNumber)) return false;

    if (header.defaultPageCacheSize < 0) return false;
    if (header.largestRootBTreePageNumber < 0) return false;

    const validTextEncodings = [1, 2, 3];
    if (!validTextEncodings.includes(header.textEncoding)) return false;

    if (header.userVersion < 0) return false;
    if (header.incrementalVacuumMode < 0) return false;
    if (header.applicationId < 0) return false;

    if (header.reservedSpace.length !== HeaderSize.ReservedExpansion) return false;
    // must be all zeros
    for (let i = 0; i < header.reservedSpace.length; i++) {
      if (header.reservedSpace[i] !== 0) return false;
    }

    if (header.versionValidFor < 0) return false;
    if (header.sqliteVersionNumber < 0) return false;

    return true;
  }
}
