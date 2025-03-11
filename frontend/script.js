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

  async buscarEnderecoPorCEP(cep) {
    if (cep.length !== 8) return; // O CEP deve ter 8 dígitos numéricos

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      document.getElementById("enderecoGCEUAdicionar").value = data.logradouro;
      document.getElementById("complementoGCEUAdicionar").value = data.complemento || "";
    } catch (error) {
      console.error("Erro ao buscar endereço pelo CEP:", error);
    }
  },

  // Adiciona evento para buscar endereço ao inserir o CEP
  initCEPListener() {
    document.getElementById("cepGCEUAdicionar").addEventListener("blur", function () {
      const cep = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
      GCEUApp.buscarEnderecoPorCEP(cep);
    });
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
    marcador.bindPopup(`
      <b>${gceu.nome}</b><br>
      ${gceu.endereco}<br>
      Líder: ${gceu.lider}<br>
      Horário: ${gceu.hora}<br>
      <button class="btn btn-warning btn-sm" onclick="GCEUApp.editarGCEU('${gceu._id}')">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="GCEUApp.deletarGCEU('${gceu._id}')">Deletar</button>
    `).openPopup();
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
    novaLinha.setAttribute("data-id", gceu._id);
    novaLinha.innerHTML = `
      <td>${gceu.nome}</td>
      <td>Disponível</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="GCEUApp.editarGCEU('${gceu._id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="GCEUApp.deletarGCEU('${gceu._id}')">Deletar</button>
      </td>
    `;
    tabela.appendChild(novaLinha);
  },

  // Adiciona GCEU ao backend
  async adicionarGCEU(event) {
    event.preventDefault();

    const endereco = document.getElementById("enderecoGCEUAdicionar").value;
    const gceu = {
      nome: document.getElementById("nomeGCEUAdicionar").value,
      cep: document.getElementById("cepGCEUAdicionar").value,
      endereco: document.getElementById("enderecoGCEUAdicionar").value,
      numero: document.getElementById("numeroGCEUAdicionar").value,
      complemento: document.getElementById("complementoGCEUAdicionar").value,
      hora: document.getElementById("horaGCEUAdicionar").value,
      descricao: document.getElementById("descricaoGCEUAdicionar").value,
      diaSemana: document.getElementById("diaSemanaGCEUAdicionar").value,
      lider: document.getElementById("adicionarLider").value,
    };

    const localizacao = await this.geocodeEndereco(endereco);
    if (!localizacao) return;

    gceu.latitude = localizacao.lat;
    gceu.longitude = localizacao.lon;

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
    this.initCEPListener();

    document.getElementById("formAdicionarGCEU").addEventListener("submit", (event) => this.adicionarGCEU(event));
  },

  editarGCEU(id) {
    const gceu = this.gceus.find(g => g._id === id);
    if (!gceu) return;

    document.getElementById("nomeGCEUAdicionar").value = gceu.nome;
    document.getElementById("enderecoGCEUAdicionar").value = gceu.endereco;
    document.getElementById("horaGCEUAdicionar").value = gceu.hora;
    document.getElementById("descricaoGCEUAdicionar").value = gceu.descricao;
    document.getElementById("diaSemanaGCEUAdicionar").value = gceu.diaSemana;
    document.getElementById("adicionarLider").value = gceu.lider;

    const button = document.querySelector("#formAdicionarGCEU button[type='submit']");
    button.innerHTML = "<i class='fa fa-edit'></i> Atualizar";
    button.onclick = () => this.atualizarGCEU(id);
  }
};

// document.addEventListener("DOMContentLoaded", () => {
//  GCEUApp.init();
// });
document.addEventListener("DOMContentLoaded", function () {
  GCEUApp.init();
  document.getElementById("igreja").value = "IMW Gericinó";
  if (igrejaSelect.options.length > 0) {
    igrejaSelect.selectedIndex = 0; // Seleciona a primeira opção
  }
  
});
