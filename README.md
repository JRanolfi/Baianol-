# Baianol

## 1. Introdução

### 1.1. Descrição do projeto

Baianol# é uma linguagem de programação cuja sintaxe foi inspirada em
expressões características do dialeto soteropolitano. O projeto
implementa um transpilador que converte programas escritos em Baianol#
para JavaScript, permitindo que o código gerado seja executado com
Node.js.

A linguagem utiliza palavras e expressões próprias para representar
estruturas comuns da programação, como declaração de variáveis,
constantes, atribuições, operações, condições, repetições, funções e
tratamento de erros. Também possui suporte a estruturas de dados como
arrays e objetos, seguindo uma sintaxe híbrida baseada em JSON.

### 1.2. Objetivo

O objetivo do projeto é desenvolver uma linguagem de programação com
identidade própria e implementar as etapas necessárias para converter
seu código em JavaScript. O processo envolve análise léxica, análise
sintática, construção de uma Árvore Sintática Abstrata (AST) e geração
do código de destino.

### 1.3. Equipe

- João Pedro Ranolfi Marques
-   Erick Fonseca Dantas de Assis
-   Hélder Brito
-   Jadson Mendes Barbosa

### 1.4. Divisão de tarefas

  Integrante                      Responsabilidades
  ------------------------------- -------------------
  João Pedro Ranolfi Marques      Lexer e tokens (Lider)
  Erick Fonseca Dantas de Assis   Testes
  Hélder Brito                    Parser e Index
  Jadson Mendes Barbosa           Generator, exemplos e relatorio

------------------------------------------------------------------------

## 2. Requisitos para utilização

### 2.1. Requisitos de software

- **Node.js:** necessário para executar o transpilador e os arquivos
    JavaScript gerados.
- **npm:** utilizado para instalar e gerenciar as dependências do
    projeto.
- **Git (opcional):** pode ser utilizado para clonar o repositório.
- **Editor de código:** recomendado para visualizar e editar os
    arquivos, como o Visual Studio Code.

### 2.2. Requisitos de hardware

O projeto é pequeno e executado localmente, não exigindo hardware de
alto desempenho. É necessário um computador compatível com Node.js e
espaço em disco para o ambiente e os arquivos do projeto.

### 2.3. Conhecimentos necessários

É recomendado que o usuário saiba:

-   Abrir e utilizar um terminal.
-   Executar comandos básicos do Node.js e npm.
-   Criar e editar arquivos de texto.
-   Compreender a sintaxe básica da linguagem Baianol#.

------------------------------------------------------------------------

## 3. Instalação e execução

### 3.1. Obter o projeto

O projeto pode ser baixado pelo GitHub ou obtido como arquivo
compactado. Caso seja utilizado Git, execute:

``` bash
git clone URL_DO_REPOSITORIO
```

Em seguida, entre na pasta do projeto:

``` bash
cd baianol
```

### 3.2. Instalar as dependências

Na pasta raiz do projeto, execute:

``` bash
npm install
```

### 3.3. Executar um programa Baianol

Para transpilar o exemplo da calculadora, execute:

``` bash
node src/index.js examples/calculadora.baianol
```

O transpilador lê o arquivo de entrada e grava o JavaScript
correspondente na pasta `output/`.

Depois, execute o arquivo JavaScript gerado:

``` bash
node output/calculadora.js
```

O processo é composto por duas etapas: primeiro ocorre a transpilação de
Baianol# para JavaScript; em seguida, o Node.js executa o código gerado.

### 3.4. Executar os testes

Para executar a suíte de testes automatizados:

``` bash
npm test
```

Na última execução registrada durante o desenvolvimento, foram aprovados
43 testes, sem falhas. Esse resultado deve ser atualizado caso novos
testes ou alterações sejam feitos.

------------------------------------------------------------------------

## 4. Organização do projeto

A estrutura principal do projeto está organizada da seguinte forma:

``` text
baianol/
├── src/
│   ├── lexer.js
│   ├── tokens.js
│   ├── parser.js
│   ├── generator.js
│   └── index.js
├── tests/
│   ├── lexer.test.js
│   ├── parser.test.js
│   └── generator.test.js
├── examples/
│   ├── calculadora.baianol
│   ├── sistema_notas.baianol
│   ├── cadastro_produtos.baianol
│   └── teste_integracao.baianol
└── output/
    ├── calculadora.js
    ├── sistema_notas.js
    ├── cadastro_produtos.js
    └── teste_integracao.js
```

