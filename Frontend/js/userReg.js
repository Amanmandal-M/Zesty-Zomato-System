const baseUrl = `https://zomato-backend-python.onrender.com`;
const defaultUrl = `${baseUrl}/user`;
const registerUrl = `${defaultUrl}/register`;
const loginUrl = `${defaultUrl}/login`;

const wrapper = document.querySelector(".wrapper");
const signUpLink = document.querySelector(".signUp-link");
const signInLink = document.querySelector(".signIn-link");

// Buttons
const signUpBtn = document.querySelector("#btnSignUp");
const loginBtn = document.querySelector("#btnLogin");

// Input Fields
const signname = document.querySelector(".signupName");
const signEmail = document.querySelector(".signupEmail");
const signPass = document.querySelector(".signupPass");
const loginEmail = document.querySelector(".loginEmail");
const loginPass = document.querySelector(".loginPass");

// Spinner icon
const showSpinner = () => {
  signUpBtn.innerHTML = "";
  signUpBtn.innerHTML = `<div class="spinner"></div>`;
};
const showSpinner2 = () => {
  loginBtn.innerHTML = "";
  loginBtn.innerHTML = `<div class="spinner"></div>`;
};

const hideSpinner = () => {
  signUpBtn.innerHTML = "";
  signUpBtn.textContent = "Sign Up";
};
const hideSpinner2 = () => {
  loginBtn.innerHTML = "";
  loginBtn.textContent = "Login";
};


function zestyHeaderClick(){
  window.location.href="../index.html";
}

signUpLink.addEventListener("click", () => {
  wrapper.classList.add("animate-signIn");
  wrapper.classList.remove("animate-signUp");
});

signInLink.addEventListener("click", () => {
  wrapper.classList.add("animate-signUp");
  wrapper.classList.remove("animate-signIn");
});

// Empty all fields

function emptyAllFields() {
  signname.value = "";
  signEmail.value = "";
  signPass.value = "";
  loginEmail.value = "";
  loginPass.value = "";
}

// SignUp Button Event Listener
signUpBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  return signupSection();
});

signUpBtn.addEventListener("keydown", async (event) => {
  if (event.keyCode === 13) {
    e.preventDefault();
    return signupSection();
  }
});

const signupSection = async () => {
  let obj = {
    name: signname.value,
    email: signEmail.value,
    password: signPass.value,
  };

  if (obj.email == "" || obj.password == "" || obj.name == "")
    return Swal.fire({
      icon: "warning",
      text: "Please Enter fields",
      width: "22%",
    });

  try {
    showSpinner();
    const fetchingUrl = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const apiResponse = await fetchingUrl.json();

    if (fetchingUrl.status == 201) {
      Swal.fire({
        icon: "success",
        text: `Registered Successfully`,
        width: "22%",
        didClose: () => {
          wrapper.classList.add("animate-signUp");
          wrapper.classList.remove("animate-signIn");
        },
      });
    } else if (fetchingUrl.status == 401) {
      Swal.fire({
        icon: "warning",
        text: "Already a member",
        width: "22%",
        didClose: () => {
          wrapper.classList.add("animate-signUp");
          wrapper.classList.remove("animate-signIn");
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Credentials Not Found",
        width: "22%",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Sign Up Failed",
      width: "22%",
    });
  }
  hideSpinner();
  emptyAllFields();
};

// Login Button Event Listener
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  return loginSection();
});

loginBtn.addEventListener("keydown", async (event) => {
    if(event.keyCode === 13){
        e.preventDefault();
        return loginSection();
    }
});

const loginSection = async () => {
  let obj = {
    email: loginEmail.value,
    password: loginPass.value,
  };

  if (obj.email == "" || obj.password == "")
    return Swal.fire({
      icon: "warning",
      text: "Please Enter fields",
      width: "22%",
    });

  try {
    showSpinner2();
    const fetchingUrl = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const apiResponse = await fetchingUrl.json();
    const data = JSON.parse(apiResponse.Data);

    sessionStorage.setItem("Token", apiResponse.Token);
    sessionStorage.setItem("Name", data.name);
    

    if (fetchingUrl.status == 201) {
      Swal.fire({
        icon: "success",
        text: `Welcome ${data.name}`,
        width: "22%",
        didClose: () => {
          window.location.href = '../index.html';
        }
      });
    } else if (fetchingUrl.status == 401) {
      Swal.fire({
        icon: "warning",
        text: "Please Sign up first",
        width: "22%",
        didClose: () => {
          wrapper.classList.add("animate-signIn");
          wrapper.classList.remove("animate-signUp");
        },
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Login Failed",
      width: "22%",
    });
  }

  hideSpinner2();
  emptyAllFields();
};

