const GCEUApp = {
  map: null,
  
  // Inicializa o mapa
  async initMap() {
    if (!this.map) {
      const igrejaLocation = [-22.857411, -43.446856]; // Coordenadas da igreja
      this.map = L.map("map").setView(igrejaLocation, 15);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      // Adiciona marcador da igreja
      L.marker(igrejaLocation).addTo(this.map)
        .bindPopup('IMW Gericinó')
        .openPopup();
    }
  },

  // Busca coordenadas do endereço
  async geocodeEndereco(endereco) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'GCEULocationApp/1.0 (your_email@example.com)',
          'Accept-Language': 'pt-BR'
        }
      });

      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

      const data = await response.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      } else {
        alert("Endereço não encontrado!");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      return null;
    }
  },

  // Adiciona um GCEU ao mapa
  async adicionarGceu(gceu) {
    const localizacao = await this.geocodeEndereco(gceu.endereco);
    if (!localizacao) return;

    const marcador = L.marker([localizacao.lat, localizacao.lon]).addTo(this.map);
    marcador.bindPopup(`<b>${gceu.nome}</b><br>${gceu.endereco}<br>Líder: ${gceu.lider}`).openPopup();
  },

  // Obtém todos os GCEUs do backend
  async carregarGCEUs() {
    try {
      const response = await fetch("http://localhost:3000/gceus");
      if (!response.ok) throw new Error("Erro ao obter GCEUs.");

      const gceus = await response.json();
      gceus.forEach(gceu => {
        this.adicionarGCEUTabela(gceu);
        this.adicionarGceu(gceu);
      });
    } catch (err) {
      console.error(err);
    }
  },

  // Adiciona GCEU à tabela
  adicionarGCEUTabela(gceu) {
    const tabela = document.getElementById("tabelaGCEUs");
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = `<td>${gceu.nome}</td><td>Disponível</td>`;
    tabela.appendChild(novaLinha);
  },

  // Adiciona GCEU ao backend
  async adicionarGCEU(event) {
    event.preventDefault();

    const gceu = {
      nome: document.getElementById("nomeGCEUAdicionar").value,
      endereco: document.getElementById("enderecoGCEUAdicionar").value,
      hora: document.getElementById("horaGCEUAdicionar").value,
      descricao: document.getElementById("descricaoGCEUAdicionar").value,
      dataInicio: document.getElementById("dataInicioGCEUAdicionar").value,
    };

    try {
      const response = await fetch("http://localhost:3000/gceus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gceu),
      });

      if (!response.ok) throw new Error("Erro ao adicionar GCEU.");

      const novoGCEU = await response.json();
      this.adicionarGCEUTabela(novoGCEU);
      this.adicionarGceu(novoGCEU);
      alert("GCEU adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar GCEU.");
    }
  },

  // Inicializa o sistema
  async init() {
    await this.initMap();
    await this.carregarGCEUs();

    document.getElementById("formAdicionarGCEU").addEventListener("submit", (event) => this.adicionarGCEU(event));
  }
};

// Inicia a aplicação
GCEUApp.init();
