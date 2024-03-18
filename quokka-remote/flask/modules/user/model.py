from pydantic import BaseModel
from pydantic_mongo import AbstractRepository, ObjectIdField
from hooks.database import db
from datetime import datetime
from typing import Optional

class User(BaseModel):
    id: ObjectIdField = None
    tenant_id: str
    
    picture: Optional[str] = ''
    work_id: Optional[str] = ''
    email: Optional[str] = ''
    username: str
    password: str
    fullname: Optional[str] = ''
    role: str = "CLIENT"
    is_deleted: bool = False

    create_at: datetime = datetime.utcnow()
    update_at: datetime = datetime.utcnow()


class UserRepository(AbstractRepository[User]):
    class Meta:
        collection_name = 'user'

userRepository = UserRepository(database=db)