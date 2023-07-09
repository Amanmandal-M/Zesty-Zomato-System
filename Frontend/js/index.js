const baseUrl = `https://zomato-backend-python.onrender.com`;
const defaultUrl = `${baseUrl}/user`;
const registerUrl = `${defaultUrl}/register`;
const loginUrl = `${defaultUrl}/login`;

const wrapper = document.querySelector('.wrapper');
const signUpLink = document.querySelector('.signUp-link');
const signInLink = document.querySelector('.signIn-link');

// Buttons
const signUpBtn = document.querySelector("#btnSignUp");
const loginBtn = document.querySelector("#btnLogin");

// Input Fields
const signname = document.querySelector(".signupName");
const signEmail = document.querySelector(".signupEmail");
const signPass = document.querySelector(".signupPass");
const loginEmail = document.querySelector('.loginEmail');
const loginPass = document.querySelector('.loginPass');

// Spinner icon
const showSpinner = () => {
    signUpBtn.innerHTML="";
    signUpBtn.innerHTML = `<div class="spinner"></div>`
};
  
const hideSpinner = () => {
    signUpBtn.innerHTML="";
    signUpBtn.textContent="Sign Up";
};

signUpLink.addEventListener('click', () => {
    wrapper.classList.add('animate-signIn');
    wrapper.classList.remove('animate-signUp');
});

signInLink.addEventListener('click', () => {
    wrapper.classList.add('animate-signUp');
    wrapper.classList.remove('animate-signIn');
});

// Empty all fields 

function emptyAllFields() {
    signname.value="";
    signEmail.value="";
    signPass.value="";
    loginEmail.value="";
    loginPass.value="";
}

// SignUp Button Event Listener
signUpBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    signupSection();
});

const signupSection = async () =>{
    showSpinner();
    let obj = {
        name: signname.value,
        email: signEmail.value,
        password: signPass.value
    };

    
    try {
        const fetchingUrl = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        const apiResponse = await fetchingUrl.json();

        if(fetchingUrl.status==200){
            hideSpinner();
            Swal.fire({
                icon: 'success',
                text: 'Sign Up Successfully',
                width: "22%",
                didClose: () => {
                  wrapper.classList.add('animate-signUp');
                  wrapper.classList.remove('animate-signIn');
                }
              });
              emptyAllFields()  
        }else{
            emptyAllFields()
            Swal.fire({
                icon: 'error',
                text: 'Credentials Not Found',
                width: "22%"
            });
        }
    } catch (error) {
        hideSpinner();
        emptyAllFields();
        Swal.fire({
            icon: 'error',
            text: 'Sign Up Failed',
            width: "22%"
        });
    }
}

// Login Button Event Listener
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    loginSection();
});

const loginSection = async () => {
    showSpinner();
    let obj = {
        email: loginEmail.value,
        password: loginPass.value
    };

    try {
        const fetchingUrl = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        const apiResponse = await fetchingUrl.json();
        if(fetchingUrl.status === 200) {
            hideSpinner();
            Swal.fire({
                icon: 'success',
                text: 'Login Successful',
                width: "22%"
            });
            emptyAllFields();
        }else{
            emptyAllFields()
            Swal.fire({
                icon: 'error',
                text: 'Credentials Not Found',
                width: "22%"
            });
        }
    } catch (error) {
        hideSpinner();
        // Handle login error
        emptyAllFields();
        Swal.fire({
            icon: 'error',
            text: 'Login Failed',
            width: "22%"
        });
    }
};