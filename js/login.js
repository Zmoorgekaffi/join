/* user array */
let users = [
    {
        name: 'Hubertus',
        email: 'test123@test.de',
        password: 'test123'
    },
];


/* register new user */
function registerNewUser() {
    let password = document.getElementById('register_password-input');
    let confirm = document.getElementById('register_confirm-input');
    let name = document.getElementById('register_name-input');
    let email = document.getElementById('register_email-input');

    if (lookIfUsersAllreadyExists(email.value) === true) {
        alert('A user with this email allready exists');
    } else {
        if (password.value === confirm.value) {
            let newUser = generateNewUserArray(name.value, email.value, password.value);
            users.push(newUser);
            window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert';
        } else {
            alert('Password dont match');
        }
    }
}

function generateNewUserArray(name, email, password) {
    return {
        name: `${name}`,
        email: `${email}`,
        password: `${password}`
    }
}

function lookIfUsersAllreadyExists(email) {
    let foundUser = users.find(user => user.email.toLowerCase() === `${email}`.toLowerCase());
    if (foundUser) {
        return true;
    } else {
        return false;
    }
}

/* handle signIn signUp display */
let signInDisplay = document.getElementById('login-card_frame');
let signUpDisplay = document.getElementById('sign-up-card_frame');
let paragraph = document.getElementById('switch-signIn-signUp_paragraph');
let button = document.getElementById('handle-signIn-signUp_button');

function handleSignInSignUp() {
    if (!signInDisplay.classList.contains('d-none')) {
        switchToSignUp();
    } else {
        window.location.href = 'login.html'
    }
}

function switchToSignUp() {
    signInDisplay.classList.add('d-none');
    signUpDisplay.classList.remove('d-none');
    paragraph.innerHTML = `Allready have an Account?`;
    button.innerHTML = `Log in`;
}

function handleSignUpButton() {
    let button = document.getElementById('signUp-button');
    if (button.classList.contains('d-none')) {
        button.classList.remove('d-none');
    } else {
        button.classList.add('d-none');
    }
}

/* eventlistener for animation */
let animationsHelper = document.getElementById('animations-helper');

animationsHelper.addEventListener('animationend', () => {
    animationsHelper.classList.add('d-none');
});

/* password login visibility */
let pwImgs = document.querySelectorAll('.pw-img');
let visibleImg = document.querySelectorAll('.visible-img');
let pwInputs = document.querySelectorAll('.password-input');

// für den focus
pwInputs.forEach(input => {
    input.addEventListener('focus', () => {
        pwImgs.forEach(img => {
            img.classList.add('d-none');
        });
        visibleImg.forEach(img => {
            img.classList.remove('d-none');
        });
    });
});

// wenn man den focus verlässt
pwInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value === ``) {
            pwImgs.forEach(img => {
                img.classList.remove('d-none');
            });
            visibleImg.forEach(img => {
                img.classList.add('d-none');
            });
        }
    });
});

function handleVisibility() {
    const isVisible = Array.from(visibleImg).some(img => img.classList.contains('visibility-off'));

    if (isVisible) {
        visibleImg.forEach(img => {
            img.classList.remove('visibility-off');
            img.src = './assets/img/icons/visibility.svg';
            togglePasswordVisibility();
        });
    } else {
        visibleImg.forEach(img => {
            img.classList.add('visibility-off');
            img.src = './assets/img/icons/visibility_off.svg';
            togglePasswordVisibility();
        });
    }
}

    // password visibility
let passwordInputs = document.querySelectorAll('input[type="password"]');


function togglePasswordVisibility() {
    passwordInputs.forEach(input => {
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    });
}
