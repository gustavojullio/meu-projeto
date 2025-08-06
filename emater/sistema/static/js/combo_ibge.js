document.addEventListener("DOMContentLoaded", function () {
  const cidadeSelect = document.getElementById("cidade");
  const cidadeSelecionada = cidadeSelect.getAttribute("data-cidade");

  // Carrega cidades de Minas Gerais diretamente
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios")
    .then((res) => res.json())
    .then((cidades) => {
      cidadeSelect.innerHTML = "";
      cidades.forEach((c) => {
        const option = document.createElement("option");
        option.value = c.nome;
        option.textContent = c.nome;
        cidadeSelect.appendChild(option);
      });

      if (cidadeSelecionada) {
        cidadeSelect.value = cidadeSelecionada;
      }
    });
});
