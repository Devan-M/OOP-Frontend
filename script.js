const API_VEICULOS = 'http://localhost:8080/veiculos';
const API_TIPOS = 'http://localhost:8080/tipos';
const IMAGEM_PADRAO = 'https://www.kikos.com.br/media/catalog/product/placeholder/default/sem-foto.jpg';

let modoEdicao = false;
let veiculoEditandoId = null;

function mostrarLista() {
  document.getElementById('veiculos-container').style.display = 'flex';
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

  const imagem = veiculo.imagemUrl && veiculo.imagemUrl.trim() !== ''
    ? veiculo.imagemUrl
    : IMAGEM_PADRAO;

  const article = document.createElement('article');
  article.className = 'article-wrapper';
  article.innerHTML = `
    <div class="rounded-lg container-project" style="background-image: url('${imagem}');"></div>
    <div class="project-info">
      <div class="flex-pr">
        <div class="project-title text-nowrap">${veiculo.marca} - ${veiculo.modelo}</div>
        <div class="project-hover" onclick="editarVeiculo(${veiculo.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><line y2="12" x2="19" y1="12" x1="5"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>
      </div>
      <div class="types">
        <span class="project-type">Cor: ${veiculo.cor}</span>
        <span class="project-type">Ano: ${veiculo.anoFabricacao}</span>
        <span class="project-type">KM: ${veiculo.quilometragem}</span>
        <span class="project-type">Preço: ${precoFormatado}</span>
        <span class="project-type">Tipo: ${veiculo.tipo?.nome || 'N/A'}</span>
        <span class="project-type" style="background-color:#f44336; color:white; cursor:pointer;" onclick="deletarVeiculo(${veiculo.id})">Deletar</span>
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
    .catch(err => console.error('Erro ao salvar veículo:', err));
});

mostrarLista();