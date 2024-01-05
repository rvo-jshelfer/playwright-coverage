"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverageReporter = void 0;
const comlink_1 = require("comlink");
const node_adapter_1 = __importDefault(require("comlink/dist/umd/node-adapter"));
const fs_1 = require("fs");
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const istanbul_lib_report_1 = require("istanbul-lib-report");
const istanbul_reports_1 = require("istanbul-reports");
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
const data_js_1 = require("./data.js");
class CoverageReporter {
    constructor({ exclude, sourceRoot, resultDir, reports = ['text-summary'], watermarks, rewritePath, } = {}) {
        this.exclude = typeof exclude === 'string' ? [exclude] : exclude !== null && exclude !== void 0 ? exclude : [];
        this.resultDir = resultDir || 'coverage';
        this.reports = reports;
        this.sourceRoot = sourceRoot;
        this.watermarks = watermarks;
        this.rewritePath = rewritePath;
        this.workerInstance = new worker_threads_1.Worker(require.resolve('./worker.js'));
        this.worker = (0, comlink_1.wrap)((0, node_adapter_1.default)(this.workerInstance));
    }
    onBegin(config) {
        this.config = config;
        void this.worker.reset();
    }
    onTestEnd(_, result) {
        const attachmentIndex = result.attachments.findIndex(({ name }) => name === data_js_1.attachmentName);
        if (attachmentIndex !== -1) {
            const [attachment] = result.attachments.splice(attachmentIndex, 1);
            if ((attachment === null || attachment === void 0 ? void 0 : attachment.path) != null) {
                void this.worker.startConversion(attachment.path);
            }
        }
    }
    async onEnd(result) {
        var _a;
        if (result.status !== 'passed' && result.status !== 'failed') {
            return;
        }
        const sourceRoot = (_a = this.sourceRoot) !== null && _a !== void 0 ? _a : this.config.rootDir;
        const coverage = (0, istanbul_lib_coverage_1.createCoverageMap)(Object.fromEntries(Object.entries(JSON.parse(await this.worker.getTotalCoverage(sourceRoot, this.exclude))).map(([relativePath, data]) => {
            var _a, _b;
            const absolutePath = path_1.default.resolve(sourceRoot, relativePath);
            const newPath = (_b = (_a = this.rewritePath) === null || _a === void 0 ? void 0 : _a.call(this, { absolutePath, relativePath })) !== null && _b !== void 0 ? _b : absolutePath;
            return [newPath, { ...data, path: newPath }];
        })));
        const context = (0, istanbul_lib_report_1.createContext)({
            coverageMap: coverage,
            dir: path_1.default.resolve(this.config.rootDir, this.resultDir),
            watermarks: this.watermarks,
            sourceFinder: path => {
                try {
                    return (0, fs_1.readFileSync)(path, 'utf8');
                }
                catch (e) {
                    throw new Error(`Failed to read ${path}: ${e}`);
                }
            },
        });
        for (const reporterConfig of this.reports) {
            let reporter;
            if (typeof reporterConfig === 'string') {
                reporter = (0, istanbul_reports_1.create)(reporterConfig);
            }
            else {
                reporter = (0, istanbul_reports_1.create)(...reporterConfig);
            }
            reporter.execute(context);
        }
    }
}
exports.CoverageReporter = CoverageReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVwb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEscUNBQXFDO0FBQ3JDLGlGQUF5RDtBQUN6RCwyQkFBZ0M7QUFDaEMsaUVBQXlFO0FBQ3pFLDZEQUE4RDtBQUM5RCx1REFBbUU7QUFDbkUsZ0RBQXdCO0FBQ3hCLG1EQUFzQztBQUV0Qyx1Q0FBeUM7QUFnRHpDLE1BQWEsZ0JBQWdCO0lBZ0IzQixZQUFZLEVBQ1YsT0FBTyxFQUNQLFVBQVUsRUFDVixTQUFTLEVBQ1QsT0FBTyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQzFCLFVBQVUsRUFDVixXQUFXLE1BQ2dCLEVBQUU7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLEVBQUUsQ0FBQztRQUN2RSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxVQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHVCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBQSxjQUFJLEVBQWlCLElBQUEsc0JBQVksRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQWtCO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcs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