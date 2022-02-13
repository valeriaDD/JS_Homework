"use strict"

let productsDisplayHTML;

function cartProductTemplate(product, total){

    return `
    <li cart-products-row class="_grid shopping-cart--list-item" id = "product-${product.id}">
        <div class="_column product-image">
            <img class="product-image--img" width="130" height="150" src="${product.image}" alt="Item image" />
        </div>
        <div class="_column product-info">
            <p>${product.title}</p>
            <div class="price product-single-price">$${product.price}</div>
        </div>
        <div class="_column product-modifiers" data-product-price="{{=${product.price}}}">
            <div class="_grid">
            <button onclick = minusProduct(${product.id})  id = "minus" class="_btn _column product-subtract">&minus;</button>
            <div class="_column product-qty">${total}</div>
            <button onclick = plusProduct(${product.id})  id = "plus" class="_btn _column product-plus">&plus;</button>
            </div>
            <button onclick = removeProduct(${product.id}) id = "remove"class="_btn entypo-trash product-remove">Remove</button>
            <div class="price product-total-price">$${product.price*total}</div>
        </div>
    </li>
    `
}

async function updateCartTotalVariable(){
    let cartVariablePlace = document.querySelector('[cart-variable]');
    cartVariablePlace.innerHTML = JSON.parse(localStorage.getItem('FavItems')).length;
}

function findProduct(storageKey ,id){
    let product = JSON.parse(localStorage.getItem(storageKey))
    .filter(product => 
        product.id == id
        )
    return product;
}

function fetchCartProducts(){
    let countProduct = {} 
    productsDisplayHTML = ''
    countProduct = countProductsById(); 

    let cartList = document.querySelector('[cart-products-ol]');

    for (var key in countProduct) {
        let total = countProduct[key]
        let  product = findProduct("FavItems", key)
        productsDisplayHTML += cartProductTemplate(product[0], total);   
    }
    cartList.innerHTML = productsDisplayHTML;
    updateCartTotalVariable()
}

function countProductsById(){
    let cart = []
    let productIdNrs = {}
    cart = JSON.parse(localStorage.getItem('FavItems'));

    cart.forEach(product => {
        if (productIdNrs.hasOwnProperty(product["id"])) {
            productIdNrs[product["id"]] += 1 
        }else{
            productIdNrs[product["id"]] = 1 
        }  
    })
    

    return productIdNrs
}


async function removeProduct(id){
    let cartItems = JSON.parse(localStorage.getItem('FavItems'));
    let products = cartItems.filter(product => product.id !== id );

    localStorage.setItem('FavItems', JSON.stringify(products)); 
    fetchCartProducts();
}

async function minusProduct(id){
    let onlyProductsId = []
    let newCartItems = []

    let cartItems = JSON.parse(localStorage.getItem('FavItems'));
    let withoutProductsId = cartItems.filter(product => product.id !== id );
    onlyProductsId = cartItems.filter(product => product.id === id );

    if(onlyProductsId.length > 1){
        onlyProductsId.pop()
        newCartItems = [...[...withoutProductsId, ...onlyProductsId]];
        localStorage.setItem('FavItems', JSON.stringify(newCartItems))
    }else{
        removeProduct(id);
    }
    fetchCartProducts();
    
}

async function plusProduct(id){
    let newCartItems = [] 

    let cartItems = localStorage.getItem('FavItems')
    let newProduct = findProduct('FavItems', id)
    
    newCartItems.push(...JSON.parse(cartItems))
    newCartItems.push(newProduct[0])

    localStorage.setItem('FavItems', JSON.stringify(newCartItems))
    fetchCartProducts();
}


updateCartTotalVariable().then(fetchCartProducts())
