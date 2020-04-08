import { AsyncStorage } from 'react-native';

export default class LocalStorage {
  static set(key, value) {
    return AsyncStorage.setItem(key, value.toString());
  }

  static get(key) {
    return AsyncStorage.getItem(key);
  }

  static remove(key) {
    return AsyncStorage.removeItem(key);
  }

  static clear() {
    return AsyncStorage.clear();
  }
}
