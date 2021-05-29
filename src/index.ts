import Fse from 'fs-extra';
import * as Os from 'os';
import * as ChildProcess from 'child_process';
const Nexe = require('nexe');

/*function getFiles(dir: string, files_: string[]) {
  files_ = files_ || [];
  const files = Fse.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (Fse.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_.map((x) => {
    return x.replace(/\\/g, '/');//
  });
}*/

export async function build({
  frontendPath,
  rootPath,
  backendPath,
  modules,
  copyModules,
  zipOut,
}: {
  frontendPath: string;
  rootPath: string;
  backendPath: string;
  modules: string[];
  copyModules: string[];
  zipOut: string;
}): Promise<void> {
  const TEMP_DIR = `${Os.tmpdir}/gam-tmp/${new Date().getTime()}`.replace(/\\/g, '/');

  // Create temp dir
  Fse.mkdirSync(`${TEMP_DIR}/node_modules`, { recursive: true });

  console.log(`TEMP_DIR path ${TEMP_DIR}`);
  console.log(`Frontend path ${frontendPath}`);

  // Build frontend
  ChildProcess.execSync(`cd ${frontendPath} && npm ci && npm run build`);
  console.log(`Build done`);

  // Copy data
  Fse.copySync(`${frontendPath}/build`, `${TEMP_DIR}/build`);
  Fse.copySync(`${rootPath}/package.json`, `${TEMP_DIR}/package.json`);
  console.log(`Copy done`);

  // Build backend
  ChildProcess.execSync(
    `nexe "${backendPath}/bin/index.js" -t windows-x86-14.15.3 -o "${TEMP_DIR}/app.exe" -r \"${backendPath}/node_modules/{${modules.join(
      ',',
    )}}/**/*\"`,
  );

  // Copy modules
  for (let i = 0; i < copyModules.length; i++) {
    Fse.copySync(
      `${backendPath}/node_modules/${copyModules[i]}`,
      `${TEMP_DIR}/node_modules/${copyModules[i]}`,
    );
  }

  const zipdir = require('zip-dir');
  await zipdir(TEMP_DIR, { saveTo: zipOut });
}

export async function backendBuild({
  workingDir,
  rootPath,
  backendPath,
  modules = [],
  copyModules = [],
  zipOut,
  exeName = 'app.exe',
  inputScript = '/bin/index.js',
  resources = [],
}: {
  workingDir?: string;
  rootPath: string;
  backendPath: string;
  modules?: string[];
  copyModules?: string[];
  zipOut?: string;
  exeName?: string;
  inputScript?: string;
  resources?: string[];
}): Promise<void> {
  console.log(inputScript);
  const TEMP_DIR = workingDir || `${Os.tmpdir}/gam-tmp/${new Date().getTime()}`.replace(/\\/g, '/');

  // Create temp dir
  Fse.mkdirSync(`${TEMP_DIR}/node_modules`, { recursive: true });

  console.log(`TEMP_DIR path ${TEMP_DIR}`);

  // Copy data
  //Fse.copySync(`${rootPath}/package.json`, `${TEMP_DIR}/package.json`);
  //console.log(`Copy done`);
  //console.log(`${backendPath}${inputScript}`);
  // Build backend
  //ChildProcess.execSync(
  //  `nexe "${backendPath}${inputScript}" -t windows-x86-14.15.3 -o "${TEMP_DIR}/${exeName}" -r \"${backendPath}/node_modules/{${modules.join(
  //    ',',
  //  )}}/**/*\"`,
  //);
  await Nexe.compile({
    // build: true,
    input: `${backendPath}${inputScript}`,
    targets: ['windows-x86-14.15.3'],
    output: `${TEMP_DIR}/${exeName}`,
    resources: [`${backendPath}/node_modules/{${modules.join(',')}}/**/*`, ...resources],
  });

  // Copy modules
  for (let i = 0; i < copyModules.length; i++) {
    Fse.copySync(
      `${backendPath}/node_modules/${copyModules[i]}`, //
      `${TEMP_DIR}/node_modules/${copyModules[i]}`,
    );
  }

  if (zipOut) {
    const zipdir = require('zip-dir');
    await zipdir(TEMP_DIR, { saveTo: zipOut });
  }
}

// Fse.copySync();
// // cd frontend && npm run build &&cd ../backend && npm run build && cd bin && nexe ./index.js -t windows-x86-14.15.3 -o app.exe -r \"../../frontend/build\" -r \"../node_modules/{y18n,yargs-parser,cliui,string-width,strip-ansi,ansi-regex,is-fullwidth-code-point,emoji-regex,wrap-ansi,escalade,get-caller-file,require-directory}/**/*\" && app.exe

// ChildProcess.execSync(`cd frontend && npm run build`);
// cd frontend && npm run build &&cd ../backend && npm run build && cd bin && nexe ./index.js -t windows-x86-14.15.3 -o app.exe -r \"../../frontend/build\" -r \"../node_modules/{y18n,yargs-parser,cliui,string-width,strip-ansi,ansi-regex,is-fullwidth-code-point,emoji-regex,wrap-ansi,escalade,get-caller-file,require-directory}/**/*\" && app.exe
