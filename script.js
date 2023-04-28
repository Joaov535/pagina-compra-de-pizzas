let modalQt;
let cart = [];
let modalKey;

const qs = (e) => document.querySelector(e);
const qsAll = (e) => document.querySelectorAll(e);


// Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--img IMG').src = item.img;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        // Resetando valor de modalQt
        modalQt = 1;
        // Salvando qual pizza é na variável
        modalKey = key;

        //Preenchendo as informações da pizza clicada
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`;
        // Removendo a classe selecionada
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        qs('.pizzaInfo--qt').innerHTML = modalQt;

        // Abrir o modal
        qs('.pizzaWindowArea').style.display = 'flex';
        qs('.pizzaWindowArea').style.opacity = 0;
        setTimeout(() => qs('.pizzaWindowArea').style.opacity = 1, 100);
    });

    qs('.pizza-area').append(pizzaItem);
});


// Eventos do MODAL

function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

// usando qsAll retorna um nodeList
// sendo assim temos que usar o forEach para adicionar o evento em cada item
// a função recebe 2 parâmetros, item e indice
qsAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

// Adicionando mais itens

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt == 1) return;
    modalQt -= 1;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt += 1;
    qs('.pizzaInfo--qt').innerHTML = modalQt;

});

// Selecionando tamanho da pizza

qsAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {
        //primeiro removemos a classe marcada
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        // Depois adicionamos a classe selected a div clicada
        size.classList.add('selected');
    });
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    // Adicionando um identificador
    let identifier = pizzaJson[modalKey].id + '@' + size;

    //Verificando se há uma pizza igual
    let k = cart.findIndex((item) => item.identifier == identifier) //O método findIndex() retorna o índice no array do primeiro elemento que satisfizer a função de teste provida. Caso contrário, retorna -1, indicando que nenhum elemento passou no teste.

    if (k > -1) {
        cart[k].qt += modalQt;
        closeModal();
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

// Abrindo e fechando carrinho no mobile

qs('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        qs('aside').style.left = '0';
    }
})

qs('.menu-closer').addEventListener('click', () => {
        qs('aside').style.left = '100vw';
})

function updateCart() {

    qs('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        cart.map((cItem, index) => {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[index].id);
            subtotal += pizzaItem.price * cart[index].qt;

            // A cada iteração sobre um item de cart, clonamos a estrutura do html e preenchemos
            let cartItem = qs('.models .cart--item').cloneNode(true); // <- elemento html criado dinâmicamente

            let pizzaSizeName;

            switch (cart[index].size) {
                case 0:
                    pizzaSizeName = '(Pequena)';
                    break;
                case 1:
                    pizzaSizeName = '(Média)';
                    break;
                case 2:
                    pizzaSizeName = '(Grande)';
                    break;
            }

            let pizzaName = `${pizzaItem.name} ${pizzaSizeName}`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[index].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[index].qt > 1) {
                    cart[index].qt--;
                } else {
                    cart.splice(index, 1);

                }
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[index].qt++;
                updateCart();
            })

            qs('.cart').append(cartItem);
        })

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.', ',')}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`;

    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}
