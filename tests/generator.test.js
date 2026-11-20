
const { test } = require("node:test");
const assert = require("node:assert");

const Lexer = require("../src/lexer");
const Parser = require("../src/parser");
const Generator = require("../src/generator");

function transpilar(codigo) {
    const lexer = new Lexer(codigo);
    const tokens = lexer.analisar();

    const parser = new Parser(tokens);
    const ast = parser.analisar();

    const generator = new Generator();

    return generator.gerar(ast);
}

test("Gera declaração de variável e impressão", () => {
    const codigo = `
        Massa idade Receba! 21 É nenhuma
        Ópraí!(idade) É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        "var idade = 21;\nconsole.log(idade);"
    );
});

test("Gera operações matemáticas respeitando precedência", () => {
    const codigo = `
        Massa resultado Receba! 10 + 5 * 2 É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        "var resultado = (10 + (5 * 2));"
    );
});

test("Gera atribuição a variável", () => {
    const codigo = `
        Massa idade Receba! 20 É nenhuma
        idade Receba! 21 É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        "var idade = 20;\nidade = 21;"
    );
});

test("Gera arrays e objetos", () => {
    const codigo = `
        Massa numeros Receba! [10, 20, 30] É nenhuma
        Massa pessoa Receba! {nome: "Ana", idade: 21} É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'var numeros = [10, 20, 30];\nvar pessoa = ({ "nome": "Ana", "idade": 21 });'
    );
});


test("Gera estrutura condicional if", () => {
    const codigo = `
        Oxi (idade De hoje a oito 18) {
            Ópraí!("Maior de idade") É nenhuma
        }
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'if ((idade > 18)) {\n    console.log("Maior de idade");\n}'
    );
});

test("Gera estrutura condicional if e else", () => {
    const codigo = `
        Oxi (idade De hoje a oito 18) {
            Ópraí!("Maior de idade") É nenhuma
        } Oxente {
            Ópraí!("Menor de idade") É nenhuma
        }
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'if ((idade > 18)) {\n    console.log("Maior de idade");\n} else {\n    console.log("Menor de idade");\n}'
    );
});

test("Gera estrutura condicional if, else if e else", () => {
    const codigo = `
        Oxi (idade De hoje a oito 18) {
            Ópraí!("Maior de idade") É nenhuma
        } Se ligue (idade === 18) {
            Ópraí!("Completou 18 anos") É nenhuma
        } Oxente {
            Ópraí!("Menor de idade") É nenhuma
        }
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'if ((idade > 18)) {\n    console.log("Maior de idade");\n} else if ((idade === 18)) {\n    console.log("Completou 18 anos");\n} else {\n    console.log("Menor de idade");\n}'
    );
});

test("Gera estrutura de repetição Bitolado", () => {
    const codigo = `
        Massa contador Receba! 0 É nenhuma

        Bitolado (contador De menor 5) {
            Ópraí!(contador) É nenhuma
            contador Receba! contador + 1 É nenhuma
        }
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'var contador = 0;\nwhile ((contador < 5)) {\n    console.log(contador);\n    contador = (contador + 1);\n}'
    );
});

test("Gera declaração de função", () => {
    const codigo = `
        Chegue saudacao(nome) {
            Ópraí!(nome) É nenhuma
        }
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'function saudacao(nome) {\n    console.log(nome);\n}'
    );
});

test("Gera função com múltiplos parâmetros", () => {
    const codigo = `
        Chegue somar(a, b) {
            Massa resultado Receba! a + b É nenhuma
            Bora resultado É nenhuma
        }
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'function somar(a, b) {\n    var resultado = (a + b);\n    return resultado;\n}'
    );
});

test("Gera chamada de função", () => {
    const codigo = `
        Chegue somar(a, b) {
            Bora a + b É nenhuma
        }

        Massa total Receba! somar(10, 20) É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'function somar(a, b) {\n    return (a + b);\n}\nvar total = somar(10, 20);'
    );
});

test("Gera operações lógicas", () => {
    const codigo = `
        Massa resultado Receba! idade De hoje a oito 18 && ativo === true É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        "var resultado = ((idade > 18) && (ativo === true));"
    );
});

test("Gera valores booleanos e null", () => {
    const codigo = `
        Massa ativo Receba! true É nenhuma
        Massa bloqueado Receba! false É nenhuma
        Massa usuario Receba! null É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        "var ativo = true;\nvar bloqueado = false;\nvar usuario = null;"
    );
});

test("Gera acesso a propriedades de objetos", () => {
    const codigo = `
        Massa pessoa Receba! {nome: "Ana"} É nenhuma
        Ópraí!(pessoa.nome) É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'var pessoa = ({ "nome": "Ana" });\nconsole.log(pessoa.nome);'
    );
});

test("Gera atribuição a propriedades de objetos", () => {
    const codigo = `
        Massa pessoa Receba! {nome: "Ana"} É nenhuma
        pessoa.nome Receba! "Maria" É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'var pessoa = ({ "nome": "Ana" });\npessoa.nome = "Maria";'
    );
});

test("Gera chamadas de métodos", () => {
    const codigo = `
        Massa mensagem Receba! "ola" É nenhuma
        mensagem.toUpperCase() É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'var mensagem = "ola";\nmensagem.toUpperCase();'
    );
});

test("Gera incremento e decremento", () => {
    const codigo = `
        Massa contador Receba! 0 É nenhuma
        contador++ É nenhuma
        contador-- É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        "var contador = 0;\ncontador++;\ncontador--;"
    );
});

test("Gera erro personalizado", () => {
    const codigo = `
        Disgraça 404("Usuário não encontrado") É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'throw new Error("Usuário não encontrado");'
    );
});

test("Gera erro genérico", () => {
    const codigo = `
        Ai Fudeu É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(
        resultado,
        'throw new Error("Ai Fudeu");'
    );
});


test("Gera declaração de variável com Massa", () => {
    const codigo = `
        Massa nome Receba! "João" É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(resultado, 'var nome = "João";');
});

test("Gera declaração de constante com Lá ele", () => {
    const codigo = `
        Lá ele nome Receba! "João" É nenhuma
    `;

    const resultado = transpilar(codigo);

    assert.equal(resultado, 'const nome = "João";');
});
