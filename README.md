# chat

This chat app is a React Native application built using Expo's gifted-chat and Google Firebase to create a chat app that runs in real-time, for Android and iOS.

## Installing Expo

Before the app can run, the Expo CLI must be installed via the terminal with the following command:
`npm install expo-cli --global`
The Expo app will also need to be downloaded on the user's mobile device to allow the app to run using Expo.

### Expo Setup

The user must create an Expo account. This can be done by navigating to the [Expo sign-up page](https://expo.io/) and following the steps outlined to create an account. Once finished, the user should be able to log in to Expo on their mobile device and in their browser. These credentials will also be used to log in to the Expo CLI during setup.

### iOS Simulator Setup

_User will need a product that runs on iOS in order to run this app in an iOS simulator._ On a device running iOS, such as a MacBook, the user must install [Xcode](https://developer.apple.com/xcode/resources/). Once installed, the user will open it and navigate to "Preferences". Under "Preferences", the user will click on "Components" and install their choice of simulator from the list. Once installed, the user will open the simulator, start their Expo project, and run the project. Projects can be run either by typing "i" in the Expo CLI or clicking "Run on iOS simmulator" in Xcode. Personally, I do not own a MacBook so I did not undertake these steps.

### Android Emulator Setup

To set up an emulator for Android, users must download and install [Android Studio](https://docs.expo.io/workflow/android-studio-emulator/?redirected). The user will be guided through an installation process once the download completes. **Do not uncheck the option for "Android Virtual Device"** when it shows up during installation.  
Once installed, the user should open Android Studio and click the "Configure" option. From there, navigate to Settings --> Appearance and Behavior --> System Setitngs --> Android SDK. Then click on "SDK Tools" and check whether or not "Android SDK Build Tools" are installed. If not, click on the row labelled "Android SDK Build Tools" and download the latest version using the download symbol next to it.  
**MacOS and Linux users:** If a user is on MacOS or Linux, they will need to add the location of the Android SDK to their PATH. In order to accomplish this, copy the path (displayed in the text field at the top of their screens in Android Studio) and add the following to their "/.bashrc" file:
`export ANDROID_SDK=/Users/myuser/Library/Android/sdk`
_Be sure to replace 'myuser' and 'Library' with your information._
**MacOS users only:** Users with a MacOS will also need to add platform tools to their "/.bashrc" file. The line for this is as follows:
`export PATH=/Users/myuser/Library/Android/sdk/platform-tools:$PATH`
_Once again, make sure to insert your information into the path._

#### Installing and Running Android Emulator

At this point, the user will close out of the "Settings for New Projects" window and click "Configure" again. This time, the user will select the "AVD Manager" option instead. From there, click "Create Virtual Device" and select a device from the list. Click "Next" to navigate to the "System Image" interface and click on the "Recommended" tab. Finally, select an operating system. _For those running Windows, it is advisable to select a device with the Play Store included -- see special notice below_

Click the "Download" link next to whichever OS you choose, and Android Studio will download the image. _This may take a few minutes._ Once finished, in the next window, give your device a name and click "Finish".
Finally, return to the Virtual Device Manager and click on the "Play" icon to start the emulator. Then, navigate to the "Browser" tab of the project you are currently running in Expo and click "Run on Android device/emulator". Expo will begin installing the Expo client on the virtual device and then start the project.

**Special Notice:**

NOTE FOR WINDOWS
For those using Ubuntu on Windows 10, if you’re using the emulator, the application might not automatically start or even install the Expo client on your Android emulator or device. If this is the case, you can workaround this as follows:

- Manually download and install the Expo client on your Android de-vice/emulator through the Play Store (treat the emulator as if it were an actual phone when logging in with a Google account to be able to download apps through Play Store).
- Log in with your Expo account in the Expo client on your de-vice/emulator.
- In Ubuntu bash, log in with your Expo account by running `expo login`.
  Now that you’re logged in on both bash and the device/emulator, whenever you start Expo (e.g., `npm start`, `expo start`) in Ubuntu bash, the application will automatically appear under the “RECENTLY IN DEVELOPMENT” label in the Expo client on the device/emulator. Once it appears, you can click to open it, and the Metro Bundler will start compiling the code. Keep in mind that for this approach to work, both your PC and your device/emulator need to have access to the internet even after installing the Expo client and logging in.

Please note, this might also apply for running the emulator on Windiws using Windows PowerShell instead of Ubunto on Windows.

## Firebase Setup

First, navigate to [Google Firebase](https://firebase.google.com/) and click "Sign In" in the top-right corner. The user should use their existing Google credentials to sign in and create a new Firebase account. _If you do not have a Google account, create one and then proceed._
After that, click on the "Go to Console" link in the top-right corner and click "Create Project". _If you have created any Firebase projects in the past, it will say "Add Project"._ The user will then fill out a form with some basic information about themselves. Go ahead and user the default settings on the last step.

### Firebase Database Setup

Onnce the project is created, click on the "Database" option in the left panel. From there, click on "Create Database" and select the "Start in Test Mode" option. This option allows users to read from and write to the user's database. Select a database location that is closest to your geographical location.

### Firebase Cloud Storage Setuo

The user will need to set up Firebase Cloud Storage to store any images they send and receive. To do so, click the "Storage" option on the left panel, click "Get Started", "Next", and then "Done".

### Firebase Authentication Setup

Users will need to be authenticated if they want to utilize the application's ability to send and store messages. To set this up, return to the dashboard and click the "Authentication" option on the left hand panel. Then click "Setup Sign-In Method" and enable the "Anonymous" option, which should be the final item on the list.

### Generating an API Key

To give the application access to the user's Firebase project, they must generate an API key. To do so, go to "Project Settings" at the top of the left panel and click "Create Web App" under the "General" tab. _This option may appear as </>_. In the modal that appears, name your applications and click "Register App".  
Copy everything within the curly braces of the firebaseConfig variable. Once the user has cloned or downloaded this repository, they will navigate to components/Chat.js, go to the following section of code:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_CONFIG_HERE",
  authDomain: "YOUR_CONFIG_HERE",
  projectId: "YOUR_CONFIG_HERE",
  storageBucket: "YOUR_CONFIG_HERE",
  messagingSenderId: "YOUR_CONFIG_HERE",
  appId: "YOUR_CONFIG_HERE",
  measurementId: "YOUR_CONFIG_HERE",
};
```

...delete the content within the curly braces, and paste their own unique API key information instead.

## Final Steps

Now that all configuration is complete, the user is able to run the application. Navigate to the project directory in the terminal and type (depending on what package manager the user has chosen):
`expo start` or `npm start` or `yarn start`
From there, the user can type "i" in the terminal to run the app in the iOS simulator (if the user is running on a Mac) or "a" to run in the Android emulator. _Make sure the Android emulator is already running._
You can also run the app on your personal mobile device:

- **Android:** Open the Expo app on your Android device, navigate to the user icon in the bottom right, and sign in if you haven't already. Then, navigate back to the Projects tab, and scan the QR code that was generated in the terminal and the Metro Bundler in the browser.
- **iPhone:** Keep open the camera app and focus it on the QR code that was generated in the terminal and the Metro Bundler in the browser.

The app will open, the user will enter their name, choose a background color for the chat screen, and begin chatting.
