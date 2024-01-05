import type { PlaywrightTestArgs, PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions, TestType } from '@playwright/test';
export interface PlaywrightCoverageOptions {
    collectCoverage: boolean;
}
export declare function mixinFixtures<T extends PlaywrightTestArgs & PlaywrightTestOptions, W extends PlaywrightWorkerArgs & PlaywrightWorkerOptions>(base: TestType<T, W>): TestType<T & PlaywrightCoverageOptions, W>;
//# sourceMappingURL=fixtures.d.ts.map