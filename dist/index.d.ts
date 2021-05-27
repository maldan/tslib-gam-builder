export declare function build({ frontendPath, rootPath, backendPath, modules, copyModules, zipOut, }: {
    frontendPath: string;
    rootPath: string;
    backendPath: string;
    modules: string[];
    copyModules: string[];
    zipOut: string;
}): Promise<void>;
