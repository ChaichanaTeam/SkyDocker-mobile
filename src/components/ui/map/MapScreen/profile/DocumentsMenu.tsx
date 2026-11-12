import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";

type Props = { onOpenList: () => void; onOpenAdd: () => void };

export const DocumentsMenu = ({ onOpenList, onOpenAdd }: Props) => (
  <>
    <TextField style={styles.sectionTitle}>Documents</TextField>
    <View style={styles.list}>
      <Pressable onPress={onOpenList} style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons
            color={colors.pressableActive1}
            name="document-text-outline"
            size={24}
          />
        </View>
        <View style={styles.cardTexts}>
          <TextField style={styles.cardTitle}>Documents</TextField>
          <TextField style={styles.cardSubtitle}>
            All your doc&apos;s are here
          </TextField>
        </View>
        <Ionicons color="#9A9A9A" name="chevron-forward" size={18} />
      </Pressable>

      <Pressable onPress={onOpenAdd} style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons color={colors.pressableActive1} name="add" size={24} />
        </View>
        <View style={styles.cardTexts}>
          <TextField style={styles.cardTitle}>Add documents</TextField>
          <TextField style={styles.cardSubtitle}>missing doc&apos;s?</TextField>
        </View>
        <Ionicons color="#9A9A9A" name="chevron-forward" size={18} />
      </Pressable>
    </View>
  </>
);
