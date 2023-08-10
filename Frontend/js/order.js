const baseUrl = `https://zomato-backend-python.onrender.com`;

const token = sessionStorage.getItem("Token");
const user_name = sessionStorage.getItem("Name");
const userId = sessionStorage.getItem("UserID");

const orderUrl = `${baseUrl}/order/`;

const nameContainer = document.getElementById("nameSpace");
const logOutContainer = document.getElementById("logout");
const namesContainer = document.getElementById("names");
const loader = document.getElementById("loader");
const loader2 = document.getElementById("loader2");

if (user_name) {
  nameContainer.remove();
  namesContainer.textContent = user_name;
  namesContainer.style.backgroundColor = "#4caf50";
  logOutContainer.textContent = "Log out";
  logOutContainer.style.backgroundColor = "#4caf50";
}

function home() {
  window.location.href = "../index.html";
}

function userLogin() {
  window.location.href = "../html/userReg.html";
}

function adminLogin() {
  window.location.href = "../html/adminDashboard.html";
}

logOutContainer.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    return showAlert("warning", "Login First");
  }
  loader.style.display = "block";
  loader2.style.display = "block";
  fetchOrders();
});

async function fetchOrders() {
  try {
    const response = await fetch(orderUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId
      })
    });
    const orders = await response.json();

    loader.style.display = "none";
    loader2.style.display = "none";

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
      <p><span>Customer Name:</span>&nbsp&nbsp<span>${user_name}</span></p>
      <p><span>Order Id:</span>&nbsp&nbsp<span>${order._id.$oid}</span></p>
      <p><span>User Id:</span>&nbsp&nbsp<span>${order.user_id}</span></p>
      <p><span>Menu Id: </span>&nbsp&nbsp<span>${order.menu_id}}</span></p>
      <p><span>Status:</span>&nbsp&nbsp<span>${order.status}</span></p>
      <button id="cancel_order">Cancel Order</button>
    `;
    orderContainer.appendChild(orderElement);
  });
}

function showAlert(type, message) {
  const title =
    type === "success" ? "Success" : type === "error" ? "Error" : "Warning";
  const icon =
    type === "success" ? "success" : type === "error" ? "error" : "warning";

  const timerDuration = title === "Warning" ? 1000 : 3000;

  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    width: "auto",
    button: "OK",
    timer: timerDuration,
    didClose: () => {
      if (title === "Warning") {
        window.location.href = "../html/userReg.html";
      } else {
        fetchOrders();
      }
    }
  });
}
