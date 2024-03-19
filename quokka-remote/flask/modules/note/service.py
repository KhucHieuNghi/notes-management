from bson import ObjectId
from modules.note.model import *
import uuid
import datetime

def getNoteById(id):
    return noteRepository.find_one_by_id(ObjectId(id));

def getNotesServiceByGroup(groupId, isDelete):

    if isDelete == None: return list(noteRepository.find_by({'group_id': groupId}))

    notes = noteRepository.find_by({'group_id': str(groupId), "is_deleted": False});

    return list(notes)

def getNotesServiceByUser(user, keySearch = None, valSearch = None):

    if not bool(keySearch) or not bool(valSearch):
        notes = noteRepository.find_by({'tenant_id': user['tenant_id'],  "is_deleted": False});
        return list(notes);

    if keySearch == 'full':
        query = {'$and': [
                    {'tenant_id': user['tenant_id']},
                    {'is_deleted': False},
                    {'$or': [
                        {'title': {'$regex': valSearch, '$options': 'i'}},
                        {'content': {'$regex': valSearch, '$options': 'i'}}
                    ]}]}

        notes = noteRepository.find_by(query);
        return list(notes);


    query = {'$and': [
                    {'tenant_id': user['tenant_id']},
                    {'is_deleted': False},
                    {'$or': [{keySearch: {'$regex': valSearch, '$options': 'i'}} ]}
                ]}

    notes = noteRepository.find_by(query);

    return list(notes);

def getNotesServiceByAdmin(keySearch = None, valSearch = None):

    if not bool(keySearch) or not bool(valSearch):
        notes = noteRepository.find_by({});
        return list(notes);

    if keySearch == 'full':
        query = {'$or': [{'title': {'$regex': valSearch, '$options': 'i'}},{'content': {'$regex': valSearch, '$options': 'i'}} ]}
        notes = noteRepository.find_by(query);
        return list(notes);


    query = {'$or': [{keySearch: {'$regex': valSearch, '$options': 'i'}} ]}
    notes = noteRepository.find_by(query);
    return list(notes);

def getNoteByIdService(id):

    note = noteRepository.find_one_by_id(ObjectId(id))
    return note;


def createNoteService(user, newNote):

    dateNow = datetime.datetime.utcnow();

    note = Note(**{
        "tenant_id": user['tenant_id'],
        "group_id": newNote['group_id'],
        "thumbnail": newNote.get('thumbnail'),
        "title": newNote.get('title'),
        "content": newNote.get('content'),
        "type": newNote.get('type'),
        "lots":  [{
            "lot_create_at": dateNow,
            "lot_create_by": user['id'],
            "lot_is_deleted": False
        }],
        "create_by": user['id'],
        "update_by": user['id'],
        "create_at": dateNow,
        "update_at": dateNow,
        "is_deleted": False
    })

    noteRepository.save(note)

    return note

def updateNoteService(user, oldNote, newNote):

    dateNow = datetime.datetime.utcnow();

    lots = list(oldNote['lots']);

    lots.append({
            "lot_title": newNote.get('title'),
            "lot_content": newNote.get('content'),
            "lot_thumbnail": newNote.get('thumbnail'),
            "lot_create_at": dateNow,
            "lot_create_by": user['id'],
            "lot_is_deleted": newNote.get('is_deleted')
    })

    noteModel = {**oldNote, **{
        "lots": lots,
        "id": ObjectId(oldNote['id']),
        "thumbnail": newNote.get('thumbnail'),
        "title": newNote.get('title'),
        "content": newNote.get('content'),
        "is_deleted": newNote.get('is_deleted'),
        "update_at": dateNow,
        "update_by": user['id'],
    }}

    note = Note(**noteModel)

    noteRepository.save(note)

    return note
