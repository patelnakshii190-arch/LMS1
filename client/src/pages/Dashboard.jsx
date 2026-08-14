import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { 
  apiFetch, 
  getStoredUser, 
  logoutUser 
} from "../api_real_fixed4";

import "../styles/dashboard.css";


export default function Dashboard() {


const navigate = useNavigate();


const [user,setUser] = useState(null);

const [enrollments,setEnrollments] = useState([]);

const [assignments,setAssignments] = useState([]);

const [loading,setLoading] = useState(true);



useEffect(()=>{


const currentUser = getStoredUser();


if(!currentUser){

navigate("/");

return;

}


setUser(currentUser);



const loadData = async()=>{

try{


const [
enrollmentData,
assignmentData

] = await Promise.all([

apiFetch("/api/enrollments"),

apiFetch("/api/assignments")

]);


setEnrollments(enrollmentData);

setAssignments(assignmentData);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};



loadData();



},[navigate]);




const logout = ()=>{

logoutUser();

navigate("/");

};



const enrolledCourses = enrollments.length;


const completedCourses = enrollments.filter(
(item)=>item.completed
).length;



const pendingAssignments = assignments.filter(
(item)=>
!["graded","returned"].includes(item.status)

).length;



const overallProgress = enrollments.length

?

Math.round(

enrollments.reduce(
(total,item)=>
total+(item.progress || 0),
0

)
/enrollments.length

)

:0;




return(


<div>


<div className="sidebar">


<h2>LMS</h2>


<ul>


<li>Dashboard</li>


<li>My Courses</li>


<li>Browse Courses</li>


<li>Video Lessons</li>


<li>Notes</li>


<li>Assignments</li>


<li>Quizzes</li>


<li>Certificates</li>



<li
onClick={()=>navigate("/analytics")}
style={{cursor:"pointer"}}
>
📊 Analytics
</li>



<li>Profile</li>


<li>Settings</li>


</ul>



<button onClick={logout}>
Logout
</button>


</div>




<div className="main">


<div className="header">

<p>Student Portal</p>

<h1>
Welcome, {user?.name || "Student"}
</h1>

</div>



{loading ? (

<p>
Loading...
</p>

)

:

(


<div className="cards">


<div className="card">

<h2>{enrolledCourses}</h2>

<p>
Enrolled Courses
</p>

</div>



<div className="card">

<h2>{completedCourses}</h2>

<p>
Completed
</p>

</div>



<div className="card">

<h2>{pendingAssignments}</h2>

<p>
Pending Assignments
</p>

</div>



<div className="card">

<h2>{overallProgress}%</h2>

<p>
Progress
</p>

</div>



</div>


)

}



</div>



</div>


);


}