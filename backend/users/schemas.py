import datetime
import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
class UserCreate:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

class UserLogin:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password    

class UserResponse:    
    def __init__(self, id: int, email: str):
        self.id = id
        self.email = email 

class TokenResponse:    
    def __init__(self, access_token: str, token_type: str):
        self.access_token = access_token
        self.token_type = token_type

