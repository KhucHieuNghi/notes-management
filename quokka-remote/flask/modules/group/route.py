from modules.group.controller import *
from utils.common import loginRequired, decodeJWT
from flask import request
from app import app

@app.route('/groups-note', methods=['GET', "POST", "DELETE", "PATCH"])
@loginRequired
def groupNotes():
    if request.method == 'GET':
        return getGroupNotesController()

    if request.method == 'POST':
        return createGroupNoteController(request.json)

    if request.method == 'PATCH':
        return updateGroupNoteController(request.json)

    if request.method == 'DELETE':
        groupNote = request.json;
        groupNote['is_deleted'] = True
        return updateGroupNoteController(request.json)
