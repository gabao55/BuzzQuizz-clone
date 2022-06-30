let quizzID;
function responderQuizz (element) {
    let quizz = element;
    quizzID = quizz.id;
    quizz.parentNode.parentNode.remove();
}
