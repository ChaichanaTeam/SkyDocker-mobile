import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";

import { useDocuments } from "@/hooks/useDocuments";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import { getMyDocuments } from "@app/api/services/pilots.service";
import type {
  PilotDocument,
  VerificationDocumentType,
} from "@app/api/types/pilots";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";
import { DOCUMENT_TYPE_TITLES } from "@/validators/types/documentTypes";
import { getApiErrorMessages } from "@/utils/apiErrorMessages";

export const DocumentsList = () => {
  const { data, loading, error, reload } = useDocuments();

  const openDocument = async (document: PilotDocument) => {
    try {
      const documents = await getMyDocuments();
      const freshDocument = documents.find(
        (item) =>
          item.document_type === document.document_type &&
          item.size === document.size &&
          item.uploaded_at === document.uploaded_at,
      );

      if (!freshDocument) {
        throw new Error("This document is no longer available.");
      }

      await WebBrowser.openBrowserAsync(freshDocument.url);
    } catch (openError: unknown) {
      Alert.alert(
        "Unable to open document",
        getApiErrorMessages(openError)[0],
      );
    }
  };

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
            <Pressable
              key={document.url}
              accessibilityRole="button"
              accessibilityLabel={`Open ${document.document_type} document`}
              onPress={() => openDocument(document)}
              style={styles.card}
            >
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
              <Ionicons color="#9A9A9A" name="chevron-forward" size={18} />
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
};
