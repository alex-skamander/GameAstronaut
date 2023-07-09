const modal = document.getElementById('modal_sign');
const btn = document.getElementById("btn_open");
const span1 = document.getElementsByClassName("close1")[0];
const span2 = document.getElementsByClassName("close2")[0];
const message1 = document.getElementsByClassName("message1")[0];
const message2 = document.getElementsByClassName("message2")[0];
const register_form= document.getElementById('register_form');
const login_form= document.getElementById('login_form');


btn.onclick = function() {
    register_form.style.display = "none";
    login_form.style.display = "block";
    modal.style.display = "block";
}

span1.onclick = function() {
    register_form.style.display = "none";
    modal.style.display = "none";
}

span2.onclick = function() {
    login_form.style.display = "none";
    modal.style.display = "none";
}

message1.onclick = function() {
    register_form.style.display = "none";
    login_form.style.display = "block";
}

message2.onclick = function() {
    register_form.style.display = "block";
    login_form.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
