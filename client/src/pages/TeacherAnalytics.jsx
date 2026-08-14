import { useEffect, useState } from "react";
import { apiFetch } from "../api_real_fixed4";
import "../styles/analytics.css";

export default function TeacherAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const result = await apiFetch("/api/analytics/teacher", {
        method: "GET",
      });

      setData(result);
    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h2>Loading Analytics...</h2>;
  }

  if (!data) {
    return <h2>No analytics data found.</h2>;
  }

  return (
    <div className="analytics-container">

      <h1>Teacher Analytics Dashboard</h1>

      {/* Cards */}

      <div className="analytics-cards">

        <div className="card">
          <h3>Total Students</h3>
          <h2>{data.totalStudents}</h2>
        </div>

        <div className="card">
          <h3>Total Courses</h3>
          <h2>{data.totalCourses}</h2>
        </div>

        <div className="card">
          <h3>Total Quizzes</h3>
          <h2>{data.totalQuizzes}</h2>
        </div>

        <div className="card">
          <h3>Highest Score</h3>
          <h2>{data.highestScore}</h2>
        </div>

        <div className="card">
          <h3>Average Score</h3>
          <h2>{data.averageScore}%</h2>
        </div>

      </div>

      {/* Top Students */}

      <h2>Top Students</h2>

      <table className="analytics-table">

        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>

          {data.topStudents?.map((student, index) => (

            <tr key={index}>
              <td>{student.student}</td>
              <td>{student.course}</td>
              <td>{student.score}</td>
            </tr>

          ))}

        </tbody>

      </table>

      {/* Subject Performance */}

      <h2>Subject Performance</h2>

      <table className="analytics-table">

        <thead>
          <tr>
            <th>Course</th>
            <th>Average Score</th>
          </tr>
        </thead>

        <tbody>

          {data.subjectPerformance?.map((subject, index) => (

            <tr key={index}>
              <td>{subject.course}</td>
              <td>{subject.averageScore}%</td>
            </tr>

          ))}

        </tbody>

      </table>

      {/* Students Needing Help */}

      <h2>Students Needing Improvement</h2>

      <table className="analytics-table">

        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>

          {data.studentsNeedHelp?.map((student, index) => (

            <tr key={index}>
              <td>{student.student}</td>
              <td>{student.course}</td>
              <td>{student.score}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}