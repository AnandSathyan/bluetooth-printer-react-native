"use client"

import { useState } from "react"
import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
import ApiDebugView from "./ApiDebugView"
import { apiDebugStore } from "../utils/api"
import { __DEV__ } from "react-native"

const ApiDebugButton = () => {
  const [showDebug, setShowDebug] = useState(false)

  // Only show in development mode
  if (!__DEV__) return null

  return (
    <>
      <TouchableOpacity
        style={[styles.debugButton, apiDebugStore.isUsingMockData ? styles.mockDataButton : styles.liveDataButton]}
        onPress={() => setShowDebug(true)}
      >
        <Text style={styles.debugButtonText}>{apiDebugStore.isUsingMockData ? "🔄 Mock" : "🔴 Live"}</Text>
      </TouchableOpacity>

      {showDebug && (
        <View style={styles.debugOverlay}>
          <ApiDebugView visible={showDebug} onClose={() => setShowDebug(false)} />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  liveDataButton: {
    backgroundColor: "rgba(220, 53, 69, 0.8)",
  },
  mockDataButton: {
    backgroundColor: "rgba(255, 193, 7, 0.8)",
  },
  debugButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  debugOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    zIndex: 1001,
  },
})

export default ApiDebugButton
