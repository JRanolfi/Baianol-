
const TOKENS = require("./tokens");

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.posicao = 0;
    }

    atual() {
        return this.tokens[this.posicao];
    }

    anterior() {
        return this.tokens[this.posicao - 1];
    }

    verificar(tipo) {
        return this.atual()?.tipo === tipo;
    }

    avancar() {
        if (!this.verificar(TOKENS.EOF)) {
            this.posicao++;
        }

        return this.anterior();
    }

    aceitar(tipo) {
        if (this.verificar(tipo)) {
            return this.avancar();
        }

        return null;
    }

    exigir(tipo, mensagem) {
        if (this.verificar(tipo)) {
            return this.avancar();
        }

        throw this.erro(mensagem);
    }

    erro(mensagem) {
        const token = this.atual();

        return new Error(
            `Erro sintático na linha ${token?.linha ?? "?"}: ${mensagem}`
        );
    }

    valorToken(token) {
        return token.valor ?? token.lexema ?? token.value;
    }

    analisar() {
        const declaracoes = [];

        while (!this.verificar(TOKENS.EOF)) {
            declaracoes.push(this.instrucao());
        }

        return {
            tipo: "Programa",
            declaracoes
        };
    }

    instrucao() {
        if (this.aceitar(TOKENS.MASSA)) {
            return this.declaracaoVariavel("Variavel");
        }

        if (this.aceitar(TOKENS.LA_ELE)) {
            return this.declaracaoVariavel("Constante");
        }

        if (this.aceitar(TOKENS.OPRAI)) {
            return this.impressao();
        }

        if (this.aceitar(TOKENS.OXI)) {
            return this.condicional();
        }

        if (this.aceitar(TOKENS.CHEGUE)) {
            return this.funcao();
        }

        if (this.aceitar(TOKENS.BORA)) {
            return this.retorno();
        }

        if (this.aceitar(TOKENS.DISGRACA_404)) {
            return this.erroPersonalizado();
        }

        if (this.aceitar(TOKENS.AI_FUDEU)) {
            this.exigir(
                TOKENS.FIM_INSTRUCAO,
                "Esperado 'É nenhuma' depois de 'Ai Fudeu'."
            );

            return {
                tipo: "LancarErro",
                mensagem: "Ai Fudeu"
            };
        }

        if (this.aceitar(TOKENS.A_TOA)) {
            return this.pausa();
        }

        if (this.verificar(TOKENS.IDENTIFICADOR)) {
            return this.atribuicao();
        }

        throw this.erro("Instrução não reconhecida.");
    }

    declaracaoVariavel(tipo) {
        const nome = this.exigir(
            TOKENS.IDENTIFICADOR,
            "Esperado o nome da variável."
        );

        this.exigir(
            TOKENS.RECEBA,
            "Esperado 'Receba!' depois do nome."
        );

        const valor = this.expressao();

        this.exigir(
            TOKENS.FIM_INSTRUCAO,
            "Esperado 'É nenhuma' no final da declaração."
        );

        return {
            tipo: tipo,
            nome: this.valorToken(nome),
            valor
        };
    }

    atribuicao() {
        const nome = this.exigir(
            TOKENS.IDENTIFICADOR,
            "Esperado um identificador."
        );

        this.exigir(
            TOKENS.RECEBA,
            "Esperado 'Receba!' na atribuição."
        );

        const valor = this.expressao();

        this.exigir(
            TOKENS.FIM_INSTRUCAO,
            "Esperado 'É nenhuma' no final da atribuição."
        );

        return {
            tipo: "Atribuicao",
            nome: this.valorToken(nome),
            valor
        };
    }

    impressao() {
        this.exigir(
            TOKENS.PARENTESE_ABRE,
            "Esperado '(' depois de 'Ópraí!'."
        );

        const valor = this.expressao();

        this.exigir(
            TOKENS.PARENTESE_FECHA,
            "Esperado ')' depois da expressão."
        );

        this.exigir(
            TOKENS.FIM_INSTRUCAO,
            "Esperado 'É nenhuma' depois da impressão."
        );

        return {
            tipo: "Impressao",
            valor
        };
    }

    condicional() {
        this.exigir(
            TOKENS.PARENTESE_ABRE,
            "Esperado '(' depois de 'Oxi'."
        );

        const condicao = this.expressao();

        this.exigir(
            TOKENS.PARENTESE_FECHA,
            "Esperado ')' depois da condição."
        );

        const bloco = this.bloco();

        const alternativas = [];

        while (this.aceitar(TOKENS.SE_LIGUE)) {
            this.exigir(
                TOKENS.PARENTESE_ABRE,
                "Esperado '(' depois de 'Se ligue'."
            );

            const condicaoAlternativa = this.expressao();

            this.exigir(
                TOKENS.PARENTESE_FECHA,
                "Esperado ')' depois da condição."
            );

            alternativas.push({
                condicao: condicaoAlternativa,
                bloco: this.bloco()
            });
        }

        let senao = null;

        if (this.aceitar(TOKENS.OXENTE)) {
            senao = this.bloco();
        }

        return {
            tipo: "Condicional",
            condicao,
            bloco,
            alternativas,
            senao
        };
    }

    bloco() {
        this.exigir(
            TOKENS.CHAVE_ABRE,
            "Esperado '{' para iniciar o bloco."
        );

        const instrucoes = [];

        while (
            !this.verificar(TOKENS.CHAVE_FECHA) &&
            !this.verificar(TOKENS.EOF)
        ) {
            instrucoes.push(this.instrucao());
        }

        this.exigir(
            TOKENS.CHAVE_FECHA,
            "Esperado '}' para encerrar o bloco."
        );

        return {
            tipo: "Bloco",
            instrucoes
        };
    }

    funcao() {
        const nome = this.exigir(
            TOKENS.IDENTIFICADOR,
            "Esperado o nome da função."
        );

        this.exigir(
            TOKENS.PARENTESE_ABRE,
            "Esperado '(' depois do nome da função."
        );

        const parametros = [];

        if (!this.verificar(TOKENS.PARENTESE_FECHA)) {
            do {
                const parametro = this.exigir(
                    TOKENS.IDENTIFICADOR,
                    "Esperado o nome de um parâmetro."
                );

                parametros.push(this.valorToken(parametro));
            } while (this.aceitar(TOKENS.VIRGULA));
        }

        this.exigir(
            TOKENS.PARENTESE_FECHA,
            "Esperado ')' depois dos parâmetros."
        );

        return {
            tipo: "Funcao",
            nome: this.valorToken(nome),
            parametros,
            bloco: this.bloco()
        };
    }

    retorno() {
        const valor = this.expressao();

        this.exigir(
            TOKENS.FIM_INSTRUCAO,
            "Esperado 'É nenhuma' depois do retorno."
        );

        return {
            tipo: "Retorno",
            valor
        };
    }

    erroPersonalizado() {
        this.exigir(
            TOKENS.PARENTESE_ABRE,
            "Esperado '(' depois de 'Disgraça 404'."
        );

        const mensagem = this.expressao();

        this.exigir(
            TOKENS.PARENTESE_FECHA,
            "Esperado ')' depois da mensagem de erro."
        );

        this.exigir(
            TOKENS.FIM_INSTRUCAO,
            "Esperado 'É nenhuma' depois do erro."
        );

        return {
            tipo: "LancarErro",
            mensagem
        };
    }

    pausa() {
        this.exigir(
            TOKENS.PARENTESE_ABRE,
            "Esperado '(' depois de 'À toa'."
        );

        const duracao = this.expressao();

        this.exigir(
            TOKENS.PARENTESE_FECHA,
            "Esperado ')' depois da duração."
        );

        this.exigir(
            TOKENS.FIM_INSTRUCAO,
            "Esperado 'É nenhuma' depois da pausa."
        );

        return {
            tipo: "Pausa",
            duracao
        };
    }

    expressao() {
        return this.logicaOu();
    }

    logicaOu() {
        let esquerda = this.logicaE();

        while (this.aceitar(TOKENS.OR)) {
            const direita = this.logicaE();

            esquerda = {
                tipo: "Logica",
                operador: "||",
                esquerda,
                direita
            };
        }

        return esquerda;
    }

    logicaE() {
        let esquerda = this.igualdade();

        while (this.aceitar(TOKENS.AND)) {
            const direita = this.igualdade();

            esquerda = {
                tipo: "Logica",
                operador: "&&",
                esquerda,
                direita
            };
        }

        return esquerda;
    }

    igualdade() {
        let esquerda = this.comparacao();

        while (this.aceitar(TOKENS.IGUAL)) {
            const direita = this.comparacao();

            esquerda = {
                tipo: "Comparacao",
                operador: "===",
                esquerda,
                direita
            };
        }

        return esquerda;
    }

    comparacao() {
        let esquerda = this.termo();

        while (
            this.verificar(TOKENS.MAIOR_QUE) ||
            this.verificar(TOKENS.MENOR_QUE)
        ) {
            const operador = this.avancar();
            const direita = this.termo();

            esquerda = {
                tipo: "Comparacao",
                operador:
                    operador.tipo === TOKENS.MAIOR_QUE ? ">" : "<",
                esquerda,
                direita
            };
        }

        return esquerda;
    }

    termo() {
        let esquerda = this.fator();

        while (
            this.verificar(TOKENS.MAIS) ||
            this.verificar(TOKENS.MENOS)
        ) {
            const operador = this.avancar();
            const direita = this.fator();

            esquerda = {
                tipo: "Operacao",
                operador:
                    operador.tipo === TOKENS.MAIS ? "+" : "-",
                esquerda,
                direita
            };
        }

        return esquerda;
    }

    fator() {
        let esquerda = this.unario();

        while (
            this.verificar(TOKENS.MULTIPLICACAO) ||
            this.verificar(TOKENS.DIVISAO) ||
            this.verificar(TOKENS.RESTO)
        ) {
            const operador = this.avancar();
            const direita = this.unario();

            let simbolo = "*";

            if (operador.tipo === TOKENS.DIVISAO) {
                simbolo = "/";
            } else if (operador.tipo === TOKENS.RESTO) {
                simbolo = "%";
            }

            esquerda = {
                tipo: "Operacao",
                operador: simbolo,
                esquerda,
                direita
            };
        }

        return esquerda;
    }

    unario() {
        if (this.aceitar(TOKENS.NOT)) {
            return {
                tipo: "Unario",
                operador: "!",
                valor: this.unario()
            };
        }

        if (this.aceitar(TOKENS.MENOS)) {
            return {
                tipo: "Unario",
                operador: "-",
                valor: this.unario()
            };
        }

        return this.chamada();
    }

    chamada() {
        let expressao = this.primario();

        while (this.aceitar(TOKENS.PARENTESE_ABRE)) {
            const argumentos = [];

            if (!this.verificar(TOKENS.PARENTESE_FECHA)) {
                do {
                    argumentos.push(this.expressao());
                } while (this.aceitar(TOKENS.VIRGULA));
            }

            this.exigir(
                TOKENS.PARENTESE_FECHA,
                "Esperado ')' depois dos argumentos."
            );

            expressao = {
                tipo: "ChamadaFuncao",
                funcao: expressao,
                argumentos
            };
        }

        return expressao;
    }

    primario() {
        if (this.verificar(TOKENS.NUMERO)) {
            const token = this.avancar();

            return {
                tipo: "Numero",
                valor: Number(this.valorToken(token))
            };
        }

        if (this.verificar(TOKENS.STRING)) {
            const token = this.avancar();

            return {
                tipo: "String",
                valor: this.valorToken(token)
            };
        }

        if (this.verificar(TOKENS.IDENTIFICADOR)) {
            const token = this.avancar();

            return {
                tipo: "Identificador",
                nome: this.valorToken(token)
            };
        }

        if (this.aceitar(TOKENS.PARENTESE_ABRE)) {
            const expressao = this.expressao();

            this.exigir(
                TOKENS.PARENTESE_FECHA,
                "Esperado ')' depois da expressão."
            );

            return expressao;
        }

        throw this.erro("Expressão inválida.");
    }
}

module.exports = Parser;
