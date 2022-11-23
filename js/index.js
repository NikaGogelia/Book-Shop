"use strict";
// Main DOM Variables
const header = document.querySelector("header");
const main = document.querySelector("main");

// Main Variables
let data = [];
let cartItems = [];

// Fetch Data Function
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const message = `Error Occurred: Page Not Found ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    main.innerHTML = `<h1>${error}</h1>`;
  }
};

// ------------------------ Header Block ------------------------ //
header.innerHTML = `
<div>
    <nav class="navbar">
        <div class="nav-brand">
            <i class="fa-solid fa-book-open"></i>
        </div>
    </nav>
    <div
        class="banner-div"
    >
        <h1>best programming books are waiting for you</h1>
        <div class="scrolldown">
            <div class="chevrons">
              <div class="chevrondown"></div>
              <div class="chevrondown"></div>
            </div>
        </div>
    </div>
</div>
`;

// Header Block DOM Variables
const scrollDown = document.querySelector(".scrolldown");

// Scroll Down Feature
scrollDown.addEventListener("click", () => (window.location = "#books"));

// ------------------------ Main Block ------------------------ //
main.innerHTML = `
<div>
    <div class="header">
      <h1>book catalog</h1>
      <div class="cart-button">
        <p>Cart Items</p>
        <div class="cart-items-number-div">
          <i class="fa-solid fa-bag-shopping"></i>
          <div class="cart-items-number">0</div>
        </div>
      </div>
    </div>
    <div class="mini-cart">
      <div class="mini-cart-attributes">
        <h4>No Items Added</h4>
      </div>
      <div>
        <div>
          <button class="confirm-order">Confirm Order</button>
          <button class="clear-all" onclick="deleteItem(\` \`, \`clearCartList\` )">Clear All</button>
        </div>
        <p class="total-price mb-0">Total: $ 0</p>
      </div>
    </div>
    <div class="book-catalog-div"></div>

    <div class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title">Book Description</h1>
          </div>
          <div class="modal-body">
            <img src="" class="modal-img" alt="modal-img" />
            <div>
              <h5 class="modal-name"></h5>
              <p class="modal-author"></p>
              <p class="modal-description"></p>
              <p class="modal-price"></p>
            </div>
          </div>
          <div class="modal-footer">
          <button class="close" onclick="modalToggle()">Close</button>
        </div>
      </div>
    </div>
</div>

</div>
`;

// Fetch Data From JSON File
// fetchData("../data/data.json").then((res) => {
//   data = res;
//   renderBooks(data);
// });

fetchData("https://nikagogelia.github.io/data/data.json").then((res) => {
  data = res;
  renderBooks(data);
});

// Main Block DOM Variables
const booksDiv = document.querySelector(".book-catalog-div");
const cartButton = document.querySelector(".cart-button");
const cartItemNumber = document.querySelector(".cart-items-number");
const miniCart = document.querySelector(".mini-cart");
const miniCartAttr = document.querySelector(".mini-cart-attributes");
const totalPriceContainer = document.querySelector(".total-price");
const confirmOrderButton = document.querySelector(".confirm-order");
const modal = document.querySelector(".modal");
const modalImage = document.querySelector(".modal-img");
const modalHeader = document.querySelector(".modal-name");
const modalAuthor = document.querySelector(".modal-author");
const modalDescription = document.querySelector(".modal-description");
const modalPrice = document.querySelector(".modal-price");

// Render Books
const renderBooks = (data) => {
  if (data !== []) {
    data.map((item, index) => {
      const card = document.createElement("div");
      const fragment = new DocumentFragment();
      const { author, imageLink, title, price } = item;

      card.classList = "card";
      card.setAttribute("draggable", "true");
      card.setAttribute("title", "Drop Book Into Cart");
      card.id = index;
      card.innerHTML = `
      <img src=${imageLink} class="card-img" alt="${title}-image" draggable="false" />
      <div class="card-body">
        <div>
          <h5 class="card-text">${title}</h5>
          <p class="card-text">${author}</p>
          <p class="card-text">$ ${price}</p>
        </div>
        <div>
          <button class="show-more" onclick="modalToggle(${index});">Show More</button>
          <button class="add-to-cart" onclick="addToCart(${index})">Add To Cart</button>
        </div>
      </div>
      `;

      fragment.append(card);
      booksDiv.append(fragment);
    });
    dragAndDrop();
  } else {
    booksDiv.innerHTML = "";
  }
};

// Render Cart Items
const renderCartItems = (items) => {
  let totalPrice = 0;
  totalPriceContainer.innerHTML = `Total: $ ${totalPrice}`;
  miniCartAttr.innerHTML = "";
  if (items.length !== 0) {
    const fragment = new DocumentFragment();

    items.map((item, index) => {
      miniCartAttr.style = "justify-content: flex-start;";
      const { imageLink, title, price, quantity } = item;
      const cartItem = document.createElement("div");
      let productPrice = price * quantity;

      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
      <img src=${imageLink} alt="${title}-image" />
      <div>
        <h6>${title}</h6>
        <div>
          <p class="quantity">Quantity: ${quantity}</p>
          <p class="price">Price: $${productPrice}</p>
        </div>
      </div>
      <i class="delete-item fa-solid fa-xmark" onclick="deleteItem(${index}, \`deleteOneItem\` )"></i>
      `;

      totalPrice += productPrice;
      totalPriceContainer.innerHTML = `Total: $ ${totalPrice}`;

      fragment.append(cartItem);
      miniCartAttr.append(cartItem);
    });
  } else {
    totalPriceContainer.innerHTML = `Total: $ ${totalPrice}`;
    miniCartAttr.style = "justify-content: center;";
    miniCartAttr.innerHTML = "<h4>No Items Added</h4>";
  }
};

