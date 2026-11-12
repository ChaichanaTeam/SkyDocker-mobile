import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { ActivityIndicator, Pressable, Switch, View } from "react-native";

import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import {
  previewVerification,
  submitVerification,
} from "@app/api/services/verification.service";
import type {
  PickedFile,
  PilotProfile,
  VerificationDocumentType,
} from "@app/api/types/pilots";
import { getApiErrorMessages } from "@/utils/apiErrorMessages";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  PRIVILEGE_TYPES,
} from "@/validators/types/documentTypes";
import { useProfile } from "@/hooks/useProfile";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";

import { DocumentTypeSelect } from "./DocumentTypeSelect";

type Props = { onDone: () => void };

export const AddDocumentForm = ({ onDone }: Props) => {
  const { data: profile, loading, error, reload } = useProfile();

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  if (error || !profile) {
    return (
      <Pressable onPress={reload}>
        <TextField style={styles.emptyText}>
          {error ?? "Failed to load profile"}. Tap to retry
        </TextField>
      </Pressable>
    );
  }

  return <AddDocumentFormBody profile={profile} onDone={onDone} />;
};

const AddDocumentFormBody = ({
  profile,
  onDone,
}: Props & { profile: PilotProfile }) => {
  const needsPilotNumber = !profile.pilot_number;

  const [firstName, setFirstName] = useState(profile.first_name ?? "");
  const [lastName, setLastName] = useState(profile.last_name ?? "");
  const [phone, setPhone] = useState(profile.phone_number ?? "");
  const [pilotNumber, setPilotNumber] = useState("");
  const [docType, setDocType] = useState<VerificationDocumentType | null>(
    needsPilotNumber ? "operator_number" : null,
  );
  const [file, setFile] = useState<PickedFile | null>(null);
  const [fileName, setFileName] = useState("");
  const [keepDocuments, setKeepDocuments] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ALLOWED_MIME_TYPES,
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? "";

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      setErrors(["Only PDF, JPEG or PNG files are allowed"]);
      return;
    }
    if (asset.size && asset.size > MAX_FILE_SIZE_BYTES) {
      setErrors(["File is larger than 10 MB"]);
      return;
    }

    setErrors([]);
    setFile({ uri: asset.uri, name: asset.name, mimeType });
    setFileName(asset.name);
  };

  const canSubmit =
    !!docType &&
    !!file &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    phone.trim() !== "" &&
    (!needsPilotNumber || pilotNumber.trim() !== "");

  const submit = async () => {
    if (!canSubmit || !docType || !file) return;

    setSubmitting(true);
    setErrors([]);
    try {
      const preview = await previewVerification({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.trim(),
        ...(needsPilotNumber ? { pilot_number: pilotNumber.trim() } : {}),
        keep_documents: keepDocuments,
        document_types: [docType],
      });

      await submitVerification(preview.verification_token, [
        {
          type: docType,
          file: { ...file, name: fileName.trim() || file.name },
        },
      ]);

      setSent(true);
    } catch (e) {
      setErrors(getApiErrorMessages(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.successBox}>
        <Ionicons
          color={colors.pressableActive1}
          name="checkmark-circle-outline"
          size={56}
        />
        <TextField style={styles.cardTitle}>Sent for review</TextField>
        <TextField style={styles.successText}>
          We are checking your document. Once approved, it will appear in
          Documents.
        </TextField>
        <Button text="Done" onPress={onDone} />
      </View>
    );
  }

  return (
    <>
      <TextField style={styles.sectionTitle}>Add documents</TextField>

      <View style={styles.form}>
        <InputField
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
          autoCapitalize="words"
        />
        <InputField
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
          autoCapitalize="words"
        />
        <InputField
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />

        {needsPilotNumber && (
          <InputField
            style={styles.input}
            value={pilotNumber}
            onChangeText={setPilotNumber}
            placeholder="Pilot number"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}

        <DocumentTypeSelect
          value={docType}
          options={PRIVILEGE_TYPES}
          locked={needsPilotNumber}
          onChange={setDocType}
        />

        <Pressable onPress={pickFile} style={styles.fileRow}>
          <Ionicons
            color={colors.pressableActive1}
            name={file ? "document-attach-outline" : "add"}
            size={22}
          />
          <TextField style={styles.fileRowText}>
            {file ? "Change file" : "Choose file (PDF, JPEG, PNG up to 10 MB)"}
          </TextField>
        </Pressable>

        {file && (
          <InputField
            style={styles.input}
            value={fileName}
            onChangeText={setFileName}
            placeholder="File name"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}

        <View style={styles.switchRow}>
          <TextField style={styles.switchText}>
            Keep documents for my organizer after approval
          </TextField>
          <Switch
            value={keepDocuments}
            onValueChange={setKeepDocuments}
            trackColor={{ true: colors.pressableActive1 }}
          />
        </View>

        {errors.map((msg, i) => (
          <TextField key={i} style={styles.errorText}>
            {msg}
          </TextField>
        ))}

        <Button
          text="Send for review"
          onPress={submit}
          disabled={!canSubmit}
          loading={submitting}
        />
      </View>
    </>
  );
};
