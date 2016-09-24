import { Linking, Alert } from 'react-native';

const openUrl = (url, app) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert(`Failed to open ${app || url}`);
    }
  });
};

export const openSnapchat = (username) => openUrl(`snapchat://add/${username}`, 'Snapchat');
export const openInstagram = (username) => openUrl(`instagram://user?username=${username}`, 'Instagram');
