const API_VEICULOS = 'http://localhost:8080/veiculos';
const API_TIPOS = 'http://localhost:8080/tipos';
const IMAGEM_PADRAO = 'https://www.kikos.com.br/media/catalog/product/placeholder/default/sem-foto.jpg';

let modoEdicao = false;
let veiculoEditandoId = null;

function ocultarTodasAsSecoes() {
  document.getElementById('home').style.display = 'none';
  document.getElementById('veiculos-container').style.display = 'none';

  // Filtros individuais
  document.getElementById('filtros').style.display = 'none';         // filtro por Km
  document.getElementById('filtro-preco').style.display = 'none';    // filtro por Preço
  document.getElementById('filtro-ano').style.display = 'none';      // filtro por Ano
  document.getElementById('filtro-status').style.display = 'none';   // filtro por Status

  // Buscas por categoria
  document.getElementById('busca-por-tipo').style.display = 'none';
  document.getElementById('busca-por-marca').style.display = 'none';
  document.getElementById('busca-por-modelo').style.display = 'none';
}

function mostrarHome() {
  ocultarTodasAsSecoes();
  document.getElementById('home').style.display = 'block';
}

function mostrarLista() {
  ocultarTodasAsSecoes();
  document.getElementById('veiculos-container').style.display = 'flex';
  carregarVeiculos();
}

function carregarVeiculos(container = document.getElementById('veiculos-container')) {
  fetch(API_VEICULOS)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = '';
      if (data.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado.</p>';
        return;
      }
      data.forEach(veiculo => {
        container.appendChild(criarCard(veiculo));
      });
    })
    .catch(err => {
      console.error('Erro ao carregar veículos:', err);
      alert('Erro ao carregar veículos. Verifique o servidor.');
    });
}

function criarCard(veiculo) {
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(veiculo.preco);

  const imagem = veiculo.imagemUrl?.trim() ? veiculo.imagemUrl : IMAGEM_PADRAO;

  const article = document.createElement('article');
  article.className = 'article-wrapper';
  article.innerHTML = `
    <div class="rounded-lg container-project" style="background-image: url('${imagem}');"></div>
    <div class="project-info">
      <div class="flex-pr">
        <div class="project-title">${veiculo.marca} - ${veiculo.modelo}</div>
      </div>
      <div class="types">
        <span class="project-type">Cor: ${veiculo.cor}</span>
        <span class="project-type">Ano: ${veiculo.anoFabricacao}</span>
        <span class="project-type">KM: ${veiculo.quilometragem}</span>
        <span class="project-type">Preço: ${precoFormatado}</span>
        <span class="project-type">Tipo: ${veiculo.tipo?.nome || 'N/A'}</span>
        <span class="project-type">Status: ${veiculo.status || 'N/A'}</span>
      </div>

      <!-- BOTÃO ALTERAR STATUS -->
      <div class="status-dropdown">
        <button class="btn btn-status">
          <p class="paragraph">Alterar Status</p>
          <span class="icon-wrapper">
            <svg
              fill="#000000"
              height="26px"
              width="26px"
              viewBox="0 0 24 24"
              class="icon"
            >
              <path
                d="M12,0C5.38,0,0,5.38,0,12s5.38,12,12,12s12-5.38,12-12S18.62,0,12,0z M12,22C6.49,22,2,17.51,2,12S6.49,2,12,2
                s10,4.49,10,10S17.51,22,12,22z M10.5,10h3v8h-3V10z M10.5,5h3v3h-3V5z"
              ></path>
            </svg>
          </span>
        </button>
        <div class="status-options">
          <div data-status="DISPONIVEL">DISPONÍVEL</div>
          <div data-status="VENDIDO">VENDIDO</div>
          <div data-status="RESERVADO">RESERVADO</div>
        </div>
      </div>

      <div class="card-actions" style="margin-top: 16px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-editar">
          <p class="paragraph">editar</p>
          <span class="icon-wrapper">
            <svg fill="#000000" width="30px" height="30px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" class="icon">
              <path class="st0" d="M12 25l3 3 15-15-3-3-15 15zM11 26l3 3-4 1z"/>
            </svg>
          </span>
        </button>
        <button class="btn btn-deletar">
          <p class="paragraph">deletar</p>
          <span class="icon-wrapper">
            <svg width="30px" height="30px" viewBox="0 0 1024 1024" fill="#000000" class="icon" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 241.6c-11.2 0-20-8.8-20-20s8.8-20 20-20l940 1.6c11.2 0 20 8.8 20 20s-8.8 20-20 20L32 241.6zM186.4 282.4c0-11.2 8.8-20 20-20s20 8.8 20 20v688.8l585.6-6.4V289.6c0-11.2 8.8-20 20-20s20 8.8 20 20v716.8l-666.4 7.2V282.4z"/>
              <path d="M682.4 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM367.2 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM524.8 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM655.2 213.6v-48.8c0-17.6-14.4-32-32-32H418.4c-18.4 0-32 14.4-32 32.8V208h-40v-42.4c0-40 32.8-72.8 72.8-72.8H624c40 0 72.8 32.8 72.8 72.8v48.8h-41.6z"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  `;

  // adiciona listeners pros botões
  article.querySelector('.btn-editar').addEventListener('click', () => editarVeiculo(veiculo.id));
  article.querySelector('.btn-deletar').addEventListener('click', () => deletarVeiculo(veiculo.id));

  // adiciona eventos para alterar status
  article.querySelectorAll('.status-options div').forEach(div => {
    div.addEventListener('click', () => {
      const novoStatus = div.dataset.status;
      alterarStatus(veiculo.id, novoStatus);
    });
  });

  return article;
}

