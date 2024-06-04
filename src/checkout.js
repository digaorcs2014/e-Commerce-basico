import { salvarlocalstorage, apagarLocalStorage, desenharProdutoNoCarrinhoSimples, lerlocalStorage } from "/src/utilidades.js";

function desenharProdutoCheckout() {
    const idsProdutoCarrinhoComQuantidade = lerlocalStorage("carrinho")?? {};
    for (const idProduto in idsProdutoCarrinhoComQuantidade) {
        desenharProdutoNoCarrinhoSimples(
            idProduto,
            "container-produto-checkout",
            idsProdutoCarrinhoComQuantidade[idProduto]
        );
    }
}

function finalizarCompra(evento){
    evento.preventDefault();
   
    const idsProdutoCarrinhoComQuantidade = lerlocalStorage("carrinho")?? {};
    if(Object.keys(idsProdutoCarrinhoComQuantidade).length === 0){
        return;
    }
    const dataAtual = new Date();
    const pedidoFeito = {
        dataPedido: dataAtual,
        pedido: idsProdutoCarrinhoComQuantidade
    }
    const historicoPedidos = lerlocalStorage('historico') ?? [];
    const historicoPedidosAtualizado = [pedidoFeito, ...historicoPedidos];
    salvarlocalstorage('historico', historicoPedidosAtualizado)
    apagarLocalStorage('carrinho')
    window.location.href = './pedidos.html';
}

desenharProdutoCheckout();
document.addEventListener('submit', (evt) => finalizarCompra(evt));