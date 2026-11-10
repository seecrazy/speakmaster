// 场景库聚合器：basic（A2/B1 生存生活线）+ advanced（服务线补充与 B1+/C1 进阶线）。
// beat/incident 字段约定见 scenarios-basic.js 文件头；结构由 tests/content.test.js 校验。
import { SCENARIOS_BASIC } from "./scenarios-basic.js";
import { SCENARIOS_ADVANCED } from "./scenarios-advanced.js";

export const SCENARIOS = [...SCENARIOS_BASIC, ...SCENARIOS_ADVANCED];
