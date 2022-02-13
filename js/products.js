"use strict"

let products = [];

function getProductTemplate(product) {

    let star = `<div class='bi-star-fill'></div>`;

    for(let i = 1; i < product.stars; i++){
        star += `<div class='bi-star-fill'></div>`
    }

    let element = `
    <div class="col mb-5">
    <div class="card h-100" id ="product-${product.id}">
        <!-- Product image-->
        <img class="card-img-top" src="${product.image}" alt="..." />
        <!-- Product details-->
        <div class="card-body p-4">
            <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">${product.title}</h5>
                <!-- Product reviews-->
                <div class="d-flex justify-content-center small text-warning mb-2" id = 'add_here'>
                ${star} 
                </div>
                <!-- Product price-->
                ${product.price}$
            </div>
        </div>
        <!-- Product actions-->
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><button onclick = addToCart(${product.id}) class="add-to-cart btn btn-outline-dark mt-auto" >Add to cart</button>
            </div>
        </div>
    </div>
</div>
    `;
    return element;
}


async function fetchProducts() {
    let products = localStorage.getItem('products');

    if (products === null) {
        const response = await fetch('https://fakestoreapi.com/products')
        const result = await response.json();

        products = result.map((product) =>{
            return {
                id: product.id,
                title: product.title,
                image: product.image,
                price:product.price,
                stars: Math.round(product.rating.rate)
            }
        })

        localStorage.setItem('products', JSON.stringify(products))
    }
    return JSON.parse(products) || products
}




function findProduct(storageKey ,id){
    let product = JSON.parse(localStorage.getItem(storageKey))
    .filter(product => 
        product.id === id
        )
    return product;
}

async function updateFavItems(product){
    let favItems = [] 
    let favList = localStorage.getItem('FavItems')

    if(favList)
        favItems.push(...JSON.parse(favList))
    
    favItems.push(product[0])
    localStorage.setItem('FavItems', JSON.stringify(favItems))
    return favList
}


function updateCartTotalVariable(){
     let cartVariablePlace = document.querySelector('[cart-variable]');
     cartVariablePlace.innerHTML = JSON.parse(localStorage.getItem('FavItems')).length;
}

function addToCart(id){
    let product = findProduct('products', id)
    updateFavItems(product).then(updateCartTotalVariable())   
}

function showProducts(){
    const productRow = document.querySelector('[data-products-row]');
    fetchProducts().then((products)=>{

        products.forEach(element => {
        productRow.innerHTML += getProductTemplate(element);
    }
    )})
    updateCartTotalVariable()
}


showProducts()
