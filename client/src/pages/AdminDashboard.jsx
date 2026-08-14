import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiFetch,
  getStoredUser,
  logoutUser,
} from "../api_real_fixed4";

import "../styles/dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      navigate("/");
      return;
    }

    setUser(currentUser);

    loadAnalytics();
  }, [navigate]);

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);

      // IMPORTANT:
      // This is the API that you confirmed is working
      const data = await apiFetch("/api/analytics");

      console.log("ANALYTICS DATA:", data);

      setAnalytics(data);
    } catch (error) {
      console.error("Analytics Error:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const logout = () => {
    logoutUser();
    navigate("/");
  };

  const goToAnalytics = () => {
    document
      .getElementById("analytics-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const summary = analytics?.summary || {};

  const records = analytics?.records || [];

  const courseProgress =
    analytics?.courseProgress || [];

  const topStudents =
    analytics?.topStudents || [];

  const studentsNeedImprovement =
    analytics?.studentsNeedImprovement || [];

  const scoreDistribution =
    analytics?.scoreDistribution || [];

  return (
    <div className="dashboard">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <h2>LMS Admin</h2>

        <ul>

          <li>
            Dashboard
          </li>

          <li>
            Users
          </li>

          <li>
            Courses
          </li>

          <li
            onClick={goToAnalytics}
            style={{
              cursor: "pointer",
            }}
          >
            📊 Analytics
          </li>

          <li>
            Certificates
          </li>

          <li>
            Settings
          </li>

        </ul>

        <button onClick={logout}>
          Logout
        </button>

      </div>


      {/* ================= MAIN ================= */}

      <div className="main">

        {/* HEADER */}

        <div className="header">

          <div>

            <p>Admin Portal</p>

            <h1>
              Welcome, {user?.name || "Admin"}
            </h1>

          </div>

        </div>


        {/* ================= EXISTING CARDS ================= */}

        <div className="cards">

          <div className="card">
            <h2>
              {summary.totalStudents ?? 0}
            </h2>

            <p>
              Total Students
            </p>
          </div>


          <div className="card">
            <h2>
              {summary.totalCourses ?? 0}
            </h2>

            <p>
              Total Courses
            </p>
          </div>


          <div className="card">
            <h2>
              {summary.highestScore ?? 0}
            </h2>

            <p>
              Highest Score
            </p>
          </div>


          <div className="card">
            <h2>
              {summary.averageScore ?? 0}%
            </h2>

            <p>
              Average Score
            </p>
          </div>

        </div>


        {/* ================= QUICK ACTION ================= */}

        <div className="courses">

          <h2>
            Quick Actions
          </h2>

          <div
            className="course"
            onClick={goToAnalytics}
            style={{
              cursor: "pointer",
            }}
          >

            <h3>
              📊 Analytics Dashboard
            </h3>

            <p>
              View student performance,
              course progress, scores and
              analytics.
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/*                ANALYTICS SECTION                  */}
        {/* ================================================= */}

        <section
          id="analytics-section"
          className="analytics-section"
        >

          {/* TITLE */}

          <div className="analytics-header">

            <div>

              <h1>
                ANALYTICS
              </h1>

              <p>
                Student performance, course
                progress and platform data.
              </p>

            </div>

            <button
              onClick={loadAnalytics}
              className="refresh-btn"
            >
              🔄 Refresh
            </button>

          </div>


          {/* LOADING */}

          {loadingAnalytics && (
            <div className="analytics-loading">
              Loading analytics...
            </div>
          )}


          {/* DATA */}

          {!loadingAnalytics && analytics && (
            <>

              {/* ================= SUMMARY ================= */}

              <div className="analytics-cards">

                <div className="analytics-card">

                  <span>
                    👨‍🎓
                  </span>

                  <h2>
                    {summary.totalStudents}
                  </h2>

                  <p>
                    Total Students
                  </p>

                </div>


                <div className="analytics-card">

                  <span>
                    📚
                  </span>

                  <h2>
                    {summary.totalCourses}
                  </h2>

                  <p>
                    Total Courses
                  </p>

                </div>


                <div className="analytics-card">

                  <span>
                    📈
                  </span>

                  <h2>
                    {summary.averageScore}%
                  </h2>

                  <p>
                    Average Score
                  </p>

                </div>


                <div className="analytics-card">

                  <span>
                    🚀
                  </span>

                  <h2>
                    {summary.averageProgress}%
                  </h2>

                  <p>
                    Average Progress
                  </p>

                </div>


                <div className="analytics-card">

                  <span>
                    🏆
                  </span>

                  <h2>
                    {summary.highestScore}%
                  </h2>

                  <p>
                    Highest Score
                  </p>

                </div>

              </div>


              {/* ================= CHARTS ================= */}

              <div className="analytics-grid">


                {/* COURSE PROGRESS */}

                <div className="analytics-box">

                  <h2>
                    📚 Course Performance
                  </h2>

                  <p className="analytics-subtitle">
                    Average score and progress by course
                  </p>


                  {courseProgress.map(
                    (course, index) => (

                      <div
                        className="course-stat"
                        key={index}
                      >

                        <div className="course-stat-top">

                          <strong>
                            {course.course}
                          </strong>

                          <span>
                            {course.score}%
                          </span>

                        </div>


                        <div className="progress-bar">

                          <div
                            className="progress-fill"
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />

                        </div>


                        <small>
                          Progress: {course.progress}%
                        </small>

                      </div>

                    )
                  )}

                </div>


                {/* SCORE DISTRIBUTION */}

                <div className="analytics-box">

                  <h2>
                    📊 Score Distribution
                  </h2>

                  <p className="analytics-subtitle">
                    Students grouped by score
                  </p>


                  <div className="bar-chart">

                    {scoreDistribution.map(
                      (item, index) => {

                        const maxCount =
                          Math.max(
                            ...scoreDistribution.map(
                              (x) => x.count
                            ),
                            1
                          );

                        const height =
                          (item.count /
                            maxCount) *
                          100;

                        return (

                          <div
                            className="bar-item"
                            key={index}
                          >

                            <span className="bar-value">
                              {item.count}
                            </span>

                            <div className="bar-wrapper">

                              <div
                                className="bar"
                                style={{
                                  height: `${height}%`,
                                }}
                              />

                            </div>

                            <small>
                              {item.range}
                            </small>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

              </div>


              {/* ================= TOP STUDENTS ================= */}

              <div className="analytics-box">

                <h2>
                  🏆 Top Students
                </h2>

                <p className="analytics-subtitle">
                  Highest performing students
                </p>


                <div className="student-table">

                  <div className="student-row student-heading">

                    <span>
                      Student
                    </span>

                    <span>
                      Course
                    </span>

                    <span>
                      Score
                    </span>

                    <span>
                      Progress
                    </span>

                  </div>


                  {topStudents.map(
                    (student, index) => (

                      <div
                        className="student-row"
                        key={index}
                      >

                        <span>
                          <strong>
                            {index + 1}.{" "}
                            {student.name}
                          </strong>
                        </span>

                        <span>
                          {student.course}
                        </span>

                        <span className="score-good">
                          {student.score}%
                        </span>

                        <span>
                          {student.progress}%
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* ================= NEED IMPROVEMENT ================= */}

              <div className="analytics-box improvement-box">

                <h2>
                  ⚠️ Students Needing Improvement
                </h2>

                <p className="analytics-subtitle">
                  Students with scores below 75%
                </p>


                {studentsNeedImprovement.length === 0 ? (

                  <div className="no-data">
                    🎉 All students are performing well!
                  </div>

                ) : (

                  <div className="student-table">

                    <div className="student-row student-heading">

                      <span>
                        Student
                      </span>

                      <span>
                        Course
                      </span>

                      <span>
                        Score
                      </span>

                      <span>
                        Progress
                      </span>

                    </div>


                    {studentsNeedImprovement.map(
                      (student, index) => (

                        <div
                          className="student-row"
                          key={index}
                        >

                          <span>
                            {student.name}
                          </span>

                          <span>
                            {student.course}
                          </span>

                          <span className="score-low">
                            {student.score}%
                          </span>

                          <span>
                            {student.progress}%
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* ================= ALL RECORDS ================= */}

              <div className="analytics-box">

                <h2>
                  👨‍🎓 Student Performance
                </h2>

                <p className="analytics-subtitle">
                  Complete analytics records
                </p>


                <div className="student-table">

                  <div className="student-row student-heading">

                    <span>
                      Student
                    </span>

                    <span>
                      Course
                    </span>

                    <span>
                      Score
                    </span>

                    <span>
                      Progress
                    </span>

                  </div>


                  {records.map(
                    (student, index) => (

                      <div
                        className="student-row"
                        key={index}
                      >

                        <span>
                          {student.studentName}
                        </span>

                        <span>
                          {student.courseName}
                        </span>

                        <span>
                          {student.score}%
                        </span>

                        <span>
                          {student.progress}%
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            </>
          )}


          {/* NO DATA */}

          {!loadingAnalytics &&
            !analytics && (

              <div className="no-data">
                Unable to load analytics data.
              </div>

            )}

        </section>

      </div>

    </div>
  );
}