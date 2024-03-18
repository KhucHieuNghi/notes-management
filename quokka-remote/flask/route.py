from modules.user.controller import *
from modules.note.controller import *
from utils.common import loginRequired, decodeJWT
from flask import request
from app import app

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/signup', methods=['POST'])
def signup():
    typeSignup = request.args.get('type', None);

    if typeSignup == 'basic':
        return signUpBasicController(request.json);

    return {}, 400

@app.route('/verify-account', methods=['POST'])
def verifyAccount():
    return verifyAccountController(request.json)

@app.route('/me', methods=['GET', 'POST', 'PATCH'])
def getMe():
    if request.method == 'GET' and request.isAuthenticated:
        return request.user, 200;

    if request.method == 'POST':
        encoded_jwt = request.json['token'];
        status, payload = decodeJWT(encoded_jwt);
        if status:
            return payload, 200
        
    if request.method == 'PATCH':
        if request.isAuthenticated:
            return updateProfileController(request.json, request.user)
        
    return {}, 400

@app.route('/oauth2-callback', methods=['POST'])
def oAuth2CallBack():
    return OAuth2CallbackController(request.json)

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
        return updateNoteController(request.json)
    
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
    
@app.route('/groups-note/<group_id>', methods=['GET'])
@loginRequired
def groupNoteById(group_id):
        return getNoteByGroupController(group_id)

@app.route('/share/<link_id>', methods=['GET'])
@loginRequired
def shareGroupsNote(link_id):
        return getNoteByGroupToShareController(link_id)

