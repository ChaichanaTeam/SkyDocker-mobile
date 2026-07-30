import { SocialButton } from "@/components/shared/auth/SocialButton";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { colors } from "@/theme";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "../../../../../assets/icons";

export const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSignIn = () => {
    router.push({
      pathname: "/(auth)/passcreen",
      params: { mode: "single" },
    });
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
        <View style={styles.container}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor={colors.backgroundWhite80}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <Text style={styles.hint}>
        We will send a confirmation link to your email
      </Text>

      <TouchableOpacity
        style={styles.signInButton}
        activeOpacity={0.8}
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={{ color: colors.backgroundWhite80, fontSize: 14 }}>
              Dont have an account?{" "}
              <Text style={{ color: colors.backgroundWhite, fontWeight: "600" }}>
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
        <SocialButton
          label="Continue with Google"
          Icon={icons.Google}
          iconWidth={19}
          iconHeight={20}
          color={colors.backgroundWhite}
          onPress={() => {}}
        />
        <SocialButton
          label="Continue with Facebook"
          Icon={icons.Facebook}
          iconWidth={20}
          iconHeight={20}
          color={colors.backgroundWhite}
          onPress={() => {}}
        />
        <SocialButton
          label="Continue with X"
          Icon={icons.X}
          iconWidth={20}
          iconHeight={18}
          color={colors.backgroundWhite}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
};
