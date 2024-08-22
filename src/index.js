import { precoService, veiculoService, utils } from "./services/index.js";

function esconderOverlay() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.add("escondido");
  const precoContainer = overlay.querySelector(".overlay-preco-container");
  precoContainer.classList.add("escondido");
  const veiculoContainer = overlay.querySelector(".overlay-veiculo-container");
  veiculoContainer.classList.add("escondido");
  const pagarTabela = document.querySelector(".pagar-tabela");
  pagarTabela.classList.add("escondido");
  fecharFormPreco();
}

function definirAtualizacaoHorario() {
  const mostrador = document.querySelector("#relogio");

  if (mostrador) {
    mostrador.textContent = utils.textoRelogio();

    setInterval(() => mostrador.textContent = utils.textoRelogio(), 1000);
  }
}

function adicionarEventListeners() {
  document.querySelector(".overlay").addEventListener("click", esconderOverlay);
  document.querySelectorAll(".overlay div").forEach(e => e.addEventListener("click", e => e.stopPropagation()));
  document.querySelector("#form-veiculo #cancelar").addEventListener("click", esconderOverlay);

  precoService.adicionarEventListeners();
  veiculoService.adicionarEventListeners();

  document.querySelector("#form-veiculo label").addEventListener("click", testPlaca);
}

function iniciar() {
  definirAtualizacaoHorario();
  receberCarros();
  receberPrecoAtual();
  receberPrecoTodos();
  adicionarEventListeners();
}

iniciar();


function receberCarros() {
  veiculoService.receberCarros();
}



function receberPrecoAtual() {
  precoService.receberPrecoAtual();
}

function receberPrecoTodos() {
  precoService.receberPrecoTodos();
}

function fecharFormPreco() {
  precoService.fecharFormPreco();
}








function testPlaca() {
  const placaInput = document.querySelector(".veiculo-form").placa;

  let str = "";

  str += genLetra();
  str += genLetra();
  str += genLetra();
  str += genNumero();
  str += genLetra();
  str += genNumero();
  str += genNumero();

  placaInput.value = str;

  function genLetra() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }

  function genNumero() {
    return String.fromCharCode(48 + Math.floor(Math.random() * 10))
  }
}