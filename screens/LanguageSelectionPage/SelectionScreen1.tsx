import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton, TextInput } from "react-native-paper";

const widths = Dimensions.get("window").width;
const heights = Dimensions.get("window").height;

const SelectionScreen1 = () => {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleChangeText = (value: any) => {
    setText(value);
    // Basit bir örnek hata kontrolü
    if (value.length < 3) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.logoContent}>
        <Text style={styles.logo}>Word Lingo</Text>
      </View>

      <View style={styles.textContainer}>
        <Text>What's Your Name ?</Text>
        <View style={styles.container}>
          <TextInput
            label="name"
            value={text}
            onChangeText={handleChangeText}
            mode="outlined" // veya "flat"
            style={styles.input}
            error={error}
            theme={{
              roundness: 50,
            }}
          />
          {error && (
            <Text style={styles.errorText}>
              Minimum 3 karakter girmelisiniz
            </Text>
          )}
        </View>
      </View>

      <View style={styles.icon}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoContent: {
    alignItems: "center",
  },

  section2: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 30,
  },
  container: {
    width: widths * 0.9,
    height: heights * 0.1,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  },
});

export default SelectionScreen1;
