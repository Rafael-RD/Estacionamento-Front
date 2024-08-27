import { precoService, veiculoService, utils } from "./services/index.js";

function iniciar() {
  definirAtualizacaoHorario();
  definirAtualizacaoTimer();
  receberCarros();
  receberPrecoAtual();
  receberPrecoTodos();
  adicionarEventListeners();

  document.querySelector("#form-veiculo label").addEventListener("click", testPlaca);
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



function definirAtualizacaoTimer() {
  utils.definirAtualizacaoTimer();
}

function definirAtualizacaoHorario() {
  utils.definirAtualizacaoHorario();
}

function adicionarEventListeners() {
  utils.adicionarEventListeners();
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