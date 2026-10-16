import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/context/AuthContext";

const InitialLayout = () => {
  const { token, isUnlocked, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const group = segments[0];

    if (!token) {
      if (group !== "(auth)") {
        router.replace("/(auth)/login");
      }
    } else if (!isUnlocked) {
      if (group !== "(pin)") {
        router.replace("/(pin)");
      }
    } else if (group !== "(app)") {
      router.replace("/(app)");
    }
  }, [token, isUnlocked, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#e02b2b" />
      </View>
    );
  }

  return <Slot />;
};

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
