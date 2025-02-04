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

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) {
            this.render(); // used the render method of subclasses
        }
    }

    render() {}


    createRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;

    }
}

class ShoppingCart extends Component {
    items = [];

    set cartItems(value) {
        this.items = value;
        // innerHTML sets new HTML content for that specific <h2> element only, so it updates the <h2> tag but the button is unchanged.
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }

    get totalAmount() {
        const sum = this.items.reduce((prevValue, curItem) => prevValue + curItem.price, 0);
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId);
    }
 
    addProduct(product) {
        const updatedItems = [...this.items]; // copy of items
        updatedItems.push(product);
        this.cartItems = updatedItems;
    }

    orderProducts() {
        console.log('Ordering...');
        console.log(this.items);
    }

    render() {
        const cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = ` 
          <h2>Total: \$${0}</h2>
          <button>Order Now!</button>
        `;
        const orderButton = cartEl.querySelector('button');
        orderButton.addEventListener('click', () => this.orderProducts()); // wraping in the arrow function ensures this is not reffered to the button
        // creating new property for ShoppingCart class to store and render Total, can be created inside function 
        this.totalOutput = cartEl.querySelector('h2'); // only returns first h2 tag it finds <h2>Total: \$${0}</h2>
    }
}

// Represents a single product item in the list
class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement('li', 'product-item');
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
    }

}

class ProductList extends Component {
     #products = [];

 constructor(renderHookId) {
     super(renderHookId, false);
     this.render();
     this.fetchProducts();
 }

 fetchProducts() {
     this.#products = [
        new Product('A Pillow', 'https://www.ikea.com/us/en/images/products/lapptatel-pillow-side-back-sleeper__0789272_pe763901_s5.jpg','a soft pillow!', 55.99),
        new Product('A Carpet','https://carpet-rug.org/wp-content/uploads/2018/06/macro-2573557_1920-1024x576.jpg', 'a carpet you will like!', 155.99,)
     ];

     this.renderProducts();
 }

 renderProducts() {
     for (const prod of this.#products) {
        new ProductItem(prod, 'prod-list');
        //const productItem = new ProductItem(prod, 'prod-list');
       // productItem.render(); // calling render() on each ProductItem, appending the result to the <ul> list.
 }
}

 render() {  
    this.createRootElement('ul', 'product-list', [new ElementAttribute('id', 'prod-list')]);
    if (this.#products && this.#products.length > 0) {
        this.renderProducts();
    }  
  }
 }


class Shop { // our app

    constructor() {
        this.render();
    }


    render() {           
    this.cart = new ShoppingCart('app'); // so it's a property of Shop
    new ProductList('app');
   }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        this.cart = shop.cart; // Assigns shop.cart to App.cart
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);

    }
}

App.init();
