const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
let produtos = [];

// Helper para converter "R$ 1.299,00" em 1299.00
function parsePrice(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/[^\d,]/g, '').replace(',', '.'));
}

async function carregarProdutos() {
    const url = `produtos.json?t=${Date.now()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('JSON não encontrado.');
        produtos = await response.json();
        renderProducts(produtos);
    } catch (error) {
        productsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;"><h2 style="color: #ff453a;">⚠️ Nenhum produto cadastrado</h2><p style="color: var(--text-secondary);">Use o gerador para criar o produtos.json</p></div>`;
    }
}

function renderProducts(lista) {
    productsGrid.innerHTML = '';
    if (lista.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">Nenhum produto encontrado.</p>';
        return;
    }

    lista.forEach(produto => {
        const oldP = parsePrice(produto.precoAntigo);
        const newP = parsePrice(produto.precoAtual);
        const discount = oldP > 0 && oldP > newP ? Math.round((1 - newP / oldP) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Texto do WhatsApp
        const shareText = encodeURIComponent(`🔥 Oferta: ${produto.titulo}\nDe ${produto.precoAntigo} por ${produto.precoAtual}\nVeja aqui: ${produto.link}`);
        const shareUrl = `https://wa.me/?text=${shareText}`;

        card.innerHTML = `
            <div class="product-image-wrapper">
                ${discount > 0 ? `<span class="badge-discount">-${discount}% OFF</span>` : ''}
                ${produto.recomendado ? `<span class="badge-fellipe"><i class="fas fa-star"></i> Fellipe Recomenda</span>` : ''}
                <a href="${shareUrl}" target="_blank" class="btn-share" title="Compartilhar no WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <img src="${produto.imagem}" alt="${produto.titulo}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-badge">${produto.destaque}</span>
                <h3 class="product-title">${produto.titulo}</h3>
                ${produto.expiraEm ? `<div class="countdown" data-expira="${produto.expiraEm}"><i class="fas fa-clock"></i> <span class="timer-text">Carregando...</span></div>` : ''}
                <div class="product-price">
                    <div class="old-price">De ${produto.precoAntigo}</div>
                    <div class="current-price">${produto.precoAtual}</div>
                </div>
                <a href="${produto.link}" target="_blank" rel="noopener noreferrer" class="btn-amazon">Ver oferta na Amazon →</a>
            </div>
        `;
        productsGrid.appendChild(card);
    });
    
    iniciarCountdowns();
}

function iniciarCountdowns() {
    const timers = document.querySelectorAll('.countdown');
    if (timers.length === 0) return;

    const atualizar = () => {
        timers.forEach(timer => {
            const expiraEm = new Date(timer.dataset.expira).getTime();
            const agora = new Date().getTime();
            const diff = expiraEm - agora;

            if (diff <= 0) {
                timer.closest('.product-card').style.opacity = '0.5';
                timer.innerHTML = '<i class="fas fa-times-circle"></i> Oferta encerrada';
                return;
            }

            const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segs = Math.floor((diff % (1000 * 60)) / 1000);

            let texto = '';
            if (dias > 0) texto = `${dias}d ${horas}h`;
            else texto = `${horas}h ${mins}m ${segs}s`;

            timer.querySelector('.timer-text').innerText = `Acaba em: ${texto}`;
        });
    };

    atualizar();
    setInterval(atualizar, 1000);
}

// Filtros e Busca
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        renderProducts(cat === 'all' ? produtos : produtos.filter(p => p.categoria === cat));
    });
});

searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    renderProducts(produtos.filter(p => p.titulo.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)));
});

carregarProdutos();