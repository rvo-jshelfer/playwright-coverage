declare class CoverageWorker {
    #private;
    startConversion(path: string): void;
    reset(): void;
    getTotalCoverage(sourceRoot: string, exclude: readonly string[]): Promise<string>;
}
export type { CoverageWorker };
//# sourceMappingURL=worker.d.ts.map