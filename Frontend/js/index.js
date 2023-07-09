const baseUrl = `https://zomato-backend-python.onrender.com`;

const menuUrl = `${baseUrl}/menu-list/`;

// Protected Routes
const orderUrl = `${baseUrl}/order/`;
const takeOrderUrl = `${orderUrl}take-order`;

// Session Storage items
const token = sessionStorage.getItem("Token");
const user_name = sessionStorage.getItem("Name");

// Buttons and names container
const nameContainer = document.getElementById("nameSpace");
const logOutContainer = document.getElementById("logout");
const namesContainer = document.getElementById("names");
const orderHeader = document.getElementById("orderHeader");

if (user_name) {
  nameContainer.remove();
  namesContainer.textContent = user_name;
  namesContainer.style.backgroundColor = "#4caf50";
  logOutContainer.textContent = "Log out";
  logOutContainer.style.backgroundColor = "#4caf50";
}

function userLogin() {
  window.location.href = "./html/userReg.html";
}

function adminLogin() {
  window.location.href="./html/adminDashboard.html";
}

logOutContainer.addEventListener("click", (e) => {
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("Name");
  logOutContainer.textContent = "";
  logOutContainer.style.backgroundColor = "transparent";
  nameContainer.textContent = "User Login";
  window.location.reload();
});



document.addEventListener("DOMContentLoaded", () => {
  // Fetch menu items
  fetchMenu();

  // Fetch orders
  if (token) {
    orderHeader.textContent = "Orders";
    fetchOrders();
  }
});

async function fetchMenu() {
  try {
    const response = await fetch(menuUrl);
    const menuItems = await response.json();
    displayMenu(JSON.parse(menuItems));
  } catch (error) {
    showAlert("error", "HTTP ERROR");
  }
}

function displayMenu(menuItems) {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = "";
  menuItems.forEach((menuItem) => {
    const menuItemElement = document.createElement("div");
    menuItemElement.className = "menu-item-container";
    menuItemElement.innerHTML = `
      <img class="dishImg" src=${menuItem.imageUrl} alt="Img Not Found"/>
      <p class="dishName"><span>Dish:</span>&nbsp&nbsp<span>${
        menuItem.name
      }</span></p>
      <p class="price"><span>Price:</span>&nbsp&nbsp<span>${menuItem.price}</span></p>
      <p class="availabile"><span>Available:</span>&nbsp&nbsp<span>${
        menuItem.available ? "Yes" : "No"
      }</span></p>
      <p class="quantity"><span>Quantity:</span>&nbsp&nbsp<span>${
        menuItem.quantity
      }</span></p>
      <button class="orderButton" onclick="addToOrder('${
        menuItem._id.$oid
      }')">Order Now</button>
    `;
    menuContainer.appendChild(menuItemElement);
  });
}

async function addToOrder(dishId) {
  if(!token) return showAlert("error", "First Login");
  try {
    const response = await fetch(takeOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: user_name,
        order_items: [dishId],
      }),
    });
    const result = await response.json();
    fetchMenu();
    showAlert("success", "Order placed successfully!");
  } catch (error) {
    showAlert("error", "Error placing order!");
  }
}

async function fetchOrders() {
  try {
    const response = await fetch(orderUrl);
    const orders = await response.json();
    displayOrders(JSON.parse(orders));
  } catch (error) {
    console.log("Error fetching orders:", error);
  }
}

function displayOrders(orders) {
  const orderContainer = document.getElementById("order-container");
  orderContainer.innerHTML = "";
  orders.forEach((order) => {
    const orderElement = document.createElement("div");
    orderElement.innerHTML = `
      <p>Order ID: ${order._id.$oid}</p>
      <p>Customer: ${order.customer_name}</p>
      <p>Dish: ${order.dish_id}</p>
      <p>Status: ${order.status}</p>
    `;
    orderContainer.appendChild(orderElement);
  });
}

function showAlert(type, message) {
  swal.fire({
    title: type === "success" ? "Success" : "Error",
    text: message,
    icon: type,
    button: "OK",
    didClose: () => {
        fetchOrders() 
    }
  });
}