### 4.1. Responsabilidade dos arquivos

  -----------------------------------------------------------------------
  Arquivo                             Responsabilidade
  ----------------------------------- -----------------------------------
  `tokens.js`                         Define os tipos de tokens
                                      reconhecidos pela linguagem.

  `lexer.js`                          Percorre o código-fonte e
                                      identifica palavras reservadas,
                                      identificadores, números, strings,
                                      operadores e símbolos.

  `parser.js`                         Analisa a sequência de tokens
                                      conforme as regras sintáticas e
                                      constrói a AST.

  `generator.js`                      Percorre a AST e gera o código
                                      JavaScript correspondente.

  `index.js`                          Integra as etapas do processo,
                                      recebe o arquivo de entrada e grava
                                      o resultado na pasta `output/`.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 5. Funcionamento do transpilador

O transpilador realiza as seguintes etapas:

1.  **Leitura do código-fonte:** o arquivo com extensão `.baianol` é
    recebido como entrada.
2.  **Análise léxica (Lexer):** o código é dividido em tokens, que
    representam os elementos reconhecidos da linguagem.
3.  **Análise sintática (Parser):** os tokens são verificados de acordo
    com a gramática e organizados em uma Árvore Sintática Abstrata
    (AST).
4.  **Geração de código (Generator):** a AST é percorrida e convertida
    em instruções JavaScript.
5.  **Gravação do resultado:** o código gerado é salvo em um arquivo
    `.js` dentro da pasta `output/`.
6.  **Execução:** o arquivo JavaScript pode ser executado pelo Node.js.

### 5.1. Fluxo de transpilação

``` text
Arquivo .baianol
       |
       v
      Lexer
       |
       v
     Tokens
       |
       v
     Parser
       |
       v
      AST
       |
       v
   Generator
       |
       v
Arquivo .js
       |
       v
     Node.js
```

------------------------------------------------------------------------

## 6. Definição da gramática da linguagem Baianol

### 6.1. Notação utilizada

A gramática é documentada utilizando EBNF (Extended Backus--Naur Form).
As convenções utilizadas são:

-   `::=` significa "é definido como".
-   `|` representa alternativas.
-   `{ }` representa repetição de zero ou mais ocorrências.
-   `[ ]` representa elementos opcionais.
-   Aspas representam palavras reservadas ou símbolos literais.
-   Nomes em letras maiúsculas representam categorias de tokens, como
    `IDENTIFICADOR` e `NUMERO`.

### 6.2. Observação sobre a gramática

As regras abaixo descrevem as construções documentadas para a linguagem.
Antes da entrega, a equipe deve compará-las com a versão final de
`src/parser.js`, para garantir que cada produção corresponda exatamente
ao que o Parser aceita. A gramática formal não deve declarar suporte a
construções que não estejam implementadas.

### 6.3. Estrutura geral

``` ebnf
Programa ::= { Instrucao } EOF ;
```

Um programa é composto por uma sequência de instruções, seguida pelo fim
do arquivo.

### 6.4. Declarações e atribuições

``` ebnf
DeclaracaoVariavel ::=
    "Massa" IDENTIFICADOR "Receba!" Expressao "É nenhuma" ;

DeclaracaoConstante ::=
    "Lá ele" IDENTIFICADOR "Receba!" Expressao "É nenhuma" ;

Atribuicao ::=
    Alvo "Receba!" Expressao "É nenhuma" ;

Alvo ::=
      IDENTIFICADOR
    | AcessoPropriedade
    | AcessoIndice ;
```

`Massa` declara uma variável, enquanto `Lá ele` declara uma constante.
`Receba!` representa a atribuição de um valor.

### 6.5. Impressão

``` ebnf
Impressao ::=
    "Ópraí!" "(" Expressao ")" "É nenhuma" ;
```

A instrução `Ópraí!` exibe um valor no terminal, sendo gerada como uma
chamada a `console.log()` em JavaScript.

### 6.6. Estruturas condicionais

``` ebnf
Condicional ::=
    "Oxi" "(" Expressao ")" Bloco
    { "Se ligue" "(" Expressao ")" Bloco }
    [ "Oxente" Bloco ] ;
```

-   `Oxi` inicia a condição.
-   `Se ligue` representa uma condição alternativa.
-   `Oxente` representa o bloco alternativo final.

### 6.7. Estrutura de repetição

``` ebnf
Repeticao ::=
    "Bitolado" "(" Expressao ")" Bloco ;
```

`Bitolado` representa uma repetição condicionada, equivalente ao `while`
do JavaScript.

### 6.8. Funções e retorno

``` ebnf
DeclaracaoFuncao ::=
    "Chegue" IDENTIFICADOR "(" [ ListaParametros ] ")" Bloco ;

ListaParametros ::=
    IDENTIFICADOR { "," IDENTIFICADOR } ;

Retorno ::=
    "Bora" [ Expressao ] "É nenhuma" ;
```

