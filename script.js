(async function () {
    try {
      const gceus = []; // Lista de GCEUs cadastrados
  
      /**
       * Inicializa o mapa com configuração inicial.
       * @returns {L.Map} Instância do Leaflet Map.
       */
      function initMap() {
        console.log("Inicializando o mapa...");
        const map = L.map("map").setView([-22.9068, -43.1729], 12); // Centro inicial no Rio de Janeiro
  
        // Adiciona os tiles do OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);
  
        return map;
      }
  
      /**
       * Valida uma localização antes de adicionar ao mapa.
       * @param {Object} location - Objeto contendo informações da localização.
       * @returns {boolean} Verdadeiro se a localização for válida, falso caso contrário.
       */
      function isValidLocation(location) {
        return (
          typeof location.name === "string" &&
          location.name.trim() &&
          typeof location.lat === "number" &&
          typeof location.lng === "number"
        );
      }
  
      /**
       * Adiciona um marcador ao mapa.
       * @param {L.Map} map - Instância do mapa Leaflet.
       * @param {Object} location - Localização a ser adicionada.
       */
      function addMarker(map, location) {
        if (!isValidLocation(location)) {
          console.warn("Dados inválidos para o marcador:", location);
          return;
        }
  
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
          <b>${location.name}</b>
          <br>
          <p>${location.local}</p>
          <p>Horário: ${location.horario}</p>
        `);
  
        location.marker = marker; // Associa o marcador ao objeto
      }
  
      /**
       * Adiciona um GCEU à tabela de GCEUs.
       * @param {Object} gceu - GCEU a ser adicionado.
       */
      function adicionarGCEUTabela(gceu) {
        const tabela = document.getElementById("tabelaGCEUs");
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
          <td>${gceu.name}</td>
          <td>Disponível</td>
        `;
        tabela.appendChild(novaLinha);
  
        // Exibe os dados do GCEU abaixo do mapa
        const dadosGCEU = document.getElementById("dadosGCEU");
        dadosGCEU.innerHTML = `
          <h2>Dados do GCEU: ${gceu.name}</h2>
          <p><strong>Nome:</strong> ${gceu.name}</p>
          <p><strong>Local:</strong> ${gceu.local}</p>
          <p><strong>Horário:</strong> ${gceu.horario}</p>
        `;
      }
  
      // Inicializa o mapa
      const map = initMap();
  
      // Adiciona marcadores iniciais
      gceus.push({
        name: "GCEU 1",
        lat: -22.9101,
        lng: -43.2094,
        local: "Rua X, 123",
        horario: "19h às 21h",
      });
      gceus.push({
        name: "GCEU 2",
        lat: -22.915,
        lng: -43.175,
        local: "Rua Y, 456",
        horario: "20h às 22h",
      });
      gceus.forEach((gceu) => {
        addMarker(map, gceu);
        adicionarGCEUTabela(gceu);
      });
  
      // Função para obter latitude e longitude usando a API Nominatim
      async function obterCoordenadasEndereco(endereco) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
          const resposta = await fetch(url);
          const dados = await resposta.json();
  
          if (dados && dados[0]) {
            const latitude = parseFloat(dados[0].lat);
            const longitude = parseFloat(dados[0].lon);
            return { latitude, longitude };
          } else {
            throw new Error("Endereço não encontrado");
          }
        } catch (error) {
          console.error("Erro ao obter coordenadas:", error);
          alert("Não foi possível obter as coordenadas para o endereço informado.");
          return null;
        }
      }
  
      // Função de envio do formulário
      const form = document.getElementById("formAdicionarGCEU");
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
  
        const nome = document.getElementById("nomeGCEUAdicionar").value.trim();
        const local = document.getElementById("localGCEUAdicionar").value.trim();
        const horario = document.getElementById("horarioGCEUAdicionar").value.trim();
        const endereco = document.getElementById("enderecoGCEUAdicionar").value.trim();
  
        if (nome && local && horario && endereco) {
          // Obter latitude e longitude a partir do endereço
          const coordenadas = await obterCoordenadasEndereco(endereco);
  
          if (coordenadas) {
            const novoGCEU = {
              name: nome,
              local: local,
              horario: horario,
              lat: coordenadas.latitude,
              lng: coordenadas.longitude,
            };
            gceus.push(novoGCEU);
            addMarker(map, novoGCEU);
            adicionarGCEUTabela(novoGCEU);
            form.reset();
            alert("GCEU adicionado com sucesso!");
          } else {
            alert("Falha ao obter coordenadas para o endereço.");
          }
        } else {
          alert("Todos os campos são obrigatórios. Tente novamente.");
        }
      });
    } catch (error) {
      console.error("Erro ao carregar o mapa:", error);
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        mapContainer.innerHTML = `
          <p style="color: red; text-align: center; font-weight: bold;">
            Ocorreu um erro ao carregar o mapa. Por favor, tente novamente mais tarde.
          </p>`;
      }
    }
  })();
  