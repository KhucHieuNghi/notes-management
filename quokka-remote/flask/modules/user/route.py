from modules.user.controller import *
from utils.common import loginRequired, decodeJWT, getRoleByUser
from flask import request
from app import app

@app.route('/signup', methods=['POST'])
def signup():
    typeSignup = request.args.get('type', None);

    if typeSignup == 'basic':
        return signUpBasicController(request.json);

    return {}, 400

@app.route('/signin', methods=['POST'])
def signin():
    return signInController(request.json)

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

@app.route('/verify-account', methods=['POST'])
def verifyAccount():
    return verifyAccountController(request.json)

@app.route('/oauth2-callback', methods=['POST'])
def oAuth2CallBack():
    return OAuth2CallbackController(request.json)

@app.route('/users', methods=['GET'])
@loginRequired
def getUsers():
    return getUserController()
