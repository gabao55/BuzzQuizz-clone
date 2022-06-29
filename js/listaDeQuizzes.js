function iniciaTelaListaDeQuizzes() {
    const estrutura = `
        <h2>Todos os Quizzes</h2>
        <div class="quizzes">
        </div>
    `

    let paginaDeQuizzes = document.querySelector(".pagina-de-quizz");
    paginaDeQuizzes.innerHTML += estrutura;

    consultarQuizzes();
}

function consultarQuizzes () {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promessa.catch(erroAoListarQuizzes);
    promessa.then(listarQuizzes);
}

function erroAoListarQuizzes (error) {
    alert("Erro ao carregar aplicação.");
    window.reload();
}

function listarQuizzes(resposta) {
    console.log(resposta.data);
    for (let i = 0 ; i < resposta.data.length ; i ++) {
        renderizarQuizz(resposta.data[i]);
    }
}

function renderizarQuizz (quizz) {
    let listaQuizzes = document.querySelector(".quizzes");
    const quizzAtual = `
        <div class="quizz" id="${quizz.id}" onclick="responderQuizz(this);">
            <div class="gradient"></div>
            <img src="${quizz.image}" />
            <h3>${quizz.title}</h3>
        </div>
    `;
    listaQuizzes.innerHTML += quizzAtual;
}

function responderQuizz (element) {
    let quizz = element;
    quizz.parentNode.parentNode.innerHTML = "";
    // TODO: Ir para a próxima página de responder quizz
}

iniciaTelaListaDeQuizzes();