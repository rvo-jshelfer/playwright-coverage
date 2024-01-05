"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CoverageWorker_instances, _CoverageWorker_queue, _CoverageWorker_sources, _CoverageWorker_sourceMaps, _CoverageWorker_totalCoverage, _CoverageWorker_markReady, _CoverageWorker_convert;
Object.defineProperty(exports, "__esModule", { value: true });
const v8_coverage_1 = require("@bcoe/v8-coverage");
const worker_threads_1 = require("worker_threads");
const comlink_1 = require("comlink");
const node_adapter_1 = __importDefault(require("comlink/dist/umd/node-adapter"));
const fs_1 = require("fs");
const data_1 = require("./data");
if (worker_threads_1.parentPort == null) {
    throw new Error('This script is meant to run as worker thread');
}
class CoverageWorker {
    constructor() {
        _CoverageWorker_instances.add(this);
        /**
         * Invariant: if #queue.length > 0, conversion is active
         */
        _CoverageWorker_queue.set(this, []);
        _CoverageWorker_sources.set(this, new Map());
        _CoverageWorker_sourceMaps.set(this, new Map());
        _CoverageWorker_totalCoverage.set(this, { result: [] });
        _CoverageWorker_markReady.set(this, void 0);
    }
    startConversion(path) {
        __classPrivateFieldGet(this, _CoverageWorker_queue, "f").push(path);
        if (__classPrivateFieldGet(this, _CoverageWorker_queue, "f").length === 1) {
            __classPrivateFieldGet(this, _CoverageWorker_instances, "m", _CoverageWorker_convert).call(this);
        }
    }
    reset() {
        __classPrivateFieldGet(this, _CoverageWorker_queue, "f").length = 0;
        __classPrivateFieldGet(this, _CoverageWorker_sources, "f").clear();
        __classPrivateFieldSet(this, _CoverageWorker_totalCoverage, { result: [] }, "f");
    }
    async getTotalCoverage(sourceRoot, exclude) {
        if (__classPrivateFieldGet(this, _CoverageWorker_queue, "f").length !== 0) {
            // We're still running
            await new Promise(resolve => (__classPrivateFieldSet(this, _CoverageWorker_markReady, resolve, "f")));
        }
        const sourceMaps = new Map(await Promise.all(Array.from(__classPrivateFieldGet(this, _CoverageWorker_sourceMaps, "f"), ([url, promise]) => promise.then(map => [url, map]))));
        return JSON.stringify(await (0, data_1.convertToIstanbulCoverage)(__classPrivateFieldGet(this, _CoverageWorker_totalCoverage, "f"), __classPrivateFieldGet(this, _CoverageWorker_sources, "f"), sourceMaps, exclude, sourceRoot));
    }
}
_CoverageWorker_queue = new WeakMap(), _CoverageWorker_sources = new WeakMap(), _CoverageWorker_sourceMaps = new WeakMap(), _CoverageWorker_totalCoverage = new WeakMap(), _CoverageWorker_markReady = new WeakMap(), _CoverageWorker_instances = new WeakSet(), _CoverageWorker_convert = async function _CoverageWorker_convert() {
    var _a;
    if (__classPrivateFieldGet(this, _CoverageWorker_queue, "f").length === 0) {
        (_a = __classPrivateFieldGet(this, _CoverageWorker_markReady, "f")) === null || _a === void 0 ? void 0 : _a.call(this);
        return;
    }
    await macrotick(); // wait one tick to give the event loop some space to run
    const [file] = __classPrivateFieldGet(this, _CoverageWorker_queue, "f");
    const coverage = JSON.parse(await fs_1.promises.readFile(file, 'utf-8'));
    await fs_1.promises.unlink(file);
    if (isProcessCov(coverage)) {
        for (const script of coverage.result) {
            if (typeof script.source === 'string') {
                if (__classPrivateFieldGet(this, _CoverageWorker_sources, "f").get(script.url) !== script.source) {
                    __classPrivateFieldGet(this, _CoverageWorker_sources, "f").set(script.url, script.source);
                    __classPrivateFieldGet(this, _CoverageWorker_sourceMaps, "f").set(script.url, (0, data_1.getSourceMap)(script.url, script.source));
                }
                delete script.source;
            }
        }
        __classPrivateFieldSet(this, _CoverageWorker_totalCoverage, (0, v8_coverage_1.mergeProcessCovs)([__classPrivateFieldGet(this, _CoverageWorker_totalCoverage, "f"), coverage]), "f");
    }
    __classPrivateFieldGet(this, _CoverageWorker_queue, "f").shift();
    __classPrivateFieldGet(this, _CoverageWorker_instances, "m", _CoverageWorker_convert).call(this);
};
(0, comlink_1.expose)(new CoverageWorker(), (0, node_adapter_1.default)(worker_threads_1.parentPort));
function isProcessCov(obj) {
    return (typeof obj === 'object' &&
        obj != null &&
        Array.isArray(obj.result));
}
function macrotick() {
    return new Promise(resolve => setTimeout(resolve));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1EQUEwRTtBQUUxRSxtREFBMEM7QUFDMUMscUNBQStCO0FBQy9CLGlGQUF5RDtBQUN6RCwyQkFBa0M7QUFDbEMsaUNBQStEO0FBRS9ELElBQUksMkJBQVUsSUFBSSxJQUFJLEVBQUU7SUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0NBQ2pFO0FBRUQsTUFBTSxjQUFjO0lBQXBCOztRQUNFOztXQUVHO1FBQ0gsZ0NBQW1CLEVBQUUsRUFBQztRQUV0QixrQ0FBVyxJQUFJLEdBQUcsRUFBa0IsRUFBQztRQUNyQyxxQ0FBYyxJQUFJLEdBQUcsRUFBaUQsRUFBQztRQUV2RSx3Q0FBNkIsRUFBQyxNQUFNLEVBQUUsRUFBRSxFQUFDLEVBQUM7UUFFMUMsNENBQXdCO0lBNkUxQixDQUFDO0lBM0VDLGVBQWUsQ0FBQyxJQUFZO1FBQzFCLHVCQUFBLElBQUksNkJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsSUFBSSx1QkFBQSxJQUFJLDZCQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1Qix1QkFBQSxJQUFJLDBEQUFTLE1BQWIsSUFBSSxDQUFXLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsS0FBSztRQUNILHVCQUFBLElBQUksNkJBQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLHVCQUFBLElBQUksK0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0Qix1QkFBQSxJQUFJLGlDQUFrQixFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUMsTUFBQSxDQUFDO0lBQ3JDLENBQUM7SUF1Q0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQWtCLEVBQUUsT0FBMEI7UUFDbkUsSUFBSSx1QkFBQSxJQUFJLDZCQUFPLENBQUMs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