`Chegue` declara uma função e `Bora` representa o retorno.

### 6.9. Expressões e operadores

A gramática de expressões é organizada por níveis de precedência:

``` ebnf
Expressao ::= LogicaOu ;

LogicaOu ::= LogicaE { "||" LogicaE } ;

LogicaE ::= Igualdade { "&&" Igualdade } ;

Igualdade ::= Comparacao { "===" Comparacao } ;

Comparacao ::=
    Termo { ("De hoje a oito" | "De menor") Termo } ;

Termo ::= Fator { ("+" | "-") Fator } ;

Fator ::= Unario { ("*" | "/" | "%") Unario } ;
```

Os operadores aritméticos são `+`, `-`, `*`, `/` e `%`. Os operadores
lógicos são `&&`, `||` e `!`. Os lexemas `De hoje a oito` e `De menor`
representam, respectivamente, os operadores `>` e `<`.

### 6.10. Arrays e objetos

``` ebnf
Array ::= "[" [ ListaArgumentos ] "]" ;

Objeto ::= "{" [ ListaPropriedades ] "}" ;

ListaPropriedades ::=
    Propriedade { "," Propriedade } ;

Propriedade ::=
    IDENTIFICADOR ":" Expressao ;
```

Arrays armazenam sequências de valores. Objetos armazenam propriedades
associadas a valores. Essas estruturas utilizam uma sintaxe híbrida
inspirada em JSON.

### 6.11. Lançamento de erros

``` ebnf
LancamentoErro ::=
      "Disgraça 404" "(" Expressao ")" "É nenhuma"
    | "Ai Fudeu" "É nenhuma" ;
```

`Disgraça 404` permite lançar um erro com mensagem definida por uma
expressão. `Ai Fudeu` representa o lançamento de um erro genérico.

------------------------------------------------------------------------

## 7. Tabela de lexemas

### 7.1. Palavras reservadas

  -------------------------------------------------------------------------------
  Lexema                  Significado             Representação JavaScript
  ----------------------- ----------------------- -------------------------------
  `Massa`                 Declaração de variável  `var`

  `Lá ele`                Declaração de constante `const`

  `Receba!`               Atribuição              `=`

  `Ópraí!`                Impressão               `console.log()`

  `Oxi`                   Condicional             `if`

  `Se ligue`              Condição alternativa    `else if`

  `Oxente`                Alternativa final       `else`

  `Chegue`                Declaração de função    `function`

  `Bora`                  Retorno de função       `return`

  `De hoje a oito`        Maior que               `>`

  `De menor`              Menor que               `<`

  `Bitolado`              Repetição condicionada  `while`

  `É nenhuma`             Fim de instrução        `;`

  `Disgraça 404`          Lançamento de erro      `throw new Error()`
                          personalizado           

  `Ai Fudeu`              Lançamento de erro      `throw new Error("Ai Fudeu")`
                          genérico                
  -------------------------------------------------------------------------------

### 7.2. Operadores e símbolos convencionais

  Operador   Significado
  ---------- -------------------
  `===`      Igualdade estrita
  `+`        Adição
  `-`        Subtração
  `*`        Multiplicação
  `/`        Divisão
  `%`        Resto
  `&&`       E lógico
  `||`       Ou lógico
  `!`        Negação lógica
  `++`       Incremento
  `--`       Decremento

### 7.3. Literais reconhecidos

Além das palavras reservadas, o Lexer reconhece:

-   Identificadores com letras Unicode, números e `_` (o primeiro
    caractere não pode ser número).
-   Números inteiros e decimais.
-   Strings delimitadas por aspas simples ou duplas.
-   Os literais convencionais `true`, `false` e `null`.

### 7.4. Características do Lexer

O Lexer:

-   Reconhece as palavras reservadas da linguagem.
-   Identifica identificadores, números e strings.
-   Reconhece operadores de um ou mais caracteres.
-   Ignora espaços em branco.
-   Registra a linha e a coluna dos tokens.
-   Adiciona o token `EOF` ao final da análise.

------------------------------------------------------------------------

## 8. Estruturas e recursos da linguagem

A implementação contempla recursos como:

-   Declaração de variáveis e constantes.
-   Atribuições.
-   Operações aritméticas, relacionais e lógicas.
-   Estruturas condicionais.
-   Repetição condicionada.
-   Declaração e chamada de funções.
-   Retorno de valores.
-   Arrays e objetos.
-   Acesso a propriedades e índices.
-   Chamadas de métodos.
-   Incremento e decremento.
-   Lançamento de erros.

