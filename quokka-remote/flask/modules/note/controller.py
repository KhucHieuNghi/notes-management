from modules.note.service import *;
from utils.common import getRoleByUser
from utils.common import validateFields
from utils.formatter import formatJson
from app import app;
from flask import request
import json

def getNotesController():
    isAdmin, user = getRoleByUser(request)
    data = []

    keySearch = request.args.get('keySearch', None);
    valSearch = request.args.get('valSearch', None);
    
    if isAdmin:
        notes = getNotesServiceByAdmin(keySearch, valSearch);
    else:
        notes = getNotesServiceByUser(user, keySearch, valSearch);
    
    for item in notes:
            data.append(formatJson(item))

    return app.RES(data);

def createNoteController(body):

    isAdmin, user = getRoleByUser(request)

    if isAdmin:
        return app.RES(message = "Can not create group note by role admin", status = 404);

    isValid = validateFields(['group_id'], body)

    if not isValid:
        return app.RES(message="Miss Some fields", status=400);

    note = createNoteService(user, body);

    return app.RES(note);

def updateNoteController(body):

    isAdmin, user = getRoleByUser(request)

    if isAdmin:
        return app.RES(message = "Can not update note by role admin", status = 404);

    isValid = validateFields(['id'], body)

    if not isValid:
        return app.RES(message="Miss Some fields", status=400);

    exNote = getNoteById(body['id'])

    if not bool(exNote):
        return app.RES(message="Note not found", status=404);

    exNote = dict(exNote)
    if user['tenant_id'] != exNote['tenant_id']:
        return app.RES(message="You are not the owner of this note", status=400);

    note = updateNoteService(user, exNote, body);

    return app.RES(note);

def getGroupNotesController():

    isAdmin, user = getRoleByUser(request)

    data = []
    if isAdmin:
        notes = getGroupNoteServiceByAdmin();
    else:
        notes = getGroupNoteServiceByUser(user);

    for item in notes:
        val = json.loads(item.model_dump_json())
        val['notesCount'] = len(getNotesServiceByGroup(str(item.id), None));
        data.append(val)

    print(data)

    return app.RES(data);

def getNoteByGroupController(group_id):

    isAdmin, user = getRoleByUser(request)

    if isAdmin: return app.RES(message = "Can not get note by group with role admin", status=400) 

    groupNote = getGroupNoteById(group_id)

    if not bool(groupNote):
        return app.RES(message="Group not found", status=404);

    if user['tenant_id'] != dict(groupNote)['tenant_id']:
        return app.RES(message="You are not the owner of this group", status=400);
    
    data = []
    notes = getNotesServiceByGroup(group_id, False);

    for item in notes:
        data.append(formatJson(item))

    return app.RES(data);

def createGroupNoteController(body):

    isAdmin, user = getRoleByUser(request)

    if isAdmin: return app.RES(message = "Can not create group note by role admin", status=400) 

    isValid = validateFields(['group_name'], body)

    if not isValid:
        return app.RES(message="Miss some fields", status=400);

    groupNote = createGroupNoteService(user, body);

    return app.RES(groupNote);

def updateGroupNoteController(body):

    isAdmin, user = getRoleByUser(request)

    if isAdmin: return app.RES(message = "Can not update group note by role admin", status=400) 

    isValid = validateFields(['id', 'group_name', 'tenant_id', 'is_public'], body)

    if not isValid:
        return app.RES(message="Miss some fields", status=400);

    groupNoteOriginal = getGroupNoteById(body['id'])

    if not bool(groupNoteOriginal): return app.RES(message="Not found group note", status=404);

    groupNoteOriginal = dict(groupNoteOriginal);

    if user['tenant_id'] != groupNoteOriginal['tenant_id']:
        return app.RES(message="You are not the owner of this group", status=400);

    groupNote = updateGroupNoteService(user, groupNoteOriginal, body);

    return app.RES(groupNote);

def getNoteByGroupToShareController(link_id):

    groupNote = getGroupNoteByShareId(link_id)

    if not bool(groupNote):
        return app.RES(message="Group not found", status=404);

    if not bool(groupNote.is_public):
        return app.RES(message="Notes not public", status=403);
    
    data = []
    notes = getNotesServiceByGroup(dict(groupNote).get('group_id'), False);

    for item in notes:
        data.append(formatJson(item))

    return app.RES(data);