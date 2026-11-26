import { ActivityIndicator, Pressable } from "react-native";

import { TextField } from "@/components/shared/ui/Text/TextField";
import { useDocuments } from "@/hooks/useDocuments";
import { useProfile } from "@/hooks/useProfile";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";

import { AddDocumentFormBody } from "@/components/ui/map/MapScreen/profile/AddDocumentFormBody";

type Props = { onDone: () => void };

export const AddDocumentForm = ({ onDone }: Props) => {
  const profileState = useProfile();
  const documentsState = useDocuments();

  if (profileState.loading || documentsState.loading)
    return <ActivityIndicator style={{ marginTop: 24 }} />;

  const { data: profile, error: profileError, reload: reloadProfile } = profileState;
  const { data: documents, error: documentsError, reload: reloadDocuments } = documentsState;

  if (profileError || documentsError || !profile || !documents) {
    return (
      <Pressable
        onPress={() => {
          reloadProfile();
          reloadDocuments();
        }}
      >
        <TextField style={styles.emptyText}>
          {profileError ?? documentsError ?? "Failed to load profile"}. Tap to
          retry
        </TextField>
      </Pressable>
    );
  }

  return (
    <AddDocumentFormBody
      profile={profile}
      documents={documents}
      onDone={onDone}
    />
  );
};
