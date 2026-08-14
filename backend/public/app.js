const authForm = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const nameGroup = document.getElementById("name-group");
const roleGroup = document.getElementById("role-group");
const submitButton = document.getElementById("submit-button");
const messageText = document.getElementById("message");
const dashboardCard = document.getElementById("dashboard-card");
const authCard = document.getElementById("auth-card");
const dashboardContent = document.getElementById("dashboard-content");
const dashboardActions = document.getElementById("dashboard-actions");
const dashboardSection = document.getElementById("dashboard-section");
const goDashboardButton = document.getElementById("go-dashboard-btn");
const logoutButton = document.getElementById("logout-button");

let mode = "register";
let currentUser = null;
let currentSectionData = [];
let dashboardStats = {
  courses: [],
  assignments: [],
  tasks: [],
  quizzes: [],
  videos: [],
  certificates: []
};

const getSolvedQuizzes = () => {
  try {
    return JSON.parse(localStorage.getItem('lms_solved_quizzes') || '{}');
  } catch (error) {
    return {};
  }
};

const setSolvedQuiz = (quizId, result) => {
  const solved = getSolvedQuizzes();
  solved[quizId] = result;
  localStorage.setItem('lms_solved_quizzes', JSON.stringify(solved));
};

const escapeHtml = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const sampleData = {
  courses: [
    { _id: 'sample-course-1', title: 'Web Development Bootcamp', description: 'Learn HTML, CSS, JavaScript and backend basics.', duration: '4h 20m', platformLink: 'https://www.udemy.com/course/the-web-developer-bootcamp/', teacher: { name: 'Ms. Khan' } },
    { _id: 'sample-course-2', title: 'Math Foundations', description: 'Core arithmetic and algebra skills for students.', duration: '3h 10m', platformLink: 'https://www.coursera.org/learn/learn-for-work-math-fundamentals', teacher: { name: 'Mr. Patel' } },
    { _id: 'sample-course-3', title: 'English Communication', description: 'Improve writing, speaking, and reading skills.', duration: '3h 45m', platformLink: 'https://www.udemy.com/course/effective-communication-skills/', teacher: { name: 'Ms. Roy' } }
  ],
  tasks: [
    { title: 'Assignment 1', description: 'Complete chapter 2 exercises and submit the PDF.', dueDate: '2026-08-12', course: { title: 'Web Development Bootcamp' }, teacher: { name: 'Ms. Khan' } },
    { title: 'Assignment 2', description: 'Write a one-page essay on renewable energy.', dueDate: '2026-08-15', course: { title: 'English Communication' }, teacher: { name: 'Ms. Roy' } }
  ],
  quizzes: [
    {
      _id: 'sample-quiz-1',
      title: 'HTML Basics Quiz',
      course: { title: 'Web Development Bootcamp' },
      passingScore: 70,
      questions: [
        {
          question: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'Hyperlinking Text Marking Language'],
          correctAnswer: 'Hyper Text Markup Language'
        },
        {
          question: 'Which element is used for the largest heading?',
          options: ['<heading>', '<h1>', '<h6>', '<title>'],
          correctAnswer: '<h1>'
        }
      ]
    },
    {
      _id: 'sample-quiz-2',
      title: 'Math Fundamentals Quiz',
      course: { title: 'Math Foundations' },
      passingScore: 80,
      questions: [
        {
          question: 'What is 5 + 7?',
          options: ['11', '12', '13', '14'],
          correctAnswer: '12'
        },
        {
          question: 'What is 9 × 3?',
          options: ['18', '24', '27', '30'],
          correctAnswer: '27'
        },
        {
          question: 'If you have ₹10 and spend ₹4, how much amount remains?',
          options: ['₹2', '₹4', '₹6', '₹7'],
          correctAnswer: '₹6'
        }
      ]
    },
    {
      _id: 'sample-quiz-3',
      title: 'CSS Essentials Quiz',
      course: { title: 'Web Development Bootcamp' },
      passingScore: 70,
      questions: [
        {
          question: 'Which CSS property changes the background color?',
          options: ['color', 'background-color', 'font-weight', 'border'],
          correctAnswer: 'background-color'
        },
        {
          question: 'How do you select an element with class name "card"?',
          options: ['#card', '.card', 'card', '*card'],
          correctAnswer: '.card'
        }
      ]
    },
    {
      _id: 'sample-quiz-4',
      title: 'Responsive Design Quiz',
      course: { title: 'Web Development Bootcamp' },
      passingScore: 75,
      questions: [
        {
          question: 'What does CSS media query allow you to do?',
          options: ['Change font style', 'Apply styles based on screen size', 'Change HTML structure', 'Add JavaScript'],
          correctAnswer: 'Apply styles based on screen size'
        },
        {
          question: 'Which unit is best for responsive font size?',
          options: ['px', 'cm', 'rem', 'vw'],
          correctAnswer: 'rem'
        }
      ]
    },
    {
      _id: 'sample-quiz-5',
      title: 'Algebra Quiz',
      course: { title: 'Math Foundations' },
      passingScore: 75,
      questions: [
        {
          question: 'Solve: 4x − 8 = 12',
          options: ['x = 5', 'x = 3', 'x = 4', 'x = 2'],
          correctAnswer: 'x = 5'
        },
        {
          question: 'What is the value of x if 2x + 6 = 14?',
          options: ['2', '3', '4', '5'],
          correctAnswer: '4'
        }
      ]
    },
    {
      _id: 'sample-quiz-6',
      title: 'Writing Skills Quiz',
      course: { title: 'English Communication' },
      passingScore: 70,
      questions: [
        {
          question: 'Which sentence is correct?',
          options: ['She go to school.', 'She goes to school.', 'She going to school.', 'She goed to school.'],
          correctAnswer: 'She goes to school.'
        },
        {
          question: 'Choose the correct past tense of "run".',
          options: ['runned', 'ran', 'run', 'running'],
          correctAnswer: 'ran'
        }
      ]
    },
    {
      _id: 'sample-quiz-7',
      title: 'Speaking Practice Quiz',
      course: { title: 'English Communication' },
      passingScore: 70,
      questions: [
        {
          question: 'Which word is a conjunction?',
          options: ['Because', 'House', 'Blue', 'Quickly'],
          correctAnswer: 'Because'
        },
        {
          question: 'Which phrase is a polite request?',
          options: ['Give me that.', 'Can you help me?', 'Do it now.', 'Stop talking.'],
          correctAnswer: 'Can you help me?'
        }
      ]
    },
    {
      _id: 'sample-quiz-8',
      title: 'JavaScript Basics Quiz',
      course: { title: 'Web Development Bootcamp' },
      passingScore: 75,
      questions: [
        {
          question: 'Which keyword declares a constant in JavaScript?',
          options: ['var', 'let', 'const', 'static'],
          correctAnswer: 'const'
        },
        {
          question: 'What does DOM stand for?',
          options: ['Document Object Model', 'Data Object Method', 'Digital Object Model', 'Document Oriented Markup'],
          correctAnswer: 'Document Object Model'
        }
      ]
    },
    {
      _id: 'sample-quiz-9',
      title: 'Geometry Quiz',
      course: { title: 'Math Foundations' },
      passingScore: 80,
      questions: [
        {
          question: 'What is the area of a rectangle with width 5 and height 8?',
          options: ['40', '13', '26', '20'],
          correctAnswer: '40'
        },
        {
          question: 'A triangle has base 6 and height 4. Its area is?',
          options: ['12', '10', '24', '15'],
          correctAnswer: '12'
        }
      ]
    },
    {
      _id: 'sample-quiz-10',
      title: 'Advanced Grammar Quiz',
      course: { title: 'English Communication' },
      passingScore: 75,
      questions: [
        {
          question: 'Which word is an adverb in the sentence: "She speaks clearly"?',
          options: ['She', 'speaks', 'clearly', 'none'],
          correctAnswer: 'clearly'
        },
        {
          question: 'Choose the correct comparative form of "good".',
          options: ['gooder', 'more good', 'better', 'best'],
          correctAnswer: 'better'
        }
      ]
    },
    {
      _id: 'sample-quiz-11',
      title: 'HTML Structure Quiz',
      course: { title: 'Web Development Bootcamp' },
      passingScore: 70,
      questions: [
        {
          question: 'Which tag contains the main site title?',
          options: ['<header>', '<title>', '<h1>', '<main>'],
          correctAnswer: '<h1>'
        },
        {
          question: 'Where does the <meta> tag belong?',
          options: ['In the body', 'In the head', 'In a footer', 'In a script'],
          correctAnswer: 'In the head'
        }
      ]
    },
    {
      _id: 'sample-quiz-12',
      title: 'Financial Literacy Quiz',
      course: { title: 'Math Foundations' },
      passingScore: 80,
      questions: [
        {
          question: 'If you save ₹15 each week, how much after 4 weeks?',
          options: ['₹45', '₹60', '₹55', '₹50'],
          correctAnswer: '₹60'
        },
        {
          question: 'What is 20% of ₹250?',
          options: ['₹40', '₹50', '₹60', '₹30'],
          correctAnswer: '₹50'
        }
      ]
    }
  ],
  videos: [
    { courseTitle: 'Web Development Bootcamp', lessonTitle: 'Introduction to HTML', videoUrl: 'https://youtu.be/HcOc7P5BMi4?si=hQURq_3hse_JoXs9', description: 'A beginner-friendly first lesson explaining HTML basics.' },
    { courseTitle: 'English Communication', lessonTitle: 'Effective Writing Tips', videoUrl: 'https://youtu.be/ZcljLAmDIY4?si=hS0RerlypRNrFFeQ', description: 'Simple writing techniques for better essays and reports.' },
    { courseTitle: 'Math Foundations', lessonTitle: 'Understanding Percentages', videoUrl: 'https://youtu.be/YJZCadaXjrU?si=gVkoadvCSuaOAV1R', description: 'Learn percentage problems with practical examples.' },
    { courseTitle: 'Web Development Bootcamp', lessonTitle: 'CSS Layouts', videoUrl: 'https://youtu.be/ESnrn1kAD4E?si=9lj--uWhZuNSDdgs', description: 'Learn layout controls with CSS Grid and Flexbox.' }
  ],
  certificates: [
    { course: { title: 'Web Development Bootcamp' }, student: { name: 'Ayesha' }, issuedAt: '2026-07-20' },
    { course: { title: 'Math Foundations' }, student: { name: 'Rohit' }, issuedAt: '2026-07-22' }
  ],
  enrollments: [
    { student: { name: 'Ayesha' }, course: { title: 'Web Development Bootcamp' }, createdAt: '2026-07-25' },
    { student: { name: 'Rohit' }, course: { title: 'Math Foundations' }, createdAt: '2026-07-26' }
  ],
  users: [
    { _id: 'sample-user-1', name: 'Ms. Khan', email: 'khan@example.com', role: 'teacher', createdAt: '2026-06-01' },
    { _id: 'sample-user-2', name: 'Mr. Patel', email: 'patel@example.com', role: 'teacher', createdAt: '2026-06-05' },
    { _id: 'sample-user-3', name: 'Ayesha', email: 'ayesha@example.com', role: 'student', createdAt: '2026-07-10' },
    { _id: 'sample-user-4', name: 'Rohit', email: 'rohit@example.com', role: 'student', createdAt: '2026-07-12' }
  ]
};

