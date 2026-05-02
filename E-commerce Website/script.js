let cart = [];

function addToCart(productName) {
cart.push(productName);
updateCart();
}

function updateCart() {
document.getElementById("cart-count").innerText = cart.length;

```
let cartItems = document.getElementById("cart-items");
cartItems.innerHTML = "";

cart.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item;
    cartItems.appendChild(li);
});
```

}
