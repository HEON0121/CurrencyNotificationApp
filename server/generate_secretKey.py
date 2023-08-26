import secrets


def generate_secret_key():
    secret_key = secrets.token_hex()
    return secret_key
