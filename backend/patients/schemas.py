from datetime import date, datetime
from typing import Optional


class PatientCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    birth_date: date
    patient_code: str = Field(min_length=4, max_length=40)

class PatientRead(PatientCreate):
    id: int
    user_id: int
    email: EmailStr
    is_active: bool
    is_validated: bool
    mfa_enabled: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True

    class PatientUpdate(BaseModel):
        first_name: Optional[str] = Field(default=None, min_length=1, max_length=80)
        last_name: Optional[str] = Field(default=None, min_length=1, max_length=80)
        birth_date: Optional[date] = None
        # patient_code is intentionally NOT editable (identifier).  

    class PatientAdminPatch(BaseModel):
        is_active: Optional[bool] = None
        is_validated: Optional[bool] = None 




