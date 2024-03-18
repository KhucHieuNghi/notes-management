from flask_bcrypt import generate_password_hash
from modules.user.model import userRepository, User
import uuid

def verifyExistedUserName(username) -> bool: 
    return bool(userRepository.find_one_by({ "username": username }))

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