const express = require('express');
const router = express.Router();

const findChecked = document.getElementsByName('h_id')
    .forEach(radio => {
        if (radio.checked) {
            console.log(radio.value);
        }
    });

    // function passvalues() {
    //     const amount = document.getElementById("amt").value;
    //     localStorage.setItem("textvalue", amount);
    //     return false;
    // }
    // document.getElementById("result").innerHTML = localStorage.getItem("textvalue");