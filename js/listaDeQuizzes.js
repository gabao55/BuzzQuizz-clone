let URLAPI = "https://mock-api.driven.com.br/api/v7/buzzquizz/"
// Listagem de Quizz

let quizzID;

function iniciaTelaListaDeQuizzes() {
    // const quizzesUsuario = lerQuizzesDoUsuario();
    let listaDeQuizzes = document.querySelector(".lista-quizzes");
   /* if (quizzesUsuario.length === 0) {
        */listaDeQuizzes.innerHTML += `<div class="secao-criar-quizz">
        <span>Você não criou nenhum quizz ainda :(</span>
        <div class="botao-criar-quizz" onclick="iniciaTelaCriarQuizz()">Criar Quizz</div>
    </div>`/*
    } else {
        listaDeQuizzes.innerHTML += `<div class="quizzes-do-usuario"><h2>Seus Quizzes  </h2><div class="botao-add-quizz" onclick="iniciaTelaCriarQuizz()">+</div></div></div>`
        for (let i = 0; i < quizzesUsuario.length; i++) {
listaDeQuizzes.innerHTML +=`
        <div class="quizz" id="${listaDeQuizzes[i].id}">
            <div class="gradient"></div>
            <img src="${listaDeQuizzes[i].image}" />
            <h3>${listaDeQuizzes[i].title}</h3>
        </div>
    `
        }
    }*/
    const estrutura = `
        <h2>Todos os Quizzes</h2>
        <div class="quizzes">
        </div>
    `

    listaDeQuizzes.innerHTML += estrutura;

    consultarQuizzes();
}

