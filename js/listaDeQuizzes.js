let URLAPI = "https://mock-api.driven.com.br/api/v3/buzzquizz/"
// Listagem de Quizz

let quizzID;

function iniciaTelaListaDeQuizzes() {
    const estrutura = `
        <h2>Todos os Quizzes</h2>
        <div class="quizzes">
        </div>
    `

    let paginaDeQuizzes = document.querySelector(".lista-quizzes");
    paginaDeQuizzes.innerHTML += estrutura;

    consultarQuizzes();
}

function consultarQuizzes() {
    const promessa = axios.get(`${URLAPI}quizzes`);
    promessa.catch(erroAoListarQuizzes);
    promessa.then(listarQuizzes);
}

function erroAoListarQuizzes(error) {
    alert("Erro ao carregar aplicação.");
    window.reload();
}

function listarQuizzes(resposta) {
    for (let i = 0; i < resposta.data.length; i++) {
        renderizarQuizz(resposta.data[i]);
    }

    document.querySelectorAll(".quizz").forEach(obj => {
        obj.addEventListener(
            "click",
            () => {
                responderQuizz(obj);
            }
        );
    });
}

function renderizarQuizz(quizz) {
    let listaQuizzes = document.querySelector(".quizzes");
    const quizzAtual = `
        <div class="quizz" id="${quizz.id}">
            <div class="gradient"></div>
            <img src="${quizz.image}" />
            <h3>${quizz.title}</h3>
        </div>
    `;
    listaQuizzes.innerHTML += quizzAtual;
}

function responderQuizz(element) {
    quizzID = element.id;
    element.parentNode.parentNode.remove();
    iniciaTelaPaginaDeQuizz(quizzID);
}

// iniciaTelaListaDeQuizzes();

// Página de Quizz
function iniciaTelaPaginaDeQuizz(element) {
    let promess = axios.get(`${URLAPI}quizzes/${element}`)
    promess.then(renderizarBanner);
}
function renderizarBanner(resposta) {
    let estrutura = document.querySelector(".pagina-de-quizz")
    estrutura.innerHTML += `<div class="banner"><img src="${resposta.data.image}">
            <span>${resposta.data.title}</span>
        </div>`
    renderizarPerguntas(resposta.data.questions);
}
function renderizarPerguntas(resposta) {
    let perguntas = resposta;
    let estrutura = document.querySelector(".pagina-de-quizz");
    let respostasRandomizadas = [];
    for (let i = 0; i < perguntas.length; i++) {
        respostasRandomizadas = perguntas[i].answers.sort(function () {
            return Math.random() - 0.5
        })
        estrutura.innerHTML += `
    <div class="pergunta">
            <div class="titulo-pergunta"><span>${perguntas[i].title}</span></div>
            <div class="container-respostas">`;
        for (let j = 0; j < perguntas[i].answers.length; j++) {
            estrutura.innerHTML += `<div class="resposta"><img src="${respostasRandomizadas[j].image}">${respostasRandomizadas[j].text}</div>`;
        }
        estrutura.innerHTML += `</div></div>`;
        respostasRandomizadas = [];
    }
}


// Criação de Quizz

let quizz = {};
let numeroDePerguntas;
let numeroDeNiveis;

function iniciaTelaCriarQuizz() {
    const infosIniciais = `
        <h2>Comece pelo começo</h2>
        <div class="inserir-infos">
            <input type="text" placeholder="Título do seu quizz" />
            <input type="url" placeholder="URL da imagem do seu quizz" />
            <input type="number" placeholder="Quantidade de perguntas do quizz" />
            <input type="number" placeholder="Quantidade de níveis do quizz" />
        </div>
        <button>Prosseguir para criar perguntas</button>
    `

    let paginaCriarQuizz = document.querySelector(".criar-quizz");
    paginaCriarQuizz.innerHTML += infosIniciais;

    paginaCriarQuizz
        .querySelector("button")
        .addEventListener("click", () => seguirParaCriarPerguntas());
}

function seguirParaCriarPerguntas() {
    let todosOsCampos = document.querySelectorAll("input");
    let title = todosOsCampos[0].value;
    let image = todosOsCampos[1].value;
    let qtdPerguntas = todosOsCampos[2].value;
    let qtdNiveis = todosOsCampos[3].value;

    if (!validarCampos(title, image, qtdPerguntas, qtdNiveis)) {
        alert("Por favor, preencha os campos corretamente");
        return
    }

    quizz = {
        title: title,
        image: image
    }

    numeroDePerguntas = qtdPerguntas;
    numeroDeNiveis = qtdNiveis;

    renderizarCriarPerguntas();
}

function validarCampos(title, image, qtdPerguntas, qtdNiveis) {
    if (!validarTitle(title) || !validarImage(image)
        || !validarQtdPerguntas(qtdPerguntas)
        || !validarQtdNiveis(qtdNiveis)) {
        return false
    }

    return true
}

function validarTitle(title) {
    if (title.length < 20 || title.length > 65) {
        return false
    }

    return true
}

function validarImage(image) {
    let url;

    try {
        url = new URL(image);
    } catch (_) {
        return false;
    }

    return true
}

function validarQtdPerguntas(qtdPerguntas) {
    if (qtdPerguntas < 3) {
        return false
    }

    return true
}

function validarQtdNiveis(qtdNiveis) {
    if (qtdNiveis < 2) {
        return false
    }

    return true
}

function renderizarCriarPerguntas() {
    document.querySelector(".criar-quizz").innerHTML = "";
    for (let i = 0; i < numeroDePerguntas; i++) {
        console.log(i);
    }
}

// iniciaTelaCriarQuizz();