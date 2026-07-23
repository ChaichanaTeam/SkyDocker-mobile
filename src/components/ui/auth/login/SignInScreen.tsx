import { SocialButton } from "@/components/shared/auth/SocialButton";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { icons } from "../../../../../assets/icons";

const REGIONS = [
  { name: "Belarus", dialCode: "+375" },
  { name: "Poland", dialCode: "+48" },
  { name: "Ukraine", dialCode: "+380" },
] as const;

type Region = (typeof REGIONS)[number];

const DEFAULT_REGION = REGIONS[0];

type AuthMethod = "phone" | "email";

type SignInScreenProps = {
  onPressRegion?: () => void;
};

export const SignInScreen = ({ onPressRegion }: SignInScreenProps) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const isPhone = authMethod === "phone";

  const handleSelectRegion = (selectedRegion: Region) => {
    setRegion(selectedRegion);
    setIsPickerVisible(false);
  };

  const handleOpenRegionPicker = () => {
    if (onPressRegion) {
      onPressRegion();
    } else {
      setIsPickerVisible(true);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>You do have an account, right?</Text>

      <View style={styles.inputWrapper}>
        {isPhone ? (
          <View style={styles.container}>
            <Text style={styles.label}>Region/Country</Text>

            <TouchableOpacity
              style={styles.regionRow}
              activeOpacity={0.7}
              onPress={handleOpenRegionPicker}
            >
              <Text style={styles.regionText}>
                {region.name} ({region.dialCode})
              </Text>
              <Ionicons name="chevron-down" size={18} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.phoneRow}>
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="(29) 123-45-67"
                placeholderTextColor="#FFFFFF80"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.emailInput}
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor="#FFFFFF80"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}
      </View>

      <Text style={styles.hint}>
        {isPhone
          ? "We will sent you a message with confirmation code"
          : "We will send a confirmation link to your email"}
      </Text>

      <TouchableOpacity style={styles.signInButton} activeOpacity={0.8}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={{ color: "#FFFFFF80", fontSize: 14 }}>
              Dont have an account?{" "}
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialList}>
        {isPhone ? (
          <SocialButton
            label="Continue with Email"
            Icon={icons.Mail}
            iconWidth={20}
            iconHeight={18}
            color="#ffffff"
            onPress={() => setAuthMethod("email")}
          />
        ) : (
          <SocialButton
            label="Continue with Phone"
            Icon={icons.Phone}
            iconWidth={14}
            iconHeight={20}
            color="#ffffff"
            onPress={() => setAuthMethod("phone")}
          />
        )}
        <SocialButton
          label="Continue with Google"
          Icon={icons.Google}
          iconWidth={19}
          iconHeight={20}
          color="#ffffff"
          onPress={() => {}}
        />
        <SocialButton
          label="Continue with Facebook"
          Icon={icons.Facebook}
          iconWidth={20}
          iconHeight={20}
          color="#ffffff"
          onPress={() => {}}
        />
        <SocialButton
          label="Continue with X"
          Icon={icons.X}
          iconWidth={20}
          iconHeight={18}
          color="#ffffff"
          onPress={() => {}}
        />
      </View>

      <Modal
        visible={isPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Region</Text>
              {REGIONS.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  style={styles.modalOption}
                  onPress={() => handleSelectRegion(item)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      region.name === item.name && styles.modalOptionSelected,
                    ]}
                  >
                    {item.name} ({item.dialCode})
                  </Text>
                  {region.name === item.name && (
                    <Ionicons name="checkmark" size={18} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};
