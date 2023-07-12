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
const menuContainer = document.getElementById("menu-container");
const loader = document.getElementById("loader");
const loader2 = document.getElementById("loader2");

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
  window.location.href = "./html/adminDashboard.html";
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
  loader.style.display = "block";
  loader2.style.display = "block";

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
    loader2.style.display = "none";
    displayMenu(JSON.parse(menuItems));
  } catch (error) {
    showAlert("error", "HTTP ERROR");
  }
}

function displayMenu(menuItems) {
  menuContainer.innerHTML = "";
  menuItems.forEach((menuItem) => {
    const menuItemElement = document.createElement("div");
    menuItemElement.className = "menu-item-container";
    menuItemElement.innerHTML = `
      <img class="dishImg" src=${menuItem.imageUrl} alt="Img Not Found"/>
      <p class="dishName"><span>Dish:</span>&nbsp&nbsp<span>${
        menuItem.name
      }</span></p>
      <p class="price"><span>Price:</span>&nbsp&nbsp<span>${
        menuItem.price
      }</span></p>
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
  if (!token)
    return swal.fire({
      title: "Login First",
      icon: "warning",
      didClose: () => {
        window.location.href = "./html/userReg.html";
      },
    });
  try {
    const response = await fetch(takeOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id:sessionStorage.getItem('UserID'),
        order_items: [dishId],
      }),
    });
    const result = await response.json();
    fetchMenu();
    showAlert("success", "Order placed successfully!");
  } catch (error) {
    showAlert("error", "HTTP ERROR");
  }
}

async function fetchOrders() {
  try {
    const response = await fetch(orderUrl);
    const orders = await response.json();
    displayOrders(JSON.parse(orders));
  } catch (error) {
    showAlert("error", "HTTP ERROR");
  }
}

function displayOrders(orders) {
  const orderContainer = document.getElementById("order-container");
  orderContainer.innerHTML = "";
  orders.forEach((order) => {
    const orderElement = document.createElement("div");
    orderElement.className = "order-item-container";
    orderElement.innerHTML = `
      <img class="dishImg2" src=${order.imageUrl} alt="Error 404"/>
      <p><span>Customer Name:</span>&nbsp&nbsp<span>${sessionStorage.getItem("Name")}</span></p>
      <p><span>Order Id:</span>&nbsp&nbsp<span>${order._id.$oid}</span></p>
      <p><span>User Id:</span>&nbsp&nbsp<span>${order.user_id}</span></p>
      <p><span>Menu Id: </span>&nbsp&nbsp<span>${order.menu_id}}</span></p>
      <p><span>Status:</span>&nbsp&nbsp<span>${order.status}</span></p>
    `;
    orderContainer.appendChild(orderElement);
  });
}

// Showing Alert
function showAlert(type, message) {
  swal.fire({
    title: type === "success" ? "Success" : "Error",
    text: message,
    icon: type,
    button: "OK",
    didClose: () => {
      fetchOrders();
    },
  });
}
