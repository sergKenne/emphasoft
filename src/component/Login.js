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

    //Reset Error Form
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

    //Username Validation
    const validateUsername = (message) => {
        setUser({ ...user, errorUsername: message, usernameWarning: true });
        resetErrorForm();
    }

    //Password Validation
    const validatePassword = (message) => {
        setUser({ ...user, errorPassword: message, passwordWarning: true });
        resetErrorForm();
    }

    //Username And Password Validation 
    const PassAndUserValidation = (userMess, passMess) => {
        setUser({
            ...user,
            errorUsername: userMess,
            errorPassword: passMess,
            usernameWarning: true,
            passwordWarning: true,
        });
        resetErrorForm();
    }
    
    //Validation And Authentication
    const validateAndAuthentication =  (username, password) => {

        const trimUsername = trim(username);
        const trimPassword = trim(password);

        const regexUsername = /^[\w.@+-]+$/;
        const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if(trimUsername && trimPassword) {

            if(trimUsername.length > 151) {

                validateUsername("Required maximum  150 characters");
                return;
            }

            if(!regexUsername.test(trimUsername)) {

                validateUsername("This is not a valid user name");
                return;
            }

            if (trimPassword.length > 129) {

                validatePassword("Required maximun 128 characters ");
                return;
            }

            if (!regexPassword.test(trimPassword)) {

                validatePassword("This is not a valid password");
                return;
            }

            if(!regexUsername.test(trimUsername) && !regexPassword.test(trimPassword)) {

                PassAndUserValidation(
                    "This is not a valid user name",
                    "This is not a valid Password"
                );
                return;
            }

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
                    //console.log("ErrorCatch:", Error.message);
                    setUser({
                        ...user,
                        errorToken: `${Error.message} username or password is not correct`,
                    });
                    resetErrorForm();
                });
           
        } else if (trimUsername === "" && trimPassword !== "" ) {

            validateUsername("Username Field cannot be left empty");
            
        } else if (trimUsername !== "" && trimPassword === "") {

            validatePassword("Password Field cannot be left empty");
            
        } else {
            PassAndUserValidation(
                "Username Field cannot be left empty", 
                "Password Field cannot be left empty"
            )
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
        validateAndAuthentication(username, password);
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
