## 1. Tabela oficial de lexemas

| *Lexema*        | *Significado*              | *Representação JavaScript*     |
|-----------------|----------------------------|--------------------------------|
| Massa           | Declaração de variável     | "var"                          |
| Lá ele          | Declaração de constante    | "const"                        |
| Receba!         | Atribuição                 | "="                            |
| Ópraí!          | Impressão                  | "console.log()"                |
| Oxi             | Condicional                | "if"                           |
| Se ligue        | Condicional alternativa    | "else if"                      |
| Oxente          | Alternativa final          | "else"                         |
| Chegue          | Declaração de função       | "function"                     |
| Bora            | Retorno de função          | "return"                       |
| De hoje a oito  | Maior que                  | ">"                            |
| De menor        | Menor que                  | "<"                            |
| Bitolado        | Repetição condicional      | "while"                        |
| É nenhuma       | Fim de instrução           | ";"                            |
| Disgraça 404    | Erro personalizado         | "throw new Error()"            |
| Ai Fudeu        | Erro genérico              | "throw new Error("Ai Fudeu")"  |


### 1.1 Os operadores convencionais:

| *Operador* | *Significado*     |
|------------|-------------------|
| "==="      | Igualdade estrita |
| "+"        | Adição            |
| "-"        | Subtração         |
| "*"        | Multiplicação     |
| "/"        | Divisão           |
| "%"        | Resto             |
| "&&"       | E lógico          |
| \|\|       | Ou lógico         |
| "!"        | Negação lógica    |
| "++"       | Incremento        |
| "--"       | Decremento        |

## 2. Como funciona o Lexer

- *Palavras reservadas:* reconhece os lexemas definidos em PALAVRAS_RESERVADAS.
- *Identificadores:* aceita letras Unicode, números e _, permitindo nomes com acentos.
- *Números:* reconhece inteiros e decimais.
- *Strings:* aceita aspas simples e duplas, além de sequências de escape.
- *Operadores:* reconhece operadores de um ou vários caracteres.
- *Localização:* registra linha e coluna de cada token.
- *Fim de arquivo:* adiciona o token EOF ao terminar a análise.

## 3. Estruturas de dados

- *Arrays:* [1, 2, 3]
- *Objetos:* { nome: "Produto", preco: 100 }
- *Acesso a propriedades:* produto.nome
- *Acesso por índice:* produtos[0]
- *Chamadas de funções e métodos.*
- *Atribuições a propriedades e índices.*