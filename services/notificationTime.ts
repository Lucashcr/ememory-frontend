import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getNotificationTime(): Promise<{ hour: number; minute: number }> {
  try {
    const savedTime = await AsyncStorage.getItem('@EMem:notificationTime');
    if (savedTime) {
      return JSON.parse(savedTime);
    }
  } catch (error) {
    console.error('Error reading notification time:', error);
  }
  return { hour: 8, minute: 0 }; // Default time
}

export async function setNotificationTime(hour: number, minute: number): Promise<void> {
  try {
    await AsyncStorage.setItem('@EMem:notificationTime', JSON.stringify({ hour, minute }));
  } catch (error) {
    console.error('Error saving notification time:', error);
  }
}
