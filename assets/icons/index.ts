import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

import DroneIcon from "@assets/icons/Drone.svg";
import EyeOff from "@assets/icons/Eye-off.svg";
import Eye from "@assets/icons/Eye.svg";
import Facebook from "@assets/icons/Facebook.svg";
import Google from "@assets/icons/Google.svg";
import Mail from "@assets/icons/Mail.svg";
import Phone from "@assets/icons/Phone.svg";
import UserIcon from "@assets/icons/User.svg";
import X from "@assets/icons/X.svg";

type IconName =
  | "DroneIcon"
  | "Eye"
  | "EyeOff"
  | "Facebook"
  | "Google"
  | "Mail"
  | "Phone"
  | "UserIcon"
  | "X";

export const icons: Record<IconName, FC<SvgProps>> = {
  Phone,
  Facebook,
  X,
  Google,
  Mail,
  Eye,
  EyeOff,
  DroneIcon,
  UserIcon,
};

export { DroneIcon, UserIcon };
