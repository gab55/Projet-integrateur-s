import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from "../api/apiClient";

export const registerForPushNotifications = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Permission for notifications was denied');
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            lightColor: '#FF231F7C',
        });
    }

    let token;
    try {
        const deviceTokenData = await Notifications.getDevicePushTokenAsync();
        token = deviceTokenData.data;

    } catch (error) {
        console.error('Error fetching device token:', error);
    }

    if (token) {
        await saveNotificationToken(token);
    }

    return token;
};

const saveNotificationToken = async (token) => {
    try {
        const response = await api.post('/permissions', {
            token
        });

        return response.data;
    } catch (error) {
        console.error('Error saving notification token:', error.message);
    }
};






