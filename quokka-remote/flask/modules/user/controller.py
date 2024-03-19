from modules.user.service import *;
from flask_bcrypt import check_password_hash
from app import app;
from flask import make_response, request
from utils.formatter import formatJson
from utils.common import validateFields, getFullname, getRoleByUser
import json
import jwt
import os
from datetime import datetime
import uuid

def signUpBasicController(user):
    try:

        isValid = validateFields(['username', 'password', 'confirmPassword', 'fullname'], user)

        if not isValid:
            return app.RES(message="Miss some fields", status=400);

        if len(user['username']) < 3 or len(user['username']) > 128:
            return app.RES(message="Invalid User Name length", status=400);

        if user['password'] != user['confirmPassword']:
            return app.RES(message="Confirm Password and Password does not match", status=400);

        if len(user['password']) < 8 or len(user['password']) > 128:
            return app.RES(message="Invalid password length", status=400);

        if verifyExistedUserName(user['username']):
            return app.RES(message="User Name already exists", status=400);

        if 'email' in user and verifyExistedEmail(user['email']):
            return app.RES(message="Email already exists", status=400);

        user['role'] = "ADMIN"
        result = createUserService(user);

        return app.RES(result)
    except Exception as error:
        return app.RES(message=str(error), status=400);


def signInController(user):

    try:

        isValid = validateFields(['username', 'password'], user)

        if not isValid:
            return app.RES(message="Miss some fields", status=400);

        if len(user['username']) < 3 or len(user['username']) > 128:
            return app.RES(message="Invalid username length", status=400);

        if len(user['password']) < 8 or len(user['password']) > 128:
            return app.RES(message="Invalid password length", status=400);

        if not verifyExistedUserName(user['username']):
            return app.RES(message="User Name does not exist", status=400);

        result = getUserByUserNameService(user['username'])

        if not check_password_hash(result.password, user['password']):
            return app.RES(message="Password is incorrect", status=404);

        result.password = None;

        encoded_jwt = jwt.encode(formatJson(result), os.environ['JWT_SECRET_KEY'], algorithm=os.environ['JWT_SECRET_ALGO'])

        return {"user": formatJson(result), "token": encoded_jwt}, 200;

    except Exception as err:
        app.logger.exception(err)
        return app.RES(None, str(err), 400)

def OAuth2CallbackController(user):
    try:

        result = upsertUserByThirdPartyService({
            "tenant_id": 'usr_' + uuid.uuid1().hex,
            "work_id": user['work_id'],
            "email": user['email'],
            "username": user.get('username', 'username_' + uuid.uuid1().hex),
            "password": '******',
            "fullname": getFullname(user),
            "picture": user.get('profilePictureUrl', '')
        })

        encoded_jwt = jwt.encode(formatJson(result), os.environ['JWT_SECRET_KEY'], algorithm=os.environ['JWT_SECRET_ALGO'])

        return {"user": formatJson(result), "token": encoded_jwt}, 200;
    except Exception as err:
        app.logger.exception(err)
        return app.RES(None, "Have a error", 400)

def verifyAccountController(user):

    isValid = validateFields(['username'], user)

    isAdmin, userRole = getRoleByUser(request);

    print(userRole)

    if not isValid:
            return app.RES(message="Miss User Name", status=400);

    if verifyExistedUserNameAfterLogin(user['username'], userRole["username"]):
        return app.RES(message="User Name already exists", status=400);

    if 'email' in user and verifyExistedEmail(user['email']):
        return app.RES(message="Email already exists", status=400);

    return app.RES(None, message="", status=204);

def updateProfileController(newUser, exUser):

    userRes = dict(getUserByUserNameService(exUser['username']))
    result = updateUserByThirdPartyService({**userRes, **{
            "fullname": newUser.get('fullname', userRes['fullname']),
            "picture": newUser.get('picture', exUser['picture']),
            "username": newUser.get('username', exUser['username']),
            "update_at": datetime.utcnow()
        }})

    encoded_jwt = jwt.encode(formatJson(result), os.environ['JWT_SECRET_KEY'], algorithm=os.environ['JWT_SECRET_ALGO'])

    return {"user": formatJson(result), "token": encoded_jwt}, 200;

def getUserController():
    isAdmin, user = getRoleByUser(request)
    if not isAdmin:
        return app.RES(message="Can not permission", status=401);
    users = getUsersService()

    data = []
    for item in users:
            data.append(formatJson(item))

    return app.RES(data);
