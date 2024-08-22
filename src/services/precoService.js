import axios from "axios";
import { utils } from "./index.js";

let precos = [];

export function adicionarEventListeners() {
  document.querySelector("#botao-preco").addEventListener('click', mostrarOverlayPrecos);
  document.querySelector("#botao-novo-preco").addEventListener("click", mostrarFormPrecoNovo);
  document.querySelector("#form-preco").addEventListener("submit", precoFormSubmit);
  document.querySelector("#form-preco #cancelar").addEventListener("click", fecharFormPreco);
}

export function receberPrecoAtual() {
  try {
    axios.get(process.env.API_URL + "/Preco").then(resp => {
      const tabelaPrecoBody = document.querySelector(".preco-tabela tbody");

      const precos = {
        precoFixo: utils.formatarIntParaValorTabela(resp.data.precoFixo),
        precoHora: utils.formatarIntParaValorTabela(resp.data.precoHora)
      }

      tabelaPrecoBody.deleteRow(-1)

      const row = tabelaPrecoBody.insertRow();
      row.insertCell().textContent = precos.precoFixo;
      row.insertCell().textContent = precos.precoHora;
    }).catch(resp => {
      if (resp.response.status === 404) {
        mostrarOverlayPrecos();
        mostrarFormPrecoNovo();
      }
    })
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }
}

export function receberPrecoTodos() {
  try {
    axios.get(process.env.API_URL + "/Preco/Todos").then(resp => {
      const tabelaPrecoTodosBody = document.querySelector(".overlay-preco-tabela tbody");

      precos = resp.data.map(p => {
        return {
          id: p.id,
          precoFixo: utils.formatarIntParaValorTabela(p.precoFixo),
          precoHora: utils.formatarIntParaValorTabela(p.precoHora),
          periodoInicio: utils.stringParaData(p.periodoInicio),
          periodoFinal: utils.stringParaData(p.periodoFinal)
        }
      });

      tabelaPrecoTodosBody.innerHTML = "";

      precos.forEach(p => {
        const row = tabelaPrecoTodosBody.insertRow();
        row.insertCell().textContent = p.precoFixo;
        row.insertCell().textContent = p.precoHora;
        row.insertCell().textContent = utils.formatarDataTabela(p.periodoInicio);
        row.insertCell().textContent = utils.formatarDataTabela(p.periodoFinal);
        const celulaAcoes = row.insertCell();

        const botaoEditar = document.createElement("ion-icon");
        botaoEditar.name = "create-sharp";
        botaoEditar.addEventListener("click", () => mostrarFormPrecoEditar(p.id));
        celulaAcoes.appendChild(botaoEditar);

        const botaoDeletar = document.createElement("ion-icon");
        botaoDeletar.name = "trash-sharp";
        botaoDeletar.addEventListener("click", () => deletarPreco(p.id));
        celulaAcoes.appendChild(botaoDeletar);
      })
    })
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  receberPrecoAtual();
}

export async function postPreco(form) {
  try {
    return await axios.post(process.env.API_URL + "/Preco", form);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }
}

export async function putPreco(form) {
  try {
    return await axios.put(process.env.API_URL + "/Preco/" + form.id, form)
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }
}

export async function deletarPreco(id) {
  try {
    await axios.delete(process.env.API_URL + "/Preco/" + id);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  receberPrecoTodos();
}

export function mostrarOverlayPrecos() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("escondido");
  const precoContainer = overlay.querySelector(".overlay-preco-container");
  precoContainer.classList.remove("escondido");
}


export function mostrarFormPrecoNovo() {
  const button = document.querySelector(".novo-preco-button");
  button.classList.add("escondido");

  const form = document.querySelector(".preco-form");
  form.reset();

  form.dataset.editando = 0;

  form.classList.remove("escondido");
}

export function mostrarFormPrecoEditar(id) {
  const button = document.querySelector(".novo-preco-button");
  button.classList.add("escondido");

  const form = document.querySelector(".preco-form");
  form.reset();

  const preco = precos.find(p => p.id === id);

  form.dataset.editando = preco.id;

  form.precoFixo.value = preco.precoFixo;
  form.precoHora.value = preco.precoHora;

  [
    form.dataInicio.value,
    form.horaInicio.value
  ] = utils.formatarDataForm(preco.periodoInicio);

  [
    form.dataFinal.value,
    form.horaFinal.value
  ] = utils.formatarDataForm(preco.periodoFinal);

  form.classList.remove("escondido");
}

export function fecharFormPreco() {
  const button = document.querySelector(".novo-preco-button");
  button.classList.remove("escondido");

  const form = document.querySelector(".preco-form");
  form.classList.add("escondido");
}

export async function precoFormSubmit(e) {
  e.preventDefault();

  const form = {
    id: Number(e.target.dataset.editando),
    precoFixo: Math.floor(Number(e.target.precoFixo.value.replace(",", ".")) * 100),
    precoHora: Math.floor(Number(e.target.precoHora.value.replace(",", ".")) * 100),
    periodoInicio: new Date(e.target.dataInicio.value + "T" + e.target.horaInicio.value),
    periodoFinal: new Date(e.target.dataFinal.value + "T" + e.target.horaFinal.value),
  }

  if (form.id === 0) await postPreco(form);
  else await putPreco(form);

  receberPrecoTodos();
}