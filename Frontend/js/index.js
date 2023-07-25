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

function Orders(){
  if(token){
    window.location.href = "./html/order.html"
  }else{
    return showAlert("warning")
  }
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
    console.log(result)

    if(response.status == 404){
      if(result.error == "Out of Stock"){
        return showAlert("error", `Oops! \n ${result.message}`)
      }else{
        return showAlert("error", `Oops! \n ${result.message}`)
      }
    }

    fetchMenu();
    showAlert("success", "Order placed successfully!");
  } catch (error) {
    showAlert("error", "HTTP ERROR");
  }
}


// Showing Alert
function showAlert(type, message) {
  const title = type === "success" ? "Success" : type === "error" ? "Error" : "Login First";
  const icon = type === "success" ? "success" : type === "error" ? "error" : "warning";

  swal.fire({
    title: title,
    text: message,
    icon: icon,
    width: "auto",
    button: "OK",
    timer:3000,
    didClose: () => {
      fetchOrders();
    },
  });
}
