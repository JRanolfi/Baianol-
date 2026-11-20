const nota = 8;
function verificarSituacao(valor) {
    if ((valor > 7)) {
        return "Aprovado";
    } else if ((valor > 5)) {
        return "Recuperação";
    } else {
        return "Reprovado";
    }
}
var situacao = verificarSituacao(nota);
console.log("Nota do aluno:");
console.log(nota);
console.log("Situação:");
console.log(situacao);