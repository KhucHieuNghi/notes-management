import modules.group.route
import modules.user.route
import modules.note.route
from utils.common import loginRequired, decodeJWT
from flask import request
from app import app

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
