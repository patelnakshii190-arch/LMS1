import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/analytics.css";
import "../styles/analytics.css";

export default function Analytics() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load analytics");
        }

        return data;
      })
      .then((data) => {
        console.log("ANALYTICS DATA:", data);

        // Handles either:
        // [ {...}, {...} ]
        // or
        // { data: [ {...}, {...} ] }
        if (Array.isArray(data)) {
          setRecords(data);
        } else if (Array.isArray(data.data)) {
          setRecords(data.data);
        } else {
          setRecords([]);
        }
      })
      .catch((err) => {
        console.error("Analytics error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="analytics-page">
        <h1>Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <h1>Analytics</h1>

        <div className="error-box">
          {error}
        </div>

        <p>
          Check this URL in your browser:
          <br />
          <strong>http://localhost:5000/api/analytics</strong>
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="analytics-page">
        <h1>Analytics</h1>

        <div className="empty-box">
          No analytics records found.
        </div>
      </div>
    );
  }

  const maxScore = 100;

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Student performance and course progress</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="analytics-cards">

        <div className="analytics-card">
          <h3>Total Students</h3>
          <strong>{records.length}</strong>
        </div>

        <div className="analytics-card">
          <h3>Average Score</h3>
          <strong>
            {(
              records.reduce(
                (sum, item) => sum + Number(item.score || 0),
                0
              ) / records.length
            ).toFixed(1)}
            %
          </strong>
        </div>

        <div className="analytics-card">
          <h3>Average Progress</h3>
          <strong>
            {(
              records.reduce(
                (sum, item) => sum + Number(item.progress || 0),
                0
              ) / records.length
            ).toFixed(1)}
            %
          </strong>
        </div>

      </div>

      {/* SCORE CHART */}

      <div className="chart-card">

        <h2>Student Scores</h2>

        <div className="bar-chart">

          {records.map((student, index) => {

            const score = Math.min(
              Number(student.score || 0),
              maxScore
            );

            return (
              <div className="bar-item" key={student._id || index}>

                <div className="bar-value">
                  {score}%
                </div>

                <div className="bar-wrapper">

                  <div
                    className="bar"
                    style={{
                      height: `${score}%`,
                    }}
                  />

                </div>

                <div className="bar-name">
                  {student.studentName || "Student"}
                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* PROGRESS CHART */}

      <div className="chart-card">

        <h2>Course Progress</h2>

        {records.map((student, index) => {

          const progress = Math.min(
            Number(student.progress || 0),
            100
          );

          return (
            <div
              className="progress-row"
              key={student._id || index}
            >

              <div className="progress-info">

                <span>
                  {student.studentName || "Student"}
                </span>

                <span>
                  {progress}%
                </span>

              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <small>
                {student.courseName || "Course"}
              </small>

            </div>
          );
        })}

      </div>

      {/* TABLE */}

      <div className="chart-card">

        <h2>Student Analytics</h2>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Score</th>
                <th>Progress</th>
                <th>Lessons</th>
              </tr>
            </thead>

            <tbody>

              {records.map((student, index) => (

                <tr key={student._id || index}>

                  <td>
                    {student.studentName || "-"}
                  </td>

                  <td>
                    {student.courseName || "-"}
                  </td>

                  <td>
                    {student.score ?? 0}%
                  </td>

                  <td>
                    {student.progress ?? 0}%
                  </td>

                  <td>
                    {student.completedLessons ?? 0}/
                    {student.totalLessons ?? 0}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}