import { View, Text, StyleSheet, ScrollView } from "react-native"
import env from "../config/env"

/**
 * A debug component to display environment variables
 * Only use this during development!
 */
const EnvDebug = () => {
  if (!env.IS_DEV) {
    return null // Don't show in production
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Environment Variables</Text>

      <View style={styles.row}>
        <Text style={styles.label}>API URL:</Text>
        <Text style={styles.value}>{env.API_URL_ADMIN_PANEL}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Platform:</Text>
        <Text style={styles.value}>{env.PLATFORM}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Development Mode:</Text>
        <Text style={styles.value}>{env.IS_DEV ? "Yes" : "No"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>App Version:</Text>
        <Text style={styles.value}>{env.APP_VERSION}</Text>
      </View>

      <Text style={styles.note}>Note: This debug panel only appears in development mode.</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    maxHeight: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: 120,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  note: {
    marginTop: 12,
    fontStyle: "italic",
    color: "#666",
    fontSize: 12,
  },
})

export default EnvDebug
