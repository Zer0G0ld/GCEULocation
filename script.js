(async function () {
  try {
    const gceus = []; // Lista de GCEUs cadastrados

    function initMap() {
      console.log("Inicializando o mapa...");
      const map = L.map("map").setView([-22.9068, -43.1729], 12); // Centro inicial no Rio de Janeiro

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      return map;
    }

    function isValidLocation(location) {
      return (
        typeof location.name === "string" &&
        location.name.trim() &&
        typeof location.lat === "number" &&
        typeof location.lng === "number"
      );
    }

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

      location.marker = marker;
    }

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
        <h2>Dados do GCEU: ${gceu.name}</h2>
        <p><strong>Nome:</strong> ${gceu.name}</p>
        <p><strong>Local:</strong> ${gceu.local}</p>
        <p><strong>Horário:</strong> ${gceu.horario}</p>
      `;
    }

    const map = initMap();

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
      horario: "18h às 20h",
    });

    gceus.forEach((gceu) => {
      addMarker(map, gceu);
      adicionarGCEUTabela(gceu);
    });

    document.getElementById("formAdicionarGCEU").addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = document.getElementById("nomeGCEUAdicionar").value;
      const local = document.getElementById("localGCEUAdicionar").value;
      const horario = document.getElementById("horarioGCEUAdicionar").value;
      const endereco = document.getElementById("enderecoGCEUAdicionar").value;
      const latitude = parseFloat(document.getElementById("latitudeGCEUAdicionar").value);
      const longitude = parseFloat(document.getElementById("longitudeGCEUAdicionar").value);

      const novoGCEU = { name: nome, local, horario, endereco, lat: latitude, lng: longitude };

      gceus.push(novoGCEU);
      addMarker(map, novoGCEU);
      adicionarGCEUTabela(novoGCEU);
    });

    document.getElementById("removerGCEU").addEventListener("click", function () {
      const nomeGCEU = document.getElementById("nomeGCEUAdicionar").value;
      const index = gceus.findIndex(gceu => gceu.name === nomeGCEU);
      
      if (index !== -1) {
        gceus[index].marker.remove();
        gceus.splice(index, 1);
        alert(`GCEU ${nomeGCEU} removido!`);
      } else {
        alert("GCEU não encontrado!");
      }
    });
  } catch (error) {
    console.error("Erro ao carregar o mapa ou dados:", error);
  }
})();
