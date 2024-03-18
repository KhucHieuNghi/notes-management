import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app import app

client = MongoClient(
    os.environ['PRIMARY_DATABASE_HOST'], 
    int(os.environ['PRIMARY_DATABASE_PORT']), 
    username=os.environ['PRIMARY_DATABASE_USERNAME'], 
    password=os.environ['PRIMARY_DATABASE_PASSWORD'], 
    serverSelectionTimeoutMS=2000)

db = client[os.environ['PRIMARY_DATABASE_DATABASE']]

def create_database_if_not_exists(database_name):
    app.logger.info(db.list_collection_names())
    if database_name not in client.database():
        client.create_database(database_name)

def test_connection():
    try:
        client.server_info();
        app.logger.info("Connection established Primary Database")
    except ConnectionFailure as err:
        app.logger.error(err)
        exit(1)

test_connection()