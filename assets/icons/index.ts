import EyeOff from "@assets/icons/Eye-off.svg";
import Eye from "@assets/icons/Eye.svg";
import Facebook from "@assets/icons/Facebook.svg";
import Google from "@assets/icons/Google.svg";
import Mail from "@assets/icons/Mail.svg";
import Phone from "@assets/icons/Phone.svg";
import X from "@assets/icons/X.svg";
import React from "react";
import { SvgProps } from "react-native-svg";

export const icons: { [key: string]: React.FC<SvgProps> } = {
  Phone,
  Facebook,
  X,
  Google,
  Mail,
  Eye,
  EyeOff,
};
