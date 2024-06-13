import Collapse  from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";
import { withInstall } from "@melon-element/utils";

export const MelonCollapse = withInstall(Collapse)
export const MelonCollapseItem = withInstall(CollapseItem)

export * from './types'