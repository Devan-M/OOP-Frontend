const API_VEICULOS = 'http://localhost:8080/veiculos';
const API_TIPOS = 'http://localhost:8080/tipos';
const IMAGEM_PADRAO = 'https://www.kikos.com.br/media/catalog/product/placeholder/default/sem-foto.jpg';

let modoEdicao = false;
let veiculoEditandoId = null;

function mostrarHome() {
  document.getElementById('home').style.display = 'block';
  document.getElementById('veiculos-container').style.display = 'none';
  document.getElementById('filtros').style.display = 'none';
}

function mostrarLista() {
  document.getElementById('home').style.display = 'none';
  document.getElementById('veiculos-container').style.display = 'flex';
  document.getElementById('filtros').style.display = 'none';
  document.getElementById('busca-por-tipo').style.display = 'none';
  carregarVeiculos();
}

function carregarVeiculos() {
  fetch(API_VEICULOS)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('veiculos-container');
      container.innerHTML = '';
      data.forEach(veiculo => {
        container.appendChild(criarCard(veiculo));
      });
    })
    .catch(err => console.error('Erro ao carregar veículos:', err));
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
        <div class="project-hover" onclick="editarVeiculo(${veiculo.id})">✏️</div>
      </div>
      <div class="types">
        <span class="project-type">Cor: ${veiculo.cor}</span>
        <span class="project-type">Ano: ${veiculo.anoFabricacao}</span>
        <span class="project-type">KM: ${veiculo.quilometragem}</span>
        <span class="project-type">Preço: ${precoFormatado}</span>
        <span class="project-type">Tipo: ${veiculo.tipo?.nome || 'N/A'}</span>
        <span class="project-type">Status: ${veiculo.status || 'N/A'}</span>
        <span class="project-type" style="background-color:#f44336; color:white; cursor:pointer;" onclick="deletarVeiculo(${veiculo.id})">🗑️ Deletar</span>
      </div>
    </div>
  `;
  return article;
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
  carregarTipos();

  const botao = document.querySelector('#form-veiculo button[type="submit"]');

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
  } else {
    modoEdicao = false;
    veiculoEditandoId = null;
    botao.textContent = 'Cadastrar';
  }
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('form-veiculo').reset();
  modoEdicao = false;
  veiculoEditandoId = null;
}

function carregarTipos() {
  fetch(API_TIPOS)
    .then(res => res.json())
    .then(tipos => {
      const select = document.getElementById('tipoId');
      select.innerHTML = '<option value="">Selecione o tipo</option>';
      tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = tipo.nome;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Erro ao carregar tipos:', err));
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
  document.getElementById('home').style.display = 'none';
  document.getElementById('veiculos-container').style.display = 'none';
  document.getElementById('filtros').style.display = 'none';
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

// Inicializa com a página inicial
mostrarHome();