import axios from "axios";
import { utils } from "./index.js";

let veiculos = [];

export function adicionarEventListeners() {
  document.querySelector("#botao-entrada").addEventListener("click", mostrarFormVeiculoEntrada);
  document.querySelector("#botao-saida").addEventListener("click", mostrarFormVeiculoSaida);
  document.querySelector("#form-veiculo").addEventListener("submit", veiculoFormSubmit);
}

export function receberCarros() {
  try {
    axios.get(process.env.API_URL + "/Veiculo/todos").then(resp => {
      const tabelaVeiculosBody = document.querySelector(".veiculo-tabela tbody");

      veiculos = resp.data.map(v => {
        let difTempoSegundos;

        const veiculo = {
          id: v.id,
          placa: v.placa,
          dataEntrada: utils.stringParaData(v.dataEntrada),
          dataSaida: utils.stringParaData(v.dataSaida),
        }

        if (veiculo.dataSaida)
          veiculo.tempo = utils.horasEntreDatas(veiculo.dataEntrada, veiculo.dataSaida);
        else
          veiculo.tempo = utils.horasEntreDatas(veiculo.dataEntrada, new Date());

        return veiculo;
      });

      tabelaVeiculosBody.innerHTML = "";
      utils.timers = [];

      veiculos.forEach(v => {
        const row = tabelaVeiculosBody.insertRow();
        row.insertCell().textContent = v.placa.toUpperCase();
        row.insertCell().textContent = utils.formatarDataTabela(v.dataEntrada);
        row.insertCell().textContent = v.dataSaida ? utils.formatarDataTabela(v.dataSaida) : "-";
        const timer = row.insertCell();
        timer.textContent = v.tempo ? v.tempo : "-";
        const celulaAcoes = row.insertCell();

        const botaoEditar = document.createElement("ion-icon");
        botaoEditar.name = "create-sharp";
        botaoEditar.addEventListener("click", () => mostrarFormVeiculoEdicao(v.id));
        celulaAcoes.appendChild(botaoEditar);

        const botaoDeletar = document.createElement("ion-icon");
        botaoDeletar.name = "trash-sharp";
        botaoDeletar.addEventListener("click", () => deletarVeiculo(v.id));
        celulaAcoes.appendChild(botaoDeletar);

        if (!v.dataSaida)
          utils.timers.push({
            dataInicial: v.dataEntrada,
            elemento: timer
          });
      });
    });
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }
}

