import { Link } from "react-router-dom";

function Navbar() {

    return (

        <nav>

            <Link to="/dashboard">Dashboard</Link> |{" "}

            <Link to="/tasks">Tasks</Link> |{" "}

            <Link to="/tasks/add">Add Task</Link> |{" "}

            <Link to="/notes">Notes</Link> |{" "}

            <Link to="/notes/add">Add Note</Link>

        </nav>

    );

}

export default Navbar;