let quizz = {};
let qtdPerguntas;
let qtdNiveis;

function iniciaTelaCriarQuizz () {
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

function seguirParaCriarPerguntas () {
    let todosOsCampos = document.querySelectorAll("input");
    let title = todosOsCampos[0].value;
    let image = todosOsCampos[1].value;
    let qtdPerguntas = todosOsCampos[2].value;
    let qtdNiveis = todosOsCampos[3].value;

    if (!validarCampos(title, image, qtdPerguntas, qtdNiveis)) {
        alert("Por favor, preencha os campos corretamente");
        return
    }


}

function validarCampos (title, image, qtdPerguntas, qtdNiveis) {
    if (!validarTitle(title) || !validarImage(image)
      || !validarQtdPerguntas(qtdPerguntas)
      || !validarQtdNiveis(qtdNiveis)) {
        return false
    }

    return true
}

function validarTitle (title) {
    if (title.length < 20 || title.length > 65) {
        return false
    }

    return true
}

function validarImage (image) {
    let url;

    try {
        url = new URL(image);
    } catch (_) {
    return false;  
    }

    return true
}

function validarQtdPerguntas (qtdPerguntas) {
    if (qtdPerguntas < 3) {
        return false
    }

    return true
}

function validarQtdNiveis (qtdNiveis) {
    if (qtdNiveis < 2) {
        return false
    }

    return true
}

function renderizarCriarPerguntas () {
    document.querySelector(".criar-quizz").innerHTML = "";

}

iniciaTelaCriarQuizz();