"use strict";

async function createUser(){
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm_password').value.trim();

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch(api_base + 'user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful!");
        } else {
            if (data.errors) {
                const messages = Object.values(data.errors).flat().join('\n');
                alert("Validation Errors:\n" + messages);
            } else {
                alert("Something went wrong:\n" + data.message);
            }
        }
    } catch (error) {
        alert("Failed to connect to server.");
    }
}

async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    try {
        const response = await fetch(api_base + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert("Login successful!");

            window.location.href = 'home.html';
        } else {
            if (data.errors) {
                const messages = Object.values(data.errors).flat().join('\n');
                alert("Validation Errors:\n" + messages);
            } else {
                alert("Something went wrong:\n" + data.message);
            }
        }
    } catch (error) {
        console.error(error);
        alert("Failed to connect to server.");
    }
}

function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}