

//classes
class UserSetup {
    constructor(name, email, phone, password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = base64Encode(password);
    }

}


// checking code that what to display or not to display on front page

const userInfo = getData('user');
if (userInfo) {
    if (userInfo.pin) {
        qs('.toggle-btns .login').classList.remove('active');
        qs('.toggle-btns .signup').classList.remove('active');
        qs('.signup-form').style.display = 'none';
        qs('.pin-page').style.display = 'block';
        qs('.login-form').style.display = 'none';
    } else {
        qs('.toggle-btns .login').classList.add('active');
        qs('.toggle-btns .signup').classList.remove('active');
        qs('.signup-form').style.display = 'none';
        qs('.pin-page').style.display = 'none';
        qs('.login-form').style.display = 'block';
    }
} else {
    qs('.toggle-btns .login').classList.remove('active');
    qs('.toggle-btns .signup').classList.add('active');
    qs('.signup-form').style.display = 'block';
    qs('.pin-page').style.display = 'none';
    qs('.login-form').style.display = 'none';
}


// pin Functionality Code onkey up functions for login using pin, new pin entering and confirmation pin entering

function checkLogin(index, event) {
    onKeyUpEvent('#pin', index, event, loginPinSubmit);
}

function newPinEvent(index, event) {
    onKeyUpEvent('#newPin', index, event, newPinDone)
}

function confirmPinEvent(index, event) {
    onKeyUpEvent('#confirmPin', index, event, confirmPinDone)
}


// login pin submition code (callback function for taking next step after pin entering)

function loginPinSubmit(loginPin) {
    if (checkPin(loginPin)) {
        takeToDashbord();
    } else {
        
    }
}


// new pin submition code now move the focus to confirm pin (callback function for taking next step after pin entering)

function newPinDone(newPin) {
    qs('#confirmPin1').focus();
}


// new pin submition code now move the focus to confirm pin (callback function for taking next step after pin entering)

function confirmPinDone(confirmPin) {
    const new_pin = qs('#newPin1').value + qs('#newPin2').value + qs('#newPin3').value + qs('#newPin4').value;
    if (parseInt(new_pin) === parseInt(confirmPin)) {
        const user = getData('user');
        setPin.call(user, new_pin);
        takeToDashbord();
    } else {
        qs('#set-pin-error').innerHTML = 'PIN does not match';
    }
}


// pin input code for login

function onKeyUpEvent(id, index, event, callthisFunction) {
    const eventCode = event.which || event.keyCode;
    console.log(id + index);
    if (qs(id + index).value.length === 1) {
        if (index !== 4) {
            qs(id + (index + 1)).focus();
        } else {
            qs(id + index).blur();

            const userCode = qs(id + 1).value + qs(id + 2).value + qs(id + 3).value + qs(id + 4).value;

            callthisFunction(userCode);

        }
    }
    if (eventCode === 8 && index !== 1) {
        qs(id + (index - 1)).focus();
    }
}

function onFocusEvent(id, index) {
    for (item = 1; item < index; item++) {
        console.log(id + item);
        const currentElement = qs(id + item);
        if (!currentElement.value) {
            currentElement.focus();
            break;
        }
    }
}


// toggle login and sign up

const login_signup = document.querySelectorAll('.toggle-btns > div');
login_signup[0].addEventListener('click', displayLogin);
login_signup[1].addEventListener('click', displaySignup);

function displayLogin() {
    qs('.toggle-btns .login').classList.add('active');
    qs('.toggle-btns .signup').classList.remove('active');
    qs('.signup-form').style.display = 'none';
    qs('.pin-page').style.display = 'none';
    qs('.login-form').style.display = 'block';
}

function displaySignup() {
    qs('.toggle-btns .signup').classList.add('active');
    qs('.toggle-btns .login').classList.remove('active');
    qs('.signup-form').style.display = 'block';
    qs('.pin-page').style.display = 'none';
    qs('.login-form').style.display = 'none';
}


// login Button Funtionality 

qs('#login-btn').addEventListener('click', login);

function login() {
    let email = qs('#login-mail').value;
    let password = qs('#password').value;
    password = base64Encode(password);
    let error = '';

    const user = getData('user');
    if (email !== user.email) {
        qs('#login-error').innerHTML = 'Invalid Email Id';
    } else if (password !== user.password) {
        qs('#login-error').innerHTML = 'Invalid Password';
    } else if (!user.pin) {
        qs('.login-form').style.display = 'none';
        qs('.set-pin-page').style.display = 'block';
    } else {
        takeToDashbord();
    }
}


// signup btn functionality

qs('#signup-btn').addEventListener('click', signup);

function signup() {
    let name = qs('#name').value;
    let email = qs('#email').value;
    let phone = qs('#phone').value;
    let password = qs('#set-password').value;
    let error;
    const validRegexForPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const validRegexForPhone = /^\d{10}$/;
    const validRegexForEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (name == '' || name == null) {
        shakeError('#name', 'Enter your name.');
        return;
    } else if (!email.match(validRegexForEmail)) {
        shakeError('#email', 'Enter a valid email address');
        return;
    } else if (!validRegexForPhone.test(phone)) {
        shakeError('#phone', 'Enter a valid phone number');
        return;
    } else if (!validRegexForPassword.test(password)) {
        shakeError('#set-password', 'Enter a password with minimum 8 characters, number and !@#$%^&*');
        return;
    } else {
        const user = new UserSetup(name, email, phone, password);
        setData(user);
        qs('.signup-form').style.display = 'none';
        qs('.set-pin-page').style.display = 'block';
        qs('.toggle-btns .signup').classList.remove('active');
    }
}

function shakeError(element, errorMsg) {
    qs(element).focus();
    qs(element).classList.add('error');
    setTimeout(() => {
        qs(element).classList.remove('error');
    }, 2000)
    qs('#signup-error').innerHTML = errorMsg;
}

function qs(query) {
    return document.querySelector(query);
}

function base64Encode(text) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

function checkPin(pin) {
    const user = getData('user');
    return (parseInt(user.pin) === parseInt(pin)) ? true : false;
}

function getData(query) {
    return JSON.parse(localStorage.getItem(query));
}

function setData(query) {
    return localStorage.setItem('user', JSON.stringify(query));
}

function setPin(pin) {
    this.pin = pin;
    localStorage.setItem('user', JSON.stringify(this));
}

function takeToDashbord(){
    
    let user = getData('user')
    user.login = true;
    let date = new Date();
    console.log(date);
    user.login_date = date.getDate();
    console.log(user.login_date);
    setData(user);

    window.location.href = 'dashbord.html';
}
