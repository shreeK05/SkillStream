import { Asset, User, Assignment } from '../types';


// Removed CURRENT_USER as requested to avoid demo data dependency

// Keeping Admin for initial access
export const ADMIN_USER: User = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@skillstream.com',
  role: 'Admin',
  department: 'Management',
  learningPreference: 'Text',
  streak: 0,
  xp: 0,
  avgScore: 0,
  hoursLearned: 0
};

export const MOCK_ASSETS: Asset[] = [
  // CLOUD
  {
    id: 'a1',
    title: 'AWS Cloud Fundamentals',
    description: 'Introduction to Amazon Web Services and core concepts. Learn about EC2, S3, and RDS.',
    type: 'Video',
    difficulty: 'Beginner',
    topic: 'Cloud',
    tags: ['aws', 'cloud', 'infrastructure'],
    durationMinutes: 10,
    contentUrl: 'https://www.youtube.com/embed/3hLmDS179YE',
    learningObjectives: ['Understand EC2 instances', 'S3 Storage basics', 'IAM Roles and Security']
  },
  {
    id: 'a1-adv',
    title: 'Advanced AWS Architecture',
    description: 'Designing resilient and high-performance architectures on AWS.',
    type: 'Doc',
    difficulty: 'Advanced',
    topic: 'Cloud',
    tags: ['aws', 'architecture'],
    durationMinutes: 45,
    learningObjectives: ['Multi-region deployment', 'Cost optimization', 'Disaster Recovery']
  },

  // JAVASCRIPT
  {
    id: 'a2',
    title: 'JavaScript Basics',
    description: 'Introduction to JavaScript programming language. variables, loops, and functions.',
    type: 'Video',
    difficulty: 'Beginner',
    topic: 'JavaScript',
    tags: ['javascript', 'web'],
    durationMinutes: 12,
    contentUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
    learningObjectives: ['Variables & Data Types', 'Functions & Scope', 'DOM Manipulation']
  },

  // REACT
  {
    id: 'a3-remedial',
    title: 'Introduction to HTML & DOM',
    description: 'Prerequisite knowledge for React. Understand how the DOM works before manipulating it.',
    type: 'Video',
    difficulty: 'Beginner',
    topic: 'React',
    tags: ['react', 'frontend', 'remedial'],
    durationMinutes: 8,
    contentUrl: 'https://www.youtube.com/embed/pIAMuMZs3Yc', // HTML basics
    learningObjectives: ['HTML5 Structure', 'DOM Tree', 'Events']
  },
  {
    id: 'a3',
    title: 'React for Beginners',
    description: 'Build modern web applications with React. Understanding Components and Hooks.',
    type: 'Video',
    difficulty: 'Intermediate',
    topic: 'React',
    tags: ['react', 'frontend', 'ui'],
    durationMinutes: 15,
    contentUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
    learningObjectives: ['Functional Components', 'useState & useEffect', 'JSX Syntax']
  },
  {
    id: 'a3-adv',
    title: 'Advanced React Patterns',
    description: 'Master Higher Order Components, Render Props, and Custom Hooks.',
    type: 'Sandbox',
    difficulty: 'Advanced',
    topic: 'React',
    tags: ['react', 'patterns'],
    durationMinutes: 30,
    learningObjectives: ['Custom Hooks', 'Performance Optimization', 'Context API']
  },

  // DEVOPS
  {
    id: 'a4',
    title: 'Docker Fundamentals',
    description: 'Learn containerization with Docker. Images, Containers, and Dockerfile.',
    type: 'Video',
    difficulty: 'Intermediate',
    topic: 'DevOps',
    tags: ['docker', 'containers'],
    durationMinutes: 10,
    contentUrl: 'https://www.youtube.com/embed/Gjnup-PuquQ',
    learningObjectives: ['Container vs VM', 'Dockerfile basics', 'Docker Compose']
  },

  // DATA SCIENCE
  {
    id: 'a5',
    title: 'Data Science with Python',
    description: 'Detailed study material covering the data science workflow.',
    type: 'Doc',
    difficulty: 'Advanced',
    topic: 'Data Science',
    tags: ['python', 'data-science'],
    durationMinutes: 90,
    learningObjectives: ['Pandas DataFrames', 'NumPy Arrays', 'Matplotlib Visualization']
  },
  {
    id: 'a6',
    title: 'Full Stack Web Architecture',
    description: 'In-depth documentation covering frontend architecture patterns.',
    type: 'Doc',
    difficulty: 'Intermediate',
    topic: 'Web Development',
    tags: ['web', 'architecture'],
    durationMinutes: 75,
    learningObjectives: ['REST API Design', 'Database Normalization', 'Authentication Patterns']
  }
];

export const MOCK_EMPLOYEES: User[] = [
  {
    id: 'u1',
    name: 'Sarah Johnson',
    email: 'sarah.j@techcorp.com',
    role: 'Employee',
    department: 'Engineering',
    learningPreference: 'Visual',
    streak: 5,
    xp: 1200,
    avgScore: 85,
    hoursLearned: 12
  },
  {
    id: 'u2',
    name: 'Michael Chen',
    email: 'm.chen@techcorp.com',
    role: 'Employee',
    department: 'Data Science',
    learningPreference: 'Text',
    streak: 12,
    xp: 3400,
    avgScore: 92,
    hoursLearned: 45
  },
  {
    id: 'u3',
    name: 'Emily Davis',
    email: 'emily.d@techcorp.com',
    role: 'Employee',
    department: 'DevOps',
    learningPreference: 'Hands-on',
    streak: 2,
    xp: 450,
    avgScore: 65,
    hoursLearned: 5
  },
  {
    id: 'u4',
    name: 'David Wilson',
    email: 'david.w@techcorp.com',
    role: 'Employee',
    department: 'Engineering',
    learningPreference: 'Visual',
    streak: 8,
    xp: 1800,
    avgScore: 78,
    hoursLearned: 18
  },
  {
    id: 'u5',
    name: 'Jessica Taylor',
    email: 'j.taylor@techcorp.com',
    role: 'Employee',
    department: 'Product',
    learningPreference: 'Text',
    streak: 0,
    xp: 100,
    avgScore: 0,
    hoursLearned: 1
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'as1',
    userId: 'u1',
    assetId: 'a1',
    status: 'Completed',
    progress: 100,
    score: 85,
    assignedBy: 'admin1',
    assignedDate: '2023-10-01',
    completedDate: '2023-10-05',
    attempts: 1
  },
  {
    id: 'as2',
    userId: 'u1',
    assetId: 'a2',
    status: 'In-Progress',
    progress: 45,
    assignedBy: 'admin1',
    assignedDate: '2023-10-10',
    attempts: 0
  },
  {
    id: 'as3',
    userId: 'u2',
    assetId: 'a1',
    status: 'Completed',
    progress: 100,
    score: 92,
    assignedBy: 'admin1',
    assignedDate: '2023-09-15',
    completedDate: '2023-09-16',
    attempts: 1
  },
  {
    id: 'as4',
    userId: 'u3',
    assetId: 'a1',
    status: 'Failed',
    progress: 100,
    score: 55,
    assignedBy: 'admin1',
    assignedDate: '2023-10-20',
    completedDate: '2023-10-21',
    attempts: 1
  }
];