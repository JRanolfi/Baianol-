
const test = require("node:test");
const assert = require("node:assert/strict");

const Lexer = require("../src/lexer");
const Parser = require("../src/parser");


test("Reconhece valor booleano true", () => {
    const tokens = new Lexer("Massa ativo Receba! true É nenhuma").analisar();
    const ast = new Parser(tokens).analisar();

    assert.strictEqual(ast.declaracoes[0].valor.tipo, "Booleano");
    assert.strictEqual(ast.declaracoes[0].valor.valor, true);
});

test("Reconhece valor booleano false", () => {
    const tokens = new Lexer("Massa ativo Receba! false É nenhuma").analisar();
    const ast = new Parser(tokens).analisar();

    assert.strictEqual(ast.declaracoes[0].valor.tipo, "Booleano");
    assert.strictEqual(ast.declaracoes[0].valor.valor, false);
});

test("Reconhece valor null", () => {
    const tokens = new Lexer("Massa resposta Receba! null É nenhuma").analisar();
    const ast = new Parser(tokens).analisar();

    assert.strictEqual(ast.declaracoes[0].valor.tipo, "Nulo");
    assert.strictEqual(ast.declaracoes[0].valor.valor, null);
});

test("Reconhece incremento", () => {
    const tokens = new Lexer("contador++ É nenhuma").analisar();
    const ast = new Parser(tokens).analisar();

    assert.strictEqual(ast.declaracoes[0].tipo, "Incremento");
    assert.strictEqual(ast.declaracoes[0].nome, "contador");
});

test("Reconhece decremento", () => {
    const tokens = new Lexer("contador-- É nenhuma").analisar();
    const ast = new Parser(tokens).analisar();

    assert.strictEqual(ast.declaracoes[0].tipo, "Decremento");
    assert.strictEqual(ast.declaracoes[0].nome, "contador");
});

test("Reconhece chamada de método", () => {
    const tokens = new Lexer(
        'Ópraí!(mensagem.toUpperCase()) É nenhuma'
    ).analisar();

    const ast = new Parser(tokens).analisar();

    console.log("AST DA CHAMADA DE MÉTODO:");
    console.log(JSON.stringify(ast, null, 2));

    assert.ok(ast);
});

test("Reconhece Bitolado como estrutura de repetição", () => {
    const codigo = `
        Bitolado (contador De menor 5) {
            Ópraí!(contador) É nenhuma
        }
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const repeticao = ast.declaracoes[0];

    assert.equal(repeticao.tipo, "Enquanto");
    assert.equal(repeticao.condicao.tipo, "Comparacao");
    assert.equal(repeticao.condicao.operador, "<");
    assert.equal(repeticao.corpo.tipo, "Bloco");
});

test("Reconhece array", () => {
    const codigo = `
        Massa frutas Receba! ["Maçã", "Banana", "Uva"] É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const variavel = ast.declaracoes[0];

    assert.equal(variavel.valor.tipo, "Array");
    assert.equal(variavel.valor.elementos.length, 3);
});

test("Reconhece objeto", () => {
    const codigo = `
        Massa pessoa Receba! {
            nome: "Gabriel",
            idade: 21,
            ativo: true
        } É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const variavel = ast.declaracoes[0];

    assert.equal(variavel.valor.tipo, "Objeto");
    assert.equal(variavel.valor.propriedades.length, 3);
});

test("Reconhece JSON híbrido com estruturas aninhadas", () => {
    const codigo = `
        Massa usuario Receba! {
            nome: "Gabriel",
            idade: 21,
            ativo: true,
            endereco: {
                cidade: "Salvador",
                estado: "BA"
            },
            interesses: ["Tecnologia", "Programação"]
        } É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const usuario = ast.declaracoes[0].valor;

    assert.equal(usuario.tipo, "Objeto");
    assert.equal(usuario.propriedades.length, 5);

    const endereco = usuario.propriedades.find(
        propriedade => propriedade.chave === "endereco"
    );

    assert.equal(endereco.valor.tipo, "Objeto");

    const interesses = usuario.propriedades.find(
        propriedade => propriedade.chave === "interesses"
    );

    assert.equal(interesses.valor.tipo, "Array");
    assert.equal(interesses.valor.elementos.length, 2);
});

