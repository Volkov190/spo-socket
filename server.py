import socket
import threading
import json

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('127.0.0.1', 3000))
server.listen(4)

def listener(client_socket):
    print('new listener')
    try:
        while(True):
            if (client_socket):
                data = client_socket.recv(1024).decode('utf-8')
                queryType = json.loads(data)['type']
                data = json.loads(data)
                print(queryType)
                result = False
                response = None
                if (queryType == 'signin'):
                    pass                                        # @TODO login в бд
                    result = True #debug
                    response = {'type': queryType, 'result': result, 'login': data['login']}
                
                if (queryType == 'signup'):
                    pass                                        # @TODO sign up
                    result = True
                    response = {'type': queryType, 'result': result}
                
                if (queryType == 'start'):
                    pass                                        # @TODO установить соединение (отправить сообщения)
                    response = {'type': 'start', 'result': [{'text': 'Test messages', 'author': 'Kirusha'}, {'text': 'It work', 'author': 'Sanya'}]} # debug
                    

                if (queryType == 'newmessage'):
                    pass                                        # @TODO сообщение в бд и событие остальным клиентам
                    messageSender(data['text'], data['author'])
                    result = True
                    # response = {'type': queryType, 'result': result}


                if (not response is None):
                    client_socket.send(json.dumps(response).encode('utf-8'))
                
    except Exception as ex:
        print('[Server Error]:', ex)
        return -1

print('Ready...')

clients = []
clientsMut = threading.Lock()
# newMesEvent = threading.Event()
# threading.Thread(target=messageSender, args())

def messageSender(text, author):
    clientsMut.acquire()
    response = {'type': 'newmessage', 'result': {'text': text, 'author': author}}
    for client in clients:
        client.send(json.dumps(response).encode('utf-8'))

    clientsMut.release()

while(True):
    client_socket, address = server.accept()

    clientsMut.acquire()
    clients.append(client_socket)
    clientsMut.release()
    threading.Thread(target=listener, args=(client_socket,)).start()