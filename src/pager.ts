import fs from "fs";
import logger from "./logger";

const PAGE_SIZE_OFFSET = 16;
const PAGE_SIZE_LENGTH = 2;


export class Pager {
  public static serviceName = "Pager";
  public pageSize = 0;
  public filePath: string;
  public fd?: number;
  private cache: Buffer[];
  private canWrite: boolean;

  constructor(filePath: string, canWrite: boolean = true) {
    this.filePath = filePath;
    this.cache = [];
    this.canWrite = canWrite;
    this.fd = fs.openSync(this.filePath, canWrite ? "r+" : "r");
    this.setPageSize();
  }

  private setPageSize(): void {
    const buf = Buffer.alloc(PAGE_SIZE_LENGTH);
    const bytesRead = fs.readSync(this.fd!, buf, 0, PAGE_SIZE_LENGTH, PAGE_SIZE_OFFSET);
    if (bytesRead !== PAGE_SIZE_LENGTH) {
      throw new Error(`Could not read page size from ${this.filePath}`);
    }
    this.pageSize = buf.readUInt16BE(0);
  }

  public getPage(pageNumber: number): Buffer {
    if (this.cache[pageNumber]) {
      return this.cache[pageNumber];
    }
    const buf = Buffer.alloc(this.pageSize);
    this.readFromFile(pageNumber, buf);

    return buf;
  }

  private readFromFile(page: number, buf: Buffer): void {
    if (!this.pageSize) {
      throw new Error("Page size not set");
    }
    if (!this.fd) {
      throw new Error("File descriptor not set");
    }
    const offset = page * this.pageSize;
    const bytesRead = fs.readSync(this.fd, buf, 0, this.pageSize, offset);
    if (bytesRead !== this.pageSize) {
      throw new Error(`Could not read page ${page} from ${this.filePath}`);
    }
    this.cache[page] = buf;
  }
}