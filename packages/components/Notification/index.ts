import Notification from "./methods";
import { withInstallFunction } from "@melon-element/utils";

export const MelonNotification = withInstallFunction(Notification, "$notify");

export * from "./types";
