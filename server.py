import socket
import threading

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('127.0.0.1', 3000))
server.listen(4)

def listener(client_socket, x):
    print('new listener')
    try:
        while(True):
            if (client_socket):
                data = client_socket.recv(1024).decode('utf-8')
                print(data)
    except Exception as ex:
        print(ex)
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