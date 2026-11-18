const test = require("node:test");
const assert = require("node:assert");
const Lexer = require("../src/lexer");
const TOKENS = require("../src/tokens");


test("Reconhece Bitolado", () => {
    const tokens = new Lexer("Bitolado").analisar();

    assert.strictEqual(tokens[0].tipo, TOKENS.BITOLADO);

});

test("Reconhece booleanos e null", () => {
    const tokens = new Lexer("true false null").analisar();

    assert.strictEqual(tokens[0].tipo, TOKENS.BOOLEANO);
    assert.strictEqual(tokens[1].tipo, TOKENS.BOOLEANO);
    assert.strictEqual(tokens[2].tipo, TOKENS.NULO);
});

test("Reconhece ponto, incremento e decremento", () => {
    const tokens = new Lexer("objeto.metodo() contador++ contador--").analisar();

    assert.strictEqual(tokens[1].tipo, TOKENS.PONTO);
    assert.strictEqual(tokens[6].tipo, TOKENS.INCREMENTO);
    assert.strictEqual(tokens[8].tipo, TOKENS.DECREMENTO);
});
