// adminDashboard.js

const baseUrl = `https://zomato-backend-python.onrender.com`;
// Admin Endpoints
const adminDefaultUrl = `${baseUrl}/admin`;
const secretUrl = `${adminDefaultUrl}/secret-key`;
// Menu End
const menuDefaultUrl = `${baseUrl}/menu-list`;
const getUrl = `${menuDefaultUrl}/`
const updateUrl = `${menuDefaultUrl}/update-items`;
const addUrl = `${menuDefaultUrl}/add-items`;
const deleteUrl = `${menuDefaultUrl}/delete-items`;


function userLogin() {
  window.location.href = "../html/userReg.html";
}

function home() {
  window.location.href = "../index.html";
}

const loginSection = document.querySelector(".input-section");
const adminFunctionalities = document.querySelector(".admin-functionalities");

// Function to dynamically generate item cards
function generateItemCard(item) {
  const itemId = item._id.$oid
  const card = document.createElement("div");
  card.classList.add("item-card");

  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.name;
  image.classList.add("item-image");
  card.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = item.name;

  const price = document.createElement("p");
  price.textContent = `Price: $${item.price.toFixed(2)}`;

  const availability = document.createElement("p");
  availability.textContent = `Availability: ${item.available}`;

  const quantity = document.createElement("p");
  quantity.textContent = `Quantity: ${item.quantity}`;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => editItem(item));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => deleteItem(itemId));

  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(availability);
  card.appendChild(quantity);
  card.appendChild(editButton);
  card.appendChild(deleteButton);

  return card;
}

// Function to load items
async function loadItems() {
  try {
    const response = await fetch(getUrl);
    const data = await response.json();
    const itemList = document.querySelector(".item-list");
    itemList.innerHTML = "";
    let allData = JSON.parse(data);
    allData.forEach((item) => {
      const card = generateItemCard(item);
      itemList.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading items:", error);
  }
}

// Function to submit form and add item
document.getElementById("addForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const newItem = {
    imageUrl: document.getElementById("imageUrl").value,
    dish_id: document.getElementById("dishId").value,
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    available: document.getElementById("available").value == "Available" ? true : false,
    quantity: Number(document.getElementById("quantity").value),
  };

  try {
    Swal.fire({
      title: "Adding Item",
      text: "Please wait...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
    console.log(newItem)
    const response = await fetch(addUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });

    if (response.status === 201) {
      loadItems();
      // Clear form fields
      document.getElementById("imageUrl").value = "";
      document.getElementById("dishId").value = "";
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("available").value = "";
      document.getElementById("quantity").value = "";
      Swal.fire("Success", "Item added successfully!", "success");
    } else {
      Swal.fire("Error", "Failed to add item.", "error");
    }
  } catch (error) {
    console.error("Error adding item:", error);
    Swal.fire("Error", "An error occurred. Please try again later.", "error");
  } finally {
    Swal.close();
  }
});

// Function to edit item
async function editItem(item) {
  const itemId = item._id.$oid;
  const editForm = document.createElement("form");
  editForm.className = 'edit-form';
  editForm.innerHTML = `
        <h2>Edit Item</h2>
        <input type="text" id="editImageUrl" value="${item.imageUrl}" required>
        <input type="text" id="editDishId" value="${item.dish_id}" required>
        <input type="text" id="editName" value="${item.name}" required>
        <input type="number" id="editPrice" value="${
    item.price
    }" step="0.01" required>
        <select id="editAvailable" required>
            <option value="" disabled>Select Availability</option>
            <option value="Available" ${
    item.available === "Available" ? "selected" : ""
    }>Available</option>
            <option value="Not Available" ${
    item.available === "Not Available" ? "selected" : ""
    }>Not Available</option>
        </select>
        <input type="number" id="editQuantity" value="${
    item.quantity
    }" required>
    `;

  // Prompt the user to edit the item
  const result = await Swal.fire({
    html: editForm,
    showCancelButton: true,
    focusConfirm: false,
    showCloseButton: true, // Show the close button
  });

  if (!result.isConfirmed) {
    return;
  }

  const editedItem = {
    imageUrl: document.getElementById("editImageUrl").value,
    dish_id: document.getElementById("editDishId").value,
    name: document.getElementById("editName").value,
    price: Number(document.getElementById("editPrice").value),
    available: document.getElementById("editAvailable").value == 'Available' ? true : false,
    quantity: Number(document.getElementById("editQuantity").value),
  };

  try {
    Swal.fire({
      title: "Updating Item",
      text: "Please wait...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch(
      `${updateUrl}/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedItem),
      }
    );

    if (response.status === 200) {
      loadItems();
      Swal.fire("Success", "Item updated successfully!", "success");
    } else {
      Swal.fire("Error", "Failed to update item.", "error");
    }
  } catch (error) {
    console.error("Error updating item:", error);
    Swal.fire(
      "Error",
      "An error occurred. Please try again later.",
      "error"
    );
  } finally {
    setTimeout(() => {
      Swal.close();
    }, 2000); // Close after 2 seconds
  }
}


// Function to delete item
async function deleteItem(itemId) {
  try {
    Swal.fire({
      title: "Deleting Item",
      text: "Please wait...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch(
      `${deleteUrl}/${itemId}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      Swal.close();
      loadItems();
      Swal.fire("Success", "Item deleted successfully!", "success");
    } else {
      Swal.fire("Error", "Failed to delete item.", "error");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    Swal.fire("Error", "An error occurred. Please try again later.", "error");
  } finally {
    setTimeout(() => {
      Swal.close();
    }, 4000);
  }
}

async function submitSecretKey() {
  const secretKeyInput = document.getElementById("secretKeyInput").value;

  if (!secretKeyInput) {
    Swal.fire({
      icon: "warning",
      title: "Empty Secret Key",
      text: "Please enter the admin secret key.",
      showConfirmButton: true,
      timer: 2000,
    });
    return; // Stop further execution
  }

  try {
    Swal.fire({
      title: "Authenticating",
      text: "Please wait...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch(secretUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: secretKeyInput }),
    });

    const data = await response.json();

    if (data.success) {
      // Hide the input section and show the admin functionalities
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Welcome Admin",
        width:"25%",
        showConfirmButton: false,
        timer:2500,
      });
      loginSection.style.display = "none";
      adminFunctionalities.style.display = "block";
      loadItems(); // Load items once the admin section is displayed
    } else {
      Swal.fire({
        icon: "error",
        title: "Wrong Secret Key",
        text: "Please enter a valid admin secret key.",
        showConfirmButton: true,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setTimeout(() => {
      Swal.close();
    }, 2500);
  }
}

// Load admin section on page load if valid secret key is present
function loadAdmin() {
  const secretKey = localStorage.getItem("adminSecretKey");
  if (secretKey) {
    submitSecretKey(secretKey);
    document.getElementById("secretKeyInput").value = secretKey;
  }
}
