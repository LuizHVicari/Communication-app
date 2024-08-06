import { Alert, Platform, ToastAndroid } from "react-native"


export const displayToast = (message : string) => {
  if (Platform.OS == "android") {
    ToastAndroid.show(message, ToastAndroid.LONG)
  } else {
    Alert.alert(message)
  }
}