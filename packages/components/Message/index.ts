import Message from "./methods";
import { withInstallFunction } from "@melon-element/utils";

export const MelonMessage = withInstallFunction(Message, "$message");

export * from "./types";
