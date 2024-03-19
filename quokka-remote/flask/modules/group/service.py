from bson import ObjectId
from modules.group.model import *
import uuid
import datetime

def getGroupNoteServiceByUser(user):

    groupNotes = groupNoteRepository.find_by({'tenant_id': user['tenant_id'],  "is_deleted": False})

    return list(groupNotes)

def getGroupNoteServiceByAdmin():

    groupNotes = groupNoteRepository.find_by({});

    return list(groupNotes)

def createGroupNoteService(user, group) :

    dateNow = datetime.datetime.utcnow();

    groupNote = GroupNote(**{
        "tenant_id": user['tenant_id'],
        "group_name": group['group_name'],
        "link_share":  'shr_' + uuid.uuid1().hex,
        "is_public": group.get('is_public', False),
        "type": group.get('type', 'basic'),
        "create_by": user['id'],
        "update_by": user['id'],
        "update_at": dateNow,
        "create_at": dateNow
    })

    groupNoteRepository.save(groupNote)

    return groupNote

def updateGroupNoteService(user, oldGroup, newGroup):

    dateNow = datetime.datetime.utcnow();

    groupNote = {**oldGroup, **{
        "id": ObjectId(oldGroup['id']),
        "group_name": newGroup['group_name'],
        "is_public": newGroup['is_public'],
        "is_deleted": newGroup['is_deleted'],
        "update_by": user['id'],
        "update_at": dateNow,
        "create_at": dateNow
    }}

    groupNote = GroupNote(**groupNote)

    groupNoteRepository.save(groupNote)

    return groupNote

def getGroupNoteById(id):
    return groupNoteRepository.find_one_by_id(ObjectId(id));

def getGroupNoteByShareId(id):
    return groupNoteRepository.find_one_by({"link_share": id});
