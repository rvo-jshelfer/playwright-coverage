import type { ProcessCov } from '@bcoe/v8-coverage';
import type { EncodedSourceMap } from '@jridgewell/trace-mapping';
import type { Suite } from '@playwright/test/reporter';
export declare const attachmentName = "@bgotink/playwright-coverage";
export declare function collectV8CoverageFiles(suite: Suite): Set<string>;
export declare function getSourceMap(url: string, source: string): Promise<EncodedSourceMap | undefined>;
export declare function getSourceMaps(sources: ReadonlyMap<string, string>): Promise<ReadonlyMap<string, EncodedSourceMap | undefined>>;
export declare function convertToIstanbulCoverage(v8Coverage: ProcessCov, sources: ReadonlyMap<string, string>, sourceMaps: ReadonlyMap<string, EncodedSourceMap | undefined>, exclude: readonly string[], sourceRoot: string): Promise<import("istanbul-lib-coverage").CoverageMap>;
//# sourceMappingURL=data.d.ts.map