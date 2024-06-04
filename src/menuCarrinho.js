import { catalogo, salvarlocalstorage, lerlocalStorage } from "./utilidades";

const idsProdutoCarrinhoComQuantidade = lerlocalStorage('carrinho') ?? {};

export function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("right-[0px]");
  document.getElementById("carrinho").classList.remove("right-[-360px]");
}

function fecharaCarrinho() {
  document.getElementById("carrinho").classList.remove("right-[0px]");
  document.getElementById("carrinho").classList.add("right-[-360px]");
}

function irParaCheckout(){
    if(Object.keys(idsProdutoCarrinhoComQuantidade).length === 0){
      return;
    }
    window.location.href =  './checkout.html';
}

export function inicializarCarrinho() {
  const botaoFecharCarrinho = document.getElementById("fechar-carrinho");
  const botaoAbrirCarrinho = document.getElementById("abrir-carrinho");
  const botaoIrParaCheckout = document.getElementById('finalizar-compra');
  botaoFecharCarrinho.addEventListener('click', fecharaCarrinho);
  botaoAbrirCarrinho.addEventListener('click', abrirCarrinho);
  botaoIrParaCheckout.addEventListener('click',irParaCheckout);

}



function removerDoCarrinho(idProduto) {
  delete idsProdutoCarrinhoComQuantidade[idProduto];
  salvarlocalstorage('carrinho', idsProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  renderizarProdutosCarrinho();
}

function incrementarQuantidadeProdruto(idProduto) {
  idsProdutoCarrinhoComQuantidade[idProduto]++;
  salvarlocalstorage('carrinho', idsProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  atualizarInformacaoQuantidade(idProduto);
}

function decrementarQuantidadeProdruto(idProduto) {
  if (idsProdutoCarrinhoComQuantidade[idProduto] === 1) {
    removerDoCarrinho(idProduto);
    return;
  }
  idsProdutoCarrinhoComQuantidade[idProduto]--;
  salvarlocalstorage('carrinho', idsProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  atualizarInformacaoQuantidade(idProduto);

}

function atualizarInformacaoQuantidade(idProduto) {
  document.getElementById(`quantidade-${idProduto}`)
    .innerText = idsProdutoCarrinhoComQuantidade[idProduto];
}

function desenharProdutoNoCarrinho(idProduto) {
  const produto = catalogo.find((p) => p.id === idProduto);

  const containerProdutoCarrinho = document.getElementById("produtos-carrinho");

  const elementoArticle = document.createElement('article');

  const articleClasses = ["flex", "bg-slate-100", "rounded-lg", "p-1", "relative"];

  for (const articleClass of articleClasses) {
    elementoArticle.classList.add(articleClass);
  }
  const cartaoProdutoCarrinho = //`<article class="flex bg-slate-100 rounded-lg p-1 relative"></article>`
    `<button id ="remover-item-${produto.id}" class="absolute top-0 right-2">
      <i
       class="fa-solid fa-circle-xmark text-slate-500 hover:text-slate-800">
      </i>
    </button>
      <img src="./assets/img/${produto.imagem}" 
        alt="Carrinho: ${produto.nome}" 
        class="h-24 rounded-lg"
        />
    <div class="p-2 flex flex-col justify-between">
      <p class="text-slate-900 text-sm">
        ${produto.nome}
      </p>
      <p class="text-slate-900 text-xs">TAMANHO :M</p>
      <p class="text-green-700 text-lg">$${produto.preco}</p>
    </div>  
    <div class="flex text-slate-950 items-end absolute bottom-0 right-2 text-lg">
      <button id="decrementar-produto-${produto.id}">-<button/>
      <p id='quantidade-${produto.id}'class='ml-2'>${idsProdutoCarrinhoComQuantidade[produto.id]
    }</p>
      <button class="ml-2" id="incrementar-produto-${produto.id}">+<button/>
    </div>` ;

  elementoArticle.innerHTML = cartaoProdutoCarrinho;
  containerProdutoCarrinho.appendChild(elementoArticle);

  document.getElementById(`decrementar-produto-${produto.id}`)
    .addEventListener('click', () => decrementarQuantidadeProdruto(produto.id));


  document.getElementById(`incrementar-produto-${produto.id}`)
    .addEventListener('click', () => incrementarQuantidadeProdruto(produto.id));


  document.getElementById(`remover-item-${produto.id}`)
    .addEventListener('click', () => removerDoCarrinho(produto.id));

}

export function renderizarProdutosCarrinho() {
  const containerProdutoCarrinho =
    document.getElementById("produtos-carrinho");
  containerProdutoCarrinho.innerHTML = "";


 
  for (const idProduto in idsProdutoCarrinhoComQuantidade) {
   
    desenharProdutoNoCarrinho(idProduto)
  }
  idsProdutoCarrinhoComQuantidade
}

export function adicionarCarrinho(idProduto) {
  if (idProduto in idsProdutoCarrinhoComQuantidade) {
    incrementarQuantidadeProdruto(idProduto);
    return;
  }
  idsProdutoCarrinhoComQuantidade[idProduto] = 1;
  salvarlocalstorage('carrinho', idsProdutoCarrinhoComQuantidade);
  desenharProdutoNoCarrinho(idProduto);
  atualizarPrecoCarrinho();
}

export function atualizarPrecoCarrinho() {
  const precoCarrinho = document.getElementById("preco-total");
  let precototalCarrinho = 0;
  for (const idprodutoCarrinho in idsProdutoCarrinhoComQuantidade) {
    precototalCarrinho += catalogo.find((p) => p.id === idprodutoCarrinho).preco
      * idsProdutoCarrinhoComQuantidade[idprodutoCarrinho];
  }
  precoCarrinho.innerText = `total: $${precototalCarrinho}`;
}


