import { RoleProfile } from '../schemas/roleProfile.schema';

export const SEEDED_ROLE_PROFILES: RoleProfile[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    version: '1.0.0',
    description: 'Entry-level role focused on cleaning, analysing and communicating data.',
    entryLevelTitles: [
      'Junior Data Analyst',
      'Reporting Analyst',
      'MIS Analyst',
      'Business Data Analyst',
    ],
    requiredSkills: [
      {
        id: 'sql',
        name: 'SQL',
        category: 'technical',
        priority: 'required',
        weight: 35,
        aliases: ['MySQL', 'PostgreSQL', 'SQL Server', 'SQLite', 'T-SQL'],
        evidenceExamples: ['Repository containing SQL queries', 'Database analysis project'],
        beginnerActions: ['Practise joins, grouping and aggregate queries.'],
      },
      {
        id: 'excel',
        name: 'Excel',
        category: 'tool',
        priority: 'required',
        weight: 25,
        aliases: ['Microsoft Excel', 'Pivot Table', 'VLOOKUP', 'XLOOKUP', 'Power Query'],
        evidenceExamples: ['Dashboard', 'Data cleaning project', 'Pivot-table analysis'],
        beginnerActions: ['Complete a sales analysis using formulas and pivot tables.'],
      },
      {
        id: 'data-visualization',
        name: 'Data Visualization',
        category: 'technical',
        priority: 'required',
        weight: 25,
        aliases: ['Power BI', 'Tableau', 'Looker', 'Matplotlib', 'Seaborn'],
        evidenceExamples: ['Interactive dashboard', 'Report visuals'],
        beginnerActions: ['Build a 3-page interactive dashboard on sales trends.'],
      },
      {
        id: 'communication',
        name: 'Business Communication',
        category: 'communication',
        priority: 'required',
        weight: 15,
        aliases: ['Presentation', 'Reporting', 'Stakeholder presentation', 'Documentation'],
        evidenceExamples: ['Executive summary slide deck', 'Project walkthrough video'],
        beginnerActions: ['Write a 1-page business insights summary from an Excel dataset.'],
      },
    ],
    preferredSkills: [
      {
        id: 'python',
        name: 'Python for Data',
        category: 'technical',
        priority: 'preferred',
        weight: 20,
        aliases: ['Pandas', 'NumPy', 'Jupyter', 'Python'],
        evidenceExamples: ['Jupyter notebook analysis'],
        beginnerActions: ['Clean a messy CSV dataset using Pandas.'],
      },
    ],
    expectedProjects: [
      {
        title: 'Sales Performance Dashboard',
        description: 'Clean data, calculate key metrics and present business insights.',
        demonstratedSkills: ['Excel', 'SQL', 'Data Visualization', 'Business Communication'],
      },
    ],
    communicationExpectations: [
      'Explain findings in simple business language.',
      'Distinguish observation from recommendation.',
    ],
    roadmapTemplates: [],
    lastReviewedAt: '2026-07-31',
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    version: '1.0.0',
    description: 'Entry-level role building scalable backend APIs, database models, and web application logic.',
    entryLevelTitles: [
      'Junior Software Engineer',
      'Graduate Engineer Trainee',
      'Backend Developer',
      'Full Stack Engineer',
    ],
    requiredSkills: [
      {
        id: 'programming-languages',
        name: 'Core Programming (JavaScript/Python/Java)',
        category: 'technical',
        priority: 'required',
        weight: 30,
        aliases: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go'],
        evidenceExamples: ['Data structures implementation', 'Algorithmic problem solving'],
        beginnerActions: ['Solve 20 medium algorithmic coding challenges.'],
      },
      {
        id: 'backend-frameworks',
        name: 'Backend Frameworks (Node.js/Express/Fastify/Django)',
        category: 'technical',
        priority: 'required',
        weight: 30,
        aliases: ['Node.js', 'Express', 'Fastify', 'NestJS', 'Django', 'Spring Boot'],
        evidenceExamples: ['RESTful API repository', 'Microservice endpoint design'],
        beginnerActions: ['Build a REST API with authentication and CRUD endpoints.'],
      },
      {
        id: 'database-sql',
        name: 'Databases & ORM',
        category: 'technical',
        priority: 'required',
        weight: 25,
        aliases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma', 'TypeORM'],
        evidenceExamples: ['Database schema design', 'Relational data modeling'],
        beginnerActions: ['Design a database schema with Foreign Key constraints.'],
      },
      {
        id: 'git-version-control',
        name: 'Git & Version Control',
        category: 'tool',
        priority: 'required',
        weight: 15,
        aliases: ['Git', 'GitHub', 'GitLab', 'Version Control'],
        evidenceExamples: ['Active GitHub repository with pull requests'],
        beginnerActions: ['Maintain GitHub repositories with clean commit messages.'],
      },
    ],
    preferredSkills: [],
    expectedProjects: [
      {
        title: 'E-Commerce Backend API',
        description: 'Designed secure authentication and payment gateway endpoints.',
        demonstratedSkills: ['Node.js', 'PostgreSQL', 'REST API', 'Git'],
      },
    ],
    communicationExpectations: [
      'Write clear API documentation and inline code comments.',
      'Explain architectural choices during technical reviews.',
    ],
    roadmapTemplates: [],
    lastReviewedAt: '2026-07-31',
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    version: '1.0.0',
    description: 'Entry-level role building interactive, modern, responsive web and mobile user interfaces.',
    entryLevelTitles: [
      'Junior Frontend Developer',
      'UI/UX Web Developer',
      'React Developer',
    ],
    requiredSkills: [
      {
        id: 'react-nextjs',
        name: 'React / Next.js / React Native',
        category: 'technical',
        priority: 'required',
        weight: 35,
        aliases: ['React', 'React.js', 'Next.js', 'React Native', 'Expo'],
        evidenceExamples: ['Interactive web application', 'State management implementation'],
        beginnerActions: ['Build a responsive web application with dynamic state management.'],
      },
      {
        id: 'javascript-typescript',
        name: 'JavaScript & TypeScript',
        category: 'technical',
        priority: 'required',
        weight: 30,
        aliases: ['JavaScript', 'TypeScript', 'ES6+'],
        evidenceExamples: ['Typed utility functions', 'Async API fetching'],
        beginnerActions: ['Convert a JavaScript project to strict TypeScript.'],
      },
      {
        id: 'css-styling',
        name: 'Modern CSS & UI Styling',
        category: 'tool',
        priority: 'required',
        weight: 20,
        aliases: ['CSS', 'CSS3', 'Tailwind', 'TailwindCSS', 'Styled Components', 'SASS'],
        evidenceExamples: ['Responsive layout design', 'Custom component design system'],
        beginnerActions: ['Replicate a modern website landing page with dark mode.'],
      },
      {
        id: 'web-performance',
        name: 'Web Performance & Accessibility',
        category: 'technical',
        priority: 'required',
        weight: 15,
        aliases: ['Lighthouse', 'Accessibility', 'a11y', 'DOM optimization'],
        evidenceExamples: ['Lighthouse score audit report'],
        beginnerActions: ['Audit and achieve 90+ Lighthouse performance score.'],
      },
    ],
    preferredSkills: [],
    expectedProjects: [
      {
        title: 'Interactive Web Dashboard',
        description: 'Built animated component dashboard with state management.',
        demonstratedSkills: ['React', 'TypeScript', 'Tailwind', 'API Integration'],
      },
    ],
    communicationExpectations: [
      'Collaborate with UI designers and backend developers.',
      'Explain component architecture choices clearly.',
    ],
    roadmapTemplates: [],
    lastReviewedAt: '2026-07-31',
  },
  {
    id: 'aiml-engineer',
    title: 'AI / ML Engineer',
    version: '1.0.0',
    description: 'Entry-level role implementing machine learning models, NLP pipelines, and generative AI integrations.',
    entryLevelTitles: [
      'Junior AI Engineer',
      'Machine Learning Intern',
      'Data Science Associate',
    ],
    requiredSkills: [
      {
        id: 'python-ml',
        name: 'Python ML Stack (PyTorch/TensorFlow/Scikit-learn)',
        category: 'technical',
        priority: 'required',
        weight: 40,
        aliases: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'NumPy', 'Pandas'],
        evidenceExamples: ['Model training notebook', 'Evaluation metrics graph'],
        beginnerActions: ['Train and evaluate a classification model on tabular data.'],
      },
      {
        id: 'llm-nlp',
        name: 'LLMs, Prompt Engineering & RAG',
        category: 'technical',
        priority: 'required',
        weight: 30,
        aliases: ['LangChain', 'LlamaIndex', 'OpenAI', 'NVIDIA NIM', 'Vector DB', 'RAG'],
        evidenceExamples: ['RAG search system', 'LLM agent implementation'],
        beginnerActions: ['Build a RAG system querying PDF document contents.'],
      },
      {
        id: 'model-deployment',
        name: 'Model Deployment & APIs',
        category: 'technical',
        priority: 'required',
        weight: 15,
        aliases: ['FastAPI', 'Docker', 'ONNX', 'Hugging Face', 'REST API'],
        evidenceExamples: ['Deployed model API endpoint'],
        beginnerActions: ['Package an ML model into a FastAPI Docker container.'],
      },
      {
        id: 'math-stats',
        name: 'Linear Algebra & Statistics',
        category: 'technical',
        priority: 'required',
        weight: 15,
        aliases: ['Statistics', 'Probability', 'Linear Algebra', 'Calculus'],
        evidenceExamples: ['A/B test statistical analysis report'],
        beginnerActions: ['Perform hypothesis testing and statistical inference.'],
      },
    ],
    preferredSkills: [],
    expectedProjects: [
      {
        title: 'Document Q&A RAG Pipeline',
        description: 'Built vector search and LLM summary pipeline for technical documentation.',
        demonstratedSkills: ['Python', 'PyTorch', 'OpenAI/NVIDIA', 'FastAPI'],
      },
    ],
    communicationExpectations: [
      'Explain machine learning evaluation metrics (Precision, Recall, F1) to non-technical stakeholders.',
    ],
    roadmapTemplates: [],
    lastReviewedAt: '2026-07-31',
  },
  {
    id: 'product-manager',
    title: 'Associate Product Manager',
    version: '1.0.0',
    description: 'Entry-level role defining product specs, analyzing user metrics, and coordinating sprint execution.',
    entryLevelTitles: [
      'Associate Product Manager',
      'Junior Product Manager',
      'Business Analyst',
    ],
    requiredSkills: [
      {
        id: 'product-spec',
        name: 'PRD Creation & User Stories',
        category: 'business',
        priority: 'required',
        weight: 35,
        aliases: ['PRD', 'User Stories', 'Requirements', 'Wireframing', 'Figma'],
        evidenceExamples: ['Product Requirement Document (PRD)', 'Feature specs'],
        beginnerActions: ['Write a detailed PRD for a mobile app feature.'],
      },
      {
        id: 'product-analytics',
        name: 'Product Analytics & Metrics',
        category: 'technical',
        priority: 'required',
        weight: 30,
        aliases: ['Mixpanel', 'Google Analytics', 'PostHog', 'A/B Testing', 'Retention'],
        evidenceExamples: ['Funnel conversion analysis report'],
        beginnerActions: ['Define North Star metric and funnel tracking steps.'],
      },
      {
        id: 'agile-scrum',
        name: 'Agile & Backlog Management',
        category: 'tool',
        priority: 'required',
        weight: 20,
        aliases: ['Jira', 'Agile', 'Scrum', 'Sprint Planning', 'Linear', 'Trello'],
        evidenceExamples: ['Jira roadmap backlog board'],
        beginnerActions: ['Create a 2-week sprint backlog with priority estimations.'],
      },
      {
        id: 'stakeholder-comm',
        name: 'Cross-functional Communication',
        category: 'communication',
        priority: 'required',
        weight: 15,
        aliases: ['Communication', 'Stakeholder Management', 'Presentation'],
        evidenceExamples: ['Product launch pitch presentation'],
        beginnerActions: ['Present a product roadmap deck to team members.'],
      },
    ],
    preferredSkills: [],
    expectedProjects: [
      {
        title: 'Mobile App Feature PRD & Prototype',
        description: 'Authored complete technical PRD and interactive Figma prototype.',
        demonstratedSkills: ['PRD', 'Product Analytics', 'User Stories', 'Figma'],
      },
    ],
    communicationExpectations: [
      'Translate technical constraints into clear user impact trade-offs.',
    ],
    roadmapTemplates: [],
    lastReviewedAt: '2026-07-31',
  },
];

