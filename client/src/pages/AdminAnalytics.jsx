import { useEffect, useState } from "react";
import { apiFetch } from "../api_real_fixed4";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

import "../styles/analytics.css";

export default function AdminAnalytics() {

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await apiFetch("/api/analytics/admin");
      setAnalytics(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!analytics) {
    return (
      <div className="loading">
        Loading Admin Analytics...
      </div>
    );
  }

  const pieData = [
    {
      name: "Pass",
      value: Number(analytics.passRate)
    },
    {
      name: "Fail",
      value: 100 - Number(analytics.passRate)
    }
  ];

  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="analytics-container">

      <h1>Admin Analytics Dashboard</h1>

      {/* Cards */}

      <div className="analytics-cards">

        <div className="card">
          <h3>Total Students</h3>
          <h2>{analytics.totalStudents}</h2>
        </div>

        <div className="card">
          <h3>Total Quizzes</h3>
          <h2>{analytics.totalQuizzes}</h2>
        </div>

        <div className="card">
          <h3>Highest Score</h3>
          <h2>{analytics.highestScore}</h2>
        </div>

        <div className="card">
          <h3>Average Score</h3>
          <h2>{analytics.averageScore}%</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="analytics-grid">

        <div className="chart-container">

          <h2>Subject Performance</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics.subjectPerformance}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="subject" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="average"
                fill="#2563eb"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-container">

          <h2>Pass / Fail</h2>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >

                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Line Chart */}

      <div className="chart-container">

        <h2>Subject Trend</h2>

        <ResponsiveContainer width="100%" height={350}>

          <LineChart
            data={analytics.subjectPerformance}
          >

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="subject"/>

            <YAxis/>

            <Tooltip/>

            <Legend/>

            <Line
              type="monotone"
              dataKey="average"
              stroke="#2563eb"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* Top Students */}

      <h2>Top Students</h2>

      <table>

        <thead>

          <tr>

            <th>Student</th>

            <th>Course</th>

            <th>Score</th>

          </tr>

        </thead>

        <tbody>

          {analytics.topStudents.map((student, index) => (

            <tr key={index}>

              <td>{student.student}</td>

              <td>{student.course}</td>

              <td>{student.score}</td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* AI Insights */}

      <div className="insight-box">

        <h2>AI Insights</h2>

        <ul>

          <li>
            Highest Score :
            {" "}
            {analytics.highestScore}
          </li>

          <li>
            Average Score :
            {" "}
            {analytics.averageScore}%
          </li>

          <li>
            Pass Rate :
            {" "}
            {analytics.passRate}%
          </li>

          <li>
            Students are performing best in the subject
            with the highest average score.
          </li>

          <li>
            Subjects with averages below 50%
            should receive additional attention.
          </li>

        </ul>

      </div>

    </div>
  );
}