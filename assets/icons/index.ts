import React from "react";
import { SvgProps } from "react-native-svg";
import EyeOff from "./Eye-off.svg";
import Eye from "./Eye.svg";
import Facebook from "./Facebook.svg";
import Google from "./Google.svg";
import Mail from "./Mail.svg";
import Phone from "./Phone.svg";
import X from "./X.svg";

export const icons: { [key: string]: React.FC<SvgProps> } = {
  Phone,
  Facebook,
  X,
  Google,
  Mail,
  Eye,
  EyeOff,
};
