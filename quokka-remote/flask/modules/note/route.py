from modules.note.controller import *
from utils.common import loginRequired, decodeJWT
from flask import request
from app import app

@app.route('/notes', methods=['GET', "POST", "DELETE", "PATCH"])
@loginRequired
def notes():
    if request.method == 'GET':
        return getNotesController()

    if request.method == 'POST':
        return createNoteController(request.json)

    if request.method == 'DELETE':
        note = request.json;
        note['is_deleted'] = True
        return updateNoteController(note)

    if request.method == 'PATCH':
        print(request.json)
        return updateNoteController(request.json)

@app.route('/notes/<node_id>', methods=['GET'])
@loginRequired
def notesById(node_id):
    return getNoteByIdController(node_id)

@app.route('/groups-note/<group_id>', methods=['GET'])
@loginRequired
def groupNoteById(group_id):
        return getNoteByGroupController(group_id)

@app.route('/share/<link_id>', methods=['GET'])
def shareGroupsNote(link_id):
        return getNoteByGroupToShareController(link_id)
