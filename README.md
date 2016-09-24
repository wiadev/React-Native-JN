# Juno

### IOS Configuration

1. Make sure you have Cocoapods version > 1.0
2. run `cd ios && pod install`
3. use `Juno.xcworkspace` for this project.

### Temporary fix for iOS 10/XCode 8:

1. open `Libraries/RCTWebsocket.xcodeproj` in Xcode
2. Under build settings tab, delete the custom compiler flags where it says other warning flags, get rid of the two flags there

### Link Facebook SDK
1. Download the Facebook iOS SDK from here: https://developers.facebook.com/docs/ios
2. Extract the zip file to your home directory: `~/FacebookSDK`

### Running:

1. If you dont already have it installed, run `npm install -g react-native-cli`
2. In the root of the project, run `npm i; react-native run-ios`
