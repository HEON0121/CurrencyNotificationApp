importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDonQY7XroCXw2kKm98NhEQ5hJA_UAiMsQ',
    authDomain: 'currency-notification.firebaseapp.com',
    projectId: 'currency-notification',
    storageBucket: 'currency-notification.appspot.com',
    messagingSenderId: '1012334776120',
    appId: '1:1012334776120:web:ee125c06c6a210ee84bbcd',
    measurementId: 'G-PC71P8KRH9',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// get Configure Web credentials in app

messaging.onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: payload,
        // icon: '/firebase-logo.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
