let map;

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
// Função para adicionar um GCEU à tabela
function adicionarGCEUTabela(gceu) {
  const tabela = document.getElementById("tabelaGCEUs");
  const novaLinha = document.createElement("tr");
  novaLinha.innerHTML = `<td>${gceu.nome}</td><td>Disponível</td>`;
  tabela.appendChild(novaLinha);
}

// Função para adicionar um GCEU ao sistema e à tabela
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
      adicionarGCEUTabela(novoGCEU); // Adiciona o GCEU à tabela
      await adicionarMarcadorMapa(novoGCEU); // Adiciona o marcador no mapa
      alert("GCEU adicionado com sucesso!");
    } else {
      throw new Error("Erro ao adicionar GCEU.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao adicionar GCEU.");
  }
});


// Função para inicializar o mapa
async function initMap() {
  if (!map) {
    // Substitua pelas coordenadas da igreja (latitude e longitude)
    const igrejaLocation = [-22.857411,-43.446856]; // Exemplo: Igreja São Paulo
    map = L.map("map").setView(igrejaLocation, 15); // Centraliza na igreja, ajusta o zoom (15)
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    
    // Adiciona marcador para a igreja
    L.marker(igrejaLocation).addTo(map)
      .bindPopup('Igreja - Localização Central')
      .openPopup();
  }
  return map;
}


// Realiza a geocodificação de endereços
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GCEULocationApp/1.0 (your_email@example.com)',
        'Accept-Language': 'pt-BR'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } else {
      console.warn(`Endereço não encontrado: ${address}`);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    return null;
  }
}

// Função para adicionar um marcador no mapa
async function adicionarMarcadorMapa(gceu) {
  await initMap(); // Certifica-se de que o mapa está inicializado
  const location = await geocodeAddress(gceu.endereco);
  
  if (location) {
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(`<b>${gceu.nome}</b><br>${gceu.endereco}`);
  } else {
    console.warn(`Não foi possível adicionar o marcador para: ${gceu.nome}`);
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
      adicionarGCEUTabela(novoGCEU); // Adiciona o GCEU à tabela
      alert("GCEU adicionado com sucesso!");
    } else {
      throw new Error("Erro ao adicionar GCEU.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao adicionar GCEU.");
  }
});
