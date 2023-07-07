const baseUrl = `https://zomato-backend-python.onrender.com`;
const defaultUrl = `${baseUrl}/zomato`;
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
const signemail = document.querySelector(".signupEmail");
const signpassword = document.querySelector(".signupPass");
const loginEmail = document.querySelector(".loginEmail");
const loginPass = document.querySelector(".loginPass");

signUpLink.addEventListener('click', () => {
    wrapper.classList.add('animate-signIn');
    wrapper.classList.remove('animate-signUp');
});

signInLink.addEventListener('click', () => {
    wrapper.classList.add('animate-signUp');
    wrapper.classList.remove('animate-signIn');
});


// Register and login Buttons
signUpBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    
});

loginBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    
})