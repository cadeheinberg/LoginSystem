import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5002/login', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/')
                } else {
                    alert("Error")
                }
            })
            .then(err => {
                if (err) { console.log(err) }
            })
    }

    return (
        <div className="container-root">
            <div className="container-form">
                <h2>Log In</h2>
                <form onSubmit={handleSubmit} className="form-register">
                    <div className="container-form-email">
                        <label htmlFor="email"><b>Email: </b></label>
                        <input name="email" type="text" placeholder="Enter Email" onChange={e => setValues({ ...values, email: e.target.value })}></input>
                    </div>
                    <div className="container-form-password">
                        <label htmlFor="password"><b>Passsword: </b></label>
                        <input name="password" type="password" placeholder="Enter Password" onChange={e => setValues({ ...values, password: e.target.value })}></input>
                    </div>
                    <button type='submit'>Log in</button>
                    <p>By signing in you agree to our terms and polcies</p>
                    <Link to="/register">Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;