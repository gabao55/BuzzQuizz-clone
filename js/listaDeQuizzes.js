let URLAPI = "https://mock-api.driven.com.br/api/v7/buzzquizz/"
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
let listaRespostasCertas = [];
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
            <div class="container-respostas pergunta${i}"></div></div>`;
        for (let j = 0; j < perguntas[i].answers.length; j++) {
            let containerRespostas = document.querySelector(`.pergunta${i}`);
            containerRespostas.innerHTML += `<div class="resposta"><img src="${respostasRandomizadas[j].image}">${respostasRandomizadas[j].text}</div>`;
            if (respostasRandomizadas[j].isCorrectAnswer === true) {
                listaRespostasCertas[i] = `<img src="${respostasRandomizadas[j].image}">${respostasRandomizadas[j].text}`;
            }
        }
        respostasRandomizadas = [];
    }
    adicionarClickRespostas();
}
function adicionarClickRespostas() {
    document.querySelectorAll(".resposta").forEach(obj => {
        obj.addEventListener(
            "click",
            () => {
                respostasCorretas(obj);
            }
        );
    })
}
function respostasCorretas(element) {
    for (let i = 0; i < listaRespostasCertas.length; i++) {
        if (element.parentNode.classList.contains(`pergunta${i}`)) {
            console.log(element.parentNode);
            if (listaRespostasCertas[i] == element.innerHTML) {
                element.classList.add("certa");
            }else {
                element.classList.add("errada");
            }
        }
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

    if (!validarCamposInfosBasicas(title, image, qtdPerguntas, qtdNiveis)) {
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

function validarCamposInfosBasicas(title, image, qtdPerguntas, qtdNiveis) {
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
    if (qtdPerguntas < 0) { // TODO: Trocar 0 por 3 nessa linha
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
    let paginaCriarQuizz = document.querySelector(".criar-quizz");
    paginaCriarQuizz.innerHTML = `<h2>Crie suas perguntas</h2>`;

    for (let i = 1; i <= numeroDePerguntas ; i++) {
        renderizarCriarPergunta(paginaCriarQuizz, i);
    }

    paginaCriarQuizz.innerHTML += `<button onclick="seguirParaCriarNiveis();">Prosseguir para criar níveis</button>`;
}

function renderizarCriarPergunta(element, numeroDaPergunta) {
    element.innerHTML += `
        <div class="inserir-infos pergunta-fechada" onclick="editarPergunta(this);">
            <div>
                <div class="referencia-pergunta">
                    <h3>Pergunta ${numeroDaPergunta}</h3>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <div class="criar-pergunta display-none">
                    <input type="text" placeholder="Texto da pergunta" />
                    <input type="text" placeholder="Cor de fundo da pergunta" />
                </div>
                <div class="criar-resposta-correta display-none">
                    <h3>Resposta correta</h3>
                    <input type="text" placeholder="Resposta correta" />
                    <input type="url" placeholder="URL da imagem" />
                </div>
                <div class="criar-respostas-incorretas display-none">
                    <h3>Respostas incorretas</h3>
                    <div class="criar-resposta-incorreta">
                        <input type="text" placeholder="Resposta incorreta 1" />
                        <input type="url" placeholder="URL da imagem 1" />
                    </div>
                    <div class="criar-resposta-incorreta">
                        <input type="text" placeholder="Resposta incorreta 2" />
                        <input type="url" placeholder="URL da imagem 2" />
                    </div>
                    <div class="criar-resposta-incorreta">
                        <input type="text" placeholder="Resposta incorreta 3" />
                        <input type="url" placeholder="URL da imagem 3" />
                    </div>
                </div>
            </div>
        </div>
    `
}

function editarPergunta (element) {
    let temPerguntaAberta = fecharOutrasPerguntas(element);
    if (!temPerguntaAberta) {
        return
    }

    element.querySelector("ion-icon").remove();
    element.classList.remove("pergunta-fechada");
    element.classList.add("pergunta-aberta");
    element.querySelectorAll(".display-none").forEach(
        (e) => {e.classList.remove("display-none")}
    );
}

function fecharOutrasPerguntas(perguntaAtual) {
    let perguntaAberta = document.querySelector(".pergunta-aberta");

    if (perguntaAberta === perguntaAtual) {
        return false
    }

    if (perguntaAberta) {
        perguntaAberta.querySelector(".referencia-pergunta").innerHTML += `<ion-icon name="create-outline"></ion-icon>`;
        perguntaAberta.classList.add("pergunta-fechada");
        perguntaAberta.classList.remove("pergunta-aberta");
        perguntaAberta.querySelector(".criar-pergunta").classList.add("display-none");
        perguntaAberta.querySelector(".criar-resposta-correta").classList.add("display-none");
        perguntaAberta.querySelector(".criar-respostas-incorretas").classList.add("display-none");
    }

    return true
}

// TODO: Refatorar essa função
function seguirParaCriarNiveis() {
    quizz.questions = [];

    let perguntas = document.querySelectorAll(".inserir-infos");

    perguntas.forEach(obj => {
        let question = {
            title: null,
            color: null,
            answers: null
        };
        let title = obj.querySelector(".criar-pergunta input").value;
        let color = obj.querySelector(".criar-pergunta input:last-child").value;

        if (validarTitleEColor(title, color)) {
            question.title = title;
            question.color = color;
        } else {
            alert("Preencha os campos corretamente");
            return
        }

        question.answers = [];

        // TODO: Continuar debugando daqui

        let respostaCorreta = obj.querySelector(".criar-resposta-correta");
        let textoRespostaCorreta = respostaCorreta.querySelector("input[type=text]");
        let urlRespostaCorreta = respostaCorreta.querySelector("input[type=url]");

        if (validarTextoEUrl(textoRespostaCorreta, urlRespostaCorreta)) {
            question.answers.push(
                {
                    text: textoRespostaCorreta,
                    image: urlRespostaCorreta,
                    isCorrectAnswer: true
                }
            )
        } else {
            console.log("O problema está aqui");
            alert("Preencha os campos corretamente");
            return
        }

        let respostasIncorretas = obj.querySelectorAll(".criar-resposta-incorreta");
        respostasIncorretas.forEach(respostaIncorreta => {
            let textoRespostaIncorreta = respostaIncorreta.querySelector("input[type=text]").value;
            let urlRespostaIncorreta = respostaIncorreta.querySelector("input[type=url]").value;

            if (validarTextoEUrl(textoRespostaIncorreta, urlRespostaIncorreta)) {
                question.answers.push(
                    {
                        text: textoRespostaIncorreta,
                        image: urlRespostaIncorreta,
                        isCorrectAnswer: false
                    }
                )
            } else {
                alert("Preencha os campos corretamente");
                return
            }
        });

        // if (validarPerguntas(question)) {
        //     quizz.questions = question;
        // } else {
        //     alert("Preencha os campos corretamente");
        //     return
        // }
    });

    console.log(quizz);
}

function validarTitleEColor(title, color) {
    if (title.length < 20 || !validarColor(color)) {
        return false
    }

    return true
}

function validarColor(color) {
    if (color[0] !== "#" || color.length !== 7) {
        return false
    }

    for (let i = 1; i < color.length ; i ++) {
        if (!(/[a-zA-Z0-9]/).test(color[i])) {
            return false
        }
    }

    return true
}

function validarTextoEUrl(texto, url) {
    if (texto.length <= 0) {
        return false
    }

    let imagem;

    try {
        imagem = new URL(url);
    } catch (_) {
        return false;
    }

    return true
}

iniciaTelaCriarQuizz();