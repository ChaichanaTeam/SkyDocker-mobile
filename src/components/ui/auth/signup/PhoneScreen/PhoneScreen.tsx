import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import { useSignUp } from "@app/api/context/SignUpContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

type SignInScreenProps = {
  onPressRegion?: () => void;
};

const REGIONS = [
  { name: "Poland", dialCode: "+48" },
  { name: "Ukraine", dialCode: "+380" },
] as const;

type Region = (typeof REGIONS)[number];

const DEFAULT_REGION = REGIONS[0];

export const PhoneScreen = ({ onPressRegion }: SignInScreenProps) => {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setPhone: savePhone } = useSignUp();

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly) return;

    savePhone(`${region.dialCode}${digitsOnly}`);
    router.push("/(auth)/passcreen");
  };

  const handleSelectRegion = (selectedRegion: Region) => {
    setRegion(selectedRegion);
    setIsDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    if (onPressRegion) {
      onPressRegion();
    } else {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextField style={styles.title} variant="title">
        Enter Phone Number
      </TextField>

      <TextField style={styles.subtitle} variant="subtitle">
        Please write phone number
      </TextField>

      <View style={styles.inputWrapper}>
        <View style={styles.container}>
          <TextField style={styles.label} variant="label">
            Region/Country
          </TextField>

          <Button
            style={styles.regionRow}
            variant="text"
            activeOpacity={0.7}
            onPress={handleToggleDropdown}
          >
            <TextField style={styles.regionText}>
              {region.name} ({region.dialCode})
            </TextField>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.backgroundWhite}
            />
          </Button>

          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {REGIONS.filter((item) => item.name !== region.name).map(
                (item) => (
                  <Button
                    key={item.name}
                    style={styles.dropdownItem}
                    variant="text"
                    activeOpacity={0.7}
                    onPress={() => handleSelectRegion(item)}
                  >
                    <TextField style={styles.dropdownItemText}>
                      {item.name} ({item.dialCode})
                    </TextField>
                  </Button>
                ),
              )}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.phoneRow}>
            <InputField
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="123-45-67"
              placeholderTextColor={colors.backgroundWhite80}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Button
          text="Back"
          onPress={handleBack}
          size="small"
          variant="text"
          activeOpacity={0.7}
        />

        <Button
          text="Next"
          onPress={handleNext}
          disabled={!phone.replace(/\D/g, "")}
          size="small"
          variant="secondary"
          activeOpacity={0.8}
        />
      </View>
    </ScrollView>
  );
};
