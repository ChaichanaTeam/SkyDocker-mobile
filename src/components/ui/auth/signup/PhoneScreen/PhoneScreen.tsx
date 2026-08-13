import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@app/api/context/SignUpContext";

type SignInScreenProps = {
  onPressRegion?: () => void;
};

const REGIONS = [
  { name: "Belarus", dialCode: "+375" },
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
      <Text style={styles.title}>Enter Phone Number</Text>
      <Text style={styles.subtitle}>Please write phone number</Text>

      <View style={styles.inputWrapper}>
        <View style={styles.container}>
          <Text style={styles.label}>Region/Country</Text>

          <TouchableOpacity
            style={styles.regionRow}
            activeOpacity={0.7}
            onPress={handleToggleDropdown}
          >
            <Text style={styles.regionText}>
              {region.name} ({region.dialCode})
            </Text>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.backgroundWhite}
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {REGIONS.filter((item) => item.name !== region.name).map(
                (item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.dropdownItem}
                    activeOpacity={0.7}
                    onPress={() => handleSelectRegion(item)}
                  >
                    <Text style={styles.dropdownItemText}>
                      {item.name} ({item.dialCode})
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.phoneRow}>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="(29) 123-45-67"
              placeholderTextColor={colors.backgroundWhite80}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
          disabled={!phone.replace(/\D/g, "")}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
