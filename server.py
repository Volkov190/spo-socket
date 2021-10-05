import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('127.0.0.1', 3000))
server.listen(4)

print('Ready...')

while(True):
    client_socket, address = server.accept()

    data = client_socket.recv(1024).decode('utf-8')
    print(data)

    client_socket.send(data.encode('utf-8'))
    client_socket.close()