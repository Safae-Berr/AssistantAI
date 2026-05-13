# backend/notifications/manager.py
"""
In-memory connection manager for WebSocket notifications.

Stores live WebSocket connections per role and broadcasts JSON messages.
Single-process only — for multi-worker deployment, use Redis pub/sub.
"""

import asyncio
import json
import logging
from typing import Dict, List

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self) -> None:
        # role -> list of active WebSocket connections
        self._connections: Dict[str, List[WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def connect(self, ws: WebSocket, role: str) -> None:
        await ws.accept()
        async with self._lock:
            self._connections.setdefault(role, []).append(ws)
        logger.info("WS connected (role=%s, total=%d)", role, len(self._connections[role]))

    async def disconnect(self, ws: WebSocket, role: str) -> None:
        async with self._lock:
            conns = self._connections.get(role, [])
            if ws in conns:
                conns.remove(ws)
        logger.info("WS disconnected (role=%s)", role)

    async def broadcast(self, role: str, payload: dict) -> None:
        """Send a JSON message to every connection registered under `role`."""
        message = json.dumps(payload)
        async with self._lock:
            targets = list(self._connections.get(role, []))

        for ws in targets:
            try:
                await ws.send_text(message)
            except Exception as exc:
                logger.warning("WS send failed, dropping connection: %s", exc)
                await self.disconnect(ws, role)


# Singleton — imported wherever we need to broadcast
manager = ConnectionManager()