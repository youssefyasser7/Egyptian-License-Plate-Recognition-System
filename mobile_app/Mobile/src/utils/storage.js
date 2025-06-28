import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const getFromStorage = async (key) => {
  return await AsyncStorage.getItem(key);
};

export const removeFromStorage = async (key) => {
  await AsyncStorage.removeItem(key);
};