const API_BASE = "/api/auth";

const setMode = (newMode) => {
  mode = newMode;
  const isRegister = newMode === "register";
  formTitle.textContent = isRegister ? "Register" : "Login";
  submitButton.textContent = isRegister ? "Register" : "Login";
  showRegister.classList.toggle("active", isRegister);
  showLogin.classList.toggle("active", !isRegister);
  nameGroup.style.display = isRegister ? "block" : "none";
  roleGroup.style.display = isRegister ? "block" : "none";
  messageText.textContent = "";
};

const showMessage = (text, error = false) => {
  messageText.textContent = text;
  messageText.style.color = error ? "#d14343" : "#25603f";
};

const getToken = () => localStorage.getItem("lms_token");

const getApiUrl = (path) => {
  if (typeof path !== 'string') return path;
  if (/^https?:\/\//.test(path)) return path;
  if (window.location.protocol === 'file:') {
    return `http://localhost:5000${path}`;
  }
  return `${window.location.origin}${path}`;
};

const setToken = (token) => localStorage.setItem("lms_token", token);

const clearToken = () => localStorage.removeItem("lms_token");

const fetchDashboardStats = async (user) => {
  try {
    const token = getToken();
    const endpoints = [
      `/api/courses?mine=true`,
      "/api/assignments",
      "/api/assignment-tasks",
      "/api/quizzes",
      "/api/courses?videos=true&mine=true",
      "/api/certificates"
    ];

    const responses = await Promise.all(
      endpoints.map((url) => fetch(getApiUrl(url), {
        headers: { Authorization: `Bearer ${token}` }
      }))
    );

    const results = await Promise.all(
      responses.map((response) => response.ok ? response.json() : [])
    );

    const courseData = Array.isArray(results[0]) ? results[0] : [];
    const taskData = Array.isArray(results[2]) ? results[2] : [];
    const quizData = Array.isArray(results[3]) ? results[3] : [];
    const videoData = Array.isArray(results[4]) ? results[4] : [];
    const certificateData = Array.isArray(results[5]) ? results[5] : [];

    return {
      courses: courseData.length ? courseData : sampleData.courses,
      assignments: Array.isArray(results[1]) ? results[1] : [],
      tasks: taskData.length ? taskData : sampleData.tasks,
      quizzes: quizData.length ? quizData : sampleData.quizzes,
      videos: videoData.length ? videoData : sampleData.videos,
      certificates: certificateData.length ? certificateData : sampleData.certificates
    };
  } catch (error) {
    return {
      courses: [],
      assignments: [],
      tasks: [],
      quizzes: [],
      videos: [],
      certificates: []
    };
  }
};

const getSectionFallback = (section) => {
  switch (section) {
    case 'assignments':
      return sampleData.tasks;
    case 'quizzes':
      return sampleData.quizzes;
    case 'videos':
      return sampleData.videos;
    case 'certificates':
      return sampleData.certificates;
    case 'my-courses':
      return sampleData.courses;
    case 'manage-courses':
      return sampleData.courses;
    case 'student-registration':
      return sampleData.enrollments;
    case 'manage-teachers':
      return sampleData.users.filter((user) => user.role === 'teacher');
    case 'manage-students':
      return sampleData.users.filter((user) => user.role === 'student');
    case 'delete-users':
      return sampleData.users;
      case 'student-registration':
      return sampleData.analytics;
    default:
      return [];
  }
};

const filterAdminSection = (section, query) => {
  const filter = query.trim().toLowerCase();
  if (!filter) return currentSectionData;

  return currentSectionData.filter((item) => {
    if (section === 'manage-courses') {
      return item.title.toLowerCase().includes(filter)
        || item.description?.toLowerCase().includes(filter)
        || item.teacher?.name?.toLowerCase().includes(filter)
        || item.status?.toLowerCase().includes(filter);
    }
    return item.name?.toLowerCase().includes(filter)
      || item.email?.toLowerCase().includes(filter)
      || item.role?.toLowerCase().includes(filter)
      || item.title?.toLowerCase().includes(filter);
  });
};

const attachAdminSearch = (section) => {
  const searchInput = document.getElementById('admin-search-input');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const filtered = filterAdminSection(section, searchInput.value);
    renderSection(section, filtered);
  });
};

const updateAdminCourseStatus = async (courseId, status) => {
  try {
    const response = await fetch(getApiUrl(`/api/admin/courses/${courseId}/status`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || 'Unable to update course.', true);
      return;
    }
    showMessage(`Course ${data.title} set to ${status}.`);
    renderSection('manage-courses');
  } catch (error) {
    showMessage(error.message || 'Network error while updating course.', true);
  }
};

const showDashboard = async () => {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(getApiUrl("/api/dashboard"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Unable to load dashboard. Please login again.");
    }

    const data = await response.json();
    currentUser = data.user;
    await renderDashboard(data.user);
    authCard.classList.add("hidden");
    dashboardCard.classList.remove("hidden");
    goDashboardButton.classList.add("hidden");
    showMessage("");
  } catch (error) {
    clearToken();
    authCard.classList.remove("hidden");
    dashboardCard.classList.add("hidden");
    showMessage(error.message, true);
  }
};

const renderDashboard = async (user) => {
  const isStudent = user.role === "student";
  const isAdmin = user.role === "admin";
  const title = isStudent ? "Student Dashboard" : isAdmin ? "Admin Dashboard" : "Teacher Dashboard";
  const description = isStudent
    ? "View your enrolled courses, assignments, quizzes, videos, and certificates."
    : isAdmin
      ? "Manage teachers, students, courses, users, and system statistics."
      : "Manage your courses, student registrations, assignments, quizzes, videos, and certifications.";

  const heroVisual = isStudent
    ? `
      <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="studentFaceBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8ac7d5" />
            <stop offset="100%" stop-color="#e3f2f6" />
          </linearGradient>
          <filter id="blurGlowStudent" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="18" y="32" width="444" height="276" rx="36" fill="url(#studentFaceBg)" filter="url(#blurGlowStudent)" />
        <circle cx="240" cy="168" r="96" fill="#ffffff" opacity="0.98" />
        <circle cx="240" cy="132" r="42" fill="#4a9cb1" opacity="0.95" />
        <circle cx="240" cy="132" r="18" fill="#ffffff" />
        <path d="M202 172c0 22 16 40 38 40s38-18 38-40" stroke="#4a9cb1" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9" />
        <path d="M210 96c-10 16-14 28-14 42" stroke="#3c7d8d" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.85" />
        <path d="M270 96c10 16 14 28 14 42" stroke="#3c7d8d" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.85" />
        <path d="M174 206c18-12 42-18 66-18s48 6 66 18" stroke="#4a9cb1" stroke-width="10" fill="none" opacity="0.75" />
        <path d="M250 210c12 0 18 8 18 18s-6 18-18 18-18-8-18-18 6-18 18-18z" fill="#4a9cb1" opacity="0.4" />
        <path d="M188 234c14-10 30-14 48-14s34 4 48 14" stroke="#4a9cb1" stroke-width="8" fill="none" opacity="0.45" />
        <rect x="146" y="254" width="188" height="24" rx="12" fill="#d8f0f5" opacity="0.85" />
        <rect x="130" y="64" width="220" height="16" rx="8" fill="#ffffff" opacity="0.55" />
      </svg>
    `
    : `
      <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="teacherFaceBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#84b6d1" />
            <stop offset="100%" stop-color="#dbeaf2" />
          </linearGradient>
          <filter id="blurGlowTeacher" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="18" y="32" width="444" height="276" rx="36" fill="url(#teacherFaceBg)" filter="url(#blurGlowTeacher)" />
        <circle cx="240" cy="120" r="46" fill="#ffffff" />
        <circle cx="240" cy="120" r="24" fill="#4a9cb1" />
        <circle cx="240" cy="120" r="12" fill="#ffffff" />
        <path d="M204 114c0 14 10 26 24 26s24-12 24-26-10-26-24-26-24 12-24 26z" fill="#ffffff" opacity="0.25" />
        <path d="M194 162c20-14 44-22 66-22s46 8 66 22" stroke="#4a9cb1" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9" />
        <path d="M150 188c16-12 36-18 56-18s40 6 56 18" stroke="#4a9cb1" stroke-width="10" fill="none" opacity="0.8" />
        <path d="M132 132c10-18 26-30 44-30s34 12 44 30" stroke="#4a9cb1" stroke-width="10" fill="none" opacity="0.85" />
        <path d="M286 132c10-18 26-30 44-30s34 12 44 30" stroke="#4a9cb1" stroke-width="10" fill="none" opacity="0.85" />
        <path d="M158 228h164v18H158z" fill="#ffffff" opacity="0.65" />
        <path d="M176 256h128v18H176z" fill="#ffffff" opacity="0.45" />
        <circle cx="104" cy="90" r="16" fill="#ffffff" opacity="0.28" />
        <circle cx="376" cy="90" r="14" fill="#ffffff" opacity="0.18" />
      </svg>
    `;

  dashboardStats = await fetchDashboardStats(user);
  const displayStats = {
    courses: dashboardStats.courses.length ? dashboardStats.courses : sampleData.courses,
    tasks: dashboardStats.tasks.length ? dashboardStats.tasks : sampleData.tasks,
    quizzes: dashboardStats.quizzes.length ? dashboardStats.quizzes : sampleData.quizzes,
    videos: dashboardStats.videos.length ? dashboardStats.videos : sampleData.videos,
    certificates: dashboardStats.certificates.length ? dashboardStats.certificates : sampleData.certificates
  };

  const categories = [
    { title: 'Active Courses', count: displayStats.courses.length, detail: 'Courses currently in progress' },
    { title: 'Published Tasks', count: displayStats.tasks.length, detail: 'Assignments created by your instructor' },
    { title: 'Live Exams', count: displayStats.quizzes.length, detail: 'Quizzes ready to take' },
    { title: 'Media Library', count: displayStats.videos.length, detail: 'Video tutorials and lessons' },
    { title: 'Achievement Badges', count: displayStats.certificates.length, detail: 'Certificates and milestones unlocked' }
  ];

  dashboardContent.innerHTML = `
    <div class="dashboard-hero">
      <div>
        <h2>${title}</h2>
        <p class="hero-name">${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p>${description}</p>
      </div>
      <div class="dashboard-hero-visual">
        ${heroVisual}
      </div>
    </div>
    <div class="dashboard-overview">
      ${categories.map((category) => `
        <div class="dashboard-summary-card dashboard-category-card">
          <strong>${category.count}</strong>
          <span>${category.title}</span>
          <p>${category.detail}</p>
        </div>
      `).join('')}
    </div>
  `;

  const sectionIcons = {"analytics": `
<svg viewBox="0 0 24 24">
<path d="M5 19h14v2H5v-2zm2-3h2V8H7v8zm4 0h2V4h-2v12zm4 0h2v-6h-2v6z"/>
</svg>
`,
    "admin-dashboard": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16v4H4V5zm0 6h7v4H4v-4zm0 6h16v2H4v-2z"/></svg>`,
    "manage-teachers": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-6 8c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v1H6v-1zm12 3v1H6v-1c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2z"/></svg>`,
    "manage-students": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-7 14c0-1.66 3.58-3 8-3s8 1.34 8 3v1H5v-1z"/></svg>`,
    "manage-courses": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 4h12a2 2 0 0 1 2 2v12a1 1 0 0 1-1.45.9L12 16.2l-6.55 2.7A1 1 0 0 1 4 18V6a2 2 0 0 1 2-2z"/></svg>`,
    "my-courses": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16v12H4V6zm2 2v2h12V8H6zm0 4v2h8v-2H6zm0 4v2h6v-2H6z"/></svg>`,
    "delete-users": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 7h12v2H6V7zm2 3h2v9H8v-9zm4 0h2v9h-2v-9zm4 0h2v9h-2v-9zM9 4h6v2H9V4z"/></svg>`,
    "statistics": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 19h14v2H5v-2zm3-5h2v5H8v-5zm4-4h2v9h-2V10zm4 2h2v7h-2v-7z"/></svg>`,
    "assignments": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 4h12v2H6V4zm0 4h12v2H6V8zm0 4h8v2H6v-2zm0 4h8v2H6v-2z"/></svg>`,
    "quizzes": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm1 13h-2v-2h2zm0-4h-2V7h2z"/></svg>`,
    "videos": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm2 3v8l7-4-7-4zm11 0H6v8h11V8z"/></svg>`,
    "certificates": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 6 6 .5-4.5 4.5 1.5 6-5-3-5 3 1.5-6L3 8.5 9.5 8 12 2z"/></svg>`
  };

  const sections = user.role === 'admin' ? [
    { key: 'admin-dashboard', label: 'Dashboard' },
    { key: 'manage-teachers', label: 'Manage Teachers' },
    { key: 'manage-students', label: 'Manage Students' },
    { key: 'manage-courses', label: 'Manage Courses' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'delete-users', label: 'Delete Users' },
    { key: 'statistics', label: 'Statistics' }
  ] : [
    { key: user.role === 'teacher' ? 'manage-courses' : 'my-courses', label: user.role === 'teacher' ? 'Manage Courses' : 'My Courses' },
    { key: 'assignments', label: 'Assignments' },
    { key: 'quizzes', label: 'Quizzes' },
    { key: 'videos', label: 'Videos' },
    { key: 'certificates', label: user.role === 'teacher' ? 'Certifications' : 'Certificates' },
    ...(user.role === 'teacher' ? [{ key: 'student-registration', label: 'Student Registration' }] : [])
  ];

  dashboardActions.innerHTML = sections
    .map(
      (section) =>
        `<button class="dashboard-action" data-section="${section.key}"><span class="action-icon">${sectionIcons[section.key] || '➡️'}</span>${section.label}</button>`
    )
    .join("");

  dashboardSection.innerHTML = `<div class="dashboard-placeholder"><p>Choose a category from the menu to view details, progress, and resources.</p></div>`;
  attachDashboardActionListeners();

  const firstSection = dashboardActions.querySelector('button[data-section]');
  if (firstSection) {
    firstSection.classList.add('active');
    renderSection(firstSection.dataset.section);
  }
};

