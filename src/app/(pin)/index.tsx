import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PinPad } from "@/components/pin-pad";
import { useAuth } from "@/context/AuthContext";

const PIN_LENGTH = 4;

const CreatePinView = () => {
  const { setupPin } = useAuth();
  const [stage, setStage] = useState<"create" | "confirm">("create");
  const [firstPin, setFirstPin] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (value.length < PIN_LENGTH) {
      return;
    }
    if (stage === "create") {
      setFirstPin(value);
      setValue("");
      setStage("confirm");
      setError("");
    } else if (value === firstPin) {
      setupPin(value);
    } else {
      setError("PIN-коды не совпадают, попробуйте снова");
      setFirstPin("");
      setValue("");
      setStage("create");
    }
  }, [value]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {stage === "create" ? "Придумайте PIN-код" : "Повторите PIN-код"}
        </Text>
        <Text style={styles.subtitle}>
          Он будет запрашиваться при каждом новом запуске приложения
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <PinPad value={value} onChange={setValue} />
    </SafeAreaView>
  );
};

const EnterPinView = () => {
  const { unlock, logout } = useAuth();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (value.length < PIN_LENGTH) {
      return;
    }
    unlock(value).then((success) => {
      if (!success) {
        setError("Неверный PIN-код");
        setValue("");
      }
    });
  }, [value]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Введите PIN-код</Text>
        <Text style={styles.subtitle}>Доступ к приложению заблокирован</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <PinPad value={value} onChange={setValue} />
      <TouchableOpacity style={styles.logoutLink} onPress={logout}>
        <Text style={styles.logoutLinkText}>Забыли PIN-код? Выйти из аккаунта</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const PinScreen = () => {
  const { hasPin } = useAuth();
  return hasPin ? <EnterPinView /> : <CreatePinView />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
    gap: 40,
  },
  header: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f0f0f",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#606060",
    textAlign: "center",
  },
  error: {
    fontSize: 13,
    color: "#c22b2b",
    marginTop: 8,
    textAlign: "center",
  },
  logoutLink: {
    marginTop: 8,
  },
  logoutLinkText: {
    fontSize: 14,
    color: "#606060",
    textDecorationLine: "underline",
  },
});

export default PinScreen;