// Add Item To Cart
const addToCart = (index) => {
  const { author, imageLink, title, price } = data[index];

  if (cartItems !== [] && cartItems.find((item) => item.title === title)) {
    let index = cartItems.indexOf(
      cartItems.find((item) => item.title === title)
    );
    let item = cartItems[index];
    item.quantity++;
  } else {
    cartItems = [
      ...cartItems,
      { author, imageLink, title, price, quantity: 1 },
    ];
  }

  cartItemsQuantity();
  renderCartItems(cartItems);
};

// Delete Item From Cart
const deleteItem = (index, key) => {
  switch (key) {
    case "deleteOneItem":
      cartItems.splice(index, 1);
      cartItemsQuantity();
      renderCartItems(cartItems);
      break;
    case "clearCartList":
      if (cartItems.length !== 0) {
        cartItems = [];
        cartItemsQuantity();
        renderCartItems(cartItems);
      } else {
        return cartItems;
      }
      break;
  }
};

// Drag And Drop Functions
const dragAndDrop = () => {
  const cards = document.querySelectorAll(".card");
  const button = document.querySelector(".cart-button");
  let index = 0;

  cards.forEach((card, i) => {
    card.addEventListener("dragstart", (e) => {
      e.target.style.opacity = "0.4";

      cartButton.classList.add("over");
      cartButton.firstElementChild.innerText = "Drop Here";
      index = i;
    });

    card.addEventListener("dragend", (e) => {
      e.target.style.opacity = "1";

      cartButton.classList.remove("over");
      cartButton.firstElementChild.innerText = "Cart Items";
      index = i;
    });
  });

  button.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  button.addEventListener("drop", (e) => {
    e.preventDefault();
    addToCart(index);
  });
};

// Cart Items Quantity
cartItemNumber.classList.add("d-none");
const cartItemsQuantity = () => {
  if (cartItems === []) {
    cartItemNumber.innerText = 0;
    cartItemNumber.classList.add("d-none");
  } else {
    cartItemNumber.classList.remove("d-none");
    cartItemNumber.innerText = cartItems
      ?.map((item) => item.quantity)
      .reduce((a, b) => a + b, 0);
  }
};

// Open Cart
cartButton.addEventListener("click", () => {
  miniCart.classList.contains("open-cart")
    ? miniCart.classList.remove("open-cart")
    : miniCart.classList.add("open-cart");
});

// Open Modal
const modalToggle = (index) => {
  modal.classList.contains("modal-open")
    ? modal.classList.remove("modal-open")
    : modal.classList.add("modal-open");

  if (index !== undefined) {
    const { author, imageLink, title, price, description } = data[index];

    modalImage.setAttribute("src", imageLink);
    modalHeader.innerText = title;
    modalAuthor.innerText = author;
    modalDescription.innerText = description + ".";
    modalPrice.innerText = "$ " + price;
  } else {
    return null;
  }
};

// Confirm Order Button
confirmOrderButton.addEventListener("click", () => {
  location.href = "../pages/confirm-order.html";
});
