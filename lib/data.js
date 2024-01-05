"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToIstanbulCoverage = exports.getSourceMaps = exports.getSourceMap = exports.collectV8CoverageFiles = exports.attachmentName = void 0;
const fs_1 = require("fs");
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const micromatch_1 = require("micromatch");
const path_1 = require("path");
const url_1 = require("url");
const v8_to_istanbul_1 = __importDefault(require("v8-to-istanbul"));
exports.attachmentName = '@bgotink/playwright-coverage';
function collectV8CoverageFiles(suite) {
    const files = new Set();
    for (const test of suite.allTests()) {
        for (const result of test.results) {
            const attachmentIndex = result.attachments.findIndex(({ name }) => name === exports.attachmentName);
            if (attachmentIndex === -1) {
                continue;
            }
            const [attachment] = result.attachments.splice(attachmentIndex, 1);
            if (attachment.path != null) {
                files.add(attachment.path);
            }
        }
    }
    return files;
}
exports.collectV8CoverageFiles = collectV8CoverageFiles;
const fetch = eval('import("node-fetch")');
async function getSourceMap(url, source) {
    const match = source.match(/\/\/# *sourceMappingURL=(.*)/);
    if (match == null) {
        try {
            const response = await (await fetch).default(`${url}.map`, {
                method: 'GET',
            });
            return (await response.json());
        }
        catch {
            return undefined;
        }
    }
    const resolved = new url_1.URL(match[1], url);
    try {
        switch (resolved.protocol) {
            case 'file:':
                return JSON.parse(await fs_1.promises.readFile(resolved, 'utf8'));
            case 'data:': {
                if (!/^application\/json[,;]/.test(resolved.pathname)) {
                    return undefined;
                }
                const comma = resolved.pathname.indexOf(',');
                const rawData = resolved.pathname.slice(comma + 1);
                const between = resolved.pathname
                    .slice('application/json;'.length, comma)
                    .split(';');
                const dataString = between.includes('base64')
                    ? Buffer.from(rawData, 'base64url').toString('utf8')
                    : rawData;
                return JSON.parse(dataString);
            }
            default: {
                const response = await (await fetch).default(resolved.href, {
                    method: 'GET',
                });
                return (await response.json());
            }
        }
    }
    catch {
        return undefined;
    }
}
exports.getSourceMap = getSourceMap;
async function getSourceMaps(sources) {
    return new Map(await Promise.all(Array.from(sources, async ([url, source]) => [url, await getSourceMap(url, source)])));
}
exports.getSourceMaps = getSourceMaps;
async function convertToIstanbulCoverage(v8Coverage, sources, sourceMaps, exclude, sourceRoot) {
    const istanbulCoverage = (0, istanbul_lib_coverage_1.createCoverageMap)({});
    for (const script of v8Coverage.result) {
        const source = sources.get(script.url);
        const sourceMap = sourceMaps.get(script.url);
        if (source == null || sourceMap == null) {
            continue;
        }
        function sanitizePath(path) {
            let url;
            try {
                url = new url_1.URL(path);
            }
            catch {
                url = (0, url_1.pathToFileURL)(path);
            }
            let relativePath;
            if (url.protocol.startsWith('webpack')) {
                relativePath = url.pathname.slice(1); // webpack: URLs contain relative paths
            }
            else {
                relativePath = url.pathname;
            }
            if (relativePath.includes('/webpack:/')) {
                // v8ToIstanbul breaks when the source root in the source map is set to webpack:
                // It treats the URL as a path, leading to a confusing result.
                relativePath = relativePath.slice(relativePath.indexOf('/webpack:/') + '/webpack:/'.length);
            }
            else if (path_1.posix.isAbsolute(relativePath)) {
                relativePath = path_1.posix.relative((0, url_1.pathToFileURL)(sourceRoot).pathname, path);
            }
            if (!relativePath) {
                relativePath = '/';
            }
            return relativePath;
        }
        const isExcludedCache = new Map();
        const convertor = (0, v8_to_istanbul_1.default)('', 0, {
            source,
            sourceMap: { sourcemap: sourceMap },
        }, path => {
            let isExcluded = isExcludedCache.get(path);
            if (isExcluded != null) {
                return isExcluded;
            }
            const relativePath = sanitizePath(path);
            isExcluded =
                // ignore files outside of the root
                relativePath.startsWith('../') ||
                    // ignore webpack files
                    path.includes('/webpack:/webpack/') ||
                    relativePath === 'webpack/bootstrap' ||
                    relativePath.startsWith('webpack/runtime/') ||
                    // ignore dependencies
                    relativePath.startsWith('node_modules/') ||
                    relativePath.includes('/node_modules/') ||
                    // apply exclusions
                    (0, micromatch_1.isMatch)(relativePath, exclude);
            isExcludedCache.set(path, isExcluded);
            return isExcluded;
        });
        try {
            await convertor.load();
        }
        catch (error) {
            continue;
        }
        convertor.applyCoverage(script.functions);
        istanbulCoverage.merge(Object.fromEntries(Array.from(Object.entries(convertor.toIstanbul()), ([path, coverage]) => {
            path = sanitizePath(path);
            return [
                path,
                {
                    ...coverage,
                    path,
                },
            ];
        })));
    }
    return istanbulCoverage;
}
exports.convertToIstanbulCoverage = convertToIstanbulCoverage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLDJCQUFrQztBQUNsQyxpRUFBd0Q7QUFDeEQsMkNBQW1DO0FBQ25DLCtCQUEyQjtBQUMzQiw2QkFBdUM7QUFDdkMsb0VBQTBDO0FBRTdCLFFBQUEsY0FBYyxHQUFHLDhCQUE4QixDQUFDO0FBRTdELFNBQWdCLHNCQUFzQixDQUFDLEtBQVk7SUFDakQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQUVoQyxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUNuQyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakMsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQ2xELENBQUMsRUFBQyxJQUFJLEVBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLHNCQUFjLENBQ3BDLENBQUM7WUFFRixJQUFJLGVBQWUsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDMUIsU0FBUzthQUNWO1lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBRWhFLENBQUM7WUFFRixJQUFJLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO2dCQUMzQixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QjtTQUNGO0tBQ0Y7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUF4QkQsd0RBd0JDO0FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUV4QyxDQUFDO0FBRUssS0FBSyxVQUFVLFlBQVksQ0FDaEMsR0FBVyxFQUNYLE1BQWM7SUFFZCxNQUFNLEtBQUssR0FBRyxNQUFNLENB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