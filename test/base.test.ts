import * as Chai from 'chai';
import { Builder } from '../src';

describe('Base', function () {
  it('first', async function () {
    const b = new Builder({
      targetOs: 'windows-x86-14.15.3',
      output: 'app.exe',
    });

    await b.build();
  });
});
