import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomePage() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={{
                uri: 'https://www.pegasustech.net/image/catalog/pegasus-logob.png',
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Select Package Preference</Text>
        <Text style={styles.subheading}>How would you like to enjoy your meal?</Text>

        {/* Options */}
        <View style={styles.optionGroup}>
          <TouchableOpacity
            style={[styles.optionButton,{ marginBottom: 20 }]}
            onPress={() => navigation.navigate('FoodOrderingKiosk')}
          >
            <Text style={styles.emoji}>👜</Text>
            <Text style={styles.optionTitle}>Take Away</Text>
            <Text style={styles.optionDescription}>
              Busy day? We’ll pack your meal for you to take away
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.emoji}>🍽️</Text>
            <Text style={styles.optionTitle}>Eat Here</Text>
            <Text style={styles.optionDescription}>
              Enjoy your meal in our comfy seating area
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Switcher */}
        <View style={styles.languageSwitcher}>
          <View style={styles.languageOption}>
            <Image
              source={{
                uri: 'https://cdn.britannica.com/33/4833-050-F6E415FE/Flag-United-States-of-America.jpg',
              }}
              style={styles.flag}
            />
            <Text style={styles.languageLabel}>Eng</Text>
          </View>

          <View style={styles.languageOption}>
            <Image
              source={{
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANUAAACfCAMAAABZXWy7AAAAQlBMVEUAej3OESb///8AAAAAbR/KAAClpaUAfT7XEijTESefDR3KESUAYDAAMxlaBxAAOBwAWy4AcC2tqayjrazGAA5TBg/K3apjAAABYklEQVR4nO3WWU7DUBQEUV8eMyTM+98qCYQMju0Po8iqVp0V3FLrWe46SZIkSZIkSZIkSZrjbukDLqE9J2a19hI4V9vIm2tblTdX+xU2164qbK62lzTXoSpprnYsZq6Tqpi5Ws9rRFa/qq0S5jqrinhdA1UBcw1V8V/XcBV9rpEq+OsarWqrt2uqiar2fkU1VXW79HGzWcVhFYdVHFZxWMVhFYdVHFZxWMVhFYdVHFZxWMVhFYdVHFZxWMVhFYdVHFZxWMVhFYdVHFZxWMUxVfWx9HGzTVStP2+oxqse7wtrrGr99LD0af8wUkUeqkaq2EPVcBV8qBqq+qIPVQNV/KHqrGpd/KGqXxUxVJ1W4T99e13eUHVUlTNUHaqChqq/qqihaleVNVT9VKUNVduquKE2uoyfiZ5u6QMuwioOqzis4rCKwyoOqzis4rCKwyoOqzis4rCKwyoOqzis4rCKI7PqG1VnmIYHIpIuAAAAAElFTkSuQmCC',
              }}
              style={[styles.flag]}
            />
            <Text style={styles.languageLabel}>Arb</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoCircle: {
    width: 96,
    height: 96,
    backgroundColor: '#E9D5FF',
    borderRadius: 48,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionGroup: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
    marginBottom: 40,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
    color: '#9333ea',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 16,
  },
  languageOption: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flag: {
    width: 45,
    height: 30,
    borderRadius: 4,
  },
  languageLabel: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
});
