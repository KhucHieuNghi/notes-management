from bson import ObjectId
from modules.note.model import *
import uuid
import datetime

def getGroupNoteServiceByUser(user):
    
    groupNotes = groupNoteRepository.find_by({'tenant_id': user['tenant_id'],  "is_deleted": False})

    return list(groupNotes)

def getGroupNoteServiceByAdmin():
    
    groupNotes = groupNoteRepository.find_by({});

    return list(groupNotes)

def createGroupNoteService(user, group) :
    groupNote = GroupNote(**{
        "tenant_id": user['tenant_id'],
        "group_name": group['group_name'],
        "link_share":  'shr_' + uuid.uuid1().hex,
        "is_public": group.get('is_public', False),
        "type": group.get('type', 'basic'),
        "create_by": user['id'],
        "update_by": user['id'],
    })

    groupNoteRepository.save(groupNote)

    return groupNote

def updateGroupNoteService(user, oldGroup, newGroup):

    dateNow = datetime.datetime.now();

    groupNote = {**oldGroup, **{
        "id": ObjectId(oldGroup['id']),
        "group_name": newGroup['group_name'],
        "is_public": newGroup['is_public'],
        "is_deleted": newGroup['is_deleted'],
        "update_by": user['id'],
        "update_at": dateNow,
    }}

    groupNote = GroupNote(**groupNote)

    groupNoteRepository.save(groupNote)

    return groupNote

def getGroupNoteById(id):
    return groupNoteRepository.find_one_by_id(ObjectId(id));

def getGroupNoteByShareId(id):
    return groupNoteRepository.find_one_by({"link_share": id});

def getNoteById(id):
    return noteRepository.find_one_by_id(ObjectId(id));

def getNotesServiceByGroup(groupId, isDelete):
    
    if isDelete == None: return list(noteRepository.find_by({'group_id': groupId}))

    notes = noteRepository.find_by({'group_id': groupId, "is_deleted": isDelete});

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
def createNoteService(user, newNote):

    dateNow = datetime.datetime.now();

    note = Note(**{
        "tenant_id": user['tenant_id'],
        "group_id": newNote['group_id'],
        "thumbnail": newNote.get('thumbnail'),
        "title": newNote.get('title'),
        "content": newNote.get('content'),
        "lots":  [{
            "lot_create_at": dateNow,
            "lot_create_by": user['id'],
            "lot_is_deleted": False
    }],
        "create_by": user['id'],
        "update_by": user['id'],
        "is_deleted": False
    })

    noteRepository.save(note)

    return note

def updateNoteService(user, oldNote, newNote):

    dateNow = datetime.datetime.now();

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