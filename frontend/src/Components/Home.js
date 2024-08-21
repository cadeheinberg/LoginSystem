import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'

function Home() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('')
    const [userName, setUserName] = useState('')

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:5002').then(res => {
            if (res.data.Status === "Success") {
                setAuth(true)
                setUserName(res.data.userName)
            } else {
                setAuth(false)
                setMessage(res.data.Error)
            }
        }).catch(err => console.error("Error checking authentication:", err));
    }, [])

    const handleLogout = () => {
        axios.get('http://localhost:5002/logout').then(res => {
            window.location.reload(true);
        }).catch(err => console.log(err));
    }

    if (auth) {
        return (
            <div className="container-root">{ }
                <div>
                    <h3>You are authorized {userName}</h3>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container-root">{ }
                <div>
                    <h2>{message}</h2>
                    <h3>Login Now</h3>
                    <Link to="/login">Login</Link>
                </div>
            </div>
        );
    }

}

export default Home;