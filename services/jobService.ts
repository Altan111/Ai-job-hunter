import { Job } from '../types';

const sampleJobs: Job[] = [
    { title: 'Senior React Developer', company: 'Innovate Inc.', description: 'Experienced React developer needed for our cutting-edge fintech platform. Must know TypeScript and GraphQL.', url: 'https://www.linkedin.com/jobs/search/?keywords=React' },
    { title: 'Frontend Engineer (Vue.js)', company: 'DataStream Corp.', description: 'Join our data visualization team. Proficiency in Vue.js, D3.js, and CSS animations required.', url: 'https://www.linkedin.com/jobs/search/?keywords=Vue' },
    { title: 'Full Stack Developer (Node.js)', company: 'CloudNimbus Solutions', description: 'Build scalable backend services with Node.js, Express, and MongoDB. AWS experience is a plus.', url: 'https://www.linkedin.com/jobs/search/?keywords=Node.js' },
    { title: 'UI/UX Designer & Developer', company: 'Creative Pixels', description: 'A hybrid role for someone passionate about design and code. Figma, React, and Tailwind CSS skills needed.', url: 'https://www.linkedin.com/jobs/search/?keywords=UI%2FUX' },
    { title: 'Junior JavaScript Developer', company: 'StartRight Tech', description: 'Entry-level position for a motivated JS developer. Learn and grow with our team. Basic knowledge of React is a plus.', url: 'https://www.linkedin.com/jobs/search/?keywords=Javascript' },
    { title: 'DevOps Engineer', company: 'SecureCloud', description: 'Manage our CI/CD pipelines and cloud infrastructure. Experience with Docker, Kubernetes, and Jenkins is essential.', url: 'https://www.linkedin.com/jobs/search/?keywords=DevOps' },
    { title: 'Mobile Developer (React Native)', company: 'GoApp!', description: 'Create beautiful and performant mobile apps for iOS and Android using React Native.', url: 'https://www.linkedin.com/jobs/search/?keywords=React%20Native' },
    { title: 'Backend Engineer (Python/Django)', company: 'CodePy', description: 'Develop robust backend systems with Python and Django. Familiarity with REST APIs and PostgreSQL is key.', url: 'https://www.linkedin.com/jobs/search/?keywords=Python' },
    { title: 'Software Engineer in Test (SET)', company: 'QualityFirst', description: 'Automate our testing processes. Strong skills in Selenium, Cypress, or Playwright.', url: 'https://www.linkedin.com/jobs/search/?keywords=QA' },
    { title: 'Lead Frontend Engineer', company: 'Synergy Systems', description: 'Lead a team of talented frontend developers. Architectural mindset and deep React expertise required.', url: 'https://www.linkedin.com/jobs/search/?keywords=Lead%20Frontend' },
    { title: 'Angular Developer', company: 'Enterprise Solutions', description: 'Work on our large-scale enterprise application using Angular and TypeScript.', url: 'https://www.linkedin.com/jobs/search/?keywords=Angular' },
    { title: 'Machine Learning Engineer', company: 'AI Future', description: 'Develop and deploy ML models. Python, TensorFlow, and PyTorch are our tools of choice.', url: 'https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning' },
    { title: 'Web3/Blockchain Developer', company: 'DecentralChain', description: 'Build the future of the web with Solidity, Hardhat, and Ethers.js. Knowledge of React or Next.js for dApp frontends.', url: 'https://www.linkedin.com/jobs/search/?keywords=Web3' },
    { title: 'Svelte Developer', company: 'LeanWeb', description: 'Passionate about performance? Join our team building lightning-fast web apps with SvelteKit.', url: 'https://www.linkedin.com/jobs/search/?keywords=Svelte' },
    { title: 'Game Developer (Unity/C#)', company: 'PixelPlay Games', description: 'Create exciting new games with Unity and C#. A strong portfolio is a must.', url: 'https://www.linkedin.com/jobs/search/?keywords=Unity' },
    { title: 'Data Scientist', company: 'Insight Analytics', description: 'Analyze large datasets to extract meaningful insights. SQL, Python, and R skills are crucial.', url: 'https://www.linkedin.com/jobs/search/?keywords=Data%20Scientist' },
    { title: 'Cloud Architect (Azure)', company: 'Azure Dynamics', description: 'Design and implement scalable and secure cloud solutions on Microsoft Azure.', url: 'https://www.linkedin.com/jobs/search/?keywords=Azure' },
    { title: 'Technical Project Manager', company: 'AgileFlow', description: 'Lead our engineering teams using Agile methodologies. Technical background in software development is required.', url: 'https://www.linkedin.com/jobs/search/?keywords=Project%20Manager' },
    { title: 'Golang Backend Developer', company: 'Speedy Microservices', description: 'Build high-performance microservices using Go. Experience with gRPC and concurrency patterns is a big plus.', url: 'https://www.linkedin.com/jobs/search/?keywords=Golang' },
    { title: 'WordPress Developer', company: 'WebPress Agency', description: 'Customize and maintain WordPress sites for our clients. Strong PHP, JavaScript, and CSS skills needed.', url: 'https://www.linkedin.com/jobs/search/?keywords=Wordpress' }
];

export const scrapeJobsFromPage = async (): Promise<Job[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return sampleJobs;
};

export const callGeminiAPI = async (
  resume: string,
  jobDescription: string,
  keywords: string
): Promise<'Yes' | 'No'> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  if (!keywords.trim()) {
    // If no keywords are provided, we can default to matching
    return 'Yes';
  }

  const keywordList = keywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
  const resumeLower = resume.toLowerCase();
  const descriptionLower = jobDescription.toLowerCase();
  
  // A simple simulation: check if at least one keyword is present in both the resume and the job description.
  const isMatch = keywordList.some(keyword => 
    resumeLower.includes(keyword) && descriptionLower.includes(keyword)
  );

  return isMatch ? 'Yes' : 'No';
};
