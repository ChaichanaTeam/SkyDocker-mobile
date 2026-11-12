import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

import { useDocuments } from "@/hooks/useDocuments";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import type { VerificationDocumentType } from "@app/api/types/pilots";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";
import { DOCUMENT_TYPE_TITLES } from "@/validators/types/documentTypes";

export const DocumentsList = () => {
  const { data, loading, error, reload } = useDocuments();

  return (
    <>
      <TextField style={styles.sectionTitle}>Documents</TextField>

      {loading && <ActivityIndicator style={{ marginTop: 24 }} />}

      {!loading && error && (
        <Pressable onPress={reload}>
          <TextField style={styles.emptyText}>{error}. Tap to retry</TextField>
        </Pressable>
      )}

      {!loading && !error && data?.length === 0 && (
        <TextField style={styles.emptyText}>
          No approved documents yet
        </TextField>
      )}

      {!loading && !error && data && data.length > 0 && (
        <View style={styles.list}>
          {data.map((document) => (
            <View key={document.url} style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons
                  color={colors.pressableActive1}
                  name="document-text-outline"
                  size={24}
                />
              </View>
              <View style={styles.cardTexts}>
                <TextField style={styles.cardTitle}>
                  {Object.prototype.hasOwnProperty.call(
                    DOCUMENT_TYPE_TITLES,
                    document.document_type,
                  )
                    ? DOCUMENT_TYPE_TITLES[
                        document.document_type as VerificationDocumentType
                      ]
                    : document.document_type}
                </TextField>
                <TextField style={styles.cardSubtitle}>
                  Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                </TextField>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
};
