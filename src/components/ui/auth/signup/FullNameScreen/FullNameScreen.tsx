import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const FullNameScreen = () => {
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    router.push("/");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>And to finish this up</Text>
      <Text style={styles.subtitle}>
        Please enter your name to finish registration
      </Text>

      <View style={styles.inputWrapper}>
        <View style={styles.container}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.passwordInput}
            value={name}
            onChangeText={setName}
            placeholder="Anatoly"
            placeholderTextColor="#FFFFFF80"
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={[styles.inputWrapper, { marginTop: 50 }]}>
        <View style={styles.container}>
          <Text style={styles.label}>Second name</Text>
          <TextInput
            style={styles.passwordInput}
            value={secondName}
            onChangeText={setSecondName}
            placeholder="Fisher"
            placeholderTextColor="#FFFFFF80"
            autoCapitalize="words"
          />
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
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