const attachDashboardActionListeners = () => {
  const buttons = dashboardActions.querySelectorAll("button[data-section]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderSection(button.dataset.section);
    });
  });
};
const renderAnalyticsSection = () => {

  const students = [
    {
      name: "Rahul",
      course: "React JS",
      score: 92,
      progress: 95,
      lessons: "19/20"
    },
    {
      name: "Priya",
      course: "Node JS",
      score: 85,
      progress: 80,
      lessons: "16/20"
    },
    {
      name: "Aisha",
      course: "MongoDB",
      score: 78,
      progress: 72,
      lessons: "14/20"
    },
    {
      name: "Rohit",
      course: "JavaScript",
      score: 68,
      progress: 65,
      lessons: "13/20"
    },
    {
      name: "Neha",
      course: "React JS",
      score: 94,
      progress: 98,
      lessons: "20/20"
    },
    {
      name: "Karan",
      course: "Node JS",
      score: 74,
      progress: 70,
      lessons: "14/20"
    }
  ];

  const totalStudents = students.length;

  const courses = new Set(
    students.map(s => s.course)
  ).size;

  const averageScore =
    students.reduce(
      (sum, s) => sum + s.score,
      0
    ) / totalStudents;

  const averageProgress =
    students.reduce(
      (sum, s) => sum + s.progress,
      0
    ) / totalStudents;

  const highestScore =
    Math.max(...students.map(s => s.score));

  const topStudents = [...students]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const needImprovement =
    students.filter(s => s.score < 75);


  dashboardSection.innerHTML = `

    <div class="analytics-container">

      <div class="analytics-header">
        <div>
          <h1>Student Analytics</h1>
          <p>
            Student scores, progress and performance overview
          </p>
        </div>
      </div>


      <!-- SUMMARY CARDS -->

      <div class="analytics-cards">

        <div class="analytics-card">
          <span>👨‍🎓</span>
          <div>
            <small>Total Students</small>
            <strong>${totalStudents}</strong>
          </div>
        </div>

        <div class="analytics-card">
          <span>📚</span>
          <div>
            <small>Total Courses</small>
            <strong>${courses}</strong>
          </div>
        </div>

        <div class="analytics-card">
          <span>🎯</span>
          <div>
            <small>Average Score</small>
            <strong>${averageScore.toFixed(1)}%</strong>
          </div>
        </div>

        <div class="analytics-card">
          <span>📈</span>
          <div>
            <small>Average Progress</small>
            <strong>${averageProgress.toFixed(1)}%</strong>
          </div>
        </div>

        <div class="analytics-card">
          <span>🏆</span>
          <div>
            <small>Highest Score</small>
            <strong>${highestScore}%</strong>
          </div>
        </div>

      </div>


      <!-- CHARTS -->

      <div class="analytics-grid">

        <!-- SCORE CHART -->
        

        <div class="analytics-box">

          <h2>Student Scores</h2>

          <div class="score-chart">

            ${students.map(student => `

              <div class="chart-column">

                <div class="chart-number">
                  ${student.score}%
                </div>

                <div
                  class="chart-bar"
                  style="height:${student.score * 2}px">
                </div>

                <div class="chart-name">
                  ${student.name}
                </div>

              </div>

            `).join("")}

          </div>

        </div>


        <!-- PROGRESS -->

        <div class="analytics-box">

          <h2>Student Progress</h2>

          <div class="progress-list">

            ${students.map(student => `

              <div class="progress-item">

                <div class="progress-title">

                  <span>
                    ${student.name}
                  </span>

                  <strong>
                    ${student.progress}%
                  </strong>

                </div>

                <div class="progress-background">

                  <div
                    class="progress-value"
                    style="width:${student.progress}%">
                  </div>

                </div>

              </div>

            `).join("")}

          </div>

        </div>

      </div>


      <!-- TOP STUDENTS -->

      <div class="analytics-grid">

        <div class="analytics-box">

          <h2>🏆 Top Students</h2>

          ${topStudents.map((student, index) => `

            <div class="student-row">

              <div class="student-rank">
                ${index + 1}
              </div>

              <div class="student-avatar">
                ${student.name.charAt(0)}
              </div>

              <div class="student-details">

                <strong>
                  ${student.name}
                </strong>

                <small>
                  ${student.course}
                </small>

              </div>

              <strong class="student-score">
                ${student.score}%
              </strong>

            </div>

          `).join("")}

        </div>


        <!-- NEED IMPROVEMENT -->

        <div class="analytics-box">

          <h2>⚠️ Needs Improvement</h2>

          ${
            needImprovement.length
              ? needImprovement.map(student => `

                <div class="student-row">

                  <div class="student-avatar warning">
                    ${student.name.charAt(0)}
                  </div>

                  <div class="student-details">

                    <strong>
                      ${student.name}
                    </strong>

                    <small>
                      ${student.course}
                    </small>

                  </div>

                  <strong class="danger-score">
                    ${student.score}%
                  </strong>

                </div>

              `).join("")
              : "<p>All students are doing well.</p>"
          }

        </div>

      </div>


      <!-- TABLE -->

      <div class="analytics-box">

        <div class="table-header">

          <div>
            <h2>Student Performance</h2>
            <p>Complete student performance data</p>
          </div>

        </div>

        <div class="table-scroll">

          <table class="student-table">

            <thead>

              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Score</th>
                <th>Progress</th>
                <th>Lessons</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              ${students.map(student => `

                <tr>

                  <td>
                    <strong>
                      ${student.name}
                    </strong>
                  </td>

                  <td>
                    ${student.course}
                  </td>

                  <td>

                    <span class="score-badge">
                      ${student.score}%
                    </span>

                  </td>

                  <td>

                    <div class="table-progress">

                      <div class="table-progress-background">

                        <div
                          style="width:${student.progress}%">
                        </div>

                      </div>

                      ${student.progress}%

                    </div>

                  </td>

                  <td>
                    ${student.lessons}
                  </td>

                  <td>

                    ${
                      student.score >= 75
                        ? `<span class="status-good">Good</span>`
                        : `<span class="status-warning">Improve</span>`
                    }

                  </td>

                </tr>

              `).join("")}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  `;
};
const renderSection = async (section, filteredData = null) => {
  if (section === "analytics") {
    await renderAnalytics();
    return;
}async function renderAnalytics()
 {
    
    const dashboardSection = document.getElementById("dashboard-section");

    try {
        dashboardSection.innerHTML = `
            <div class="analytics-loading">
                <h2>Loading Analytics...</h2>
            </div>
        `;

        const response = await fetch("/api/analytics");

        if (!response.ok) {
            throw new Error("Failed to load analytics");
        }

        const result = await response.json();

        console.log("ANALYTICS DATA:", result);

        // =====================================================
        // ALL ANALYTICS RECORDS
        // =====================================================

        const records = Array.isArray(result.records)
            ? result.records
            : [];

        // =====================================================
        // UNIQUE STUDENTS
        // =====================================================

        const uniqueStudents = [
            ...new Set(
                records
                    .map(item => item.studentName)
                    .filter(Boolean)
            )
        ];

        // =====================================================
        // UNIQUE COURSES
        // =====================================================

        const uniqueCourses = [
            ...new Set(
                records
                    .map(item => item.courseName)
                    .filter(Boolean)
            )
        ];

        // =====================================================
        // BASIC CALCULATIONS
        // =====================================================

        const scores = records
            .map(item => Number(item.score))
            .filter(score => !isNaN(score));

        const progresses = records
            .map(item => Number(item.progress))
            .filter(progress => !isNaN(progress));

        const averageScore = scores.length
            ? Math.round(
                scores.reduce((sum, score) => sum + score, 0) /
                scores.length
            )
            : 0;

        const averageProgress = progresses.length
            ? Math.round(
                progresses.reduce((sum, progress) => sum + progress, 0) /
                progresses.length
            )
            : 0;

        const highestScore = scores.length
            ? Math.max(...scores)
            : 0;

        // =====================================================
        // COURSE PERFORMANCE
        // =====================================================

        const courseMap = {};

        records.forEach(item => {
            const course = item.courseName || "Unknown Course";

            if (!courseMap[course]) {
                courseMap[course] = {
                    scores: [],
                    progresses: []
                };
            }

            if (!isNaN(Number(item.score))) {
                courseMap[course].scores.push(
                    Number(item.score)
                );
            }

            if (!isNaN(Number(item.progress))) {
                courseMap[course].progresses.push(
                    Number(item.progress)
                );
            }
        });

        const coursePerformance = Object.entries(courseMap)
            .map(([course, values]) => {

                const score = values.scores.length
                    ? Math.round(
                        values.scores.reduce(
                            (sum, value) => sum + value,
                            0
                        ) / values.scores.length
                    )
                    : 0;

                const progress = values.progresses.length
                    ? Math.round(
                        values.progresses.reduce(
                            (sum, value) => sum + value,
                            0
                        ) / values.progresses.length
                    )
                    : 0;

                return {
                    course,
                    score,
                    progress
                };
            })
            .sort((a, b) => b.score - a.score);

        // =====================================================
        // SCORE DISTRIBUTION
        // =====================================================
  
        const scoreDistribution = {
            "90-100": 0,
            "80-89": 0,
            "70-79": 0,
            "Below 70": 0
        };

        scores.forEach(score => {

            if (score >= 90) {
                scoreDistribution["90-100"]++;
            } else if (score >= 80) {
                scoreDistribution["80-89"]++;
            } else if (score >= 70) {
                scoreDistribution["70-79"]++;
            } else {
                scoreDistribution["Below 70"]++;
            }

        });

        // =====================================================
        // TOP STUDENTS
        // Average score for each student
        // =====================================================

        const studentMap = {};

        records.forEach(item => {

            const name = item.studentName || "Unknown Student";

            if (!studentMap[name]) {
                studentMap[name] = {
                    scores: [],
                    progresses: [],
                    courses: []
                };
            }

            const score = Number(item.score);
            const progress = Number(item.progress);

            if (!isNaN(score)) {
                studentMap[name].scores.push(score);
            }

            if (!isNaN(progress)) {
                studentMap[name].progresses.push(progress);
            }

            if (item.courseName) {
                studentMap[name].courses.push(item.courseName);
            }

        });

        const studentPerformance = Object.entries(studentMap)
            .map(([name, values]) => {

                const score = values.scores.length
                    ? Math.round(
                        values.scores.reduce(
                            (sum, value) => sum + value,
                            0
                        ) / values.scores.length
                    )
                    : 0;

                const progress = values.progresses.length
                    ? Math.round(
                        values.progresses.reduce(
                            (sum, value) => sum + value,
                            0
                        ) / values.progresses.length
                    )
                    : 0;

                return {
                    name,
                    score,
                    progress,
                    course: values.courses.join(", ")
                };

            })
            .sort((a, b) => b.score - a.score);

        const topStudents = studentPerformance.slice(0, 5);

        // =====================================================
        // STUDENTS NEEDING IMPROVEMENT
        // =====================================================

        const studentsNeedImprovement = studentPerformance
            .filter(student => student.score < 75)
            .sort((a, b) => a.score - b.score);

        // =====================================================
        // COURSE HTML
        // =====================================================

        const courseHTML = coursePerformance.length
            ? coursePerformance.map(course => `
                <div class="analytics-course">

                    <div class="analytics-course-header">
                        <strong>${course.course}</strong>
                        <span>${course.score}%</span>
                    </div>

                    <div class="analytics-bar-background">
                        <div
                            class="analytics-bar"
                            style="width: ${course.score}%"
                        ></div>
                    </div>

                    <div class="analytics-course-progress">
                        Progress: ${course.progress}%
                    </div>

                </div>
            `).join("")
            : `
                <p class="analytics-empty">
                    No course data available.
                </p>
            `;

        // =====================================================
        // SCORE DISTRIBUTION HTML
        // =====================================================

        const distributionHTML = Object.entries(scoreDistribution)
            .map(([range, count]) => {

                const maxCount = Math.max(
                    ...Object.values(scoreDistribution),
                    1
                );

                const width = (count / maxCount) * 100;

                return `
                    <div class="distribution-row">

                        <div class="distribution-label">
                            <span>${range}</span>
                            <strong>${count}</strong>
                        </div>

                        <div class="distribution-background">
                            <div
                                class="distribution-fill"
                                style="width: ${width}%"
                            ></div>
                        </div>

                    </div>
                `;

            })
            .join("");

        // =====================================================
        // TOP STUDENTS HTML
        // =====================================================

        const topStudentsHTML = topStudents.length
            ? topStudents.map((student, index) => {

                const medal =
                    index === 0 ? "🥇" :
                    index === 1 ? "🥈" :
                    index === 2 ? "🥉" :
                    `#${index + 1}`;

                return `
                    <div class="top-student">

                        <div class="student-rank">
                            ${medal}
                        </div>

                        <div class="student-info">

                            <strong>
                                ${student.name}
                            </strong>

                            <span>
                                ${student.course || "Multiple Courses"}
                            </span>

                        </div>

                        <div class="student-score">
                            ${student.score}%
                        </div>

                    </div>
                `;

            }).join("")
            : `
                <p class="analytics-empty">
                    No student data available.
                </p>
            `;

        // =====================================================
        // NEED IMPROVEMENT HTML
        // =====================================================

        const improvementHTML = studentsNeedImprovement.length
            ? studentsNeedImprovement.map(student => `
                <div class="improvement-student">

                    <div>
                        <strong>
                            ${student.name}
                        </strong>

                        <span>
                            ${student.course || "Multiple Courses"}
                        </span>
                    </div>

                    <div class="improvement-score">
                        ${student.score}%
                    </div>

                </div>
            `).join("")
            : `
                <div class="all-good">
                    ✓ All students are performing well.
                </div>
            `;

        // =====================================================
        // COMPLETE ANALYTICS UI
        // =====================================================

        dashboardSection.innerHTML = `

            <div class="analytics-container">

                <!-- HEADER -->

                <div class="analytics-header">

                    <div>
                        <h1>Analytics</h1>

                        <p>
                            Student performance, course progress
                            and platform data.
                        </p>
                    </div>

                    <div class="analytics-record-count">
                        ${records.length} Records
                    </div>

                </div>


                <!-- SUMMARY CARDS -->

                <div class="analytics-summary-grid">

                    <div class="analytics-summary-card">

                        <div class="analytics-card-icon">
                            👨‍🎓
                        </div>

                        <div>
                            <h2>
                                ${uniqueStudents.length}
                            </h2>

                            <p>
                                Students
                            </p>
                        </div>

                    </div>


                    <div class="analytics-summary-card">

                        <div class="analytics-card-icon">
                            📚
                        </div>

                        <div>
                            <h2>
                                ${uniqueCourses.length}
                            </h2>

                            <p>
                                Courses
                            </p>
                        </div>

                    </div>


                    <div class="analytics-summary-card">

                        <div class="analytics-card-icon">
                            🎯
                        </div>

                        <div>
                            <h2>
                                ${averageScore}%
                            </h2>

                            <p>
                                Average Score
                            </p>
                        </div>

                    </div>


                    <div class="analytics-summary-card">

                        <div class="analytics-card-icon">
                            📈
                        </div>

                        <div>
                            <h2>
                                ${averageProgress}%
                            </h2>

                            <p>
                                Average Progress
                            </p>
                        </div>

                    </div>


                    <div class="analytics-summary-card">

                        <div class="analytics-card-icon">
                            🏆
                        </div>

                        <div>
                            <h2>
                                ${highestScore}%
                            </h2>

                            <p>
                                Highest Score
                            </p>
                        </div>

                    </div>

                </div>


                <!-- COURSE + SCORE DISTRIBUTION -->

                <div class="analytics-two-column">


                    <!-- COURSE PERFORMANCE -->

                    <div class="analytics-panel">

                        <div class="analytics-panel-title">

                            <div>
                                <h2>Course Performance</h2>

                                <p>
                                    Average score and progress by course
                                </p>
                            </div>

                        </div>

                        <div class="course-performance-list">

                            ${courseHTML}

                        </div>

                    </div>


                    <!-- SCORE DISTRIBUTION -->

                    <div class="analytics-panel">

                        <div class="analytics-panel-title">

                            <div>
                                <h2>Score Distribution</h2>

                                <p>
                                    Student score ranges
                                </p>
                            </div>

                        </div>

                        <div class="distribution-list">

                            ${distributionHTML}

                        </div>

                    </div>

                </div>


                <!-- TOP STUDENTS + IMPROVEMENT -->

                <div class="analytics-two-column">


                    <!-- TOP STUDENTS -->

                    <div class="analytics-panel">

                        <div class="analytics-panel-title">

                            <div>
                                <h2>Top Students</h2>

                                <p>
                                    Highest performing students
                                </p>
                            </div>

                        </div>

                        <div class="top-students-list">

                            ${topStudentsHTML}

                        </div>

                    </div>


                    <!-- NEED IMPROVEMENT -->

                    <div class="analytics-panel">

                        <div class="analytics-panel-title">

                            <div>
                                <h2>Students Needing Improvement</h2>

                                <p>
                                    Students scoring below 75%
                                </p>
                            </div>

                        </div>

                        <div class="improvement-list">

                            ${improvementHTML}

                        </div>

                    </div>

                </div>


                <!-- STUDENT PERFORMANCE TABLE -->

                <div class="analytics-panel analytics-table-panel">

                    <div class="analytics-panel-title">

                        <div>

                            <h2>Student Performance</h2>

                            <p>
                                Complete performance records
                            </p>

                        </div>

                        <span>
                            ${records.length} records
                        </span>

                    </div>


                    <div class="analytics-table-wrapper">

                        <table class="analytics-table">

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

                                ${
                                    records.length === 0
                                        ? `
                                            <tr>
                                                <td
                                                    colspan="5"
                                                    class="analytics-empty"
                                                >
                                                    No analytics records found.
                                                </td>
                                            </tr>
                                        `
                                        : records.map(student => `

                                            <tr>

                                                <td>
                                                    <strong>
                                                        ${student.studentName || "Unknown"}
                                                    </strong>
                                                </td>

                                                <td>
                                                    ${student.courseName || "Unknown"}
                                                </td>

                                                <td>

                                                    <span class="score-badge">
                                                        ${student.score ?? 0}%
                                                    </span>

                                                </td>

                                                <td>

                                                    <div class="table-progress">

                                                        <div
                                                            class="table-progress-fill"
                                                            style="
                                                                width: ${student.progress ?? 0}%
                                                            "
                                                        ></div>

                                                    </div>

                                                    <span>
                                                        ${student.progress ?? 0}%
                                                    </span>

                                                </td>

                                                <td>

                                                    ${
                                                        student.completedLessons ?? 0
                                                    }

                                                    /

                                                    ${
                                                        student.totalLessons ?? 0
                                                    }

                                                </td>

                                            </tr>

                                        `).join("")
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Analytics Error:", error);

        dashboardSection.innerHTML = `
            <div class="analytics-error">

                <h2>Analytics</h2>

                <p>
                    Failed to load analytics data.
                </p>

                <small>
                    ${error.message}
                </small>

            </div>
        `;
    }
}
  const user = currentUser || {};
  let title = "";
  let subtitle = "";
  let endpoint = null;

  switch (section) {
    case "my-courses":
      title = "My Courses";
      subtitle = "These are your enrolled courses.";
      endpoint = "/api/courses?mine=true";
      break;
    case "manage-courses":
      title = "Manage Courses";
      subtitle = user.role === 'admin' ? 'Review all courses in the system.' : 'Courses you created or manage.';
      endpoint = user.role === 'admin' ? "/api/admin/courses" : "/api/courses?mine=true";
      break;
    case "student-registration":
      title = "Student Registration";
      subtitle = "View student enrollments for your courses.";
      endpoint = "/api/enrollments?teacher=true";
      break;
    case "assignments":
      title = "Assignments";
      subtitle = user.role === "student"
        ? "Review assignment tasks and complete them."
        : "Create assignments and publish them for students.";
      endpoint = "/api/assignment-tasks";
      break;
    case "manage-teachers":
      title = "Manage Teachers";
      subtitle = "Review and manage teacher accounts.";
      endpoint = "/api/admin/users?role=teacher";
      break;
    case "manage-students":
      title = "Manage Students";
      subtitle = "Review and manage student accounts.";
      endpoint = "/api/admin/users?role=student";
      break;
    case "delete-users":
      title = "Delete Users";
      subtitle = "Delete old or inactive users from the system.";
      endpoint = "/api/admin/users";
      break;
    case "statistics":
      title = "Statistics";
      subtitle = "System analytics and user activity overview.";
      endpoint = "/api/admin/analytics";
      break;
    case "quizzes":
      title = "Quizzes";
      subtitle = user.role === "student"
        ? "Take quizzes and review results."
        : "Create quizzes and manage student assessments.";
      endpoint = "/api/quizzes";
      break;
      case "analytics":
      title = "Analytics";
      subtitle = "Student performance, course progress and platform data.";
      endpoint = "/api/analytics";
break;
    case "videos":
      title = "Videos";
      subtitle = user.role === "student"
        ? "Watch instructional videos."
        : "Add and manage course videos.";
      endpoint = "/api/courses?videos=true&mine=true";
      break;
    case "certificates":
      title = "Certificates";
      subtitle = user.role === "student"
        ? "View your earned certificates."
        : "Issue certificates to successful students.";
      endpoint = "/api/certificates";
      break;
    default:
      dashboardSection.innerHTML = `<p>Select a section to view details.</p>`;
      return;
  }

  if (section === 'admin-dashboard') {
    dashboardSection.innerHTML = `<p>Loading admin analytics...</p>`;
    let displayStats = {
      totalUsers: sampleData.users.length,
      totalCourses: sampleData.courses.length,
      totalEnrollments: sampleData.enrollments.length,
      totalAssignments: sampleData.tasks.length,
      approvedCourses: sampleData.courses.length,
      totalQuizzes: sampleData.quizzes.length,
      totalVideos: sampleData.videos.length,
      totalCertificates: sampleData.certificates.length
    };

    try {
      const analyticsResponse = await fetch(getApiUrl('/api/admin/analytics'), {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json();
        displayStats = { ...displayStats, ...analytics };
      }
    } catch (error) {
      // keep sample fallback data
    }

 dashboardSection.innerHTML = `
      <div class="section-header">
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
        <div class="section-count">${data.length} items</div>
      </div>

      ${analyticsChart}

      <div class="dashboard-item-wrapper">${rows}</div>
  
      
        <div>
          <h2>Admin Dashboard</h2>
          <p>Monitor system activity, courses, users, and resources.</p>
        </div>
      </div>
      <div class="dashboard-overview">
        <div class="dashboard-summary-card dashboard-category-card"><strong>${displayStats.totalUsers}</strong><span>Users</span><p>Teachers and students in the system.</p></div>
        <div class="dashboard-summary-card dashboard-category-card"><strong>${displayStats.totalCourses}</strong><span>Courses</span><p>Total published and active courses.</p></div>
        <div class="dashboard-summary-card dashboard-category-card"><strong>${displayStats.totalQuizzes}</strong><span>Quizzes</span><p>Quizzes created across the platform.</p></div>
        <div class="dashboard-summary-card dashboard-category-card"><strong>${displayStats.totalVideos}</strong><span>Videos</span><p>Lesson and tutorial resources.</p></div>
        <div class="dashboard-summary-card dashboard-category-card"><strong>${displayStats.totalCertificates}</strong><span>Certificates</span><p>Achievements issued to learners.</p></div>
      </div>
    `;
    return;
  }

  dashboardSection.innerHTML = `<p>Loading ${title.toLowerCase()}...</p>`;

  try {
    const response = await fetch(getApiUrl(endpoint), {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Could not load ${title.toLowerCase()}.`);
    }

    const responseData = await response.json();
    let fetchedData;

if (section === "analytics") {
  fetchedData = responseData.records || [];
} else if (section === "statistics") {
  fetchedData = responseData;
} else {
  fetchedData = Array.isArray(responseData)
    ? (responseData.length
        ? responseData
        : getSectionFallback(section))
    : getSectionFallback(section);
}

    const data = filteredData !== null ? filteredData : fetchedData;
    currentSectionData = Array.isArray(data) ? data : [];

    if (section === "manage-courses") {
      const isAdminView = user.role === 'admin';
      const searchBar = isAdminView ? `
        <div class="section-search-bar">
          <input type="search" id="admin-search-input" placeholder="Search courses, teachers, status..." />
        </div>
      ` : '';

      const courseRows = data.map((item) => {
        const statusTag = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending';
        return `
          <div class="dashboard-item">
            <h3>${item.title}</h3>
            <p>${item.description || item.course?.description || 'No description available.'}</p>
            <div class="item-meta">
              <span>Teacher: ${item.teacher?.name || 'TBD'}</span>
              <span>Duration: ${item.duration || item.course?.duration || 'N/A'}</span>
              ${item.platformLink || item.course?.platformLink ? `<a class="course-link" href="${item.platformLink || item.course?.platformLink}" target="_blank">Platform Link</a>` : ''}
              <span>Status: ${statusTag}</span>
              ${isAdminView ? `
                <div class="course-action-row">
                  <button class="course-action-button" data-course-id="${item._id}" data-status="approved">Approve</button>
                  <button class="course-action-button reject" data-course-id="${item._id}" data-status="rejected">Reject</button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      dashboardSection.innerHTML = `
        <div class="section-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="section-count">${data.length} courses</div>
        </div>
        ${searchBar}
        <div class="dashboard-item-wrapper">${courseRows}</div>
      `;

      if (isAdminView) {
        document.querySelectorAll('.course-action-button').forEach((button) => {
          button.addEventListener('click', () => updateAdminCourseStatus(button.dataset.courseId, button.dataset.status));
        });
        attachAdminSearch(section);
      }
      return;
    }

    if (section === "assignments") {
      const taskRows = data.map((item, index) => {
        return `
          <div class="dashboard-item">
            <h3>Assignment ${index + 1}</h3>
            <strong>${item.title}</strong>
            <p>${item.description || 'No task description provided.'}</p>
            <div class="item-meta">
              <span>Course: ${item.course?.title || 'Unknown course'}</span>
              <span>Due: ${item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}</span>
              ${item.attachmentUrl ? `<a href="${item.attachmentUrl}" target="_blank">Attachment</a>` : ''}
              ${user.role === 'teacher'
                ? `<span>Created by you</span>`
                : `<span>Teacher: ${item.teacher?.name || 'N/A'}</span>`}
            </div>
          </div>
        `;
      }).join('');

      const teacherForm = user.role === 'teacher' ? `
        <form id="assignment-task-form" class="dashboard-form">
          <h3>Create New Assignment</h3>
          <div class="form-grid">
            <label>
              Course
              <select name="courseId" required>
                ${dashboardStats.courses.map((course) => `<option value="${course._id}">${course.title}</option>`).join('')}
              </select>
            </label>
            <label>
              Title
              <input type="text" name="title" required />
            </label>
            <label>
              Due Date
              <input type="date" name="dueDate" />
            </label>
            <label class="full-width">
              Description
              <textarea name="description" rows="4"></textarea>
            </label>
            <label class="full-width">
              Attachment
              <input type="file" name="attachment" />
            </label>
            <button type="submit" class="submit-button">Publish Assignment</button>
          </div>
        </form>
      ` : '';

      dashboardSection.innerHTML = `
        <div class="section-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="section-count">${data.length} items</div>
        </div>
        ${teacherForm}
        <div class="dashboard-item-wrapper">${taskRows}</div>
      `;

      if (user.role === 'teacher') {
        const taskForm = document.getElementById('assignment-task-form');
        taskForm?.addEventListener('submit', submitAssignmentTask);
      }
      return;
    }

    if (section === "quizzes") {
      const solvedQuizzes = getSolvedQuizzes();
      const quizRows = data.map((item, index) => {
        const quizId = item._id || item.title;
        const solved = solvedQuizzes[quizId];
        const solvedStatus = solved ? `<div class="quiz-result-status">Quiz solved: <strong>${solved.correct}/${solved.total}</strong> correct — <strong>${solved.score}%</strong></div>` : '';
        const questionBlocks = item.questions?.map((question, qIndex) => {
          const optionsMarkup = question.options?.map((option) => `
            <label class="quiz-option">
              <input type="radio" name="question-${qIndex}" value="${escapeHtml(option)}" ${solved ? 'disabled' : ''} required />
              <span>${escapeHtml(option)}</span>
            </label>
          `).join('') || '';
          return `
            <fieldset class="quiz-question">
              <legend>Q${qIndex + 1}. ${escapeHtml(question.question)}</legend>
              <div class="quiz-options">${optionsMarkup}</div>
            </fieldset>
          `;
        }).join('');

        const reviewMarkup = solved ? `
          <div class="quiz-review">
            <h4>Review answers</h4>
            ${solved.details?.map((detail, reviewIndex) => `
              <div class="quiz-review-item ${detail.isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Q${reviewIndex + 1}.</strong> ${escapeHtml(detail.question)}</p>
                <p>Your answer: <span>${escapeHtml(detail.selected || 'No answer')}</span></p>
                <p>Correct answer: <span>${escapeHtml(detail.correctAnswer)}</span></p>
              </div>
            `).join('')}
          </div>
        ` : '';

        return `
          <div class="dashboard-item quiz-card${solved ? ' quiz-solved' : ''}">
            <div class="quiz-card-header">
              <div>
                <h3>Quiz ${index + 1}: ${escapeHtml(item.title)}</h3>
                <p>Course: ${escapeHtml(item.course?.title || item.courseTitle || 'General')}</p>
              </div>
              <div class="quiz-meta">
                <span>Questions: ${item.questions?.length || 0}</span>
                <span>Passing Score: ${item.passingScore || 0}%</span>
              </div>
            </div>
            ${solvedStatus}
            <form class="quiz-form" data-quiz-id="${quizId}">
              ${questionBlocks}
              ${solved ? `<p class="quiz-solved-note">You have already completed this quiz.</p>` : '<button type="submit" class="submit-button">Submit Answers</button>'}
            </form>
            ${reviewMarkup}
          </div>
        `;
      }).join('');

      const teacherQuizForm = user.role === 'teacher' ? `
        <form id="quiz-create-form" class="dashboard-form">
          <h3>Create Quiz</h3>
          <div class="form-grid">
            <label>
              Course
              <select name="courseId" required>
                ${dashboardStats.courses.map((course) => `<option value="${course._id}">${course.title}</option>`).join('')}
              </select>
            </label>
            <label>
              Quiz Title
              <input type="text" name="title" required />
            </label>
            <label>
              Passing Score
              <input type="number" name="passingScore" min="0" max="100" value="60" />
            </label>
            <label class="full-width">
              Question
              <input type="text" name="question" required />
            </label>
            <label>
              Option 1
              <input type="text" name="option1" required />
            </label>
            <label>
              Option 2
              <input type="text" name="option2" required />
            </label>
            <label>
              Option 3
              <input type="text" name="option3" required />
            </label>
            <label>
              Option 4
              <input type="text" name="option4" required />
            </label>
            <label>
              Correct Answer
              <select name="correctAnswer" required>
                <option value="">Select correct answer</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </select>
            </label>
            <button type="submit" class="submit-button">Publish Quiz</button>
          </div>
        </form>
      ` : '';

      dashboardSection.innerHTML = `
        <div class="section-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="section-count">${data.length} items</div>
        </div>
        ${teacherQuizForm}
        <div class="dashboard-item-wrapper">${quizRows}</div>
      `;

      if (user.role === 'teacher') {
        const quizForm = document.getElementById('quiz-create-form');
        quizForm?.addEventListener('submit', submitQuiz);
      }
      if (user.role === 'student') {
        document.querySelectorAll('.quiz-form').forEach((form) => {
          form.addEventListener('submit', handleQuizSubmit);
        });
      }
      return;
    }

    if (section === 'manage-teachers' || section === 'manage-students') {
      const userRows = data.map((item) => `
        <div class="dashboard-item">
          <h3>${item.name}</h3>
          <p>${item.email}</p>
          <div class="item-meta">
            <span>Role: ${item.role}</span>
            <span>Joined: ${new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');

      dashboardSection.innerHTML = `
        <div class="section-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="section-count">${data.length} users</div>
        </div>
        <div class="dashboard-item-wrapper">${userRows}</div>
      `;
      return;
    }

    if (section === 'delete-users') {
      const userRows = data.map((item) => `
        <div class="dashboard-item">
          <h3>${item.name}</h3>
          <p>${item.email}</p>
          <div class="item-meta">
            <span>Role: ${item.role}</span>
            <button class="delete-user-button" data-user-id="${item._id}">Delete</button>
          </div>
        </div>
      `).join('');

      dashboardSection.innerHTML = `
        <div class="section-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="section-count">${data.length} users</div>
        </div>
        <div class="dashboard-item-wrapper">${userRows}</div>
      `;

      document.querySelectorAll('.delete-user-button').forEach((button) => {
        button.addEventListener('click', () => deleteUser(button.dataset.userId));
      });
      return;
    }

    if (section === 'statistics') {if(section === "analytics") {

let analyticsData = {
totalStudents: 120,
totalTeachers: 15,
totalCourses: 25,
averageScore: 78,
completionRate: 65
};


try {

const response = await fetch(getApiUrl('/api/admin/analytics'),{
headers:{
Authorization:`Bearer ${getToken()}`
}
});


if(response.ok){
const data = await response.json();
analyticsData = {...analyticsData,...data};
}


}catch(error){
console.log("Using demo analytics");
}



dashboardSection.innerHTML = `

<div class="section-header">
<div>
<h2>Analytics Dashboard</h2>
<p>Track student progress and LMS performance.</p>
</div>
</div>


<div class="dashboard-overview">


<div class="dashboard-summary-card dashboard-category-card">
<strong>${analyticsData.totalStudents}</strong>
<span>Total Students</span>
<p>Registered learners</p>
</div>


<div class="dashboard-summary-card dashboard-category-card">
<strong>${analyticsData.totalTeachers}</strong>
<span>Total Teachers</span>
<p>Active instructors</p>
</div>


<div class="dashboard-summary-card dashboard-category-card">
<strong>${analyticsData.totalCourses}</strong>
<span>Total Courses</span>
<p>Available courses</p>
</div>


<div class="dashboard-summary-card dashboard-category-card">
<strong>${analyticsData.averageScore}%</strong>
<span>Average Score</span>
<p>Student performance</p>
</div>


<div class="dashboard-summary-card dashboard-category-card">
<strong>${analyticsData.completionRate}%</strong>
<span>Completion Rate</span>
<p>Course completion</p>
</div>


</div>


<div class="analytics-chart">

<h3>Student Progress</h3>

<div class="progress-bar">
<div style="width:${analyticsData.completionRate}%">
${analyticsData.completionRate}%
</div>
</div>


<h3>Performance Overview</h3>

<ul>

<li>Average Quiz Score : ${analyticsData.averageScore}%</li>

<li>Courses Completed : ${analyticsData.completionRate}%</li>

<li>Active Students : ${analyticsData.totalStudents}</li>

</ul>


</div>

`;

return;

}
      dashboardSection.innerHTML = `
        <div class="section-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
        </div>
        <div class="dashboard-overview">
          <div class="dashboard-summary-card dashboard-category-card"><strong>${data.totalUsers}</strong><span>Users</span><p>Total registered users.</p></div>
          <div class="dashboard-summary-card dashboard-category-card"><strong>${data.totalCourses}</strong><span>Courses</span><p>Total courses in the system.</p></div>
          <div class="dashboard-summary-card dashboard-category-card"><strong>${data.totalEnrollments}</strong><span>Enrollments</span><p>Active course enrollments.</p></div>
          <div class="dashboard-summary-card dashboard-category-card"><strong>${data.totalAssignments}</strong><span>Assignments</span><p>Assignments created across the platform.</p></div>
          <div class="dashboard-summary-card dashboard-category-card"><strong>${data.approvedCourses}</strong><span>Approved Courses</span><p>Courses approved for students.</p></div>
        </div>
      `;
      return;
    }

    if (data.length === 0) {
      dashboardSection.innerHTML = `
        <div class="section-header">
          <div>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div class="section-count">0 items</div>
        </div>
        <p>No records found.</p>
      `;
      return;
    }

    // ======================================================
// ANALYTICS SECTION
// ======================================================

if (section === "analytics") {

  // Your API returns:
  // {
  //   success: true,
  //   summary: {...},
  //   records: [...]
  // }

  const analyticsData = Array.isArray(data)
    ? data
    : (data.records || []);

  const summary = Array.isArray(data)
    ? {}
    : (data.summary || {});

  // -----------------------------------------
  // BASIC SUMMARY
  // -----------------------------------------

  const totalStudents =
    summary.totalStudents || analyticsData.length;

  const totalCourses =
    summary.totalCourses ||
    new Set(
      analyticsData.map(item => item.courseName)
    ).size;

  const averageScore =
    summary.averageScore ||
    (
      analyticsData.reduce(
        (sum, item) => sum + Number(item.score || 0),
        0
      ) / (analyticsData.length || 1)
    ).toFixed(1);

  const averageProgress =
    summary.averageProgress ||
    (
      analyticsData.reduce(
        (sum, item) => sum + Number(item.progress || 0),
        0
      ) / (analyticsData.length || 1)
    ).toFixed(1);

  const highestScore =
    summary.highestScore ||
    Math.max(
      ...analyticsData.map(
        item => Number(item.score || 0)
      ),
      0
    );

  // -----------------------------------------
  // TOP STUDENTS
  // -----------------------------------------

  const topStudents = [...analyticsData]
    .sort(
      (a, b) =>
        Number(b.score || 0) -
        Number(a.score || 0)
    )
    .slice(0, 5);

  // -----------------------------------------
  // COURSE PERFORMANCE
  // -----------------------------------------

  const courseMap = {};

  analyticsData.forEach(item => {

    const course = item.courseName || "Unknown";

    if (!courseMap[course]) {
      courseMap[course] = {
        score: 0,
        progress: 0,
        count: 0
      };
    }

    courseMap[course].score += Number(item.score || 0);
    courseMap[course].progress += Number(item.progress || 0);
    courseMap[course].count++;
  });

  const coursePerformance =
    Object.entries(courseMap).map(
      ([course, values]) => ({
        course,
        score: Math.round(
          values.score / values.count
        ),
        progress: Math.round(
          values.progress / values.count
        )
      })
    );

  // -----------------------------------------
  // SCORE DISTRIBUTION
  // -----------------------------------------

  const scoreDistribution = {
    "90-100": 0,
    "80-89": 0,
    "70-79": 0,
    "Below 70": 0
  };

  analyticsData.forEach(item => {

    const score = Number(item.score || 0);

    if (score >= 90) {
      scoreDistribution["90-100"]++;
    } else if (score >= 80) {
      scoreDistribution["80-89"]++;
    } else if (score >= 70) {
      scoreDistribution["70-79"]++;
    } else {
      scoreDistribution["Below 70"]++;
    }
  });

  // -----------------------------------------
  // STUDENTS NEEDING IMPROVEMENT
  // -----------------------------------------

  const needImprovement =
    analyticsData
      .filter(
        item =>
          Number(item.score || 0) < 70 ||
          Number(item.progress || 0) < 70
      )
      .sort(
        (a, b) =>
          Number(a.score || 0) -
          Number(b.score || 0)
      );

  // -----------------------------------------
  // COURSE CHART
  // -----------------------------------------

  const courseChartHTML =
    coursePerformance.map(course => {

      return `
        <div style="
          margin-bottom:22px;
        ">

          <div style="
            display:flex;
            justify-content:space-between;
            margin-bottom:7px;
            font-weight:600;
          ">
            <span>${course.course}</span>
            <span>${course.score}%</span>
          </div>

          <div style="
            width:100%;
            height:12px;
            background:#e8f1f2;
            border-radius:20px;
            overflow:hidden;
          ">

            <div style="
              width:${course.score}%;
              height:100%;
              background:linear-gradient(
                90deg,
                #4fa3b8,
                #197b8d
              );
              border-radius:20px;
            "></div>

          </div>

          <div style="
            margin-top:5px;
            font-size:13px;
            color:#777;
          ">
            Progress: ${course.progress}%
          </div>

        </div>
      `;

    }).join("");

  // -----------------------------------------
  // HIGHEST STUDENT SCORE CHART
  // -----------------------------------------

  const highestStudentChartHTML =
    topStudents.map((student, index) => {

      const score =
        Number(student.score || 0);

      return `
        <div style="
          display:grid;
          grid-template-columns:30px 110px 1fr 50px;
          align-items:center;
          gap:10px;
          margin-bottom:15px;
        ">

          <strong>
            ${index + 1}
          </strong>

          <span style="
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          ">
            ${student.studentName}
          </span>

          <div style="
            height:10px;
            background:#edf2f3;
            border-radius:20px;
            overflow:hidden;
          ">

            <div style="
              width:${score}%;
              height:100%;
              background:linear-gradient(
                90deg,
                #197b8d,
                #63b8c7
              );
              border-radius:20px;
            "></div>

          </div>

          <strong>
            ${score}%
          </strong>

        </div>
      `;

    }).join("");

  // -----------------------------------------
  // SCORE DISTRIBUTION CHART
  // -----------------------------------------

  const distributionChartHTML =
    Object.entries(scoreDistribution)
      .map(([range, count]) => {

        const maxCount =
          Math.max(
            ...Object.values(scoreDistribution),
            1
          );

        const height =
          Math.max(
            (count / maxCount) * 150,
            count > 0 ? 20 : 5
          );

        return `
          <div style="
            flex:1;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-end;
          ">

            <strong style="
              margin-bottom:6px;
            ">
              ${count}
            </strong>

            <div style="
              width:45px;
              height:${height}px;
              background:linear-gradient(
                180deg,
                #63b8c7,
                #197b8d
              );
              border-radius:8px 8px 0 0;
            "></div>

            <span style="
              margin-top:8px;
              font-size:12px;
            ">
              ${range}
            </span>

          </div>
        `;

      }).join("");

  // -----------------------------------------
  // STUDENT TABLE
  // -----------------------------------------

  const studentRows =
    analyticsData.map((student, index) => {

      return `
        <tr>

          <td>
            <strong>
              ${student.studentName || "Unknown"}
            </strong>
          </td>

          <td>
            ${student.courseName || "N/A"}
          </td>

          <td>
            <strong>
              ${student.score || 0}%
            </strong>
          </td>

          <td>

            <div style="
              display:flex;
              align-items:center;
              gap:10px;
            ">

              <div style="
                width:100px;
                height:8px;
                background:#edf2f3;
                border-radius:20px;
                overflow:hidden;
              ">

                <div style="
                  width:${student.progress || 0}%;
                  height:100%;
                  background:#63b8c7;
                  border-radius:20px;
                "></div>

              </div>

              ${student.progress || 0}%

            </div>

          </td>

          <td>
            ${student.completedLessons || 0}
            /
            ${student.totalLessons || 0}
          </td>

        </tr>
      `;

    }).join("");

  // -----------------------------------------
  // NEED IMPROVEMENT
  // -----------------------------------------

  const improvementHTML =
    needImprovement.length === 0

      ? `
        <div style="
          padding:20px;
          text-align:center;
          color:#277b63;
        ">
          ✓ All students are performing well.
        </div>
      `

      : needImprovement.map(student => {

          return `
            <div style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              padding:14px 0;
              border-bottom:1px solid #e5eeee;
            ">

              <div>

                <strong>
                  ${student.studentName}
                </strong>

                <div style="
                  font-size:13px;
                  color:#777;
                  margin-top:4px;
                ">
                  ${student.courseName}
                </div>

              </div>

              <div style="
                text-align:right;
              ">

                <strong style="
                  color:#c65b5b;
                ">
                  ${student.score}%
                </strong>

                <div style="
                  font-size:12px;
                  color:#777;
                ">
                  Progress ${student.progress}%
                </div>

              </div>

            </div>
          `;

        }).join("");

  // -----------------------------------------
  // FINAL ANALYTICS PAGE
  // -----------------------------------------

  dashboardSection.innerHTML = `

    <div class="section-header">

      <div>

        <h2>Analytics</h2>

        <p>
          Student performance, course progress and platform data.
        </p>

      </div>

      <div class="section-count">
        ${analyticsData.length} Records
      </div>

    </div>


    <!-- SUMMARY CARDS -->

    <div style="
      display:grid;
      grid-template-columns:
        repeat(auto-fit,minmax(180px,1fr));
      gap:18px;
      margin:25px 0;
    ">

      <div class="dashboard-item">
        <h2>${totalStudents}</h2>
        <p>Total Students</p>
      </div>

      <div class="dashboard-item">
        <h2>${totalCourses}</h2>
        <p>Total Courses</p>
      </div>

      <div class="dashboard-item">
        <h2>${averageScore}%</h2>
        <p>Average Score</p>
      </div>

      <div class="dashboard-item">
        <h2>${averageProgress}%</h2>
        <p>Average Progress</p>
      </div>

      <div class="dashboard-item">
        <h2>${highestScore}%</h2>
        <p>Highest Score</p>
      </div>

    </div>


    <!-- CHARTS -->

    <div style="
      display:grid;
      grid-template-columns:
        repeat(auto-fit,minmax(350px,1fr));
      gap:22px;
      margin-bottom:25px;
    ">


      <!-- COURSE PERFORMANCE -->

      <div class="dashboard-item">

        <h3>
          Course Performance
        </h3>

        <p>
          Average score by course
        </p>

        <div style="
          margin-top:25px;
        ">

          ${courseChartHTML}

        </div>

      </div>


      <!-- HIGHEST STUDENTS -->

      <div class="dashboard-item">

        <h3>
          Highest Student Scores
        </h3>

        <p>
          Top performing students
        </p>

        <div style="
          margin-top:25px;
        ">

          ${highestStudentChartHTML}

        </div>

      </div>


      <!-- SCORE DISTRIBUTION -->

      <div class="dashboard-item">

        <h3>
          Score Distribution
        </h3>

        <p>
          Student score ranges
        </p>

        <div style="
          display:flex;
          align-items:flex-end;
          gap:20px;
          height:200px;
          margin-top:20px;
          padding:10px;
        ">

          ${distributionChartHTML}

        </div>

      </div>


      <!-- NEED IMPROVEMENT -->

      <div class="dashboard-item">

        <h3>
          Students Needing Improvement
        </h3>

        <p>
          Students with lower scores or progress
        </p>

        <div style="
          margin-top:15px;
        ">

          ${improvementHTML}

        </div>

      </div>

    </div>


    <!-- TOP STUDENTS -->

    <div class="dashboard-item">

      <h3>
        Top Students
      </h3>

      <div style="
        margin-top:15px;
      ">

        ${topStudents.map((student, index) => `

          <div style="
            display:flex;
            justify-content:space-between;
            padding:12px 0;
            border-bottom:1px solid #e5eeee;
          ">

            <span>
              <strong>
                #${index + 1}
                ${student.studentName}
              </strong>

              <span style="
                margin-left:15px;
                color:#777;
              ">
                ${student.courseName}
              </span>
            </span>

            <strong>
              ${student.score}%
            </strong>

          </div>

        `).join("")}

      </div>

    </div>


    <!-- STUDENT PERFORMANCE -->

    <div class="dashboard-item"
      style="
        margin-top:25px;
        overflow-x:auto;
      "
    >

      <h3>
        Student Performance
      </h3>

      <table style="
        width:100%;
        border-collapse:collapse;
        margin-top:20px;
      ">

        <thead>

          <tr>

            <th style="
              text-align:left;
              padding:12px;
            ">
              Student
            </th>

            <th style="
              text-align:left;
              padding:12px;
            ">
              Course
            </th>

            <th style="
              text-align:left;
              padding:12px;
            ">
              Score
            </th>

            <th style="
              text-align:left;
              padding:12px;
            ">
              Progress
            </th>

            <th style="
              text-align:left;
              padding:12px;
            ">
              Lessons
            </th>

          </tr>

        </thead>

        <tbody>

          ${studentRows}

        </tbody>

      </table>

    </div>

  `;

  return;
}


// ======================================================
// NORMAL SECTIONS
// ======================================================
// ======================================================
// ANALYTICS CHART - TOP STUDENT SCORES
// ======================================================

if (section === "analytics") {

  const analyticsRecords = Array.isArray(data) ? data : [];

  // Sort students by score - highest first
  const topScores = [...analyticsRecords]
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, 10);

  const highestScore = topScores.length
    ? Number(topScores[0].score || 0)
    : 0;

  const chartHTML = topScores.map((student, index) => {

    const score = Number(student.score || 0);

    return `
      <div class="analytics-chart-row">

        <div class="analytics-student-name">
          <span class="analytics-rank">
            ${index + 1}
          </span>

          <strong>
            ${student.studentName || "Unknown Student"}
          </strong>

          <small>
            ${student.courseName || "N/A"}
          </small>
        </div>

        <div class="analytics-bar-container">

          <div
            class="analytics-score-bar"
            style="width: ${score}%"
          ></div>

        </div>

        <div class="analytics-score-value">
          ${score}%
        </div>

      </div>
    `;
  }).join("");

  dashboardSection.innerHTML = `
    
    <div class="section-header">

      <div>
        <h2>Analytics</h2>

        <p>
          Student performance, course progress and platform data.
        </p>
      </div>

      <div class="section-count">
        ${analyticsRecords.length} students
      </div>

    </div>


    <!-- TOP SCORE CARD -->

    <div class="analytics-highlight-card">

      <div>
        <span class="analytics-label">
          HIGHEST STUDENT SCORE
        </span>

        <h1>
          ${highestScore}%
        </h1>

        <p>
          ${topScores[0]?.studentName || "No student"}
        </p>

      </div>

    </div>


    <!-- STUDENT SCORE CHART -->

    <div class="analytics-chart-card">

      <div class="analytics-chart-header">

        <div>
          <h2>Student Score Performance</h2>

          <p>
            Highest scoring students
          </p>
        </div>

      </div>

      <div class="analytics-chart">

        ${chartHTML}

      </div>

    </div>

  `;

  return;
}
// ======================================================
// ANALYTICS CHART
// ======================================================

let analyticsChart = "";

if (section === "analytics" && Array.isArray(data)) {

  // Sort students by score - highest first
  const topStudents = [...data]
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, 5);

  analyticsChart = `
    <div class="analytics-chart-section">

      <h2>Top Student Performance</h2>
      <p class="analytics-chart-subtitle">
        Highest scoring students
      </p>

      <div class="analytics-chart">

        ${topStudents.map((student, index) => {

          const score = Number(student.score || 0);

          return `
            <div class="chart-row">

              <div class="chart-student">
                <strong>#${index + 1} ${student.studentName || "Student"}</strong>
                <span>${student.courseName || "Course"}</span>
              </div>

              <div class="chart-bar-container">
                <div
                  class="chart-bar-fill"
                  style="width: ${score}%"
                ></div>
              </div>

              <div class="chart-score">
                ${score}%
              </div>

            </div>
          `;

        }).join("")}

      </div>

    </div>
  `;
}
const rows = data.map((item) => {

  switch (section) {

    case "my-courses":

    case "manage-courses":

      return `
        <div class="dashboard-item">

          <h3>
            ${item.title}
          </h3>

          <p>
            ${item.description ||
              item.course?.description ||
              "No description available."}
          </p>

          <div class="item-meta">

            <span>
              Teacher:
              ${item.teacher?.name || "TBD"}
            </span>

            <span>
              Duration:
              ${item.duration ||
                item.course?.duration ||
                "N/A"}
            </span>

            ${
              (item.platformLink ||
                item.course?.platformLink)

                ? `
                  <a
                    class="course-link"
                    href="${
                      item.platformLink ||
                      item.course?.platformLink
                    }"
                    target="_blank"
                  >
                    Platform Link
                  </a>
                `
                : ""
            }

          </div>

        </div>
      `;


    case "student-registration":

      return `
        <div class="dashboard-item">

          <h3>
            ${item.student.name}
          </h3>

          <p>
            Course: ${item.course.title}
          </p>

          <div class="item-meta">

            <span>
              Enrolled on:
              ${new Date(
                item.createdAt
              ).toLocaleDateString()}
            </span>

          </div>

        </div>
      `;


    case "assignments":

      return `
        <div class="dashboard-item">

          <h3>
            ${item.course?.title || "Assignment"}
          </h3>

          <p>
            Status:
            ${item.status || "pending"}
          </p>

          <div class="item-meta">

            <span>
              Grade:
              ${item.grade || "N/A"}
            </span>

          </div>

        </div>
      `;


    case "quizzes":

      return `
        <div class="dashboard-item">

          <h3>
            ${item.title}
          </h3>

          <p>
            Course:
            ${item.course?.title ||
              item.courseTitle ||
              "General"}
          </p>

          <div class="item-meta">

            <span>
              Questions:
              ${item.questions?.length || 0}
            </span>

            <span>
              Time limit:
              ${item.timeLimit || "N/A"}
            </span>

          </div>

        </div>
      `;


    case "videos":

      return `
        <div class="dashboard-item">

          <h3>
            ${item.lessonTitle}
          </h3>

          <p>
            Course:
            ${item.courseTitle || "Video Library"}
          </p>

          <p>
            ${item.description ||
              "Watch the latest lesson."}
          </p>

          <div class="item-meta">

            <a
              class="course-link"
              href="${item.videoUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ Watch on YouTube
            </a>

          </div>

        </div>
      `;


    case "certificates":

      return `
        <div class="dashboard-item">

          <h3>
            ${item.course?.title || "Certificate"}
          </h3>

          <p>
            Student:
            ${item.student?.name || "N/A"}
          </p>

          <div class="item-meta">

            <span>
              Issued:
              ${new Date(
                item.issuedAt
              ).toLocaleDateString()}
            </span>

          </div>

        </div>
      `;


    default:

      return `
        <div class="dashboard-item">

          <h3>
            Unknown item
          </h3>

        </div>
      `;

  }

}).join("");


dashboardSection.innerHTML = `

  <div class="section-header">

    <div>

      <h2>${title}</h2>

      <p>${subtitle}</p>

    </div>

    <div class="section-count">
      ${data.length} items
    </div>

  </div>

  <div class="dashboard-item-wrapper">
    ${rows}
  </div>

`;
  } catch (error) {
    dashboardSection.innerHTML = `<p class="error">${error.message}</p>`;
  }
};

const submitAssignmentTask = async (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const courseId = formData.get('courseId');
  const title = formData.get('title').trim();
  const description = formData.get('description').trim();
  const dueDate = formData.get('dueDate');

  if (!courseId || !title) {
    showMessage('Please provide course and title for the assignment task.', true);
    return;
  }

  try {
    const response = await fetch(getApiUrl(`/api/assignment-tasks/${courseId}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || 'Failed to create assignment task.', true);
      return;
    }

    showMessage('Assignment task created successfully.');
    renderSection('assignments');
  } catch (error) {
    showMessage(error.message || 'Network error while creating task.', true);
  }
};

const deleteUser = async (userId) => {
  if (!confirm('Delete this user? This cannot be undone.')) return;

  try {
    const response = await fetch(getApiUrl(`/api/admin/users/${userId}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || 'Unable to delete user.', true);
      return;
    }
    showMessage(data.message || 'User deleted successfully.');
    renderSection('delete-users');
  } catch (error) {
    showMessage(error.message || 'Network error while deleting user.', true);
  }
};

const submitQuiz = async (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const courseId = formData.get('courseId');
  const title = formData.get('title').trim();
  const passingScore = parseInt(formData.get('passingScore'), 10) || 60;
  const question = formData.get('question').trim();
  const options = [
    formData.get('option1').trim(),
    formData.get('option2').trim(),
    formData.get('option3').trim(),
    formData.get('option4').trim()
  ];
  const correctAnswerKey = formData.get('correctAnswer');
  const correctAnswer = formData.get(correctAnswerKey).trim();

  if (!courseId || !title || !question || options.some((opt) => !opt) || !correctAnswerKey) {
    showMessage('Please fill all quiz fields.', true);
    return;
  }

  try {
    const response = await fetch(getApiUrl('/api/quizzes'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        course: courseId,
        title,
        passingScore,
        questions: [
          {
            question,
            options,
            correctAnswer
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || 'Failed to create quiz.', true);
      return;
    }

    showMessage('Quiz created successfully.');
    renderSection('quizzes');
  } catch (error) {
    showMessage(error.message || 'Network error while creating quiz.', true);
  }
};

const handleQuizSubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  const quizId = form.dataset.quizId;
  const solvedQuizzes = getSolvedQuizzes();
  if (solvedQuizzes[quizId]) {
    showMessage('This quiz has already been solved.', true);
    return;
  }

  const quiz = currentSectionData.find((item) => (item._id || item.title) === quizId) || sampleData.quizzes.find((item) => (item._id || item.title) === quizId);
  if (!quiz) {
    showMessage('Quiz data not found.', true);
    return;
  }

  const answers = quiz.questions.map((question, qIndex) => {
    const selected = form.querySelector(`input[name="question-${qIndex}"]:checked`);
    return selected ? selected.value : '';
  });

  const resultDetails = quiz.questions.map((question, qIndex) => {
    const selected = answers[qIndex] || '';
    const isCorrect = selected === question.correctAnswer;
    return {
      question: question.question,
      selected,
      correctAnswer: question.correctAnswer,
      isCorrect
    };
  });

  const correctCount = resultDetails.filter((item) => item.isCorrect).length;
  const total = resultDetails.length;
  const score = Math.round((correctCount / total) * 100);

  setSolvedQuiz(quizId, {
    score,
    total,
    correct: correctCount,
    details: resultDetails
  });

  showMessage(`Quiz submitted successfully. You scored ${score}% (${correctCount}/${total}).`);
  renderSection('quizzes');
};

const submitAuth = async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!email || !password || (mode === "register" && !name)) {
    showMessage("Please fill all required fields.", true);
    return;
  }

  const url = mode === "register" ? `${API_BASE}/register` : `${API_BASE}/login`;
  const body = {
    email,
    password
  };

  if (mode === "register") {
    body.name = name;
    body.role = role;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Authentication failed.", true);
      return;
    }

    setToken(data.token);
    showMessage(data.message || "Success.");
    currentUser = data.user;
    goDashboardButton.classList.add("hidden");
    await showDashboard();
  } catch (error) {
    showMessage(error.message || "Network error.", true);
  }
};

showRegister.addEventListener("click", () => setMode("register"));
showLogin.addEventListener("click", () => setMode("login"));
authForm.addEventListener("submit", submitAuth);
goDashboardButton.addEventListener("click", () => showDashboard());
logoutButton.addEventListener("click", () => {
  clearToken();
  currentUser = null;
  authCard.classList.remove("hidden");
  dashboardCard.classList.add("hidden");
  goDashboardButton.classList.add("hidden");
  showMessage("Logged out successfully.");
  dashboardActions.innerHTML = "";
  dashboardSection.innerHTML = "";
});

window.addEventListener("load", () => {
  setMode("register");
  if (getToken()) {
    showDashboard();
  }
});