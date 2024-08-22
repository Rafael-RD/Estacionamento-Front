const apiUrl = "https://localhost:7217";

const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"];

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

let precos = [];

let veiculos = [
  {
    "id": 1,
    "placa": "abc5h12",
    "dataEntrada": "2024-08-19T05:56:28.849",
    "dataSaida": "2024-08-20T06:29:54.726",
    "tempo": "24:33:25"
  },
  {
    "id": 2,
    "placa": "ahe3h67",
    "dataEntrada": "2024-08-21T03:29:42.787",
    "dataSaida": null,
    "tempo": "14:33:37"
  }
]

let precoAtual = {}

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

function mostrarFormVeiculoEdicao(id) {
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
  ] = formatarDataForm(veiculo.dataEntrada);


  if (veiculo.dataSaida) [
    veiculoForm.dataSaida.value,
    veiculoForm.horaSaida.value
  ] = formatarDataForm(veiculo.dataSaida);
}

function mostrarFormVeiculoEntrada() {
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
  ] = formatarDataForm(dataAtual);
}

function mostrarFormVeiculoSaida() {
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
  ] = formatarDataForm(dataAtual);
}

function mostrarOverlayPrecos() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("escondido");
  const precoContainer = overlay.querySelector(".overlay-preco-container");
  precoContainer.classList.remove("escondido");
}

function mostrarFormPrecoEditar(id) {
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
  ] = formatarDataForm(preco.periodoInicio);

  [
    form.dataFinal.value,
    form.horaFinal.value
  ] = formatarDataForm(preco.periodoFinal);

  form.classList.remove("escondido");
}

function mostrarFormPrecoNovo() {
  const button = document.querySelector(".novo-preco-button");
  button.classList.add("escondido");

  const form = document.querySelector(".preco-form");
  form.reset();

  form.dataset.editando = 0;

  form.classList.remove("escondido");
}

function fecharFormPreco() {
  const button = document.querySelector(".novo-preco-button");
  button.classList.remove("escondido");

  const form = document.querySelector(".preco-form");
  form.classList.add("escondido");
}

