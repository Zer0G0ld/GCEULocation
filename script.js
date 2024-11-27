// Função que gerencia o evento de clique para fechar a barra de navegação
document.addEventListener("click", function (event) {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarCollapse.classList.contains("show") && !navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
    navbarToggler.click();
  }
});

// Função assíncrona que inicializa o mapa
async function initMap() {
  const map = L.map("map").setView([-22.9068, -43.1729], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Adicionar controles de zoom e geolocalização
  L.control.zoom().addTo(map);
  L.control.locate().addTo(map);

  return map;
}

// Função assíncrona para geocodificar o endereço
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    throw new Error("Endereço não encontrado.");
  } catch (error) {
    console.error("Erro na geocodificação:", error);
    return null;
  }
}

// Função para adicionar marcador no mapa
function addMarker(map, location) {
  if (!location.lat || !location.lng) {
    console.warn("Coordenadas inválidas para o marcador:", location);
    return;
  }

  const marker = L.marker([location.lat, location.lng]).addTo(map);
  marker.bindPopup(`
    <b>${location.name}</b>
    <br>
    <p>${location.local}</p>
    <p>Horário: ${location.horario}</p>
  `);

  location.marker = marker;
}

// Função para adicionar um GCEU à tabela e exibir os detalhes
function adicionarGCEUTabela(gceu) {
  const tabela = document.getElementById("tabelaGCEUs");
  const novaLinha = document.createElement("tr");
  novaLinha.innerHTML = `
    <td>${gceu.name}</td>
    <td>Disponível</td>
  `;
  tabela.appendChild(novaLinha);

  const dadosGCEU = document.getElementById("dadosGCEU");
  dadosGCEU.innerHTML = `
    <h3>${gceu.name}</h3>
    <p>Local: ${gceu.local}</p>
    <p>Horário: ${gceu.horario}</p>
  `;
}

// Função principal assíncrona para inicializar o sistema
(async function () {
  try {
    const gceus = [];
    const map = await initMap();

    // Dados iniciais de GCEUs
    const gceusDados = [
      { name: "GCEU Centro", local: "Centro", horario: "19h às 21h", endereco: "Rua X, 123" },
      { name: "GCEU Zona Norte", local: "Zona Norte", horario: "18h às 20h", endereco: "Rua Y, 456" }
    ];

    // Geocodificação e adição de marcadores no mapa para cada GCEU
    for (const gceu of gceusDados) {
      const location = await geocodeAddress(gceu.endereco);
      if (location) {
        addMarker(map, { ...gceu, ...location });
        adicionarGCEUTabela(gceu);
      }
    }

    // Função para adicionar um novo GCEU
    document.getElementById("formAdicionarGCEU").addEventListener("submit", async function (event) {
      event.preventDefault();

      const nome = document.getElementById("nomeGCEUAdicionar").value;
      const local = document.getElementById("localGCEUAdicionar").value;
      const horario = document.getElementById("horarioGCEUAdicionar").value;
      const endereco = document.getElementById("enderecoGCEUAdicionar").value;

      // Log para verificar os dados do formulário
      console.log("Dados do novo GCEU:", nome, local, horario, endereco);

      // Geocodificando o endereço
      const location = await geocodeAddress(endereco);
      if (location) {
        const novoGCEU = { name: nome, local, horario, endereco, lat: location.lat, lng: location.lng };

        // Log para verificar se o novo GCEU foi criado corretamente
        console.log("Novo GCEU adicionado:", novoGCEU);

        // Adiciona o novo GCEU ao array e à tabela
        gceus.push(novoGCEU);
        addMarker(map, novoGCEU);
        adicionarGCEUTabela(novoGCEU);

        // Limpa o formulário após o envio
        document.getElementById("formAdicionarGCEU").reset();
      } else {
        console.error("Erro ao adicionar GCEU: Endereço não encontrado.");
      }
    });

  } catch (error) {
    console.error("Erro inicializando o mapa ou GCEUs:", error);
  }
})();
