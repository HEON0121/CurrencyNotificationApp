import firebase_admin
from firebase_admin import credentials, messaging

# This registration token comes from the client FCM SDKs.
registration_token = 'YOUR_REGISTRATION_TOKEN'

# See documentation on defining a message payload.
message = messaging.Message(
    data={
        'title': '850',
        'body': '2:45',
    },
    token=registration_token,
)

# Send a message to the device corresponding to the provided
# registration token.
response = messaging.send(message)
# Response is a message ID string.
print('Successfully sent message:', response)


cred = credentials.Certificate(
    "service_account.json")
firebase_admin.initialize_app(cred)

# Send messages to specific devices


def sendPush(title, msg, registration_token):
    # See documentation on defining a message payload.
    message = messaging.Message(
        data={
            "title": title,
            "body": msg,
        },
        token=registration_token,
    )

    # Send a message to the device corresponding to the provided
    # registration token.
    response = messaging.send(message)
    # Response is a message ID string.
    print('Successfully sent message:', response)
