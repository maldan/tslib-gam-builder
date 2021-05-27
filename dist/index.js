"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const Os = __importStar(require("os"));
const ChildProcess = __importStar(require("child_process"));
const TEMP_DIR = `${Os.tmpdir}/gam-tmp/${new Date().getTime()}`.replace(/\\/g, '/');
function getFiles(dir, files_) {
    files_ = files_ || [];
    const files = fs_extra_1.default.readdirSync(dir);
    for (const i in files) {
        const name = dir + '/' + files[i];
        if (fs_extra_1.default.statSync(name).isDirectory()) {
            getFiles(name, files_);
        }
        else {
            files_.push(name);
        }
    }
    return files_.map((x) => {
        return x.replace(/\\/g, '/');
    });
}
function build({ frontendPath, rootPath, backendPath, modules, copyModules, zipOut, }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create temp dir
        fs_extra_1.default.mkdirSync(`${TEMP_DIR}/node_modules`, { recursive: true });
        console.log(`TEMP_DIR path ${TEMP_DIR}`);
        console.log(`Frontend path ${frontendPath}`);
        // Build frontend
        ChildProcess.execSync(`cd ${frontendPath} && npm ci && npm run build`);
        console.log(`Build done`);
        // Copy data
        fs_extra_1.default.copySync(`${frontendPath}/build`, `${TEMP_DIR}/build`);
        fs_extra_1.default.copySync(`${rootPath}/package.json`, `${TEMP_DIR}/package.json`);
        console.log(`Copy done`);
        // Build backend
        ChildProcess.execSync(`nexe "${backendPath}/bin/index.js" -t windows-x86-14.15.3 -o "${TEMP_DIR}/app.exe" -r \"${backendPath}/node_modules/{${modules.join(',')}}/**/*\"`);
        // Copy modules
        for (let i = 0; i < copyModules.length; i++) {
            fs_extra_1.default.copySync(`${backendPath}/node_modules/${copyModules[i]}`, `${TEMP_DIR}/node_modules/${copyModules[i]}`);
        }
        const zipdir = require('zip-dir');
        yield zipdir(TEMP_DIR, { saveTo: zipOut });
    });
}
exports.build = build;
// Fse.copySync();
// // cd frontend && npm run build &&cd ../backend && npm run build && cd bin && nexe ./index.js -t windows-x86-14.15.3 -o app.exe -r \"../../frontend/build\" -r \"../node_modules/{y18n,yargs-parser,cliui,string-width,strip-ansi,ansi-regex,is-fullwidth-code-point,emoji-regex,wrap-ansi,escalade,get-caller-file,require-directory}/**/*\" && app.exe
// ChildProcess.execSync(`cd frontend && npm run build`);
// cd frontend && npm run build &&cd ../backend && npm run build && cd bin && nexe ./index.js -t windows-x86-14.15.3 -o app.exe -r \"../../frontend/build\" -r \"../node_modules/{y18n,yargs-parser,cliui,string-width,strip-ansi,ansi-regex,is-fullwidth-code-point,emoji-regex,wrap-ansi,escalade,get-caller-file,require-directory}/**/*\" && app.exe