async function deletarPreco(id) {
  try {
  await axios.delete(apiUrl + "/Preco/" + id);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  receberPrecoTodos();
}

async function deletarVeiculo(id) {
  try {
  await axios.delete(apiUrl + "/Veiculo/" + id);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  receberCarros();
}

async function putVeiculo(formEl) {
  const form = {
    id: Number(formEl.dataset.editando),
    placa: formEl.placa.value.toUpperCase(),
    dataEntrada: new Date(formEl.dataEntrada.value + "T" + formEl.horaEntrada.value)
  }
  if (formEl.dataSaida) form.dataSaida = new Date(formEl.dataSaida.value + "T" + formEl.horaSaida.value);

  try {
  await axios.put(apiUrl + "/Veiculo/" + form.id, form);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  esconderOverlay();
  receberCarros();
}

async function postSaidaVeiculo(formEl) {
  const form = {
    placa: formEl.placa.value.toUpperCase(),
    dataSaida: new Date(formEl.dataSaida.value + "T" + formEl.horaSaida.value)
  }

  try {
    const resp = await axios.post(apiUrl + "/Veiculo/saida", form);
    console.log(resp);

    const veiculoSaida = {
      placa: resp.data.placa,
      dataEntrada: stringParaData(resp.data.dataEntrada),
      dataSaida: stringParaData(resp.data.dataSaida.slice(0, 19)),
      aPagar: formatarIntParaValorTabela(resp.data.aPagar)
    }

    const difTempoSegundos = Math.floor((veiculoSaida.dataSaida.getTime() - veiculoSaida.dataEntrada.getTime()) / 1000);

    veiculoSaida.tempo = (
      Math.floor(difTempoSegundos / 3600) + ":" +
      Math.floor((difTempoSegundos / 60) % 60).toString().padStart(2, 0) + ":" +
      Math.floor(difTempoSegundos % 60).toString().padStart(2, 0)
    );

    const tabelaAPagar = document.querySelector(".pagar-tabela");
    const bodyTabela = tabelaAPagar.querySelector("tbody");

    bodyTabela.deleteRow(-1);
    const row = bodyTabela.insertRow();

    row.insertCell().textContent = veiculoSaida.placa
    row.insertCell().textContent = formatarDataTabela(veiculoSaida.dataEntrada)
    row.insertCell().textContent = formatarDataTabela(veiculoSaida.dataSaida)
    row.insertCell().textContent = veiculoSaida.tempo
    row.insertCell().textContent = veiculoSaida.aPagar

    tabelaAPagar.classList.remove("escondido");
  } catch (error) {
    console.log(error);

    if (error.response.status === 400) alert(error.response.data);
    else console.log(error);
  }
}

async function postEntradaVeiculo(formEl) {
  const form = {
    placa: formEl.placa.value.toUpperCase(),
    dataEntrada: new Date(formEl.dataEntrada.value + "T" + formEl.horaEntrada.value)
  }

  try {
  await axios.post(apiUrl + "/Veiculo/entrada", form);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }

  esconderOverlay();
  receberCarros();
}

async function veiculoFormSubmit(e) {
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

async function precoFormSubmit(e) {
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

async function postPreco(form) {
  try {
    return await axios.post(apiUrl + "/Preco", form);
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }
}

async function putPreco(form) {
  try {
    return await axios.put(apiUrl + "/Preco/" + form.id, form)
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }
}

function receberPrecoTodos() {
  try {
  axios.get(apiUrl + "/Preco/Todos").then(resp => {
    const tabelaPrecoTodosBody = document.querySelector(".overlay-preco-tabela tbody");

    precos = resp.data.map(p => {
      return {
        id: p.id,
        precoFixo: formatarIntParaValorTabela(p.precoFixo),
        precoHora: formatarIntParaValorTabela(p.precoHora),
        periodoInicio: stringParaData(p.periodoInicio),
        periodoFinal: stringParaData(p.periodoFinal)
      }
    });

    tabelaPrecoTodosBody.innerHTML = "";

    precos.forEach(p => {
      const row = tabelaPrecoTodosBody.insertRow();
      row.insertCell().textContent = p.precoFixo;
      row.insertCell().textContent = p.precoHora;
      row.insertCell().textContent = formatarDataTabela(p.periodoInicio);
      row.insertCell().textContent = formatarDataTabela(p.periodoFinal);
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

function receberPrecoAtual() {
  try {
  axios.get(apiUrl + "/Preco").then(resp => {
    const tabelaPrecoBody = document.querySelector(".preco-tabela tbody");

    const precos = {
      precoFixo: formatarIntParaValorTabela(resp.data.precoFixo),
      precoHora: formatarIntParaValorTabela(resp.data.precoHora)
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

function formatarIntParaValorTabela(valor) {
  return (valor / 100).toFixed(2).replace(".", ",");
}


function receberCarros() {
  try {
  axios.get(apiUrl + "/Veiculo/todos").then(resp => {
    const tabelaVeiculosBody = document.querySelector(".veiculo-tabela tbody");

    veiculos = resp.data.map(v => {
      let difTempoSegundos;

      const veiculo = {
        id: v.id,
        placa: v.placa,
        dataEntrada: stringParaData(v.dataEntrada),
        dataSaida: stringParaData(v.dataSaida),
      }

      if (veiculo.dataSaida)
        difTempoSegundos = Math.floor((veiculo.dataSaida.getTime() - veiculo.dataEntrada.getTime()) / 1000);
      else {
        difTempoSegundos = Math.floor((new Date().getTime() - veiculo.dataEntrada.getTime()) / 1000);
      }

      veiculo.tempo = (
        Math.floor(difTempoSegundos / 3600) + ":" +
        Math.floor((difTempoSegundos / 60) % 60).toString().padStart(2, 0) + ":" +
        Math.floor(difTempoSegundos % 60).toString().padStart(2, 0)
      );

      return veiculo;
    });

    tabelaVeiculosBody.innerHTML = "";

    const tab = document.createElement("table")
    const tbd = tab.createTBody()

    veiculos.forEach(v => {
      const row = tabelaVeiculosBody.insertRow();
      row.insertCell().textContent = v.placa.toUpperCase();
      row.insertCell().textContent = formatarDataTabela(v.dataEntrada);
      row.insertCell().textContent = v.dataSaida ? formatarDataTabela(v.dataSaida) : "-";
      row.insertCell().textContent = v.tempo ? v.tempo : "-";
      const celulaAcoes = row.insertCell();

      const botaoEditar = document.createElement("ion-icon");
      botaoEditar.name = "create-sharp";
      botaoEditar.addEventListener("click", () => mostrarFormVeiculoEdicao(v.id));
      celulaAcoes.appendChild(botaoEditar);

      const botaoDeletar = document.createElement("ion-icon");
      botaoDeletar.name = "trash-sharp";
      botaoDeletar.addEventListener("click", () => deletarVeiculo(v.id));
      celulaAcoes.appendChild(botaoDeletar);
    });
  });
  } catch (error) {
    if (error.response?.status === 404) alert(error.response.data);
    else console.error(error);
  }
}

function formatarDataForm(data) {
  const arr = data.toLocaleString().split(",");

  let dataSemHora = arr[0].split("/");
  dataSemHora[2].padStart(4, 0); //transforma ano 35 em 0035 ISO
  dataSemHora = dataSemHora.reverse().join("-");

  const hora = arr[1].trim();

  return [dataSemHora, hora]
}

function formatarDataTabela(data) {
  return (
    data.getDate().toString().padStart(2, 0) + "/" +
    data.getMonth().toString().padStart(2, 0) + "/" +
    data.getFullYear().toString().padStart(4, 0) + " " +
    data.getHours() + ":" +
    data.getMinutes().toString().padStart(2, 0) + ":" +
    data.getSeconds().toString().padStart(2, 0)
  );
}

function stringParaData(str) {
  if (str != null) return localizarData(new Date(str));
  else return null;
}

function localizarData(data) {
  const horaAtual = new Date();
  const novaData = new Date(data)

  const difHora = novaData.getHours() - (horaAtual.getTimezoneOffset() / 60);
  const difMin = novaData.getMinutes() - (horaAtual.getTimezoneOffset() % 60);

  novaData.setHours(difHora, difMin);

  return novaData;
}

function textoRelogio() {
  const data = new Date();

  return `${diasSemana[data.getDay()]},
      ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()},
      ${data.getHours()}:${data.getMinutes().toString().padStart(2, 0)}:${data.getSeconds().toString().padStart(2, 0)}`;
}

function definirAtualizacaoHorario() {
  const mostrador = document.querySelector("#relogio");

  if (mostrador) {
    mostrador.textContent = textoRelogio();

    setInterval(() => mostrador.textContent = textoRelogio(), 1000);
  }
}

function adicionarEventListeners() {
  document.querySelector(".overlay").addEventListener("click", esconderOverlay);
  document.querySelectorAll(".overlay div").forEach(e => e.addEventListener("click", e => e.stopPropagation()));
  document.querySelector("#botao-preco").addEventListener('click', mostrarOverlayPrecos);
  document.querySelector("#botao-entrada").addEventListener("click", mostrarFormVeiculoEntrada);
  document.querySelector("#botao-saida").addEventListener("click", mostrarFormVeiculoSaida);
  document.querySelector("#botao-novo-preco").addEventListener("click", mostrarFormPrecoNovo);
  document.querySelector("#form-preco").addEventListener("submit", precoFormSubmit);
  document.querySelector("#form-preco #cancelar").addEventListener("click", fecharFormPreco);
  document.querySelector("#form-veiculo").addEventListener("submit", veiculoFormSubmit);
  document.querySelector("#form-veiculo #cancelar").addEventListener("click", esconderOverlay);


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