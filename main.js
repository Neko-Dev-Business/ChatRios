import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  child,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

/* MODAL */
// window.onload = () => {
//   modalShow(1);
//   // const btnSubmit = document.getElementById("btnSubmit");
//   // btnSubmit.value = "<i class='fas fa-sign-out-alt'></i> Entrar";
// };

// const fechar = document.getElementById("fechar");
// fechar.addEventListener("click", () => {
//   modalShow(2);
// });

/**
 * Exibir/Ocultar o Modal de Login.
 * @param {number} option Opção: 1-exibir/2-ocultar
 */
const modalShow = (option) => {
  if (option === 1) {
    document.querySelector("#popbox").classList.remove("zoom-out");
    document.querySelector("#popbox").classList.add("zoom-in");
    document.querySelector(".popwrap").style.display = "block";
  } else if (option === 2) {
    document.querySelector("#popbox").classList.remove("zoom-in");
    document.querySelector("#popbox").classList.add("zoom-out");
    setTimeout(function () {
      document.querySelector(".popwrap").style.display = "none";
    }, 100);
  }
};

/* endMODAL */

const firebaseConfig = {
  apiKey: "AIzaSyAzCPRRuDtaBp_jQB4GsGHap6PwECYSH88",
  authDomain: "chatrios-diego.firebaseapp.com",
  databaseURL: "https://chatrios-diego-default-rtdb.firebaseio.com",
  projectId: "chatrios-diego",
  storageBucket: "chatrios-diego.appspot.com",
  messagingSenderId: "741860669158",
  appId: "1:741860669158:web:7f937d500a8dee4414ed27",
};

//Obter referências do firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const form = {
  email: () => document.getElementById("emailUser"),
  nome: () => document.getElementById("nomeUser"),
  // loginButton: () => document.getElementById("btnSubmit"),
  password: () => document.getElementById("passUser"),
};

const btnSubmit = document.getElementById("btnSubmit");
btnSubmit.addEventListener("click", () => {
  login();
});

const btnPassword = document.getElementById("btnPassword");
btnPassword.addEventListener("click", () => {
  recoverPassword();
});

const btnRegister = document.getElementById("btnRegister");
btnRegister.addEventListener("click", () => {
  register();
});

const btnLogout = document.getElementById("btnLogout");
btnLogout.addEventListener("click", () => {
  logout();
});

onAuthStateChanged(auth, (user) => {
  // user = null -> não logado. user <> null -> logado.
  if (user) {
    modalShow(2);
    signInChat();
  } else if (!user) {
    modalShow(1);
  }
});

function logout() {
  signOut(auth)
    .then(() => {
      document.getElementById("messages").innerHTML = "";
      form.email().value = "";
      form.nome().value = "";
      form.password().value = "";
      document.getElementById("header-title").innerHTML =
        "<img class='header-logo' src='img/icon.png' alt='Logo ChatRios' /><span>ChatRios</span>";
      //window.location.reload();
    })
    .catch(() => {
      alert("Erro ao sair do  Chat.");
    });
}

function recoverPassword() {
  showLoading();
  // auth().
  sendPasswordResetEmail(auth, form.email().value)
    // sendPasswordResetEmail(auth, "tudocom65@gmail.com")
    .then(() => {
      hideLoading();
      alert("Email enviado com sucesso.");
    })
    .catch((error) => {
      hideLoading();
      alert(getErrorMessage(error));
    });
}

function signInChat() {
  const username = form.nome().value;
  // Supondo que você tenha um objeto 'message' com o campo 'username'
  // const avatarSeed = username;

  // const avatarImage = generateAvatar(avatarSeed);

  // Agora você pode usar 'avatarImage' para exibir o avatar na interface do chat

  document.getElementById("header-title").innerHTML =
    "<img class='header-logo' src='img/icon.png' alt='Logo ChatRios' /><span>ChatRios - " +
    username +
    "</span>";

   function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  function sendMessage() {
    //Obter os valores a serem enviados
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
    const sentAt = new Date().toUTCString();

    //Limpar a caixa de entrada
    messageInput.value = "";

    //Rolagem automática para a parte inferior
    document.getElementById("messages").scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });

    //Obtém uma chave para uma nova mensagem
    const newPostKey = push(child(ref(db), "messages")).key;

    //Enviar os dados da mensagem
    set(ref(db, "messages/" + newPostKey), {
      username,
      sentAt,
      message,
    });
    scrollToBottom()
  }

  //Enviar mensagens a partir do formulário
  const messageForm = document.getElementById("message-form");

  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    sendMessage();
   // ;
  });

  //Obter referência do nó messages
  const fetchChat = ref(db, "messages/");

  //Atualizar mensagens
  onChildAdded(fetchChat, (snapshot) => {
    setTimeout(1500);
    const messages = snapshot.val();
    const isCurrentUser = username === messages.username;
    const message = `<div class=${isCurrentUser ? "userMsg" : "nouserMsg"}><img
        src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${
          messages.username + "ChatRios-Diego"
        }"
        alt="avatar" class="avatar"
      />
      <li class=${isCurrentUser ? "sent" : "receive"}>
        <span>${isCurrentUser ? "" : messages.username + ": "}</span>${
      messages.message
    }
              <div>
                <span style="font-size: 10px">${new Date(
                  messages.sentAt
                ).getHours()}:${new Date(messages.sentAt).getMinutes()}</span>
              </div>
            </li></div>`;
    document.getElementById("messages").innerHTML += message;
  });
}

function login() {
  showLoading();

  signInWithEmailAndPassword(auth, form.email().value, form.password().value)
    .then((response) => {
      console.log("success", response);
      hideLoading();
      //modalShow(2);
      //signInChat();
    })
    .catch((error) => {
      hideLoading();
      // alert(error.code);
      alert(getErrorMessage(error));
      // console.log("error", error);
    });
}

function register() {
  showLoading();
  createUserWithEmailAndPassword(
    auth,
    form.email().value,
    form.password().value
  )
    .then(() => {
      hideLoading();
      modalShow(2);
      signInChat();
    })
    .catch((error) => {
      hideLoading();
      alert(getErrorMessage(error));
    });
}
function getErrorMessage(error) {
  hideLoading();
  if (error.code === "auth/invalid-credential") {
    return "Senha/Email inválidos.";
  } else if (error.code == "auth/wrong-password") {
    return "Senha inválida";
  } else if (error.code == "auth/email-already-in-use") {
    return "Email já está em uso.";
  } else {
    return error.code;
  }
}
// const username = prompt("Por favor, diga seu nome");
// const username = form.nome().value;
