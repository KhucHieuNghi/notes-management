from flask_bcrypt import generate_password_hash
from modules.user.model import userRepository, User
import uuid

def verifyExistedUserName(username) -> bool:
    return bool(userRepository.find_one_by({ "username": username }))

def verifyExistedUserNameAfterLogin(username, currentUsername) -> bool:
    users = userRepository.find_by({ "username": username });

    data = []
    for user in users:
        data.append(user)

    if not len(data): return False

    if len(data) > 1: return True;

    if dict(data[0])['username'] != currentUsername: return True;

    return False

def verifyExistedEmail(email) -> bool:
    return bool(userRepository.find_one_by( { "email": email }) )

def createUserService(user)  -> User:

    user['password'] = generate_password_hash(user['password']);
    user['tenant_id'] = 'usr_' + uuid.uuid1().hex;

    user = User(**user)

    userRepository.save(user)

    return user

def upsertUserByThirdPartyService(user)  -> User:

    userResult = userRepository.find_one_by({ "work_id": user['work_id'] })

    if not bool(userResult):
        user = User(**user);
        userRepository.save(user);
        return user

    return userResult

def updateUserByThirdPartyService(user)  -> User:
    user = User(**user);
    userRepository.save(user);
    return user

def getUserByUserNameService(username) -> User or None: # type: ignore

    user = userRepository.find_one_by({ "username": username })

    return user

def getUsersService():

    users = userRepository.find_by({})

    return users
