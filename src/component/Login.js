import { trim } from 'jquery';
import React, {useState} from 'react';
import Storage from '../Storage';

const Login = ({history}) => {
    const [user, setUser] = useState({
        username: "", 
        password: "",
        errorUsername: "",
        errorPassword: "",
        errorToken: "",
        usernameWarning: false,
        passwordWarning: false,
    });

    
    const resetErrorForm = () => {
        setTimeout(() => setUser({
            ...user,
            errorUsername: "",
            errorPassword: "",
            errorToken: "",
            usernameWarning: false,
            passwordWarning: false,
        }), 2000);
    } 

    const formValidite =  (username, password) => {
        const trimUsername = trim(username);
        const trimPassword = trim(password);

        if(trimUsername && trimPassword) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ "username": trimUsername, "password": trimPassword }),
            };

            fetch("https://emphasoft-test-assignment.herokuapp.com/api-token-auth/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    const {token} = JSON.parse(result);
                    console.log("ErrorToken:", token);
                    if (token) {
                        Storage.setToken(token);
                         history.push("/users")
                    } else {
                        throw new Error(JSON.parse(result).non_field_errors[0])
                    }
                })
                .catch(Error => {
                    console.log("ErrorCatch:", Error.message);
                    setUser({
                        ...user,
                        errorToken: `${Error.message} username or password is not correct`,
                    });
                    resetErrorForm();
                });
           
        } else if (trim(username) === "" && trim(password) !== "" ) {
            setUser({
                ...user, 
                errorUsername:"please fill username",
                usernameWarning: true,
                });
            resetErrorForm(); 
        } else if (trim(username) !== "" && trim(password) === "") {
            setUser({
                ...user,
                errorPassword: "please fill password",
                passwordWarning: true,
            });
            resetErrorForm();
        } else {
            setUser({
                ...user,
                errorUsername: "please fill username",
                errorPassword: "please fill password",
                usernameWarning: true,
                passwordWarning: true,
            });
            resetErrorForm();
        }
    }

    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const {username, password} = user;
        formValidite(username, password);
    }

    const { usernameWarning, passwordWarning} = user

    return (
        <div className="login-wrap">
            <div className="error-token">{user.errorToken}</div>
            <div className="login">
                <div className="login-box">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="textbox">
                            <div className="wrap-input">
                                <i className="fas fa-user"></i>
                                <input 
                                    type="text"
                                    name="username"
                                    id="username" 
                                    placeholder="Username"
                                    value={user.username}
                                    onChange={handleChange}
                                />
                            </div>    
                            <div className={!usernameWarning? "error hide" : "error"}>{user.errorUsername}</div>
                        </div>
                        <div className="textbox">
                            <div className="wrap-input">
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={user.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={!passwordWarning ? "error hide" : "error"}>{user.errorPassword}</div>
                        </div>
                        <input className="btn" type="submit" value="Sign in"/>
                    </form>    
                </div>
            </div>
        </div>
    )
}

export default Login;
