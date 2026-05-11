# backend/auth/models.py
"""
AuthToken: stores refresh tokens AND short-lived MFA-pending tokens.

The same table handles both because they share the same lifecycle:
- a server-side record with an expiration
- a hash of the token (never the raw value)
- a revocation flag
"""

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class TokenType:
    REFRESH = "REFRESH"
    MFA_PENDING = "MFA_PENDING"  # issued after password OK, before TOTP


class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Store the hash of the token, never the token itself.
    token_hash = Column(String, unique=True, index=True, nullable=False)

    token_type = Column(String, nullable=False)  # REFRESH | MFA_PENDING

    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False, nullable=False)

    # MFA attempts counter (rate-limit brute force on TOTP)
    attempts = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="auth_tokens")