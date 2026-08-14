import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api_real_fixed4";
import "../styles/dashboard.css";


export default function Sidebar() {

    const navigate = useNavigate();


    const logout = () => {
        logoutUser();
        navigate("/");
    };


    return (

        <div className="sidebar">

            <h2>LMS</h2>


            <ul>

                <li>
                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                </li>


                <li>
                    <Link to="/users">
                        Users
                    </Link>
                </li>


                <li>
                    <Link to="/courses">
                        Courses
                    </Link>
                </li>


                <li>

                    <button
                        className="menu-item"
                        onClick={() => navigate("/analytics")}
                    >
                        📊 Analytics
                    </button>

                </li>


                <li>
                    <Link to="/certificates">
                        Certificates
                    </Link>
                </li>


                <li>
                    <Link to="/settings">
                        Settings
                    </Link>
                </li>


            </ul>


            <button 
                className="logout-btn"
                onClick={logout}
            >
                Logout
            </button>


        </div>

    );
}