function lerQuizzesDoUsuario () {
    if (!localStorage.getItem("quizzesDoUsuario")) {
        return [];
    }

    return JSON.parse(localStorage.getItem("quizzesDoUsuario"));
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

iniciaTelaListaDeQuizzes();

// Página de Quizz

let arrayDeNiveis;

function iniciaTelaPaginaDeQuizz(element) {
    let promess = axios.get(`${URLAPI}quizzes/${element}`)
    promess.then(renderizarBanner);
}
function renderizarBanner(resposta) {
    let estrutura = document.querySelector(".pagina-de-quizz");

    arrayDeNiveis = resposta.data.levels;
    estrutura.innerHTML = "";
    estrutura.innerHTML += `<div class="banner"><img src="${resposta.data.image}">
            <span>${resposta.data.title}</span>
        </div>`
    renderizarPerguntas(resposta.data.questions);
}
let listaRespostasCertas = [];
function renderizarPerguntas(resposta) {
    let perguntas = resposta;
    let estrutura = document.querySelector(".pagina-de-quizz");
    let respostasAleatorias = [];
    for (let i = 0; i < perguntas.length; i++) {
        respostasAleatorias = perguntas[i].answers.sort(function () {
            return Math.random() - 0.5
        })
        estrutura.innerHTML += `
    <div class="pergunta">
            <div class="titulo-pergunta"><span>${perguntas[i].title}</span></div>
            <div class="container-respostas pergunta${i}"></div></div>`;
        for (let j = 0; j < perguntas[i].answers.length; j++) {
            let containerRespostas = document.querySelector(`.pergunta${i}`);
            containerRespostas.innerHTML += `<div class="resposta"><img src="${respostasAleatorias[j].image}">${respostasAleatorias[j].text}</div>`;
            if (respostasAleatorias[j].isCorrectAnswer === true) {
                listaRespostasCertas[i] = `<img src="${respostasAleatorias[j].image}">${respostasAleatorias[j].text}`;
            }
        }
        respostasAleatorias = [];
    }
    adicionarClickRespostas();
}
function adicionarClickRespostas() {
    document.querySelectorAll(".resposta").forEach(obj => {
        obj.addEventListener(
            "click",
            () => {
                analisarRespostas(obj);
            }
        );
    })
}
let perguntaAtual;
let respostasCorretas = 0;
function analisarRespostas(element) {
    for (let i = 0; i < listaRespostasCertas.length; i++) {
        if (element.parentNode.classList.contains(`pergunta${i}`)) {
            perguntaAtual = i;
            element.parentNode.querySelectorAll(".resposta").forEach(obj => {
                obj.classList.add("respondida");
            })
            element.classList.remove("respondida");
            if (listaRespostasCertas[i] == element.innerHTML) {
                element.classList.add("certa");
                respostasCorretas++;
            } else {
                element.classList.add("errada");
            }
            element.parentNode.querySelectorAll(".respondida").forEach(obj => {
                if (listaRespostasCertas[i] == obj.innerHTML) {
                    obj.classList.add("certa");
                } else {
                    obj.classList.add("errada");
                }
            })
            proximaPergunta();
        }
    }
}
let quantRespondida;
function proximaPergunta() {
    quantRespondida = document.querySelectorAll(".certa");
    console.log(quantRespondida);
    if (quantRespondida.length < listaRespostasCertas.length) {
        setTimeout(() => { document.querySelector(`.pergunta${perguntaAtual + 1}`).parentNode.scrollIntoView({ behavior: "smooth" }); }, 2000);
    } else {
        mostrarResultado();
        setTimeout(scrollParaResultado, 2000);
    }
}

function mostrarResultado() {
    let estrutura = document.querySelector(".pagina-de-quizz");
    let porcentagemAcertos = Math.round(respostasCorretas / listaRespostasCertas.length * 100);
    let nivelDoUsuario =
    {
        title: null,
        image: null,
        text: null,
        minValue: -1
    };

    for (let i = 0; i < arrayDeNiveis.length; i++) {
        if (arrayDeNiveis[i].minValue <= porcentagemAcertos && arrayDeNiveis[i].minValue > nivelDoUsuario.minValue) {
            nivelDoUsuario.title = arrayDeNiveis[i].title;
            nivelDoUsuario.image = arrayDeNiveis[i].image;
            nivelDoUsuario.text = arrayDeNiveis[i].text;
            nivelDoUsuario.minValue = arrayDeNiveis[i].minValue;
        }
    }

    estrutura.innerHTML += `
        <div class="pergunta">
            <div class="titulo-pergunta titulo-resultado">
                <span>${porcentagemAcertos}% de acerto: ${nivelDoUsuario.title}</span>
            </div>
            <div class="container-respostas">
                <div class="resposta resultado">
                    <img src="${nivelDoUsuario.image}" />
                    <p>${nivelDoUsuario.text}</p>
                </div>
            </div>
            <div class="acoes">
                <button onclick="iniciaTelaPaginaDeQuizz(${quizzID});scrollParaReiniciarQuiz();">Reiniciar quizz</button>
                <div onclick="window.location.reload();">Voltar para home</div>
            </div>
        </div>
    `
}

function scrollParaResultado() {
    let resultado = document.querySelector(".titulo-resultado");
    resultado.parentNode.scrollIntoView({ behavior: "smooth" });
}

function scrollParaReiniciarQuiz() {
    respostasCorretas = 0;
    let inicioQuizz = document.querySelector(".pagina-de-quizz");
    inicioQuizz.parentNode.scrollIntoView({ behavior: "smooth" });
}

// Criação de Quizz

let quizz = {};
let numeroDePerguntas;
let numeroDeNiveis;

function iniciaTelaCriarQuizz() {
    document.querySelector(".pagina-de-quizz").innerHTML = ""
    document.querySelector(".lista-quizzes").innerHTML = ""
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
    let paginaCriarQuizz = document.querySelector(".criar-quizz");
    paginaCriarQuizz.innerHTML = `<h2>Crie suas perguntas</h2>`;

    for (let i = 1; i <= numeroDePerguntas; i++) {
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

function editarPergunta(element) {
    let temPerguntaAberta = fecharOutrasPerguntas(element);
    if (!temPerguntaAberta) {
        return
    }

    element.querySelector("ion-icon").remove();
    element.classList.remove("pergunta-fechada");
    element.classList.add("pergunta-aberta");
    element.querySelectorAll(".display-none").forEach(
        (e) => { e.classList.remove("display-none") }
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
    let questions = [];
    let invalido = 0;

    let perguntas = document.querySelectorAll(".inserir-infos");

    let numeroDeRespostasIncorretas = 0;
    let numeroDeRespostasCorretas = 0;

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
            invalido++;
            return
        }

        question.answers = [];

        let respostaCorreta = obj.querySelector(".criar-resposta-correta");
        let textoRespostaCorreta = respostaCorreta.querySelector("input[type=text]").value;
        let urlRespostaCorreta = respostaCorreta.querySelector("input[type=url]").value;

        if (validarTextoEUrl(textoRespostaCorreta, urlRespostaCorreta)) {
            question.answers.push(
                {
                    text: textoRespostaCorreta,
                    image: urlRespostaCorreta,
                    isCorrectAnswer: true
                }
            )
            numeroDeRespostasCorretas++;
        } else {
            invalido++;
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
                );
                numeroDeRespostasIncorretas++;
            } else if (textoRespostaIncorreta || urlRespostaIncorreta) {
                invalido++;
                return
            }
        });

        if (validarPergunta(numeroDeRespostasCorretas, numeroDeRespostasIncorretas)) {
            questions.push(question);
        } else {
            invalido++;
            return
        }
    });

    if (invalido > 0) {
        alert("Preencha os campos corretamente");
        return
    }

    quizz.questions = questions;
    renderizarCriarNiveis()
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

    for (let i = 1; i < color.length; i++) {
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

function validarPergunta(respostasCorretas, respostasIncorretas) {
    if (respostasCorretas === 0 || respostasIncorretas === 0) {
        return false
    }

    return true
}

function renderizarCriarNiveis() {
    let paginaCriarQuizz = document.querySelector(".criar-quizz");
    paginaCriarQuizz.innerHTML = `<h2>Agora, decida os níveis!</h2>`;
    for (let i = 1; i <= numeroDeNiveis; i++) {
        renderizarCriarNivel(paginaCriarQuizz, i);
    }
    paginaCriarQuizz.innerHTML += `<button onclick="seguirParaFinalizarQuizz();">Finalizar Quizz</button>`;
}
function renderizarCriarNivel(element, numeroDoQuizz) {
    element.innerHTML += `
        <div class="inserir-infos pergunta-fechada" onclick="editarNivel(this);">
            <div>
                <div class="referencia-pergunta">
                    <h3>Nível ${numeroDoQuizz}</h3>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <div class="criar-pergunta display-none">
                    <input type="text" placeholder="Título do Nível" />
                    <input type="number" placeholder="% de acerto mínima" />     
                    <input type="url" placeholder="URL da imagem" />
                    <input type="text" placeholder="Descrição do nível" />
                </div>             
                </div>
            </div>        
    `
}

function editarNivel(element) {
    let temNivelAberto = fecharOutrosNiveis(element);
    if (!temNivelAberto) {
        return
    }
    element.querySelector("ion-icon").remove();
    element.classList.remove("pergunta-fechada");
    element.classList.add("pergunta-aberta");
    element.querySelectorAll(".display-none").forEach(
        (e) => { e.classList.remove("display-none") }
    );
}
function fecharOutrosNiveis(nivelAtual) {
    let nivelAberto = document.querySelector(".pergunta-aberta");

    if (nivelAberto === nivelAtual) {
        return false
    }

    if (nivelAberto) {
        nivelAberto.querySelector(".referencia-pergunta").innerHTML += `<ion-icon name="create-outline"></ion-icon>`;
        nivelAberto.classList.add("pergunta-fechada");
        nivelAberto.classList.remove("pergunta-aberta");
        nivelAberto.querySelector(".criar-pergunta").classList.add("display-none");
    }
    return true
}
function seguirParaFinalizarQuizz() {
    quizz.levels = [];
    let levels = [];
    let invalido = 0;
    let niveis = document.querySelectorAll(".inserir-infos");
    niveis.forEach(obj => {
        let level = {
            title: null,
            image: null,
            text: null,
            minValue: null
        };
        let title = obj.querySelector(".criar-pergunta input").value;
        let image = obj.querySelector(".criar-pergunta input[type=url]").value;
        let text = obj.querySelector(".criar-pergunta input:last-child").value;
        let minValue = obj.querySelector(".criar-pergunta input[type=number]").value;

        if (validarQuizz(title, image, text, minValue)) {
            level.title = title;
            level.image = image;
            level.text = text;
            level.minValue = minValue;
            levels.push(level);
        } else {
            invalido++;
            return
        }

    })
    if (verificarMinValue(levels)) {
        quizz.levels = levels;        
    } else {
        invalido++;        
    }

    if (invalido>0){
       alert("Preencha os campos corretamente!");
       return
    }else{
        renderizarSucessoQuizz();
    }
}

function validarQuizz(title, image, text, minValue) {

    if (title.length < 9) {
        return false;
    }

    //validação da imagem
    let url;
    try {
        url = new URL(image);
    } catch (_) {
        return false;
    }

    if (text.length < 29) {
        return false;
    }

    if ((minValue < 0) || (minValue > 100)) {
        return false
    } else {
        return true;
    }
}

function verificarMinValue(levels){    
    for (let i=0;i<levels.length;i++){
        if (levels[i].minValue==0){
            return true;
        }
    }
    return false;
}
function renderizarSucessoQuizz(){
    
    let paginaCriarQuizz = document.querySelector(".criar-quizz");
    paginaCriarQuizz.innerHTML = `<h2>Seu quizz está pronto!</h2>`;

}

function escreverQuizzesDoUsuario (id) {
    if (lerQuizzesDoUsuario().length === 0) {
        let ids = JSON.stringify([id]);
        localStorage.setItem("quizzesDoUsuario", ids);
    } else {
        let ids = lerQuizzesDoUsuario();
        ids.push(id);
        localStorage.setItem("quizzesDoUsuario", JSON.stringify(ids));
    }
}