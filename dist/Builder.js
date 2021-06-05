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
exports.Builder = void 0;
const Os = __importStar(require("os"));
const Util = __importStar(require("util"));
const Fse = __importStar(require("fs-extra"));
const Nexe = __importStar(require("nexe"));
const copyfiles_1 = __importDefault(require("copyfiles"));
const AsyncCopyFiles = Util.promisify(copyfiles_1.default);
class Builder {
    constructor() {
        this.workingDir = '';
        // Create temp dir
        this.workingDir = `${Os.tmpdir}/gam-tmp/${new Date().getTime()}`.replace(/\\/g, '/');
        Fse.mkdirSync(`${this.workingDir}`, { recursive: true });
        console.log(`Working Dir path ${this.workingDir}`);
    }
    copyFile(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Copy from "${from}" to "${to}"`);
            const path = (this.workingDir + to).replace(/\\/g, '/').split('/').slice(0, -1).join('/');
            yield Fse.mkdirp(path);
            // @ts-ignore
            yield Fse.copyFile(from, this.workingDir + to);
        });
    }
    copyFiles(from, to, up = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Copy from "${from}" to "${to}"`);
            // @ts-ignore
            yield AsyncCopyFiles([from, this.workingDir + to], {
                up,
            });
        });
    }
    build(config) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Start build');
            yield Nexe.compile({
                input: `./index.js`,
                targets: [config.targetOs],
                output: config.output,
                cwd: this.workingDir,
                resources: config.resources,
            });
        });
    }
    zip(path, folder = '/out') {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Zip to ${path}`);
            const zipdir = require('zip-dir');
            yield zipdir(this.workingDir + folder, { saveTo: path });
        });
    }
}
exports.Builder = Builder;
