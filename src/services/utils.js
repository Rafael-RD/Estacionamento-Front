export const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"];
export const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function textoRelogio() {
  const data = new Date();

  return `${diasSemana[data.getDay()]},
      ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()},
      ${data.getHours()}:${data.getMinutes().toString().padStart(2, 0)}:${data.getSeconds().toString().padStart(2, 0)}`;
}

export function horasEntreDatas(dataAtras, dataAFrente) {
  const difTempoSegundos = Math.floor((dataAFrente.getTime() - dataAtras.getTime()) / 1000);

  return (
    Math.floor(difTempoSegundos / 3600) + ":" +
    Math.floor((difTempoSegundos / 60) % 60).toString().padStart(2, 0) + ":" +
    Math.floor(difTempoSegundos % 60).toString().padStart(2, 0)
  )
}

export function formatarDataTabela(data) {
  return (
    data.getDate().toString().padStart(2, 0) + "/" +
    data.getMonth().toString().padStart(2, 0) + "/" +
    data.getFullYear().toString().padStart(4, 0) + " " +
    data.getHours() + ":" +
    data.getMinutes().toString().padStart(2, 0) + ":" +
    data.getSeconds().toString().padStart(2, 0)
  );
}

export function formatarDataForm(data) {
  const arr = data.toLocaleString().split(",");

  let dataSemHora = arr[0].split("/");
  dataSemHora[2].padStart(4, 0); //transforma ano 35 em 0035 ISO
  dataSemHora = dataSemHora.reverse().join("-");

  const hora = arr[1].trim();

  return [dataSemHora, hora]
}

export function stringParaData(str) {
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

export function formatarIntParaValorTabela(valor) {
  return (valor / 100).toFixed(2).replace(".", ",");
}