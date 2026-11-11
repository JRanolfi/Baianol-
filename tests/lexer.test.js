
const test = require("node:test");
const assert = require("node:assert/strict");

const Lexer = require("../src/lexer");
const TOKENS = require("../src/tokens");

// Executa o Lexer e remove o token EOF dos resultados.
function analisar(codigo) {
    const lexer = new Lexer(codigo);

    return lexer.analisar().filter(
        token => token.tipo !== TOKENS.EOF
    );
}

test("Reconhece palavras reservadas", () => {
    const tokens = analisar(`
        Massa
        Lá ele
        Receba!
        Ópraí!
        Oxi
        Se ligue
        Oxente
        Chegue
        Bora
        Disgraça 404
        Ai Fudeu
        À toa
        É nenhuma
    `);

    const esperados = [
        TOKENS.MASSA,
        TOKENS.LA_ELE,
        TOKENS.RECEBA,
        TOKENS.OPRAI,
        TOKENS.OXI,
        TOKENS.SE_LIGUE,
        TOKENS.OXENTE,
        TOKENS.CHEGUE,
        TOKENS.BORA,
        TOKENS.DISGRACA_404,
        TOKENS.AI_FUDEU,
        TOKENS.A_TOA,
        TOKENS.FIM_INSTRUCAO
    ];

    assert.deepEqual(
        tokens.map(token => token.tipo),
        esperados
    );
});

test("Reconhece identificadores", () => {
    const tokens = analisar("idade nome usuario123");

    assert.deepEqual(
        tokens.map(token => token.tipo),
        [
            TOKENS.IDENTIFICADOR,
            TOKENS.IDENTIFICADOR,
            TOKENS.IDENTIFICADOR
        ]
    );
});

test("Reconhece números inteiros e decimais", () => {
    const tokens = analisar("21 10.5 100");

    assert.deepEqual(
        tokens.map(token => token.tipo),
        [
            TOKENS.NUMERO,
            TOKENS.NUMERO,
            TOKENS.NUMERO
        ]
    );
});

test("Reconhece strings", () => {
    const tokens = analisar('"Olá, Bahia!" \'Oxente\'');

    assert.deepEqual(
        tokens.map(token => token.tipo),
        [TOKENS.STRING, TOKENS.STRING]
    );
});

test("Reconhece operadores", () => {
    const tokens = analisar("=== && || + - * / % !");

    assert.deepEqual(
        tokens.map(token => token.tipo),
        [
            TOKENS.IGUAL,
            TOKENS.AND,
            TOKENS.OR,
            TOKENS.MAIS,
            TOKENS.MENOS,
            TOKENS.MULTIPLICACAO,
            TOKENS.DIVISAO,
            TOKENS.RESTO,
            TOKENS.NOT
        ]
    );
});

test("Reconhece delimitadores", () => {
    const tokens = analisar("( ) { } [ ] , :");

    assert.deepEqual(
        tokens.map(token => token.tipo),
        [
            TOKENS.PARENTESE_ABRE,
            TOKENS.PARENTESE_FECHA,
            TOKENS.CHAVE_ABRE,
            TOKENS.CHAVE_FECHA,
            TOKENS.COLCHETE_ABRE,
            TOKENS.COLCHETE_FECHA,
            TOKENS.VIRGULA,
            TOKENS.DOIS_PONTOS
        ]
    );
});

test("Identifica caracteres inválidos", () => {
    assert.throws(() => analisar("@"));
});
