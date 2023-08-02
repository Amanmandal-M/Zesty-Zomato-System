const baseUrl = `https://zomato-backend-python.onrender.com`;

// Session Storage items
const token = sessionStorage.getItem("Token");
const user_name = sessionStorage.getItem("Name");

// Protected Routes
const orderUrl = `${baseUrl}/order/`;
const takeOrderUrl = `${orderUrl}take-order`;

// Buttons and names container
const nameContainer = document.getElementById("nameSpace");
const logOutContainer = document.getElementById("logout");
const namesContainer = document.getElementById("names");
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
  window.location.href = "../html/adminDashboard.html";
}

logOutContainer.addEventListener("click", (e) => {
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("Name");
  logOutContainer.textContent = "";
  logOutContainer.style.backgroundColor = "transparent";
  nameContainer.textContent = "User Login";
  window.location.href="../index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    return showAlert("warning", "Login First");
  }

  // Fetch menu items
  loader.style.display = "block";
  loader2.style.display = "block";

  fetchOrders();
});

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
        <p><span>Customer Name:</span>&nbsp&nbsp<span>${sessionStorage.getItem(
          "Name"
        )}</span></p>
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
  const title =
    type === "success" ? "Success" : type === "error" ? "Error" : "Warning";
  const icon =
    type === "success" ? "success" : type === "error" ? "error" : "warning";

  if (title == "Warning") {
    return swal.fire({
      title: title,
      text: message,
      icon: icon,
      width: "auto",
      button: "OK",
      timer: 1000,
      didClose: () => {
        window.location.href = "../html/userReg.html";
      },
    });
  }

  swal.fire({
    title: title,
    text: message,
    icon: icon,
    width: "auto",
    button: "OK",
    timer: 3000,
    didClose: () => {
      fetchOrders();
    },
  });
}
