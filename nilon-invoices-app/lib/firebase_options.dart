import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.windows:
        return windows;
      default:
        return android;
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBAjZF_BS58w5QCEOv0wYJldZnjrbrP1is',
    appId: '1:186241000197:android:adc66c27924ffd40274d6c',
    messagingSenderId: '186241000197',
    projectId: 'nilon-web-app',
    storageBucket: 'nilon-web-app.firebasestorage.app',
  );

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyBAjZF_BS58w5QCEOv0wYJldZnjrbrP1is',
    appId: '1:186241000197:web:adc66c27924ffd40274d6c',
    messagingSenderId: '186241000197',
    projectId: 'nilon-web-app',
    storageBucket: 'nilon-web-app.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyBAjZF_BS58w5QCEOv0wYJldZnjrbrP1is',
    appId: '1:186241000197:ios:adc66c27924ffd40274d6c',
    messagingSenderId: '186241000197',
    projectId: 'nilon-web-app',
    storageBucket: 'nilon-web-app.firebasestorage.app',
    iosBundleId: 'com.nilonxaydung.nilonInvoicesApp',
  );

  static const FirebaseOptions windows = FirebaseOptions(
    apiKey: 'AIzaSyBAjZF_BS58w5QCEOv0wYJldZnjrbrP1is',
    appId: '1:186241000197:web:adc66c27924ffd40274d6c',
    messagingSenderId: '186241000197',
    projectId: 'nilon-web-app',
    storageBucket: 'nilon-web-app.firebasestorage.app',
  );
}

