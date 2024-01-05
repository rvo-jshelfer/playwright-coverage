"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixinFixtures = void 0;
const fs_1 = require("fs");
const data_1 = require("./data");
const coverageFixtures = {
    collectCoverage: true,
    page: async ({ page, collectCoverage, browserName }, use, testInfo) => {
        if (browserName !== 'chromium' || !collectCoverage) {
            return use(page);
        }
        await page.coverage.startJSCoverage({
            resetOnNavigation: false,
        });
        await use(page);
        const result = await page.coverage.stopJSCoverage();
        const resultFile = testInfo.outputPath('v8-coverage.json');
        await fs_1.promises.writeFile(resultFile, JSON.stringify({ result }));
        testInfo.attachments.push({
            name: data_1.attachmentName,
            contentType: 'application/json',
            path: resultFile,
        });
    },
};
function mixinFixtures(base) {
    return base.extend(coverageFixtures);
}
exports.mixinFixtures = mixinFixtures;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4dHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZml4dHVyZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBUUEsMkJBQWtDO0FBRWxDLGlDQUFzQztBQU10QyxNQUFNLGdCQUFnQixHQUtsQjtJQUNGLGVBQWUsRUFBRSxJQUFJO0lBRXJCLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBQyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUNsRSxJQUFJLFdBQVcsS0FBSyxVQUFVLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDbEQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7UUFFRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1lBQ2xDLGlCQUFpQixFQUFFLEtBQUs7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXBELE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMzRCxNQUFNLGFBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDeEIsSUFBSSxFQUFFLHFCQUFjO1lBQ3BCLFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUM7QUFFRixTQUFnQixhQUFhLENBRzNCLElBQW9CO0lBQ3BCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFMRCxzQ0FLQyJ9