export async function postEntradaVeiculo(formEl) {
  const form = {
    placa: formEl.placa.value.toUpperCase(),
    dataEntrada: new Date(formEl.dataEntrada.value + "T" + formEl.horaEntrada.value)
  }

  try {
    await axios.post(process.env.API_URL + "/Veiculo/entrada", form);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  esconderOverlay();
  receberCarros();
}

export async function postSaidaVeiculo(formEl) {
  const form = {
    placa: formEl.placa.value.toUpperCase(),
    dataSaida: new Date(formEl.dataSaida.value + "T" + formEl.horaSaida.value)
  }

  try {
    const resp = await axios.post(process.env.API_URL + "/Veiculo/saida", form);
    const veiculoSaida = {
      placa: resp.data.placa,
      dataEntrada: utils.stringParaData(resp.data.dataEntrada),
      dataSaida: utils.stringParaData(resp.data.dataSaida.slice(0, 19)),
      aPagar: utils.formatarIntParaValorTabela(resp.data.aPagar)
    }

    veiculoSaida.tempo = utils.horasEntreDatas(veiculoSaida.dataEntrada, veiculoSaida.dataSaida);

    const tabelaAPagar = document.querySelector(".pagar-tabela");
    const bodyTabela = tabelaAPagar.querySelector("tbody");

    bodyTabela.deleteRow(-1);
    const row = bodyTabela.insertRow();

    row.insertCell().textContent = veiculoSaida.placa
    row.insertCell().textContent = utils.formatarDataTabela(veiculoSaida.dataEntrada)
    row.insertCell().textContent = utils.formatarDataTabela(veiculoSaida.dataSaida)
    row.insertCell().textContent = veiculoSaida.tempo
    row.insertCell().textContent = veiculoSaida.aPagar

    tabelaAPagar.classList.remove("escondido");
  } catch (error) {
    if (error.response.status === 400) alert(error.response.data);
    else console.error(error);
  }
}

export async function putVeiculo(formEl) {
  const form = {
    id: Number(formEl.dataset.editando),
    placa: formEl.placa.value.toUpperCase(),
    dataEntrada: new Date(formEl.dataEntrada.value + "T" + formEl.horaEntrada.value)
  }
  if (formEl.dataSaida) form.dataSaida = new Date(formEl.dataSaida.value + "T" + formEl.horaSaida.value);

  try {
    await axios.put(process.env.API_URL + "/Veiculo/" + form.id, form);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  esconderOverlay();
  receberCarros();
}

export async function deletarVeiculo(id) {
  try {
    await axios.delete(process.env.API_URL + "/Veiculo/" + id);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  receberCarros();
}

export function mostrarFormVeiculoEntrada() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("escondido");
  const veiculoContainer = document.querySelector(".overlay-veiculo-container");
  veiculoContainer.classList.remove("escondido");

  const veiculoForm = veiculoContainer.querySelector(".veiculo-form");
  veiculoForm.reset();

  veiculoForm.dataset.acao = "entrada";
  veiculoForm.dataset.editando = "0";

  veiculoForm.dataEntrada.disabled = false;
  veiculoForm.horaEntrada.disabled = false;
  veiculoForm.dataSaida.disabled = true;
  veiculoForm.horaSaida.disabled = true;
  veiculoForm.dataSaida.required = true;
  veiculoForm.horaSaida.required = true;

  const dataAtual = (new Date()).toLocaleString();
  // '21/08/2024, 18:23:23'

  [
    veiculoForm.dataEntrada.value,
    veiculoForm.horaEntrada.value
  ] = utils.formatarDataForm(dataAtual);
}

export function mostrarFormVeiculoSaida() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("escondido");
  const veiculoContainer = document.querySelector(".overlay-veiculo-container");
  veiculoContainer.classList.remove("escondido");

  const veiculoForm = veiculoContainer.querySelector(".veiculo-form");
  veiculoForm.reset();

  veiculoForm.dataset.acao = "saida";
  veiculoForm.dataset.editando = "0";

  veiculoForm.dataEntrada.disabled = true;
  veiculoForm.horaEntrada.disabled = true;
  veiculoForm.dataSaida.disabled = false;
  veiculoForm.horaSaida.disabled = false;
  veiculoForm.dataSaida.required = true;
  veiculoForm.horaSaida.required = true;

  const dataAtual = (new Date()).toLocaleString();
  // '21/08/2024, 18:23:23'

  [
    veiculoForm.dataSaida.value,
    veiculoForm.horaSaida.value
  ] = utils.formatarDataForm(dataAtual);
}

export function mostrarFormVeiculoEdicao(id) {
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("escondido");
  const veiculoContainer = document.querySelector(".overlay-veiculo-container");
  veiculoContainer.classList.remove("escondido");

  const veiculoForm = veiculoContainer.querySelector(".veiculo-form");
  veiculoForm.reset();

  veiculoForm.dataset.acao = "edicao";
  veiculoForm.dataset.editando = id;

  veiculoForm.dataEntrada.disabled = false;
  veiculoForm.horaEntrada.disabled = false;
  veiculoForm.dataSaida.disabled = false;
  veiculoForm.horaSaida.disabled = false;
  veiculoForm.dataSaida.required = false;
  veiculoForm.horaSaida.required = false;


  const veiculo = veiculos.find(v => v.id === id);

  veiculoForm.placa.value = veiculo.placa;

  [
    veiculoForm.dataEntrada.value,
    veiculoForm.horaEntrada.value
  ] = utils.formatarDataForm(veiculo.dataEntrada);


  if (veiculo.dataSaida) [
    veiculoForm.dataSaida.value,
    veiculoForm.horaSaida.value
  ] = utils.formatarDataForm(veiculo.dataSaida);
}


export async function veiculoFormSubmit(e) {
  e.preventDefault();

  switch (e.target.dataset.acao) {
    case "entrada":
      await postEntradaVeiculo(e.target);
      break;

    case "saida":
      await postSaidaVeiculo(e.target);
      break;

    case "edicao":
      await putVeiculo(e.target);
      break;
  }
}