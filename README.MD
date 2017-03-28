
Phenotypic data collection tool

Ready to go iOS app: https://itunes.apple.com/us/app/phenobook/id1170632297?ls=1&mt=8

Check our online documentation https://intabiotechmj.github.io/phenobook-server/
to learn more.

To build android app:

ANDROID_HOME=/Users/juan/Documents/manu/dev/android-sdk-macosx
PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

sudo cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore manolo.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk manolo

./zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk out.apk
