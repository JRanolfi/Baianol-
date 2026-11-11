
const TOKENS = require("./tokens");

const PALAVRAS_RESERVADAS = [
    ["Disgraça 404", TOKENS.DISGRACA_404],
    ["De hoje a oito", TOKENS.MAIOR_QUE],
    ["É nenhuma", TOKENS.FIM_INSTRUCAO],
    ["Lá ele", TOKENS.LA_ELE],
    ["Se ligue", TOKENS.SE_LIGUE],
    ["Ai Fudeu", TOKENS.AI_FUDEU],
    ["De menor", TOKENS.MENOR_QUE],
    ["Massa", TOKENS.MASSA],
    ["Receba!", TOKENS.RECEBA],
    ["Ópraí!", TOKENS.OPRAI],
    ["À toa", TOKENS.A_TOA],
    ["Oxente", TOKENS.OXENTE],
    ["Chegue", TOKENS.CHEGUE],
    ["Bora", TOKENS.BORA],
    ["Oxi", TOKENS.OXI]
];

class Lexer {
    constructor(codigo) {
        this.codigo = codigo;
        this.posicao = 0;
        this.linha = 1;
        this.coluna = 1;
        this.tokens = [];
    }

    atual() {
        return this.codigo[this.posicao];
    }

    avancar() {
        const caractere = this.atual();

        this.posicao++;

        if (caractere === "\n") {
            this.linha++;
            this.coluna = 1;
        } else {
            this.coluna++;
        }

        return caractere;
    }

    adicionarToken(tipo, valor, linha, coluna) {
        this.tokens.push({
            tipo,
            valor,
            linha,
            coluna
        });
    }

    ignorarEspacos() {
        while (
            this.atual() !== undefined &&
            /\s/u.test(this.atual())
        ) {
            this.avancar();
        }
    }

    reconhecerPalavraReservada() {
        for (const [palavra, tipo] of PALAVRAS_RESERVADAS) {
            const trecho = this.codigo.slice(
                this.posicao,
                this.posicao + palavra.length
            );

            if (trecho !== palavra) {
                continue;
            }

            const proximo = this.codigo[
                this.posicao + palavra.length
            ];

            // Evita reconhecer palavras dentro de identificadores.
            if (
                proximo !== undefined &&
                /[\p{L}\p{N}_]/u.test(proximo)
            ) {
                continue;
            }

            const linha = this.linha;
            const coluna = this.coluna;

            for (let i = 0; i < palavra.length; i++) {
                this.avancar();
            }

            this.adicionarToken(tipo, palavra, linha, coluna);
            return true;
        }

        return false;
    }

    reconhecerIdentificador() {
        const inicio = this.posicao;
        const linha = this.linha;
        const coluna = this.coluna;

        while (
            this.atual() !== undefined &&
            /[\p{L}\p{N}_]/u.test(this.atual())
        ) {
            this.avancar();
        }

        const valor = this.codigo.slice(inicio, this.posicao);

        this.adicionarToken(
            TOKENS.IDENTIFICADOR,
            valor,
            linha,
            coluna
        );
    }

    reconhecerNumero() {
        const inicio = this.posicao;
        const linha = this.linha;
        const coluna = this.coluna;

        while (
            this.atual() !== undefined &&
            /[0-9]/.test(this.atual())
        ) {
            this.avancar();
        }

        if (
            this.atual() === "." &&
            /[0-9]/.test(this.codigo[this.posicao + 1])
        ) {
            this.avancar();

            while (
                this.atual() !== undefined &&
                /[0-9]/.test(this.atual())
            ) {
                this.avancar();
            }
        }

        const valor = this.codigo.slice(inicio, this.posicao);

        this.adicionarToken(
            TOKENS.NUMERO,
            Number(valor),
            linha,
            coluna
        );
    }

    reconhecerString() {
        const aspas = this.atual();
        const linha = this.linha;
        const coluna = this.coluna;

        this.avancar();

        let valor = "";

        while (
            this.atual() !== undefined &&
            this.atual() !== aspas
        ) {
            if (this.atual() === "\\") {
                this.avancar();

                if (this.atual() === undefined) {
                    throw new Error(
                        `Escape incompleto na linha ${this.linha}`
                    );
                }

                const escapes = {
                    n: "\n",
                    t: "\t",
                    r: "\r",
                    "\\": "\\",
                    '"': '"',
                    "'": "'"
                };

                const caractere = this.avancar();

                valor += escapes[caractere] ?? caractere;
            } else {
                valor += this.avancar();
            }
        }

        if (this.atual() !== aspas) {
            throw new Error(
                `String não fechada na linha ${linha}, coluna ${coluna}`
            );
        }

        this.avancar();

        this.adicionarToken(
            TOKENS.STRING,
            valor,
            linha,
            coluna
        );
    }

    reconhecerSimbolo() {
        const linha = this.linha;
        const coluna = this.coluna;

        const simbolos = {
            "===": TOKENS.IGUAL,
            "&&": TOKENS.AND,
            "||": TOKENS.OR,
            "+": TOKENS.MAIS,
            "-": TOKENS.MENOS,
            "*": TOKENS.MULTIPLICACAO,
            "/": TOKENS.DIVISAO,
            "%": TOKENS.RESTO,
            "!": TOKENS.NOT,
            "(": TOKENS.PARENTESE_ABRE,
            ")": TOKENS.PARENTESE_FECHA,
            "{": TOKENS.CHAVE_ABRE,
            "}": TOKENS.CHAVE_FECHA,
            "[": TOKENS.COLCHETE_ABRE,
            "]": TOKENS.COLCHETE_FECHA,
            ",": TOKENS.VIRGULA,
            ":": TOKENS.DOIS_PONTOS
        };

        // Reconhece operadores de vários caracteres primeiro.
        for (const simbolo of ["===", "&&", "||"]) {
            if (this.codigo.startsWith(simbolo, this.posicao)) {
                for (let i = 0; i < simbolo.length; i++) {
                    this.avancar();
                }

                this.adicionarToken(
                    simbolos[simbolo],
                    simbolo,
                    linha,
                    coluna
                );

                return true;
            }
        }

        const caractere = this.atual();
        const tipo = simbolos[caractere];

        if (!tipo) {
            return false;
        }

        this.avancar();

        this.adicionarToken(tipo, caractere, linha, coluna);

        return true;
    }

    analisar() {
        while (this.atual() !== undefined) {
            this.ignorarEspacos();

            if (this.atual() === undefined) {
                break;
            }

            if (this.reconhecerPalavraReservada()) {
                continue;
            }

            if (/[\p{L}_]/u.test(this.atual())) {
                this.reconhecerIdentificador();
                continue;
            }

            if (/[0-9]/.test(this.atual())) {
                this.reconhecerNumero();
                continue;
            }

            if (this.atual() === '"' || this.atual() === "'") {
                this.reconhecerString();
                continue;
            }

            if (this.reconhecerSimbolo()) {
                continue;
            }

            throw new Error(
                `Caractere inesperado "${this.atual()}" ` +
                `na linha ${this.linha}, coluna ${this.coluna}`
            );
        }

        this.adicionarToken(
            TOKENS.EOF,
            null,
            this.linha,
            this.coluna
        );

        return this.tokens;
    }
}

module.exports = Lexer;
