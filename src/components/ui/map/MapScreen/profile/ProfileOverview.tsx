import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import type { PilotProfile } from "@app/api/types/pilots";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";

type QuickAction = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

type Props = {
  profile: PilotProfile | null;
  isLoading: boolean;
  onDocumentsPress: () => void;
  onSettingsPress?: () => void;
  onMyDronesPress?: () => void;
  onMissionPress?: () => void;
};

export const ProfileOverview = ({
  profile,
  isLoading,
  onDocumentsPress,
  onSettingsPress,
  onMyDronesPress,
  onMissionPress,
}: Props) => {
  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ");
  const title = fullName || profile?.email || "—";
  const actions: QuickAction[] = [
    {
      key: "documents",
      title: "Documents",
      subtitle: "Manage your documents",
      icon: (
        <Ionicons
          color={colors.pressableActive1}
          name="document-text-outline"
          size={24}
        />
      ),
      onPress: onDocumentsPress,
    },
    {
      key: "drones",
      title: "My drones",
      subtitle: "Manage your fleet",
      icon: (
        <MaterialCommunityIcons
          color={colors.pressableActive1}
          name="quadcopter"
          size={26}
        />
      ),
      onPress: onMyDronesPress,
    },
    {
      key: "mission",
      title: "Mission",
      subtitle: "day photoshoot: 40D:12h:24min",
      icon: (
        <Ionicons
          color={colors.pressableActive1}
          name="calendar-outline"
          size={24}
        />
      ),
      onPress: onMissionPress,
    },
  ];

  return (
    <>
      <View style={styles.header}>
        <Pressable onPress={onSettingsPress} style={styles.settingsButton}>
          <Ionicons color="#1B2340" name="settings-outline" size={20} />
        </Pressable>

        <View style={styles.avatar}>
          <Ionicons color="#D9D6F2" name="person-outline" size={48} />
        </View>

        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : (
          <>
            <TextField style={styles.userId}>{title}</TextField>
            {profile?.pilot_number && (
              <TextField style={styles.phone}>{profile.pilot_number}</TextField>
            )}
            {profile?.phone_number && (
              <TextField style={styles.phone}>{profile.phone_number}</TextField>
            )}
          </>
        )}
      </View>

      <TextField style={styles.sectionTitle}>Quick Actions</TextField>
      <View style={styles.list}>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            onPress={action.onPress}
            style={styles.card}
          >
            <View style={styles.iconBox}>{action.icon}</View>
            <View style={styles.cardTexts}>
              <TextField style={styles.cardTitle}>{action.title}</TextField>
              <TextField style={styles.cardSubtitle}>
                {action.subtitle}
              </TextField>
            </View>
            <Ionicons color="#9A9A9A" name="chevron-forward" size={18} />
          </Pressable>
        ))}
      </View>
    </>
  );
};
