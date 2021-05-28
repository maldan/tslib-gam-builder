export declare function build({ frontendPath, rootPath, backendPath, modules, copyModules, zipOut, }: {
    frontendPath: string;
    rootPath: string;
    backendPath: string;
    modules: string[];
    copyModules: string[];
    zipOut: string;
}): Promise<void>;
export declare function backendBuild({ workingDir, rootPath, backendPath, modules, copyModules, zipOut, exeName, inputScript, }: {
    workingDir?: string;
    rootPath: string;
    backendPath: string;
    modules?: string[];
    copyModules?: string[];
    zipOut?: string;
    exeName?: string;
    inputScript?: string;
}): Promise<void>;
