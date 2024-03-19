from flask import request
from functools import wraps
import os
import jwt
def getRoleByUser(request):
    isAdmin = request.user['role'] == 'ADMIN'
    return isAdmin, request.user;

def loginRequired(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.isAuthenticated:
            return f(*args, **kwargs)
        return {"message": "You need to login!"}, 400
    return decorated_function

def validateFields(fields, obj):
    for field in fields:
        if type(obj.get(field)) == type(bool()): continue
        if bool(obj.get(field)): continue;
        print(field)
        return False
    return True

def decodeJWT(jwt_encode):
    try:
        payload = jwt.decode(jwt_encode, os.environ['JWT_SECRET_KEY'], algorithms=os.environ['JWT_SECRET_ALGO'])
        return True, payload;
    except Exception as err:
        print('err', err)
        return False, {}

def getFullname(user):
    fullname = ''
    last_name = user.get('lastName')
    first_name = user.get('firstName')

    if last_name is not None:
        fullname += last_name

    if first_name is not None:
        if fullname:
            fullname += ' '

    fullname += first_name if first_name is not None else ''
    return fullname
