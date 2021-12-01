const socket = new WebSocket("ws://127.0.0.1:2000");
const form = document.querySelector(".header__login-area");
const signin_but = document.querySelector(".login-area__submit_sign-in");
const signup_but = document.querySelector(".login-area__submit_sign-up");
const newMesArea = document.querySelector(".messages__new-message-area");
const newMesBtn = document.querySelector(".new-message__button");
const newMesForm = document.querySelector(".messages__new-message-area");
const login__button = document.querySelector(".login__button");
const deleteButton = document.querySelector(".login__delete-button");
const messagesButton = document.querySelector(".login__messages-button");
const mainForum = document.querySelector(".messages");
let dialogs;
const privateMessagesForm = document.querySelector(".dialog__form");
let dialog_with = "";

deleteButton.addEventListener("click", (ev) => {
  const message = {
    type: "remove",
  };

  socket.send(JSON.stringify(message));
  const wrongMes = document.querySelector(".login-area__wrong-message");
  wrongMes.innerHTML = "";

  form.classList.remove("header__login-area_none");
  const loginText = document.querySelector(".login .login__text");
  loginText.innerHTML = "";
  login__button.innerHTML = "Вход";
  const deleteButton = document.querySelector(".login__delete-button");
  deleteButton.classList.add("login__delete-button_inactive");
  messagesButton.classList.add("login__messages-button_inactive");

  const dialogBox = document.querySelector(".dialog");
  dialogBox.classList.add("dialog_inactive");
  const privMessages = document.querySelector(".privmessages");
  privMessages.classList.add("privmessages_inactive");
  const messagesBox = document.querySelector(".messages");
  messagesBox.classList.remove("messages_inactive");
});

login__button.addEventListener("click", (ev) => {
  if (ev.target.innerHTML === "Выход") {
    const wrongMes = document.querySelector(".login-area__wrong-message");
    wrongMes.innerHTML = "";
    const message = {
      type: "logout",
    };

    socket.send(JSON.stringify(message));

    form.classList.remove("header__login-area_none");
    const loginText = document.querySelector(".login .login__text");
    loginText.innerHTML = "";
    ev.target.innerHTML = "Вход";
    const deleteButton = document.querySelector(".login__delete-button");
    deleteButton.classList.add("login__delete-button_inactive");
    messagesButton.classList.add("login__messages-button_inactive");

    const dialogBox = document.querySelector(".dialog");
    dialogBox.classList.add("dialog_inactive");
    const privMessages = document.querySelector(".privmessages");
    privMessages.classList.add("privmessages_inactive");
    const messagesBox = document.querySelector(".messages");
    messagesBox.classList.remove("messages_inactive");
  }
});

socket.addEventListener("message", (message) => {
  message = JSON.parse(message.data);

  if (message.type === "start") {
    for (user of message.users) {
      const elem = `<div class="privmessages__dialog"><a href="#">${user.login}</a></div>`;
      const privateMessages = document.querySelector(".privmessages");
      privateMessages.insertAdjacentHTML("beforeend", elem);
    }

    dialogs = document.querySelectorAll(".privmessages__dialog a");
    for (dialog of dialogs) {
      dialog.addEventListener("click", (event) => {
        event.preventDefault();
        const message = {
          type: "getDialogs",
          to: event.target.innerHTML,
        };
        console.log(message);
        const dialogBox = document.querySelector(".dialog");
        dialogBox.classList.remove("dialog_inactive");

        socket.send(JSON.stringify(message));
      });
    }

    console.log(message);
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
      const deleteButton = document.querySelector(".login__delete-button");
      deleteButton.classList.remove("login__delete-button_inactive");
      messagesButton.classList.remove("login__messages-button_inactive");
    } else {
      const wrongMes = document.querySelector(".login-area__wrong-message");
      wrongMes.innerHTML = "Неверный логин или пароль";
    }
  }

  if (message.type === "newmessage") {
    const elem = `<div class="message"><div class="message__user">${message.result.author} написал(а):</div><div class="message__text">${message.result.text}</div></div>`;
    newMesArea.insertAdjacentHTML("beforebegin", elem);
  }

  if (message.type === "signup") {
    if (!message.result) {
      const wrongMes = document.querySelector(".login-area__wrong-message");
      wrongMes.innerHTML = "Это имя занято";
    }
  }

  if (message.type === "getDialogs") {
    const dialogBox = document.querySelector(".dialog .dialog__box");
    const dialogHeader = document.querySelector(".dialog .dialog__title");
    dialog_with = message.to;
    dialogHeader.innerHTML = `Диалог с ${message.to}`;
    dialogBox.innerHTML = "";
    for (const mes of message.result) {
      const elem = `<div class="dialog__text">${mes.message}</div>`;
      dialogBox.insertAdjacentHTML("beforeend", elem);
    }
  }

  if (message.type === "newPrivateMessage") {
    if (
      message.result.from === dialog_with ||
      message.result.to === dialog_with
    ) {
      const elem = `<div class="dialog__text">${message.result.text}</div>`;
      const dialogBox = document.querySelector(".dialog .dialog__box");
      dialogBox.insertAdjacentHTML("beforeend", elem);
    }
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

messagesButton.addEventListener("click", (ev) => {
  ev.preventDefault();

  const privMessages = document.querySelector(".privmessages");
  mainForum.classList.toggle("messages_inactive");
  privMessages.classList.toggle("privmessages_inactive");
  const dialogBox = document.querySelector(".dialog");
  dialogBox.classList.add("dialog_inactive");
});

privateMessagesForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // const textBox = document.querySelector("dialog__new-message-text");
  const text = event.target.text.value.trim();
  const message = {
    type: "newPrivateMessage",
    text: text,
    to: dialog_with,
  };
  socket.send(JSON.stringify(message));

  event.target.reset();
});
