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
                'Accept': 'application/json' // Laravel expects this
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            console.log(data);
            // Optionally redirect or reset form
        } else {
            // Laravel returns validation errors like this
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
