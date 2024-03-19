from pydantic import BaseModel
from pydantic_mongo import AbstractRepository, ObjectIdField
from typing import Optional
from hooks.database import db
import typing as t
from datetime import datetime

class GroupNote(BaseModel):
    id: ObjectIdField = None

    tenant_id: str
    group_name: str
    link_share: str
    is_public: bool = False

    type: str = 'basic' # basic, draw, list

    create_at: datetime = datetime.utcnow()
    create_by: ObjectIdField
    update_at: datetime = datetime.utcnow()
    update_by: ObjectIdField

    is_deleted: bool = False


class GroupNoteRepository(AbstractRepository[GroupNote]):
   class Meta:
      collection_name = 'group_note'

groupNoteRepository = GroupNoteRepository(database=db)
