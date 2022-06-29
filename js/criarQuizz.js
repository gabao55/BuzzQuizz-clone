function iniciaTelaCriarQuizz () {
    const infosIniciais = `
        <h2>Comece pelo começo</h2>
        <div class="inserir-infos">
            <input type="text" placeholder="Título do seu quizz" />
            <input type="url" placeholder="URL da imagem do seu quizz" />
            <input type="text" placeholder="Quantidade de perguntas do quizz" />
            <input type="text" placeholder="Quantidade de níveis do quizz" />
        </div>
        <button>Prosseguir para criar perguntas</button>
    `

    let paginaCriarQuizz = document.querySelector(".criar-quizz");
    paginaCriarQuizz.innerHTML += infosIniciais;
}