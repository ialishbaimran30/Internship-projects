import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/");

    };

    return (

        <nav>

            <Link to="/dashboard">Dashboard</Link>

            {" | "}

            <Link to="/tasks">Tasks</Link>

            {" | "}

            <Link to="/tasks/add">Add Task</Link>

            {" | "}

            <button onClick={logout}>
                Logout
            </button>

        </nav>

    );

}

export default Navbar;