
const test = require("node:test");
const assert = require("node:assert/strict");

const Lexer = require("../src/lexer");
const Parser = require("../src/parser");

function analisar(codigo) {
    const lexer = new Lexer(codigo);
    const tokens = lexer.analisar();

    const parser = new Parser(tokens);
    return parser.analisar();
}

test("Reconhece declaração de variável", () => {
    const ast = analisar(
        'Massa idade Receba! 21 É nenhuma'
    );

    assert.equal(ast.declaracoes[0].tipo, "Variavel");
    assert.equal(ast.declaracoes[0].nome, "idade");
    assert.equal(ast.declaracoes[0].valor.valor, 21);
});

test("Reconhece impressão", () => {
    const ast = analisar(
        'Ópraí!("Oxente!") É nenhuma'
    );

    assert.equal(ast.declaracoes[0].tipo, "Impressao");
    assert.equal(ast.declaracoes[0].valor.valor, "Oxente!");
});

test("Reconhece uma operação matemática", () => {
    const ast = analisar(
        "Massa resultado Receba! 10 + 5 * 2 É nenhuma"
    );

    const expressao = ast.declaracoes[0].valor;

    assert.equal(expressao.operador, "+");
    assert.equal(expressao.direita.operador, "*");
});

test("Rejeita declaração incompleta", () => {
    assert.throws(() => {
        analisar("Massa Receba! 21 É nenhuma");
    });
});

test("Reconhece uma estrutura condicional", () => {
    const ast = analisar(`
        Oxi (idade De hoje a oito 18) {
            Ópraí!("Maior") É nenhuma
        } Oxente {
            Ópraí!("Menor") É nenhuma
        }
    `);

    assert.equal(ast.declaracoes[0].tipo, "Condicional");
    assert.ok(ast.declaracoes[0].senao);
});
