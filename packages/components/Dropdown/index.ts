import { withInstall } from "@melon-element/utils";
import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";

export const MelonDropdown = withInstall(Dropdown)
export const MelonDropdownItem = withInstall(DropdownItem)

export * from './types'