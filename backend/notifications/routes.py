# backend/notifications/routes.py
"""
WebSocket endpoints.

  WS /api/ws/admin   — admin-only realtime notification channel
                       (e.g. new doctor registrations)
"""

import logging
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session
from jose import JWTError

from app.database import get_db
from auth.cookies import ACCESS_COOKIE
from auth.jwt import decode_token
from notifications.manager import manager
from users.models import User, UserRole

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws", tags=["WebSocket"])


@router.websocket("/admin")
async def admin_ws(websocket: WebSocket, db: Session = Depends(get_db)):
    """
    Authenticated admin channel.
    Auth: reads the `access_token` cookie sent by the browser on the WS handshake.
    Closes 1008 (policy violation) if the user is not an admin.
    """
    token = websocket.cookies.get(ACCESS_COOKIE)
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        payload = decode_token(token, expected_type="access")
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_id = int(payload["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != UserRole.ADMIN or not user.is_active:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket, role="admin")
    try:
        # Keep the connection open. We don't expect client messages,
        # but we still need to await something so the loop runs.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        await manager.disconnect(websocket, role="admin")