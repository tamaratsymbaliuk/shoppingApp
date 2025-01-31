class Product {
    title = 'DEFAULT';
    imageUrl;
    description;
    price;

    constructor(title, image, desc, price) {
        this.title = title;
        this.imageUrl = image;
        this.description = desc;
        this.price = price;

    }
}

class ShoppingCart {
    items = [];

    addProduct(product) {
        this.items.push(product);
        // innerHTML sets new HTML content for that specific <h2> element only, so it updates the <h2> tag but the button is unchanged.
        this.totalOutput.innerHTML = `<h2>Total: \$${1}</h2>`;
        
    }

    render() {
        const cartEl = document.createElement('section');
        cartEl.className = 'cart'; 
        cartEl.innerHTML = ` 
          <h2>Total: \$${0}</h2>
          <button>Order Now!</button>
        `;
        // creating new property for ShoppingCart class to store and render Total, can be created inside function 
        this.totalOutput = cartEl.querySelector('h2'); // only returns first h2 tag it finds <h2>Total: \$${0}</h2>
        return cartEl;

    }
}

// Represents a single product item in the list
class ProductItem {
    constructor(product) {
        this.product = product;
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = document.createElement('li');
        prodEl.className = 'product-item';
        prodEl.innerHTML = `
        <div>
          <img src="${this.product.imageUrl}" alt="${this.product.title}" >
          <div class="product-item__content">
           <h2>${this.product.title}</h2>
           <h3>\$${this.product.price}</h3>
           <p>${this.product.description}</p>
           <button>Add to Cart</button>
           </div>
        </div>
        `;
        const addCartButton = prodEl.querySelector('button');
        addCartButton.addEventListener('click', this.addToCart.bind(this)); // using bind(this) to call the instance of the product
        return prodEl;
    }

}

class ProductList {
     products = [
        new Product('A Pillow', 'https://www.ikea.com/us/en/images/products/lapptatel-pillow-side-back-sleeper__0789272_pe763901_s5.jpg',55.99,'a soft pillow!'),
        new Product('A Carpet','https://carpet-rug.org/wp-content/uploads/2018/06/macro-2573557_1920-1024x576.jpg', 155.99, 'a carpet you will like!')
 ];

 constructor() {}

 render() {  
    const prodList = document.createElement('ul');
    prodList.className = 'product-list';
    for (const prod of this.products) {
        const productItem = new ProductItem(prod);
        const prodEl = productItem.render();
        prodList.append(prodEl);
    }
    return prodList;
 }
}

class Shop { // our app
    render() {        
    const renderHook = document.getElementById('app');
    
    this.cart = new ShoppingCart(); // so it's a property of Shop
    const cartEl = this.cart.render();   
    const productList = new ProductList();
    const prodListEl = productList.render();

    renderHook.append(cartEl);
    renderHook.append(prodListEl);
   }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        shop.render();
        this.cart = shop.cart;     
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);

    }
}

App.init();
