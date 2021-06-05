export declare class Builder {
    workingDir: string;
    constructor();
    copyFile(from: string, to: string): Promise<void>;
    copyFiles(from: string, to: string, up?: number): Promise<void>;
    build(config: {
        targetOs: string;
        output: string;
        resources: string[];
    }): Promise<void>;
    zip(path: string, folder?: string): Promise<void>;
}
