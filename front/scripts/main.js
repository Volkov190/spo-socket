const socket = new WebSocket('ws://127.0.0.1:2000');
const form = document.querySelector('.header__login-area');

socket.addEventListener('message', (message) => {
    console.log(message.data);
});

socket.addEventListener('close', () => {
    console.log('Connection closed');
});

form.addEventListener('submit', (ev) => {
    console.log(ev.target)
    const message = {
        type: 'signin',
        login: form.login.value,
        password: form.password.value,
    };

    if (form.register.value !== '') {     // @TODO переделать для регистрации
        console.log(form.register.value);
        message.type = 'signup';
    }

    socket.send(JSON.stringify(message));
    ev.preventDefault();
});