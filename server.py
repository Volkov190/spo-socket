import socket
import threading
import json

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('127.0.0.1', 3000))
server.listen(4)

def listener(client_socket, x):
    print('new listener')
    try:
        while(True):
            if (client_socket):
                data = client_socket.recv(1024).decode('utf-8')
                queryType = json.loads(data)['type']
                print(queryType)
                result = False
                if (queryType == 'signin'):
                    pass                                        # @TODO login в бд
                    result = False #debug
                    # type = 'signin'
                
                if (queryType == 'signup'):
                    pass                                        # @TODO sign up
                    result = True
                    # type = 'signup'
                
                if (queryType == 'start'):
                    pass                                        # @TODO установить соединение (отправить сообщения)
                    result = True
                    # type = 'start'

                if (queryType == 'newmessage'):
                    pass                                        # @TODO сообщение в бд и событие остальным клиентам
                    result = True
                    # type = 'newmessage'

                resultMes = 'failed'
                if (result):
                    resultMes = 'success'

                response = {'type': queryType, 'result': resultMes}
                client_socket.send(json.dumps(response).encode('utf-8'))
                

                # print(data)
    except Exception as ex:
        print('[Server Error]:', ex)
        return -1

print('Ready...')

while(True):
    client_socket, address = server.accept()

    threading.Thread(target=listener, args=(client_socket, 0)).start()

    # while(True):
    #     if(client_socket):
    #         data = client_socket.recv(1024).decode('utf-8')
    #         print(data)
    # client_socket.send(data.encode('utf-8'))
    # client_socket.close()