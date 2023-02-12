import { Pager } from '../pager';
import { it } from 'mocha';
import { expect } from 'chai';
import { join } from 'path';

process.env.NODE_ENV = 'test';

const testDbPath = join(__dirname, 'data', 'simple_table.db');

describe('Pager', () => {
  let pager: Pager;
  
  before(() => {
    pager = new Pager(testDbPath, false);
  });

  it('should have a page size', () => {
    expect(pager.pageSize).to.be.a('number');
    expect(pager.pageSize).to.be.greaterThanOrEqual(512);
    expect(pager.pageSize).to.be.lessThanOrEqual(32768);
    expect((Math.log(pager.pageSize) / Math.log(2)) % 1).to.equal(0);
  });

  it('should get a page', () => {
    const page = pager.getPage(1);
    expect(page).to.not.be.undefined;
    expect(page).to.be.an.instanceOf(Buffer);
    expect(page.length).to.equal(pager.pageSize);
  });
});

