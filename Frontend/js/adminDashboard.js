const baseUrl = `https://zomato-backend-python.onrender.com`;
const defaultUrl = `${baseUrl}/admin`;
const secretUrl = `${defaultUrl}/secret-key`;

function userLogin() {
  window.location.href = "../html/userReg.html";
}

function home() {
  window.location.href = "../index.html";
}

const loginSection = document.querySelector(".loginSection");
const bodyLoad = document.querySelector("body");


