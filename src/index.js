const fs = require("fs");
const path = require("path");

const Lexer = require("./lexer");
const Parser = require("./parser");
const Generator = require("./generator");

function transpilarArquivo(arquivoEntrada) {
    const caminhoEntrada = path.resolve(arquivoEntrada);

    if (!fs.existsSync(caminhoEntrada)) {
        throw new Error(`Arquivo não encontrado: ${arquivoEntrada}`);
    }

    // 1. Lê o código Baianol#
    const codigo = fs.readFileSync(caminhoEntrada, "utf-8");

    // 2. Executa o Lexer
    const lexer = new Lexer(codigo);
    const tokens = lexer.analisar();

    // 3. Executa o Parser
    const parser = new Parser(tokens);
    const ast = parser.analisar();

    // 4. Executa o Generator
    const generator = new Generator();
    const codigoJavaScript = generator.gerar(ast);

    // 5. Salva o arquivo JavaScript
    const pastaSaida = path.resolve("output");

    fs.mkdirSync(pastaSaida, { recursive: true });

    const nomeArquivo = path.basename(
        caminhoEntrada,
        path.extname(caminhoEntrada)
    );

    const caminhoSaida = path.join(pastaSaida, `${nomeArquivo}.js`);

    fs.writeFileSync(caminhoSaida, codigoJavaScript, "utf-8");

    console.log(`Transpilação concluída!`);
    console.log(`Arquivo gerado: ${caminhoSaida}`);
}

try {
    const arquivoEntrada = process.argv[2];

    if (!arquivoEntrada) {
        throw new Error(
            "Informe o arquivo Baianol# que deseja transpilar."
        );
    }

    transpilarArquivo(arquivoEntrada);
} catch (erro) {
    console.error(`Erro: ${erro.message}`);
    process.exitCode = 1;
}