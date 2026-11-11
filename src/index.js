
const fs = require("fs");
const path = require("path");

const Lexer = require("./lexer");
const Parser = require("./parser");

const arquivo = process.argv[2];

if (!arquivo) {
    console.log("Uso: node src/index.js <arquivo.baianol>");
    process.exit(1);
}

const caminho = path.resolve(arquivo);

if (!fs.existsSync(caminho)) {
    console.error("Arquivo não encontrado:", caminho);
    process.exit(1);
}

try {
    const codigo = fs.readFileSync(caminho, "utf-8");

    // Primeira etapa: análise léxica
    const lexer = new Lexer(codigo);
    const tokens = lexer.analisar();

    console.log("\n=== ANÁLISE LÉXICA ===\n");
    console.table(tokens);

    // Segunda etapa: análise sintática
    const parser = new Parser(tokens);
    const ast = parser.analisar();

    console.log("\n=== ÁRVORE SINTÁTICA (AST) ===\n");
    console.dir(ast, { depth: null, colors: true });

    console.log("\nAnálise léxica e sintática concluídas!");

} catch (erro) {
    console.error("\nErro durante a análise:");
    console.error(erro.message);
    process.exit(1);
}
