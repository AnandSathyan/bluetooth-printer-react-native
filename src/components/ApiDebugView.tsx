"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native"
import { apiDebugStore } from "../utils/api"
import api from "../utils/api" // Declare the api variable

interface ApiDebugViewProps {
  visible: boolean
  onClose: () => void
}

const ApiDebugView = ({ visible, onClose }: ApiDebugViewProps) => {
  const [selectedItem, setSelectedItem] = useState(null)

  const renderValue = (value: any, depth = 0): React.ReactNode => {
    if (value === null || value === undefined) {
      return <Text style={styles.nullValue}>null</Text>
    }

    if (typeof value === "string") {
      return <Text style={styles.stringValue}>"{value}"</Text>
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return <Text style={styles.numberValue}>{String(value)}</Text>
    }

    if (Array.isArray(value)) {
      if (depth > 2) return <Text style={styles.arrayValue}>[Array]</Text>
      return (
        <View style={styles.arrayContainer}>
          <Text style={styles.arrayValue}>[</Text>
          {value.map((item, index) => (
            <View key={index} style={styles.arrayItem}>
              {renderValue(item, depth + 1)}
              {index < value.length - 1 && <Text style={styles.comma}>,</Text>}
            </View>
          ))}
          <Text style={styles.arrayValue}>]</Text>
        </View>
      )
    }

    if (typeof value === "object") {
      if (depth > 2) return <Text style={styles.objectValue}>{"{Object}"}</Text>
      return (
        <View style={styles.objectContainer}>
          <Text style={styles.objectValue}>{"{"}</Text>
          {Object.entries(value).map(([key, val], index, arr) => (
            <View key={key} style={styles.objectItem}>
              <Text style={styles.objectKey}>{key}: </Text>
              {renderValue(val, depth + 1)}
              {index < arr.length - 1 && <Text style={styles.comma}>,</Text>}
            </View>
          ))}
          <Text style={styles.objectValue}>{"}"}</Text>
        </View>
      )
    }

    return <Text>{String(value)}</Text>
  }

  const renderDetailView = () => {
    if (!selectedItem) return null

    return (
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.detailModal}>
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>
                {selectedItem.type === "success" ? "✅ " : "❌ "}
                {selectedItem.endpoint}
              </Text>
              <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Request:</Text>
                {renderValue(selectedItem.request)}
              </View>

              {selectedItem.type === "success" ? (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Response:</Text>
                  {renderValue(selectedItem.response)}
                </View>
              ) : (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Error:</Text>
                  {renderValue(selectedItem.error)}
                </View>
              )}

              <Text style={styles.timestamp}>{new Date(selectedItem.timestamp).toLocaleString()}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    )
  }

  if (!visible) return null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API Debug</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>API URL:</Text>
        <Text style={styles.statusValue}>
          {apiDebugStore.isUsingMockData ? "Using Mock Data" : api.defaults.baseURL}
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Recent API Calls</Text>
      <ScrollView style={styles.historyList}>
        {apiDebugStore.history.length === 0 ? (
          <Text style={styles.emptyText}>No API calls recorded yet</Text>
        ) : (
          apiDebugStore.history.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.historyItem, item.type === "error" ? styles.errorItem : styles.successItem]}
              onPress={() => setSelectedItem(item)}
            >
              <Text style={styles.historyEndpoint} numberOfLines={1}>
                {item.type === "success" ? "✅ " : "❌ "}
                {item.endpoint}
              </Text>
              <Text style={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {renderDetailView()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#343a40",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#495057",
    borderRadius: 4,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#e9ecef",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  statusLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  statusValue: {
    flex: 1,
  },
  sectionHeader: {
    padding: 12,
    fontWeight: "bold",
    backgroundColor: "#e9ecef",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  successItem: {
    backgroundColor: "#d4edda",
  },
  errorItem: {
    backgroundColor: "#f8d7da",
  },
  historyEndpoint: {
    flex: 1,
    fontWeight: "500",
  },
  historyTime: {
    color: "#6c757d",
    fontSize: 12,
  },
  emptyText: {
    padding: 16,
    textAlign: "center",
    color: "#6c757d",
    fontStyle: "italic",
  },
  detailModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  detailContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  detailContent: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 14,
  },
  timestamp: {
    textAlign: "right",
    color: "#6c757d",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 8,
  },
  objectContainer: {
    marginLeft: 8,
  },
  objectItem: {
    marginLeft: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  objectKey: {
    color: "#7952b3",
    fontWeight: "500",
  },
  objectValue: {
    color: "#212529",
  },
  arrayContainer: {
    marginLeft: 8,
  },
  arrayItem: {
    marginLeft: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  arrayValue: {
    color: "#212529",
  },
  stringValue: {
    color: "#28a745",
  },
  numberValue: {
    color: "#fd7e14",
  },
  nullValue: {
    color: "#6c757d",
    fontStyle: "italic",
  },
  comma: {
    color: "#212529",
  },
})

export default ApiDebugView