export class RoleProfileService {
  public static getAllRoles(): RoleProfile[] {
    return SEEDED_ROLE_PROFILES;
  }

  public static getRoleById(id: string): RoleProfile | null {
    const role = SEEDED_ROLE_PROFILES.find((r) => r.id.toLowerCase() === id.toLowerCase());
    return role || null;
  }

  /**
   * Synthesize a generic RoleProfile for a user-specified custom target role that
   * is not part of the seeded catalogue. Gives the scoring engine + LLM a valid
   * profile to evaluate against, using broad professional competencies plus the
   * role title so the analysis is tailored to the role the student typed.
   */
  public static buildCustomRole(rawId: string, title: string): RoleProfile {
    const cleanTitle = (title || rawId || 'Custom Target Role').trim() || 'Custom Target Role';
    const id =
      (rawId || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-+|-+$/g, '') ||
      'custom-role';

    return {
      id,
      title: cleanTitle,
      version: 'custom-1.0.0',
      description: `User-specified target role: ${cleanTitle}. Evaluated against general professional and technical expectations for this role.`,
      entryLevelTitles: [cleanTitle, `Junior ${cleanTitle}`, `Associate ${cleanTitle}`],
      requiredSkills: [
        {
          id: 'core-technical',
          name: 'Core Technical Skills',
          category: 'technical',
          priority: 'required',
          weight: 30,
          aliases: ['programming', 'development', 'engineering', 'coding', 'technical', 'design'],
          evidenceExamples: ['Hands-on technical project', 'Documented implementation'],
          beginnerActions: [`Complete a foundational project relevant to a ${cleanTitle} role.`],
        },
        {
          id: 'domain-tools',
          name: 'Role-Specific Tools & Platforms',
          category: 'tool',
          priority: 'required',
          weight: 25,
          aliases: ['tools', 'platform', 'software', 'framework', 'stack'],
          evidenceExamples: ['Project using industry-standard tools'],
          beginnerActions: [`Learn the primary tools commonly used by a ${cleanTitle}.`],
        },
        {
          id: 'applied-projects',
          name: 'Applied Project Experience',
          category: 'portfolio',
          priority: 'required',
          weight: 25,
          aliases: ['project', 'portfolio', 'case study', 'built', 'implemented', 'developed'],
          evidenceExamples: ['End-to-end portfolio project'],
          beginnerActions: [`Build an end-to-end project that a ${cleanTitle} would typically deliver.`],
        },
        {
          id: 'communication',
          name: 'Professional Communication',
          category: 'communication',
          priority: 'required',
          weight: 20,
          aliases: ['communication', 'presentation', 'documentation', 'reporting', 'collaboration'],
          evidenceExamples: ['Presentation deck', 'Written project report'],
          beginnerActions: ['Write a clear one-page summary of a project and its impact.'],
        },
      ],
      preferredSkills: [],
      expectedProjects: [
        {
          title: `${cleanTitle} Portfolio Project`,
          description: `A representative end-to-end project demonstrating core ${cleanTitle} competencies.`,
          demonstratedSkills: ['Core Technical Skills', 'Applied Project Experience'],
        },
      ],
      communicationExpectations: [
        `Clearly explain ${cleanTitle} work and its impact to both technical and non-technical audiences.`,
      ],
      roadmapTemplates: [],
      lastReviewedAt: new Date().toISOString().slice(0, 10),
    };
  }
}
