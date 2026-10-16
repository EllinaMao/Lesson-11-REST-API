import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

interface PinPadProps {
  value: string;
  onChange: (value: string) => void;
}

export const PinPad = ({ value, onChange }: PinPadProps) => {
  const press = (key: string) => {
    if (key === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "" || value.length >= PIN_LENGTH) {
      return;
    }
    onChange(value + key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View key={index} style={[styles.dot, index < value.length && styles.dotFilled]} />
        ))}
      </View>

      <View style={styles.grid}>
        {KEYS.map((key, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.key, key === "" && styles.keyHidden]}
            onPress={() => press(key)}
            disabled={key === ""}
            activeOpacity={0.6}
          >
            <Text style={styles.keyText}>{key === "del" ? "⌫" : key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 32,
  },
  dots: {
    flexDirection: "row",
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#c0c0c0",
  },
  dotFilled: {
    backgroundColor: "#e02b2b",
    borderColor: "#e02b2b",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 3 * 72,
    justifyContent: "center",
  },
  key: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  keyHidden: {
    opacity: 0,
  },
  keyText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#0f0f0f",
  },
});
