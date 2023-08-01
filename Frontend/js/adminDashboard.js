function userLogin() {
  window.location.href = "../html/userReg.html";
}

function home() {
  window.location.href = "../index.html";
}

const loginSection = document.querySelector('.loginSection');
const bodyLoad = document.querySelector('body');


const loadAdmin = async () => {
    const { value: password } = await Swal.fire({
      title: 'Enter Secret Key',
      input: 'password',
      inputLabel: 'Password',
      inputPlaceholder: 'Enter Secret Key',
      inputAttributes: {
        maxlength: 9,
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      didClose: () => {
        validation(password)
      }
    })
    


    async function validation (password) {
        try {
          console.log(password)
        } catch (error) {
           swal.fire({
            title: title,
            text: message,
            icon: icon,
           })
        }
    }
}

