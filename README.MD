To build android app:

sudo cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore manolo.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk manolo

./zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk out.apk