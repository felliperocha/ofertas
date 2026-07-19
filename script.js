// ==========================================
// CONFIGURAÇÃO E VARIÁVEIS GLOBAIS
// ==========================================
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
let produtos = []; // Array vazio, será preenchido pelo fetch

// ==========================================
// CARREGAR PRODUTOS DO ARQUIVO JSON
// ==========================================
async function carregarProdutos() {
    // O ?t=Date.now() força o navegador a buscar o arquivo novo, evitando cache do GitHub Pages
    const url = `produtos.json?t=${Date.now()}`; 
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Arquivo produtos.json não encontrado.');
        
        produtos = await response.json();
        renderProducts(produtos);
    } catch (error) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h2 style="color: #ff453a; margin-bottom: 16px;">⚠️ Nenhum produto cadastrado ainda</h2>
                <p style="color: var(--text-secondary);">Use o <strong>gerador.html</strong> para criar seu arquivo <code>produtos.json</code> e faça upload para o GitHub.</p>
            </div>
        `;
        console.error('Erro ao carregar JSON:', error);
    }
}

// ==========================================
// LÓGICA DE RENDERIZAÇÃO
// ==========================================
function renderProducts(lista) {
    productsGrid.innerHTML = '';
    
    if (lista.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    lista.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.titulo}" class="product-image" loading="lazy">
            <div class="product-info">
                <span class="product-badge">${produto.destaque}</span>
                <h3 class="product-title">${produto.titulo}</h3>
                <div class="product-price">
                    <div class="old-price">De ${produto.precoAntigo}</div>
                    <div class="current-price">${produto.precoAtual}</div>
                </div>
                <a href="${produto.link}" target="_blank" rel="noopener noreferrer" class="btn-amazon">
                    Ver oferta na Amazon →
                </a>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// ==========================================
// FILTROS E BUSCA
// ==========================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const categoria = btn.getAttribute('data-category');
        if (categoria === 'all') {
            renderProducts(produtos);
        } else {
            const filtrados = produtos.filter(p => p.categoria === categoria);
            renderProducts(filtrados);
        }
    });
});

searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = produtos.filter(p => 
        p.titulo.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );
    renderProducts(filtrados);
});

// Iniciar o site
carregarProdutos();