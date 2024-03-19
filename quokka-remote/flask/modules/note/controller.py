from modules.note.service import *;
from modules.group.service import *;
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

def getNoteByIdController(id):
    isAdmin, user = getRoleByUser(request)

    if isAdmin:
        note = getNoteByIdService(id);
    else:
        note = getNoteByIdService(id);

        if user['tenant_id'] != note.tenant_id:
            return app.RES(message="You are not the owner of this note", status=400);

    return app.RES(note);

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

    print(notes, groupNote)

    for item in notes:
        data.append(formatJson(item))

    return {"group": formatJson(groupNote), "notes": data}, 200

def getNoteByGroupToShareController(link_id):

    groupNote = getGroupNoteByShareId(link_id)

    if not bool(groupNote):
        return app.RES(message="Group not found", status=404);

    if not bool(groupNote.is_public):
        return app.RES(message="Notes not public", status=403);

    data = []
    notes = getNotesServiceByGroup(dict(groupNote).get('id'), False);

    for item in notes:
        data.append(formatJson(item))

    return app.RES(data);
