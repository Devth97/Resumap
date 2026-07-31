export const ROUTES = {
  HOME: '/',
  PRIVACY: '/privacy',
  UPLOAD: '/upload',
  ROLE: '/role',
  QUESTIONNAIRE: '/questionnaire',
  ANALYSING: '/analysing',
  RESULTS: (id: string) => `/results/${id}`,
  FEEDBACK: (id: string) => `/feedback/${id}`,
};
