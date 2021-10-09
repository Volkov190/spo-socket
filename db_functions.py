import psycopg2
import hashlib
from db_config import host, user, db_name, password

def signin(login, password):
    pass

def signup(login, password):
    pass

try:
    connection = psycopg2.connect(host = host, user = user, password = password, database = db_name)
except Exception as ex:
    print('[Error] Connect exception:', ex)