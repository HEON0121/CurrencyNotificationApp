// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
// import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging.js';

const serviceWorkerUrl = '/static/firebase-messaging-sw.js';

// register-service-worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
    navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then(function (swReg) {
            console.log('Service Worker is registered', swReg);
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
}

// Notification permission
const requestPermission = () => {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        }
    });
};
requestPermission();

debugger;
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
const messaging = firebase.messaging(app);
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/static/firebase-messaging-sw.js').then((registration) => {
//         console.log(registration);
//     });
// }

// access the registration token
messaging
    .getToken({
        vapidKey: 'BBk3ikMbS9J2rNlIM209F9ze0fNOydtKdZhNVQPgmE0kY3i00cLZb_mXZ2DFEVuC-dANLTjw1fpATvup2Xc1nGw',
    })
    .then((currentToken) => {
        if (currentToken) {
            // Send the token to your server and update the UI if necessary
            // ...
            console.log(currentToken);
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
    })
    .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });

// receive forground message
messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
});
