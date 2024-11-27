// Função para obter todos os GCEUs do backend
async function getGCEUs() {
  try {
    const response = await fetch('http://localhost:3000/gceus');
    if (response.ok) {
      const gceus = await response.json();
      console.log(gceus);

      // Popula a tabela com os GCEUs e adiciona os marcadores no mapa
      gceus.forEach(gceu => {
        adicionarGCEUTabela(gceu);
        adicionarMarcadorMapa(gceu);
      });
    } else {
      throw new Error("Erro ao obter GCEUs.");
    }
  } catch (err) {
    console.error(err);
  }
}

// Função para adicionar um GCEU à tabela
function adicionarGCEUTabela(gceu) {
  const tabela = document.getElementById("tabelaGCEUs");
  const novaLinha = document.createElement("tr");
  novaLinha.innerHTML = `<td>${gceu.name}</td><td>Disponível</td>`;
  tabela.appendChild(novaLinha);
}

// Função para inicializar o mapa
async function initMap() {
  const map = L.map("map").setView([-22.9068, -43.1729], 12); // Centraliza no Rio de Janeiro como fallback

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  return map;
}

// Realiza a geocodificação de endereços
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
    console.error("Erro ao buscar endereço:", error);
    return null;
  }
}

// Função para adicionar um marcador no mapa
async function adicionarMarcadorMapa(gceu) {
  const map = await initMap(); // Inicializa o mapa, caso ainda não tenha sido feito

  const location = await geocodeAddress(gceu.endereco);
  if (location) {
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(`<b>${gceu.name}</b><br>${gceu.local}<br>${gceu.endereco}`);
  }
}

// Função de inicialização do sistema
(async () => {
  await getGCEUs();  // Chama a função para obter os GCEUs e exibi-los
})();

// Adicionar GCEU ao sistema
document.getElementById("formAdicionarGCEU").addEventListener("submit", async (event) => {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  const nome = document.getElementById("nomeGCEUAdicionar").value;
  const endereco = document.getElementById("enderecoGCEUAdicionar").value;
  const hora = document.getElementById("horaGCEUAdicionar").value;
  const descricao = document.getElementById("descricaoGCEUAdicionar").value;
  const dataInicio = document.getElementById("dataInicioGCEUAdicionar").value;

  const gceu = { nome, endereco, hora, descricao, dataInicio };

  try {
    const response = await fetch('http://localhost:3000/gceus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gceu),
    });

    if (response.ok) {
      const novoGCEU = await response.json();
      adicionarGCEUTabela(novoGCEU); // Função que adiciona o GCEU à tabela
      alert("GCEU adicionado com sucesso!");
    } else {
      throw new Error("Erro ao adicionar GCEU.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao adicionar GCEU.");
  }
});
