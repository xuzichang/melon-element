import type { ButtonSize, ButtonType } from "../Button/types";
import type { TooltipProps } from "../Tooltip/types";
export type DropdownCommand = string | number;

export interface DropdownItemProps {
  command?: DropdownCommand;
  label?: string;
  disabled?: boolean;
  dvided?: boolean;
}

export interface DropdownProps extends TooltipProps {
  type?: ButtonType;
  size?: ButtonSize;
  items?: DropdownItemProps[];
  hideOnClick?: boolean;
  splitButton?: boolean;
}

export interface DropdownEmits {
  (e: "visible-change", value: boolean): void;
  //   todo
}
