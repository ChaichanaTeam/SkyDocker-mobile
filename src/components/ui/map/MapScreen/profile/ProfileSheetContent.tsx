import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable } from "react-native";

import { TextField } from "@/components/shared/ui/Text/TextField";
import type { PilotProfile } from "@app/api/types/pilots";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";
import { AddDocumentForm } from "@components/ui/map/MapScreen/profile/AddDocumentForm";
import { DocumentsList } from "@components/ui/map/MapScreen/profile/DocumentsList";
import { DocumentsMenu } from "@components/ui/map/MapScreen/profile/DocumentsMenu";

import { ProfileOverview } from "./ProfileOverview";

export type ProfileView =
  | "profile"
  | "documents"
  | "documentsList"
  | "addDocuments";

type Props = {
  view: ProfileView;
  profile: PilotProfile | null;
  profileLoading: boolean;
  fade: Animated.Value;
  slide: Animated.Value;
  onBack: () => void;
  onDocumentsPress: () => void;
  onOpenDocumentsList: () => void;
  onOpenAddDocuments: () => void;
  onAddDocumentDone: () => void;
  onSettingsPress?: () => void;
  onMyDronesPress?: () => void;
  onMissionPress?: () => void;
};

export const ProfileSheetContent = ({
  view,
  profile,
  profileLoading,
  fade,
  slide,
  onBack,
  onDocumentsPress,
  onOpenDocumentsList,
  onOpenAddDocuments,
  onAddDocumentDone,
  onSettingsPress,
  onMyDronesPress,
  onMissionPress,
}: Props) => (
  <Animated.View style={{ opacity: fade, transform: [{ translateX: slide }] }}>
    {view !== "profile" && (
      <Pressable onPress={onBack} style={styles.backRow} hitSlop={12}>
        <Ionicons color="#1B2340" name="chevron-back" size={20} />
        <TextField style={styles.backText}>Back</TextField>
      </Pressable>
    )}

    {view === "profile" && (
      <ProfileOverview
        isLoading={profileLoading}
        onDocumentsPress={onDocumentsPress}
        onMissionPress={onMissionPress}
        onMyDronesPress={onMyDronesPress}
        onSettingsPress={onSettingsPress}
        profile={profile}
      />
    )}

    {view === "documents" && (
      <DocumentsMenu
        onOpenList={onOpenDocumentsList}
        onOpenAdd={onOpenAddDocuments}
      />
    )}
    {view === "documentsList" && <DocumentsList />}
    {view === "addDocuments" && <AddDocumentForm onDone={onAddDocumentDone} />}
  </Animated.View>
);
