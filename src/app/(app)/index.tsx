import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/auth-api";

interface UserData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const AppHomeScreen = () => {
  const { token, lock, logout } = useAuth();
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }
    authApi
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUserData(res.data))
      .catch((error) => console.error("Не удалось получить профиль: ", error))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Профиль</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e02b2b" style={styles.loader} />
      ) : (
        <View style={styles.card}>
          {userData ? (
            <>
              <Text style={styles.info}>
                Имя: {userData.firstName} {userData.lastName}
              </Text>
              <Text style={styles.info}>Логин: {userData.username}</Text>
              <Text style={styles.info}>Email: {userData.email}</Text>
            </>
          ) : (
            <Text style={styles.info}>Не удалось загрузить данные профиля</Text>
          )}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={lock} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Заблокировать</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0f0f0f",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  info: {
    fontSize: 15,
    color: "#0f0f0f",
  },
  actions: {
    marginTop: "auto",
    gap: 10,
  },
  button: {
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f0f0f",
  },
  logoutButton: {
    backgroundColor: "#fbdada",
  },
  logoutButtonText: {
    color: "#c22b2b",
  },
});

export default AppHomeScreen;
