from pydantic import BaseModel
from pydantic_mongo import AbstractRepository, ObjectIdField
from typing import Optional
from hooks.database import db
import typing as t
from datetime import datetime

class Note(BaseModel):
    id: ObjectIdField = None
    tenant_id: str
    group_id: Optional[str]
    thumbnail: Optional[str] = ""
    title: str = ''
    content: Optional[t.Any] = ''
    type: Optional[t.Any] = ''
    lots: Optional[t.Any]

    create_at: datetime = datetime.utcnow()
    create_by: ObjectIdField = ''
    update_at: datetime = datetime.utcnow()
    update_by: ObjectIdField = ''

    is_deleted: bool = False

class NoteRepository(AbstractRepository[Note]):
   class Meta:
      collection_name = 'note'

noteRepository = NoteRepository(database=db)
