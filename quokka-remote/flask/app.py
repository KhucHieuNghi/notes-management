from dotenv import load_dotenv
from os.path import join, dirname
from flask import Flask, request
from flask_cors import CORS
from utils.formatter import RES
from utils.common import decodeJWT
app = Flask('KHN_QUOKKA')
dotenv_path = join(dirname(__file__), '.env')  # Path to .env file
load_dotenv(dotenv_path)

from hooks.database import *;
from route import *

CORS(app)
app.RES = RES;
@app.before_request
def middlewareIsAuthentication():
    try:
        encoded_jwt = request.headers.get('Authorization')
        status, payload = decodeJWT(encoded_jwt)
        if status:
            request.isAuthenticated = True
            request.user = payload
        else:
            request.isAuthenticated = False
    except Exception:
        request.isAuthenticated = False

@app.after_request
def middlewareHeader(r):
    r.headers["Content-Type"] = "application/json"
    return r