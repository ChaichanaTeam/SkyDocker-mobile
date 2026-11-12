import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { TextField } from "@/components/shared/ui/Text/TextField";
import { DOCUMENT_TYPE_TITLES } from "@/validators/types/documentTypes";
import type { VerificationDocumentType } from "@app/api/types/pilots";
import { profileStyles as styles } from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";

type Props = {
  value: VerificationDocumentType | null;
  options: VerificationDocumentType[];
  locked?: boolean;
  onChange: (value: VerificationDocumentType) => void;
};

export const DocumentTypeSelect = ({
  value,
  options,
  locked,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable
        disabled={locked}
        onPress={() => setOpen((o) => !o)}
        style={styles.selectRow}
      >
        <TextField
          style={value ? styles.selectValue : styles.selectPlaceholder}
        >
          {value ? DOCUMENT_TYPE_TITLES[value] : "File type"}
        </TextField>
        {!locked && (
          <Ionicons
            color="#9A9A9A"
            name={open ? "chevron-up" : "chevron-down"}
            size={18}
          />
        )}
      </Pressable>

      {open && (
        <View style={styles.selectList}>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              style={styles.selectOption}
            >
              <TextField style={styles.selectValue}>
                {DOCUMENT_TYPE_TITLES[option]}
              </TextField>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
