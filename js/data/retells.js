// 复述语料聚合器：basic（12 段）+ advanced（18 段）= 30 段。
// keyPoints.groups：每组内任一同义词命中即该组覆盖，全部组覆盖才算该要点达成。
// 内容门禁：tests/content.test.js 校验结构。
import { RETELLS_BASIC } from "./retells-basic.js";
import { RETELLS_ADVANCED } from "./retells-advanced.js";

export const RETELL_PASSAGES = [...RETELLS_BASIC, ...RETELLS_ADVANCED];
