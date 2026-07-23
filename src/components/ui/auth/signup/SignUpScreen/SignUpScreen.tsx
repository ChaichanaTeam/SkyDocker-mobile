import { SocialButton } from "@/components/shared/auth/SocialButton";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Ionicons } from "@expo/vector-icons";
import { icons } from "../../../../../../assets/icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
const DEFAULT_REGION = { name: "Belarus", dialCode: "+375" };

type AuthMethod = "phone" | "email";

type SignUpScreenProps = {
  onPressRegion?: () => void;
};

export const SignUpScreen = ({ onPressRegion }: SignUpScreenProps) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region] = useState(DEFAULT_REGION);

  const isPhone = authMethod === "phone";

  const handleSignUp = () => {
    router.push("/(auth)/passcreen");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Let get you started</Text>

      <View style={styles.inputWrapper}>
        {isPhone ? (
          <View style={styles.container}>
            <Text style={styles.label}>Region/Country</Text>

            <TouchableOpacity
              style={styles.regionRow}
              activeOpacity={0.7}
              onPress={onPressRegion}
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

      <TouchableOpacity
        style={styles.signInButton}
        activeOpacity={0.8}
        onPress={handleSignUp}
      >
        <Text style={styles.signInButtonText}>Sign Up</Text>
      </TouchableOpacity>

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
    </ScrollView>
  );
};
