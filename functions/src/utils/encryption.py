from cryptography.fernet import Fernet
import os
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# In production, use a secure key from environment variables (e.g., Google Cloud Secret Manager)
# For this MVP, we derive a Fernet key from the same passphrase as the frontend, 
# but note that improved interoperability would require matching the exact Key Derivation Function parameters.
SECRET_PASSPHRASE = os.environ.get('NEXT_PUBLIC_ENCRYPTION_KEY', 'dev-secret-key-change-in-prod').encode()

def _get_key(salt=b'salt_for_mvp_only'):
    """Derives a Fernet-compatible key from the passphrase."""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(SECRET_PASSPHRASE))

def encrypt(data: str) -> str:
    """Encrypts a string using Fernet (AES)."""
    if not data:
        return ""
    try:
        # Use a fixed salt for simplicity in this MVP helper, or generate one and prepend it
        key = _get_key()
        f = Fernet(key)
        return f.encrypt(data.encode()).decode()
    except Exception as e:
        print(f"Encryption error: {e}")
        return ""

def decrypt(token: str) -> str:
    """Decrypts a Fernet token."""
    if not token:
        return ""
    try:
        key = _get_key()
        f = Fernet(key)
        return f.decrypt(token.encode()).decode()
    except Exception as e:
        print(f"Decryption error: {e}")
        return ""
