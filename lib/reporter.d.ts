import type { FullConfig, FullResult, Reporter, TestResult } from '@playwright/test/reporter';
import { Watermarks } from 'istanbul-lib-report';
import { ReportType, ReportOptions } from 'istanbul-reports';
/**
 * Options to the coverage repoter
 */
export interface CoverageReporterOptions {
    /**
     * Glob(s) defining file(s) to exclude from coverage tracking
     */
    exclude?: string | string[];
    /**
     * Root folder for resolving source files, defaults to playwright's `rootDir`
     */
    sourceRoot?: string;
    /**
     * Folder to write coverage reports to
     *
     * Relative paths are resolved to playwright's `rootDir`. Default value is `'coverage'`.
     */
    resultDir?: string;
    /**
     * Istanbul reports to generate, defaults to generate a `'text-summary'`
     */
    reports?: (ReportType | [ReportType, ReportOptions[ReportType] | undefined])[];
    /**
     * Watermarks for categorizing coverage results as low, medium or high
     */
    watermarks?: Partial<Watermarks>;
    /**
     * Function that yields the correct absolute path to a file
     *
     * This function can be used to get complete control over the paths to source files.
     * This can e.g. be used to remove a non-existing `/_N_E/` folder inserted by Next.js.
     *
     * If no function is passed, the absolute path passed into this function is used.
     */
    rewritePath?: (file: {
        relativePath: string;
        absolutePath: string;
    }) => string;
}
export declare class CoverageReporter implements Reporter {
    private readonly exclude;
    private readonly resultDir;
    private readonly reports;
    private readonly sourceRoot?;
    private readonly watermarks?;
    private readonly rewritePath?;
    private readonly workerInstance;
    private readonly worker;
    private config;
    constructor({ exclude, sourceRoot, resultDir, reports, watermarks, rewritePath, }?: CoverageReporterOptions);
    onBegin(config: FullConfig): void;
    onTestEnd(_: unknown, result: TestResult): void;
    onEnd(result: FullResult): Promise<void>;
}
//# sourceMappingURL=reporter.d.ts.map