A disponibilidade e a sintaxe exata de cada recurso devem corresponder
aos testes e à implementação final do Parser e do Generator.

------------------------------------------------------------------------

## 9. Programas demonstrativos

O projeto possui três programas demonstrativos principais. Cada arquivo
de entrada `.baianol` é transpilado para um arquivo `.js`
correspondente.

### 9.1. Calculadora

**Arquivo de entrada:** `examples/calculadora.baianol`

``` javascript
Lá ele numero1 Receba! 20 É nenhuma
Lá ele numero2 Receba! 5 É nenhuma

Massa soma Receba! numero1 + numero2 É nenhuma
Massa subtracao Receba! numero1 - numero2 É nenhuma
Massa multiplicacao Receba! numero1 * numero2 É nenhuma
Massa divisao Receba! numero1 / numero2 É nenhuma

Ópraí!("Soma:") É nenhuma
Ópraí!(soma) É nenhuma

Ópraí!("Subtração:") É nenhuma
Ópraí!(subtracao) É nenhuma

Ópraí!("Multiplicação:") É nenhuma
Ópraí!(multiplicacao) É nenhuma

Ópraí!("Divisão:") É nenhuma
Ópraí!(divisao) É nenhuma
```

**Saída esperada:**

``` text
Soma:
25
Subtração:
15
Multiplicação:
100
Divisão:
4
```

### 9.2. Sistema de notas

**Arquivo de entrada:** `examples/sistema_notas.baianol`

``` javascript
Lá ele nota Receba! 8 É nenhuma

Chegue verificarSituacao(valor) {
    Oxi (valor De hoje a oito 7) {
        Bora "Aprovado" É nenhuma
    } Se ligue (valor De hoje a oito 5) {
        Bora "Recuperação" É nenhuma
    } Oxente {
        Bora "Reprovado" É nenhuma
    }
}

Massa situacao Receba! verificarSituacao(nota) É nenhuma

Ópraí!("Nota do aluno:") É nenhuma
Ópraí!(nota) É nenhuma

Ópraí!("Situação:") É nenhuma
Ópraí!(situacao) É nenhuma
```

**Descrição:** demonstra declaração de constante e variável, função,
retorno e estrutura condicional com alternativas.

### 9.3. Cadastro de produtos

**Arquivo de entrada:** `examples/cadastro_produtos.baianol`

``` javascript
Massa produtos Receba! [
    {
        nome: "Notebook",
        preco: 3500,
        estoque: 5
    },
    {
        nome: "Mouse",
        preco: 80,
        estoque: 15
    },
    {
        nome: "Teclado",
        preco: 150,
        estoque: 8
    }
] É nenhuma

Massa indice Receba! 0 É nenhuma

Bitolado (indice De menor 3) {
    Ópraí!("Produto:") É nenhuma
    Ópraí!(produtos[indice].nome) É nenhuma

    Ópraí!("Preço:") É nenhuma
    Ópraí!(produtos[indice].preco) É nenhuma

    Ópraí!("Estoque:") É nenhuma
    Ópraí!(produtos[indice].estoque) É nenhuma

    indice Receba! indice + 1 É nenhuma
}
```

**Saída esperada:**

``` text
Produto:
Notebook
Preço:
3500
Estoque:
5
Produto:
Mouse
Preço:
80
Estoque:
15
Produto:
Teclado
Preço:
150
Estoque:
8
```

------------------------------------------------------------------------

## 10. Testes

O projeto possui testes automatizados separados por etapa:

-   `tests/lexer.test.js`: verifica o reconhecimento dos tokens.
-   `tests/parser.test.js`: verifica a análise sintática e a construção
    da AST.
-   `tests/generator.test.js`: verifica a geração do JavaScript.

Para executar todos os testes:

``` bash
npm test
```

Na última execução registrada durante o desenvolvimento, o resultado foi
de 43 testes aprovados e nenhum teste com falha. Execute novamente o
comando antes da entrega para confirmar o estado final do projeto.

------------------------------------------------------------------------

## 11. Conclusão

O projeto Baianol# demonstra a implementação de um transpilador para uma
linguagem de programação com sintaxe inspirada no dialeto
soteropolitano. Através das etapas de análise léxica, análise sintática
e geração de código, programas escritos na linguagem são convertidos
para JavaScript e podem ser executados com Node.js.

A implementação reúne estruturas fundamentais de programação, como
variáveis, constantes, expressões, condições, repetições, funções e
estruturas de dados, além de testes automatizados para verificar o
funcionamento dos componentes.

------------------------------------------------------------------------