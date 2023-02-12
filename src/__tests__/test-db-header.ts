import { expect } from 'chai';
import { it } from 'mocha';
import { Database } from '../database';
import { join } from 'path';

describe('Database Header', () => {
  const testDbPath = join(__dirname, 'data', 'simple_table.db');
  let db: Database;

  function testFourByteInteger(num: number): void {
    expect(num).to.be.a('number');
    expect(num).to.be.greaterThanOrEqual(0);
    // max 4 bytes
    expect(num).to.be.lessThanOrEqual(4294967295);
  }

  before(() => {
    db = new Database(testDbPath);
  });

  it('should have a header', () => {
    expect(db.header).to.not.be.undefined;
  });

  it('should be valid', () => {
    // magic string is 'SQLite format 3\0'
    expect(db.header.isValid).to.be.true;
  });

  it('should have a valid page size', () => {
    const pageSize = db.header.pageSize;
    // 512 - 32768 bytes, inclusive
    expect(pageSize).to.be.a('number');
    expect(pageSize).to.be.greaterThanOrEqual(512);
    expect(pageSize).to.be.lessThanOrEqual(32768);
    // must be a power of 2
    expect((Math.log(pageSize) / Math.log(2)) % 1).to.equal(0);
  });

  it('should have a valid file format write version', () => {
    const writeVersion = db.header.fileFormatWriteVersion;
    expect(writeVersion).to.be.a('number');
    const validVersions = [1, 2]; // 1 = legacy, 2 = WAL
    expect(validVersions).to.include(writeVersion);
  });

  it('should have a valid file format read version', () => {
    const readVersion = db.header.fileFormatReadVersion;
    expect(readVersion).to.be.a('number');
    const validVersions = [1, 2]; // 1 = legacy, 2 = WAL
    expect(validVersions).to.include(readVersion);
  });

  it('should have a valid reserved space size', () => {
    // one byte, usually 0
    const reservedSpaceSize = db.header.reservedSpaceSize;
    expect(reservedSpaceSize).to.be.a('number');
    expect(reservedSpaceSize).to.be.greaterThanOrEqual(0);
    // one byte signed integer
    expect(reservedSpaceSize).to.be.lessThanOrEqual(127);
  });

  it('should have a valid max embedded payload fraction', () => {
    expect(db.header.maxEmbeddedPayloadFraction).to.be.a('number');
    expect(db.header.maxEmbeddedPayloadFraction).to.equal(64);
  });

  it('should have a valid min embedded payload fraction', () => {
    expect(db.header.minEmbeddedPayloadFraction).to.be.a('number');
    expect(db.header.minEmbeddedPayloadFraction).to.equal(32);
  });

  it('should have a valid leaf payload fraction', () => {
    expect(db.header.leafPayloadFraction).to.be.a('number');
    expect(db.header.leafPayloadFraction).to.equal(32);
  });

  it('should have a valid file change counter', () => {
    testFourByteInteger(db.header.fileChangeCounter);
  });

  it('should have a valid database size in pages', () => {
    testFourByteInteger(db.header.databaseSizeInPages);
  });

  it('should have a valid first freelist trunk page', () => {
    testFourByteInteger(db.header.firstFreelistTrunkPage);
  });

  it('should have a valid total number of freelist pages', () => {
    testFourByteInteger(db.header.totalFreelistPages);
  });

  it('should have a valid schema cookie', () => {
    testFourByteInteger(db.header.schemaCookie);
  });

  it('should have a valid schema format number', () => {
    expect(db.header.schemaFormatNumber).to.be.a('number');
    expect(db.header.schemaFormatNumber).to.be.greaterThanOrEqual(1);
    expect(db.header.schemaFormatNumber).to.be.lessThanOrEqual(4);
  });

  it('should have a valid default page cache size', () => {
    testFourByteInteger(db.header.defaultPageCacheSize);
  });

  it('should have a valid largest root b-tree page number', () => {
    testFourByteInteger(db.header.largestRootBTreePageNumber);
  });

  it('should have a valid text encoding', () => {
    expect(db.header.textEncoding).to.be.a('number');
    // 1 = UTF-8, 2 = UTF-16le, 3 = UTF-16be
    expect(db.header.textEncoding).to.be.greaterThanOrEqual(1);
    expect(db.header.textEncoding).to.be.lessThanOrEqual(3);
  });

  it('should have a valid user version', () => {
    testFourByteInteger(db.header.userVersion);
  });

  it('should have a valid incremental vacuum mode', () => {
    testFourByteInteger(db.header.incrementalVacuumMode);
  });

  it('should have a valid application id', () => {
    testFourByteInteger(db.header.applicationId);
  });

  it('should have zeroed reserved space', () => {
    expect(db.header.reservedSpace).to.be.a('string');
    // 20 bytes
    expect(db.header.reservedSpace.length).to.equal(20);
  });

  it('should have a valid version-valid-for number', () => {
    testFourByteInteger(db.header.versionValidFor);
  });

  it('should have a valid sqlite version number', () => {
    testFourByteInteger(db.header.sqliteVersionNumber);
  });
})