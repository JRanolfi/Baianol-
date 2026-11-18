
class Generator {
    gerar(ast) {
        if (ast.tipo !== "Programa") {
            throw new Error("A entrada do gerador deve ser um Programa.");
        }

        return ast.declaracoes
            .map(declaracao => this.gerarNo(declaracao))
            .join("\n");
    }

    gerarNo(no, nivel = 0) {
        switch (no.tipo) {
            // Declarações
            case "Variavel":
                return `var ${no.nome} = ${this.gerarNo(no.valor)};`;

            case "Constante":
                return `const ${no.nome} = ${this.gerarNo(no.valor)};`;

            // Atribuição
            case "Atribuicao":
                return `${this.gerarNo(no.alvo)} = ${this.gerarNo(no.valor)};`;

            // Impressão
            case "Impressao":
                return `console.log(${this.gerarNo(no.valor)});`;

            // Chamadas independentes
            case "ChamadaInstrucao":
                return `${this.gerarNo(no.expressao)};`;

            // Incremento e decremento
            case "Incremento":
                return `${no.nome}++;`;

            case "Decremento":
                return `${no.nome}--;`;

            // Operações matemáticas
            case "Operacao":
            case "Comparacao":
            case "Logica":
                return `(${this.gerarNo(no.esquerda)} ${no.operador} ${this.gerarNo(no.direita)})`;

            // Operações unárias
            case "Unario":
                return `(${no.operador}${this.gerarNo(no.valor)})`;

            // Valores primitivos
            case "Numero":
                return String(no.valor);

            case "String":
                return JSON.stringify(no.valor);

            case "Booleano":
                return String(no.valor);

            case "Nulo":
                return "null";

            case "Identificador":
                return no.nome;

            // Arrays
            case "Array":
                return `[${no.elementos
                    .map(elemento => this.gerarNo(elemento))
                    .join(", ")}]`;

            // Objetos
            case "Objeto":
                return `({ ${no.propriedades
                    .map(propriedade =>
                        `${JSON.stringify(propriedade.chave)}: ${this.gerarNo(propriedade.valor)}`
                    )
                    .join(", ")} })`;

            // Acesso a propriedades
            case "AcessoPropriedade":
                return `${this.gerarNo(no.objeto)}.${no.propriedade}`;

            // Acesso a índices
            case "AcessoIndice":
                return `${this.gerarNo(no.objeto)}[${this.gerarNo(no.indice)}]`;

            // Chamadas de funções e métodos
            case "ChamadaFuncao":
                return `${this.gerarNo(no.funcao)}(${no.argumentos
                    .map(argumento => this.gerarNo(argumento))
                    .join(", ")})`;

            case "Condicional":
                return this.gerarCondicional(no, nivel);

            case "Bloco":
                return this.gerarBloco(no, nivel);

            case "Enquanto":
                return this.gerarEnquanto(no, nivel);

            case "Funcao":
                return this.gerarFuncao(no, nivel);

            case "Retorno":
                return `return ${this.gerarNo(no.valor)};`;

            case "LancarErro":
                return `throw new Error(${this.gerarNo(no.mensagem)});`;

            default:
                throw new Error(`Tipo de nó não reconhecido pelo gerador: ${no.tipo}`);
        }
    }

    gerarFuncao(no, nivel = 0) {
        const parametros = no.parametros.join(", ");
        const corpo = this.gerarBloco(no.bloco, nivel);

        return `function ${no.nome}(${parametros}) ${corpo}`;
    }

    gerarEnquanto(no, nivel = 0) {
        const condicao = this.gerarNo(no.condicao);
        const corpo = this.gerarBloco(no.corpo, nivel);

        return `while (${condicao}) ${corpo}`;
    }

    gerarBloco(no, nivel = 0) {
        const indentacao = "    ".repeat(nivel);

        if (no.instrucoes.length === 0) {
            return "{}";
        }

        const instrucoes = no.instrucoes
            .map(instrucao => {
                const codigo = this.gerarNo(instrucao, nivel + 1);
                return `${"    ".repeat(nivel + 1)}${codigo}`;
            })
            .join("\n");

        return `{\n${instrucoes}\n${indentacao}}`;
    }

    gerarCondicional(no, nivel = 0) {
        let codigo = `if (${this.gerarNo(no.condicao)}) ${this.gerarBloco(no.bloco, nivel)}`;

        for (const alternativa of no.alternativas) {
            codigo += ` else if (${this.gerarNo(alternativa.condicao)}) ${this.gerarBloco(alternativa.bloco, nivel)}`;
        }

        if (no.senao) {
            codigo += ` else ${this.gerarBloco(no.senao, nivel)}`;
        }

        return codigo;
    }
}

module.exports = Generator;
