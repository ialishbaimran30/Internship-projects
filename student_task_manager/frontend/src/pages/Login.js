import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 
function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = () => {

    console.log("Button Clicked");

    api.post("/api/token/", {username,password
    })

    .then((response) => {

        console.log("Success");
        console.log(response.data);

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        navigate("/dashboard");

    })

    .catch((error) => {

        console.log("Error");

        console.log(error.response);

        console.log(error.response?.data);

    });

};
    return (
        <div>
            <h1>Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button>Login</button>
        </div>
    );
}

export default Login;