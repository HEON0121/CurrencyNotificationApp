AppleID.auth.init({
    clientId: "[CLIENT_ID]",
    scope: "[SCOPES]",
    redirectURI: "[REDIRECT_URI]",
    state: "[STATE]",
    nonce: "[NONCE]",
    usePopup: true,
});

// Listen for authorization success.
document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    // Handle successful response.
    console.log(event.detail.data);
});


// Listen for authorization failures.
document.addEventListener('AppleIDSignInOnFailure', (event) => {
     // Handle error.
     console.log(event.detail.error);
});