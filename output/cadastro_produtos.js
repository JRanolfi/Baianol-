var produtos = [({ "nome": "Notebook", "preco": 3500, "estoque": 5 }), ({ "nome": "Mouse", "preco": 80, "estoque": 15 }), ({ "nome": "Teclado", "preco": 150, "estoque": 8 })];
var indice = 0;
while ((indice < 3)) {
    console.log("Produto:");
    console.log(produtos[indice].nome);
    console.log("Preço:");
    console.log(produtos[indice].preco);
    console.log("Estoque:");
    console.log(produtos[indice].estoque);
    indice = (indice + 1);
}