import secrets


def generate_secret_key(length=32):
    secret_key = secrets.token_hex()
    return secret_key
