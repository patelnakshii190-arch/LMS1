import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser, logoutUser } from "../api_real_fixed4";
import "../styles/dashboard.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      navigate("/");
      return;
    }

    setUser(currentUser);

    const loadCourses = async () => {
      try {
        const data = await apiFetch("/api/courses");
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCourses();
  }, [navigate]);

  const logout = () => {
    logoutUser();
    navigate("/");
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.studentsEnrolled?.length || 0), 0);
  const pendingReviews = courses.filter((course) => course.status === "pending").length;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>LMS</h2>

        <ul>


<li>
Dashboard
</li>


<li>
My Courses
</li>


<li>
Student Management
</li>


<li>
Upload Content
</li>


<li>
Assignments
</li>


<li>
Reports
</li>



<li
onClick={()=>navigate("/analytics")}
style={{cursor:"pointer"}}
>
📊 Analytics
</li>



<li>
Announcements
</li>


<li>
Profile
</li>


<li>
Settings
</li>


</ul>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="main">
        <div className="header">
          <div>
            <p>Teacher Portal</p>
            <h1>Welcome, {user?.name || "Teacher"}</h1>
          </div>
        </div>

        <div className="cards">
          <div className="card">
            <h2>{courses.length}</h2>
            <p>Assigned Courses</p>
          </div>

          <div className="card">
            <h2>{totalStudents}</h2>
            <p>Students</p>
          </div>

          <div className="card">
            <h2>{pendingReviews}</h2>
            <p>Pending Reviews</p>
          </div>

          <div className="card">
            <h2>{courses.filter((course) => course.status === "approved").length}</h2>
            <p>Approved Courses</p>
          </div>
        </div>

        <div className="courses">
          <h2>Your Courses</h2>

          {courses.length === 0 ? (
            <p>You have not created any courses yet.</p>
          ) : (
            courses.map((course) => (
              <div className="course" key={course._id}>
                <h3>{course.title}</h3>
                <p>Status: {course.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}