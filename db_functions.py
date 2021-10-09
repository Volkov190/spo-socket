import psycopg2
import hashlib
from db_config import host, user, db_name, password

def signup(login, password):
    result = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM public.user WHERE name=%s;", (login,))
            connection.commit()
            # print(len(cursor.fetchone()))
            if (cursor.fetchone()[0] == 0):
                cursor.execute('INSERT INTO public.user (name, password) VALUES(%s, %s)', (login, hashlib.md5(password.encode()).hexdigest()))
                connection.commit()
                result = True
                
    except Exception as ex:
        print('[DB Error] Signup Exception:', ex)
    finally: 
        return result


def signin(login, password):
    result = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM public.user WHERE name=%s AND password=%s;", (login, hashlib.md5(password.encode()).hexdigest()))
            connection.commit()
            if (cursor.fetchone()[0] > 0):
                result = True
    except Exception as ex:
        print('[DB Error] Signin Exception:', ex)
    finally:
        return result

try:
    connection = psycopg2.connect(host = host, user = user, password = password, database = db_name)
except Exception as ex:
    print('[DB Error] Connect exception:', ex)
    raise ex