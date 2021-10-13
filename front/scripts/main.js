const socket = new WebSocket("ws://127.0.0.1:2000");
const form = document.querySelector(".header__login-area");
const signin_but = document.querySelector(".login-area__submit_sign-in");
const signup_but = document.querySelector(".login-area__submit_sign-up");
const newMesArea = document.querySelector(".messages__new-message-area");
const newMesBtn = document.querySelector(".new-message__button");
const newMesForm = document.querySelector(".messages__new-message-area");
const login__button = document.querySelector(".login__button");

login__button.addEventListener("click", (ev) => {
  if (ev.target.innerHTML === "Выход") {
    console.log("Выход");
    const message = {
      type: "logout",
    };

    socket.send(JSON.stringify(message));

    form.classList.remove("header__login-area_none");
    const loginText = document.querySelector(".login .login__text");
    loginText.innerHTML = "";
    ev.target.innerHTML = "Вход";
  }
});

socket.addEventListener("message", (message) => {
  message = JSON.parse(message.data);

  if (message.type === "start") {
    for (mes of message.result) {
      const elem = `<div class="message"><div class="message__user">${mes.author} написал(а):</div><div class="message__text">${mes.text}</div></div>`;
      newMesArea.insertAdjacentHTML("beforebegin", elem);
    }
  } else if (message.type === "signin") {
    if (message.result) {
      form.classList.add("header__login-area_none");
      const loginText = document.querySelector(".login .login__text");
      loginText.innerHTML = message.login;

      const loginBut = document.querySelector(".login .login__button");
      loginBut.innerHTML = "Выход";
    }
  }

  if (message.type === "newmessage") {
    const elem = `<div class="message"><div class="message__user">${message.result.author} написал(а):</div><div class="message__text">${message.result.text}</div></div>`;
    newMesArea.insertAdjacentHTML("beforebegin", elem);
  }
});

socket.addEventListener("close", () => {
  console.log("Connection closed");
});

signin_but.addEventListener("click", (ev) => {
  const message = {
    type: "signin",
    login: form.login.value,
    password: form.password.value,
  };

  socket.send(JSON.stringify(message));
  form.reset();
  ev.preventDefault();
});

signup_but.addEventListener("click", (ev) => {
  const message = {
    type: "signup",
    login: form.login.value,
    password: form.password.value,
  };

  socket.send(JSON.stringify(message));
  form.reset();
  ev.preventDefault();
});

socket.addEventListener("open", () => {
  const message = {
    type: "start",
  };
  socket.send(JSON.stringify(message));
});

newMesBtn.addEventListener("click", (ev) => {
  const message = {
    type: "newmessage",
    text: newMesForm.text.value.trim(),
  };
  newMesForm.reset();

  if (message.text !== "") socket.send(JSON.stringify(message));
  ev.preventDefault();
});
