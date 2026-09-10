import { NEEDS_INPUT, type Profile } from '../core/models/content.models';

/**
 * Source: PHASE-0-CONTENT-FINAL.md §2, §3, §4.
 * Every string below is verbatim from the locked spec.
 */
export const PROFILE: Profile = {
  name: 'Vicky Manora',
  role: 'Senior Full Stack Engineer',
  // Vodafone Idea start date. Years of experience compute from this so the
  // figure can never go stale (locked decision 10).
  careerStart: '2017-06',
  location: 'Pune, India',
  timezone: 'IST (UTC+5:30)',
  educationSignal: 'NIT Bhopal alumnus',

  // Hero line, option B — a recombination of sentences already in the resume
  // summary. No new claims. Pending Vicky's edit.
  heroLine:
    'Senior full stack engineer specializing in secure, high-performance web applications across Angular, React, Node.js, AWS and Azure.',

  // Verbatim from the updated resume (2026-09-10). The figure is now "9+" in
  // the source itself, matching the value the site already computed.
  summary:
    'Senior Full Stack Engineer with 9+ years of experience building and shipping production web applications and scalable platform solutions. Strong expertise in Angular, React, Node.js, Python, TypeScript, SQL and MongoDB, with hands-on experience across frontend architecture, backend services, APIs, reusable component systems, dashboards and cloud-native applications on AWS and Azure. Experienced in owning features end-to-end from technical design and data modeling through implementation, testing and production delivery. Strong background in platform engineering, microfrontend architecture, AI-powered applications, application security and high-performance data-driven interfaces.',

  proofChips: ['ANGULAR · REACT · NODE.JS', 'AWS · AZURE', 'NIT BHOPAL'],

  availability: NEEDS_INPUT,
  photo: NEEDS_INPUT,
};

export const CONTACT = {
  email: 'vickymanora@gmail.com',
  location: 'Pune, India',
  timezone: 'IST (UTC+5:30)',
  linkedin: 'https://www.linkedin.com/in/vicky-manora-165638ba/',
  github: 'https://github.com/VickyManora',
  resumeFile: '/Vicky-Manora-Senior-Full-Stack-Engineer.pdf',
} as const;
