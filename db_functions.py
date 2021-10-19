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

def getAllMessages():
    result = []
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT public.messages.text, public.user.name FROM public.messages
                                    INNER JOIN public.user
                                    ON public.user.id=public.messages.owner ORDER BY public.messages.id""")
            connection.commit()
            # print(cursor.fetchall())
            for line in cursor.fetchall():
                message = {}
                message["text"] = line[0]
                message["author"] = line[1]
                result.append(message)
    except Exception as ex:
        print('[DB Error] getAllMessages Exception:', ex)
    finally:
        return result

def pushMessage(text, author):
    print('tyt')
    result = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM public.user WHERE name=%s", (author,))
            connection.commit()
            authorId = 0
            resp = cursor.fetchone()
            if (not resp is None):
                authorId = resp[0]
                cursor.execute("INSERT INTO public.messages \
                                    (text, owner) \
                                    VALUES (%s, %s)", (text, authorId))        
                connection.commit()
                result = True
    except Exception as ex:
        print('[DB Error] pushMessages Exception:', ex)
    finally:
        return result

def removeUser(login):
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM public.user WHERE name=%s;", (login,))
            connection.commit()
    except Exception as ex:
        print('[DB Error] Signup Exception:', ex)

try:
    connection = psycopg2.connect(host = host, user = user, password = password, database = db_name)
except Exception as ex:
    print('[DB Error] Connect exception:', ex)