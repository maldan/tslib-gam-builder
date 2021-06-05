import * as Os from 'os';
import * as Util from 'util';
import * as Fse from 'fs-extra';
import * as Nexe from 'nexe';
import CopyFiles from 'copyfiles';

const AsyncCopyFiles = Util.promisify(CopyFiles);

export class Builder {
  workingDir: string = '';

  constructor() {
    // Create temp dir
    this.workingDir = `${Os.tmpdir}/gam-tmp/${new Date().getTime()}`.replace(/\\/g, '/');
    Fse.mkdirSync(`${this.workingDir}`, { recursive: true });
    console.log(`Working Dir path ${this.workingDir}`);
  }

  async copyFile(from: string, to: string): Promise<void> {
    console.log(`Copy from "${from}" to "${to}"`);

    const path = (this.workingDir + to).replace(/\\/g, '/').split('/').slice(0, -1).join('/');
    await Fse.mkdirp(path);

    // @ts-ignore
    await Fse.copyFile(from, this.workingDir + to);
  }

  async copyFiles(from: string, to: string, up: number = 0): Promise<void> {
    console.log(`Copy from "${from}" to "${to}"`);

    // @ts-ignore
    await AsyncCopyFiles([from, this.workingDir + to], {
      up,
    });
  }

  async build(config: { targetOs: string; output: string; resources: string[] }): Promise<void> {
    console.log('Start build');

    await Nexe.compile({
      input: `./index.js`,
      targets: [config.targetOs],
      output: config.output,
      cwd: this.workingDir,
      resources: config.resources,
    });
  }

  async zip(path: string, folder: string = '/out'): Promise<void> {
    console.log(`Zip to ${path}`);
    const zipdir = require('zip-dir');
    await zipdir(this.workingDir + folder, { saveTo: path });
  }
}
