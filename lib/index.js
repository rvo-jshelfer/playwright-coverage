"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.CoverageReporter = exports.mixinFixtures = exports.expect = exports.test = void 0;
const test_1 = require("@playwright/test");
const fixtures_1 = require("./fixtures");
exports.test = (0, fixtures_1.mixinFixtures)(test_1.test);
var test_2 = require("@playwright/test");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return test_2.expect; } });
var fixtures_2 = require("./fixtures");
Object.defineProperty(exports, "mixinFixtures", { enumerable: true, get: function () { return fixtures_2.mixinFixtures; } });
var reporter_1 = require("./reporter");
Object.defineProperty(exports, "CoverageReporter", { enumerable: true, get: function () { return reporter_1.CoverageReporter; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return reporter_1.CoverageReporter; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQThDO0FBRTlDLHlDQUF5QztBQUU1QixRQUFBLElBQUksR0FBRyxJQUFBLHdCQUFhLEVBQUMsV0FBSSxDQUFDLENBQUM7QUFFeEMseUNBQXdDO0FBQWhDLDhGQUFBLE1BQU0sT0FBQTtBQUNkLHVDQUFvRTtBQUFqQyx5R0FBQSxhQUFhLE9BQUE7QUFDaEQsdUNBSW9CO0FBSGxCLDRHQUFBLGdCQUFnQixPQUFBO0FBQ2hCLG1HQUFBLGdCQUFnQixPQUFXIn0=