import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5002/register', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/login')
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
                <h2>Sign Up</h2>
                <form className="form-register" onSubmit={handleSubmit}>
                    <div className="container-form-name">
                        <label htmlFor="name"><b>Name: </b></label>
                        <input name="name" type="text" placeholder="Enter Name" onChange={e => setValues({ ...values, name: e.target.value })}></input>
                    </div>
                    <div className="container-form-email">
                        <label htmlFor="email"><b>Email: </b></label>
                        <input name="email" type="text" placeholder="Enter Email" onChange={e => setValues({ ...values, email: e.target.value })}></input>
                    </div>
                    <div className="container-form-password">
                        <label htmlFor="password"><b>Passsword: </b></label>
                        <input name="password" type="password" placeholder="Enter Password" onChange={e => setValues({ ...values, password: e.target.value })}></input>
                    </div>
                    <button type='submit'>Sign Up</button>
                    <p>By signing up you agree to our terms and polcies</p>
                    <Link to="/login">Login</Link>
                </form>
            </div>
        </div>
    );
}

export default Register;