// ==========================================
// BASE DE DADOS DE PRODUTOS
// Adicione novos produtos aqui seguindo o modelo!
// ==========================================
const produtos = [
    {
        id: 1,
        titulo: "Kindle 11ª Geração 16GB",
        imagem: "https://m.media-amazon.com/images/I/51QCk82iGcL._AC_SL1000_.jpg",
        precoAntigo: "R$ 499,00",
        precoAtual: "R$ 374,00",
        link: "https://www.amazon.com.br/dp/B09SWW583J?tag=seutag-20", // Substitua pelo seu link de afiliado
        categoria: "Livros",
        destaque: "Mais Vendido"
    },
    {
        id: 2,
        titulo: "Teclado Mecânico Redragon Kumara RGB",
        imagem: "https://m.media-amazon.com/images/I/71VbQaRk+ZL._AC_SL1500_.jpg",
        precoAntigo: "R$ 289,90",
        precoAtual: "R$ 219,90",
        link: "https://www.amazon.com.br/dp/B019O9BLVY?tag=seutag-20",
        categoria: "Tech",
        destaque: "Oferta"
    },
    {
        id: 3,
        titulo: "Cadeira Ergonômica Flexform",
        imagem: "https://m.media-amazon.com/images/I/61k1+gKqZwL._AC_SL1500_.jpg",
        precoAntigo: "R$ 1.299,00",
        precoAtual: "R$ 899,00",
        link: "https://www.amazon.com.br/dp/B08C7KQZJ9?tag=seutag-20",
        categoria: "Casa",
        destaque: "Frete Grátis"
    },
    ,
    {
        id: 4,
        titulo: "Smartphone Motorola G86 256GB Grafite 5G 8GB+8GB RAM Boost Inteligente 6,7" Câm. Dupla + Selfie 32MP",
        imagem: "https://a-static.mlcdn.com.br/800x560/smartphone-motorola-g86-256gb-grafite-5g-8gb-8gb-ram-boost-inteligente-67-cam-dupla-selfie-32mp/magazineluiza/240248200/e0b6f0e3d6e5d3622c2761f977278644.jpg",
        precoAntigo: "1987,00",
        precoAtual: "1799,10",
        link: "https://www.magazinevoce.com.br/magazinefellipesantos/smartphone-motorola-g86-256gb-grafite-5g-8gb-8gb-ram-boost-inteligente-67-cam-dupla-selfie-32mp/p/240248200/te/mg86/",
        categoria: "Tech",
        destaque: "Smartphone Motorola G86 256GB Grafite 5G 8GB+8GB RAM Boost"
    }
];

// ==========================================
// LÓGICA DE RENDERIZAÇÃO
// ==========================================
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderProducts(lista) {
    productsGrid.innerHTML = '';
    
    if (lista.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">Nenhum produto encontrado.</p>';
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

// Filtro por Categoria
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

// Busca em Tempo Real
searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = produtos.filter(p => 
        p.titulo.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );
    renderProducts(filtrados);
});

// Renderização inicial
renderProducts(produtos);
