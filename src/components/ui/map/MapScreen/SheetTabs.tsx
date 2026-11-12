import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import { CheckIn } from "@assets/icons";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { tabsStyles as styles } from "@components/ui/map/MapScreen/styles/SheetTabs.styles";

export type SheetTab = "checkin" | "wiki" | "profile";

type Props = {
  active: SheetTab;
  onCheckInPress?: () => void;
  onWikiPress?: () => void;
  onProfilePress?: () => void;
};

export const SheetTabs = ({
  active,
  onCheckInPress,
  onWikiPress,
  onProfilePress,
}: Props) => {
  const tabs = [
    { key: "checkin", label: "Check in", onPress: onCheckInPress },
    { key: "wiki", label: "Wiki", onPress: onWikiPress },
    { key: "profile", label: "Profile", onPress: onProfilePress },
  ] as const;

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = tab.key === active;
        const iconColor = isActive ? "#FFFFFF" : colors.text5;

        return (
          <Pressable
            key={tab.key}
            onPress={tab.onPress}
            style={[
              styles.tab,
              index > 0 && styles.tabDivider,
              isActive && styles.tabActive,
            ]}
          >
            {tab.key === "checkin" ? (
              <CheckIn height={14} width={14} />
            ) : (
              <Ionicons
                color={iconColor}
                name={tab.key === "wiki" ? "book-outline" : "person-outline"}
                size={14}
              />
            )}
            <TextField style={[styles.text, isActive && styles.textActive]}>
              {tab.label}
            </TextField>
          </Pressable>
        );
      })}
    </View>
  );
};