function alterarStatus(id, novoStatus) {
  fetch(`${API_VEICULOS}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erro ao buscar veículo: ${res.status}`);
      return res.json();
    })
    .then(veiculoExistente => {
      // Monta o mesmo objeto que o form usa
      const veiculo = {
        id: veiculoExistente.id,
        marca: veiculoExistente.marca,
        modelo: veiculoExistente.modelo,
        cor: veiculoExistente.cor,
        quilometragem: veiculoExistente.quilometragem,
        anoFabricacao: veiculoExistente.anoFabricacao,
        preco: veiculoExistente.preco,
        imagemUrl: veiculoExistente.imagemUrl,
        tipo: { id: veiculoExistente.tipo?.id },
        status: novoStatus,
        dataCadastro: veiculoExistente.dataCadastro // mantém o valor original
      };

      // PUT igual ao do submit do form
      return fetch(`${API_VEICULOS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
      });
    })
    .then(res => {
      if (!res.ok) throw new Error(`Erro ao atualizar status: ${res.status}`);
      return res.json();
    })
    .then(() => {
      console.log(`✅ Status do veículo ${id} alterado para ${novoStatus}`);
      carregarVeiculos();
    })
    .catch(err => {
      console.error('❌ Erro ao alterar status:', err);
      alert('Erro ao alterar status. Verifique o console para mais detalhes.');
    });
}







function editarVeiculo(id) {
  fetch(`${API_VEICULOS}/${id}`)
    .then(res => res.json())
    .then(veiculo => abrirModal(veiculo))
    .catch(err => console.error('Erro ao carregar veículo para edição:', err));
}

function deletarVeiculo(id) {
  if (confirm('Tem certeza que deseja deletar este veículo?')) {
    fetch(`${API_VEICULOS}/${id}`, { method: 'DELETE' })
      .then(() => {
        alert('Veículo deletado com sucesso!');
        carregarVeiculos();
      })
      .catch(err => console.error('Erro ao deletar veículo:', err));
  }
}

function abrirModal(veiculo = null) {
  document.getElementById('modal').style.display = 'block';
  document.getElementById('form-veiculo').reset();

  const botao = document.querySelector('#form-veiculo button[type="submit"]');
  const titulo = document.getElementById('modal-titulo');

  carregarTipos().then(() => {
    if (veiculo) {
      modoEdicao = true;
      veiculoEditandoId = veiculo.id;

      document.getElementById('marca').value = veiculo.marca;
      document.getElementById('modelo').value = veiculo.modelo;
      document.getElementById('cor').value = veiculo.cor;
      document.getElementById('quilometragem').value = veiculo.quilometragem;
      document.getElementById('ano').value = veiculo.anoFabricacao;
      document.getElementById('preco').value = veiculo.preco;
      document.getElementById('imagemUrl').value = veiculo.imagemUrl || '';
      document.getElementById('tipoId').value = veiculo.tipo?.id || '';

      botao.textContent = 'Salvar Alterações';
      titulo.textContent = 'Editar Veículo';
    } else {
      modoEdicao = false;
      veiculoEditandoId = null;

      botao.textContent = 'Cadastrar';
      titulo.textContent = 'Cadastrar Veículo';
    }
  });
}


function fecharModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('form-veiculo').reset();
  modoEdicao = false;
  veiculoEditandoId = null;
}

function carregarTipos() {
  const select = document.getElementById('tipoId');
  select.innerHTML = '<option value="">Carregando tipos...</option>';

  return fetch(API_TIPOS)
    .then(res => res.json())
    .then(tipos => {
      select.innerHTML = '<option value="">Selecione o tipo</option>';
      tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = tipo.nome;
        select.appendChild(option);
      });
    });
}

document.getElementById('form-veiculo').addEventListener('submit', function (e) {
  e.preventDefault();

  const marca = document.getElementById('marca').value.trim();
  const modelo = document.getElementById('modelo').value.trim();
  const cor = document.getElementById('cor').value.trim();
  const quilometragem = parseInt(document.getElementById('quilometragem').value);
  const ano = parseInt(document.getElementById('ano').value);
  const preco = parseFloat(document.getElementById('preco').value);
  const imagemUrl = document.getElementById('imagemUrl').value.trim();
  const tipoId = parseInt(document.getElementById('tipoId').value);

  if (!marca || !modelo || !cor || isNaN(quilometragem) || isNaN(ano) || isNaN(preco) || isNaN(tipoId)) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const veiculo = {
    marca,
    modelo,
    cor,
    quilometragem,
    anoFabricacao: ano,
    preco,
    imagemUrl,
    tipo: { id: tipoId }
  };

  const url = modoEdicao ? `${API_VEICULOS}/${veiculoEditandoId}` : API_VEICULOS;
  const metodo = modoEdicao ? 'PUT' : 'POST';

  fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(veiculo)
  })
    .then(res => res.json())
    .then(() => {
      fecharModal();
      carregarVeiculos();
    })
    .catch(err => {
      console.error('Erro ao salvar veículo:', err);
      alert('Erro ao salvar veículo. Verifique os dados e tente novamente.');
    });
});

function filtrarVeiculos() {
  const tipo = document.getElementById('filtroTipo').value.trim().toLowerCase();
  const status = document.getElementById('filtroStatus').value.trim().toLowerCase();
  const kmMax = parseInt(document.getElementById('filtroKm').value);

  fetch(API_VEICULOS)
    .then(res => res.json())
    .then(data => {
      const filtrados = data.filter(v => {
        const tipoMatch = tipo ? v.tipo?.nome?.toLowerCase().includes(tipo) : true;
        const statusMatch = status ? v.status?.toLowerCase().includes(status) : true;
        const kmMatch = !isNaN(kmMax) ? v.quilometragem <= kmMax : true;
        return tipoMatch && statusMatch && kmMatch;
      });

      const container = document.getElementById('veiculos-container');
      container.innerHTML = '';
      filtrados.forEach(v => container.appendChild(criarCard(v)));
    })
    .catch(err => {
      console.error('Erro ao filtrar veículos:', err);
      alert('Erro ao buscar veículos. Tente novamente.');
    });
}

function mostrarBuscaPorTipo() {
  ocultarTodasAsSecoes();
  document.getElementById('busca-por-tipo').style.display = 'block';
  document.getElementById('resultado-tipo').innerHTML = '';
  carregarBotoesTipos();
}

function carregarBotoesTipos() {
  fetch(API_TIPOS)
    .then(res => res.json())
    .then(tipos => {
      const container = document.getElementById('botoes-tipos');
      container.innerHTML = '';
      tipos.forEach(tipo => {
        const card = document.createElement('div');
        card.className = 'card-tipo';
        //card.style.backgroundImage = `url('${tipo.imagemUrl || IMAGEM_PADRAO}')`;
        const imagem = imagensPorTipo[tipo.nome.toLowerCase()] || IMAGEM_PADRAO;
        card.style.backgroundImage = `url('${imagem}')`;

        card.onclick = () => buscarVeiculosPorTipo(tipo.id);

        const overlay = document.createElement('div');
        overlay.className = 'overlay-tipo';
        overlay.textContent = tipo.nome;

        card.appendChild(overlay);
        container.appendChild(card);
      });
    })
    .catch(err => console.error('Erro ao carregar tipos:', err));
}


function buscarVeiculosPorTipo(tipoId) {
  fetch(API_VEICULOS)
    .then(res => res.json())
    .then(data => {
      const filtrados = data.filter(v => v.tipo?.id === tipoId);
      const container = document.getElementById('resultado-tipo');
      container.innerHTML = '';
      if (filtrados.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado para este tipo.</p>';
      } else {
        filtrados.forEach(v => container.appendChild(criarCard(v)));
      }
    })
    .catch(err => {
      console.error('Erro ao buscar veículos por tipo:', err);
      alert('Erro ao buscar veículos. Tente novamente.');
    });
}

const imagensPorTipo = {
  hatch: 'https://garagem360.com.br/wp-content/uploads/2022/10/EXL_3_4_Traseira_Lado_A_Azul_F01_0000s_0015_3_4_Traseira_Lado_B_azul_F01.jpg',
  sedan: 'https://image1.mobiauto.com.br/images/api/images/v1.0/2939964/transform/fl_progressive,f_webp,q_70,w_384',
  suv: 'https://www2.mercedes-benz.com.br/content/dam/hq/passengercars/cars/bodytypes-landingpages/suv/modeloverview/07-2023/images/mercedes-benz-suv-landingpage-modeloverview-696x392-07-2023.png',
  pickup: 'https://www.ford.pt/content/dam/guxeu/rhd/central/cvs/all-new-ranger-2022/features/Regular_foe_2200_gbr_scb_h1_l1_xl_4x4_die_2000cc_man_na_opt2_3cqzh_globalfrozenwhite_4%20copy.jpg.renditions.original.png',
  conversível: "https://image1.mobiauto.com.br/images/api/images/v1.0/2942249/transform/fl_progressive,f_webp,q_70,w_384",
  minivan: 'https://directimports.com.br/wp-content/uploads/2023/03/6-29.webp',
  crossover: 'https://quatrorodas.abril.com.br/wp-content/uploads/2024/02/C3X_TRASEIRA.jpg?quality=70&strip=info',
  coupe: 'https://image1.mobiauto.com.br/images/api/images/v1.0/2935086/transform/fl_progressive,f_webp,q_auto',
  elétrico: 'https://www.jacmotors.com.br/public/media//veiculos/1676044284-thumb.png',
  híbrido: 'https://www.neocharge.com.br/media/wysiwyg/caoa-chery-hybrid.jpg',
};

function mostrarBuscaPorMarca() {
  ocultarTodasAsSecoes();
  document.getElementById('busca-por-marca').style.display = 'block';
  document.getElementById('resultado-marca').innerHTML = '';
  carregarBotoesMarcas();
}

function buscarPorMarca() {

  const marca = document.getElementById('marcaBusca').value.trim().toLowerCase();
  if (!marca) {
    alert('Digite uma marca para buscar.');
    return;
  }

  fetch(API_VEICULOS)
    .then(res => res.json())
    .then(data => {
      const filtrados = data.filter(v => v.marca?.toLowerCase().includes(marca));
      const container = document.getElementById('resultado-marca');
      container.innerHTML = '';
      if (filtrados.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado para esta marca.</p>';
      } else {
        filtrados.forEach(v => container.appendChild(criarCard(v)));
      }
    })
    .catch(err => {
      console.error('Erro ao buscar veículos por marca:', err);
      alert('Erro ao buscar veículos. Tente novamente.');
    });
}

function carregarBotoesMarcas() {
  fetch(API_VEICULOS)
    .then(res => res.json())
    .then(data => {
      const marcasUnicas = [...new Set(data.map(v => v.marca?.trim()).filter(Boolean))];
      const container = document.getElementById('botoes-marcas');
      container.innerHTML = '';

      marcasUnicas.forEach(marca => {
        const marcaKey = marca.toLowerCase().replace(/\s+/g, '');
        const logoPath = `logos/${marcaKey}.svg`;

        const button = document.createElement('div');
        button.className = 'card-tipo';
        button.onclick = () => buscarVeiculosPorMarca(marca);

        const img = document.createElement('img');
        img.src = logoPath;
        img.alt = marca;
        img.className = 'logo-marca'; // 👈 controle via CSS

        const overlay = document.createElement('div');
        overlay.className = 'overlay-tipo';
        overlay.textContent = marca;

        button.appendChild(img);
        button.appendChild(overlay);
        container.appendChild(button);
      });
    })
    .catch(err => console.error('Erro ao carregar marcas:', err));
}

function buscarVeiculosPorMarca(marcaSelecionada) {
  fetch(API_VEICULOS)
    .then(res => res.json())
    .then(data => {
      const filtrados = data.filter(v => v.marca?.toLowerCase() === marcaSelecionada.toLowerCase());
      const container = document.getElementById('resultado-marca');
      container.innerHTML = '';
      if (filtrados.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado para esta marca.</p>';
      } else {
        filtrados.forEach(v => container.appendChild(criarCard(v)));
      }
    })
    .catch(err => {
      console.error('Erro ao buscar veículos por marca:', err);
      alert('Erro ao buscar veículos. Tente novamente.');
    });
}

function mostrarBuscaPorKm() {
  ocultarTodasAsSecoes();
  document.getElementById('filtroKmMin').value = '';
  document.getElementById('filtroKmMax').value = '';
  document.getElementById('filtros').style.display = 'block';

  // Mostra todos os veículos inicialmente
  filtrarVeiculos();
}

document.getElementById('filtroKmMin').addEventListener('input', filtrarVeiculos);
document.getElementById('filtroKmMax').addEventListener('input', filtrarVeiculos);

function filtrarVeiculos() {
  const kmMinInput = document.getElementById('filtroKmMin').value;
  const kmMaxInput = document.getElementById('filtroKmMax').value;

  // Converte os valores ou aplica os padrões
  const kmMin = kmMinInput ? parseInt(kmMinInput) : 0;
  const kmMax = kmMaxInput ? parseInt(kmMaxInput) : 2000000000;

  fetch(`${API_VEICULOS}/quilometragem?kmMin=${kmMin}&kmMax=${kmMax}`)
    .then(res => res.json())
    .then(veiculos => {
      const container = document.getElementById('resultado-km');
      container.innerHTML = '';

      if (veiculos.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado.</p>';
        return;
      }

      veiculos.forEach(v => container.appendChild(criarCard(v)));
    })
    .catch(err => {
      console.error('Erro ao buscar veículos:', err);
      alert('Erro ao buscar veículos. Verifique o servidor.');
    });
}

function mostrarBuscaPorStatus() {
  ocultarTodasAsSecoes();
  document.getElementById('filtro-status').style.display = 'block';
  document.getElementById('statusSelect').value = '';
  document.getElementById('resultado-status').innerHTML = '';
}

function buscarPorStatus(status) {
  const container = document.getElementById('resultado-status');
  container.innerHTML = '';

  if (status === 'TODOS') {
    carregarVeiculos(container); // Passa o contêiner onde os cards devem aparecer
    return;
  }

  const url = `${API_VEICULOS}/status?status=${status}`;

  fetch(url)
    .then(res => res.json())
    .then(veiculos => {
      if (veiculos.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado com esse status.</p>';
        return;
      }

      veiculos.forEach(v => container.appendChild(criarCard(v)));
    })
    .catch(err => {
      console.error('Erro ao buscar veículos por status:', err);
      alert('Erro ao buscar veículos. Verifique o servidor.');
    });
}

function mostrarBuscaPorPreco() {
  ocultarTodasAsSecoes();
  document.getElementById('filtroPrecoMin').value = '';
  document.getElementById('filtroPrecoMax').value = '';
  document.getElementById('filtro-preco').style.display = 'block';

  // Mostra todos os veículos inicialmente
  filtrarPorPreco();
}

document.getElementById('filtroPrecoMin').addEventListener('input', filtrarPorPreco);
document.getElementById('filtroPrecoMax').addEventListener('input', filtrarPorPreco);

function filtrarPorPreco() {
  const precoMinInput = document.getElementById('filtroPrecoMin').value;
  const precoMaxInput = document.getElementById('filtroPrecoMax').value;

  const precoMin = precoMinInput ? parseFloat(precoMinInput) : 0;
  const precoMax = precoMaxInput ? parseFloat(precoMaxInput) : 100000000;

  fetch(`${API_VEICULOS}/preco?min=${precoMin}&max=${precoMax}`)
    .then(res => res.json())
    .then(veiculos => {
      const container = document.getElementById('resultado-preco');
      container.innerHTML = '';

      if (veiculos.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado.</p>';
        return;
      }

      veiculos.forEach(v => container.appendChild(criarCard(v)));
    })
    .catch(err => {
      console.error('Erro ao buscar veículos por preço:', err);
      alert('Erro ao buscar veículos. Verifique o servidor.');
    });
}

function mostrarBuscaPorAno() {
  ocultarTodasAsSecoes();
  document.getElementById('filtroAnoMin').value = '';
  document.getElementById('filtroAnoMax').value = '';
  document.getElementById('filtro-ano').style.display = 'block';

  // Mostra todos os veículos inicialmente
  filtrarPorAno();
}

document.getElementById('filtroAnoMin').addEventListener('input', filtrarPorAno);
document.getElementById('filtroAnoMax').addEventListener('input', filtrarPorAno);

function filtrarPorAno() {
  const anoMinInput = document.getElementById('filtroAnoMin').value;
  const anoMaxInput = document.getElementById('filtroAnoMax').value;

  const anoMin = anoMinInput ? parseInt(anoMinInput) : 1900;
  const anoMax = anoMaxInput ? parseInt(anoMaxInput) : 2100;

  fetch(`${API_VEICULOS}/ano?anoMin=${anoMin}&anoMax=${anoMax}`)
    .then(res => res.json())
    .then(veiculos => {
      const container = document.getElementById('resultado-ano');
      container.innerHTML = '';

      if (veiculos.length === 0) {
        container.innerHTML = '<p>Nenhum veículo encontrado.</p>';
        return;
      }

      veiculos.forEach(v => container.appendChild(criarCard(v)));
    })
    .catch(err => {
      console.error('Erro ao buscar veículos por ano:', err);
      alert('Erro ao buscar veículos. Verifique o servidor.');
    });
}

function mostrarBuscaPorModelo() {
  ocultarTodasAsSecoes();
  document.getElementById('busca-por-modelo').style.display = 'block';

  carregarBotoesModelos(); // ✅ usa a função padronizada
}

function carregarBotoesModelos() {
  const container = document.getElementById('botoes-modelos');
  container.className = 'status-buttons'; // aplica o layout flexível
  container.innerHTML = '<p>Carregando modelos...</p>';

  fetch(API_VEICULOS)
    .then(res => {
      if (!res.ok) throw new Error('Erro na resposta da API');
      return res.json();
    })
    .then(data => {
      const modelosUnicos = [...new Set(data.map(v => v.modelo?.trim()).filter(Boolean))];
      container.innerHTML = '';

      if (modelosUnicos.length === 0) {
        container.innerHTML = '<p>Nenhum modelo cadastrado.</p>';
        return;
      }

      modelosUnicos.forEach(modelo => {
        const button = document.createElement('button');
        button.className = 'animated-button';
        button.onclick = () => buscarPorModelo(modelo);

        button.innerHTML = `
          <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
          <span class="text">${modelo}</span>
          <span class="circle"></span>
          <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
        `;

        container.appendChild(button);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar modelos:', err);
      container.innerHTML = '<p>Erro ao carregar modelos. Verifique o servidor.</p>';
    });
}

function buscarPorModelo(modelo) {
  const container = document.getElementById('resultado-modelo');
  container.innerHTML = `<p>Carregando veículos do modelo "${modelo}"...</p>`;

  fetch(`${API_VEICULOS}/modelo?nome=${encodeURIComponent(modelo)}`)
    .then(res => {
      if (!res.ok) throw new Error('Erro na resposta da API');
      return res.json();
    })
    .then(veiculos => {
      container.innerHTML = '';

      if (!Array.isArray(veiculos) || veiculos.length === 0) {
        container.innerHTML = `<p>Nenhum veículo encontrado para o modelo "${modelo}".</p>`;
        return;
      }

      veiculos.forEach(v => container.appendChild(criarCard(v)));
    })
    .catch(err => {
      console.error('Erro ao buscar veículos por modelo:', err);
      container.innerHTML = '<p>Erro ao buscar veículos. Verifique o servidor.</p>';
    });
}

// Inicializa com a página inicial
mostrarHome();