test("Reconhece objetos e arrays vazios", () => {
    const codigo = `
        Massa objeto Receba! {} É nenhuma
        Massa lista Receba! [] É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    assert.equal(ast.declaracoes[0].valor.tipo, "Objeto");
    assert.equal(ast.declaracoes[0].valor.propriedades.length, 0);

    assert.equal(ast.declaracoes[1].valor.tipo, "Array");
    assert.equal(ast.declaracoes[1].valor.elementos.length, 0);
});

test("Reconhece acesso a propriedade", () => {
    const codigo = `
        Ópraí!(pessoa.nome) É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const acesso = ast.declaracoes[0].valor;

    assert.equal(acesso.tipo, "AcessoPropriedade");
    assert.equal(acesso.propriedade, "nome");
});

test("Reconhece acesso a índice de array", () => {
    const codigo = `
        Ópraí!(frutas[0]) É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const acesso = ast.declaracoes[0].valor;

    assert.equal(acesso.tipo, "AcessoIndice");
    assert.equal(acesso.indice.valor, 0);
});

test("Reconhece acesso encadeado a propriedades", () => {
    const codigo = `
        Ópraí!(usuario.endereco.cidade) É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const acesso = ast.declaracoes[0].valor;

    assert.equal(acesso.tipo, "AcessoPropriedade");
    assert.equal(acesso.propriedade, "cidade");
    assert.equal(acesso.objeto.propriedade, "endereco");
});

test("Reconhece atribuição a propriedade", () => {
    const codigo = `
        pessoa.nome Receba! "João" É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const atribuicao = ast.declaracoes[0];

    assert.equal(atribuicao.tipo, "Atribuicao");
    assert.equal(atribuicao.alvo.tipo, "AcessoPropriedade");
    assert.equal(atribuicao.alvo.propriedade, "nome");
});


test("Reconhece atribuição a índice de array", () => {
    const codigo = `
        frutas[0] Receba! "Morango" É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const atribuicao = ast.declaracoes[0];

    assert.equal(atribuicao.tipo, "Atribuicao");
    assert.equal(atribuicao.alvo.tipo, "AcessoIndice");
    assert.equal(atribuicao.alvo.indice.valor, 0);
});


test("Reconhece atribuição a propriedade encadeada", () => {
    const codigo = `
        usuario.endereco.cidade Receba! "Salvador" É nenhuma
    `;

    const tokens = new Lexer(codigo).analisar();
    const ast = new Parser(tokens).analisar();

    const atribuicao = ast.declaracoes[0];
    const alvo = atribuicao.alvo;

    assert.equal(alvo.tipo, "AcessoPropriedade");
    assert.equal(alvo.propriedade, "cidade");
    assert.equal(alvo.objeto.propriedade, "endereco");
});

test("Reconhece chamada de função como instrução", () => {
    const codigo = `minhaFuncao() É nenhuma`;

    const lexer = new Lexer(codigo);
    const tokens = lexer.analisar();

    const parser = new Parser(tokens);
    const ast = parser.analisar();

    assert.equal(ast.declaracoes[0].tipo, "ChamadaInstrucao");
    assert.equal(ast.declaracoes[0].expressao.tipo, "ChamadaFuncao");
});

test("Reconhece chamada de método como instrução", () => {
    const codigo = `mensagem.toUpperCase() É nenhuma`;

    const lexer = new Lexer(codigo);
    const tokens = lexer.analisar();

    const parser = new Parser(tokens);
    const ast = parser.analisar();

    assert.equal(ast.declaracoes[0].tipo, "ChamadaInstrucao");
    assert.equal(ast.declaracoes[0].expressao.tipo, "ChamadaFuncao");
    assert.equal(
        ast.declaracoes[0].expressao.funcao.tipo,
        "AcessoPropriedade"
    );
});