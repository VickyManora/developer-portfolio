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

  // Verbatim resume summary; only edit is "8+" -> "9+" per locked decision 10.
  summary:
    'Senior Full Stack Engineer (9+ years), NIT Bhopal alumnus, specializing in secure, high-performance web applications. Strong background in Angular, React, Node.js, and cloud-native architectures (AWS & Azure). Known for improving application security, optimizing delivery timelines using AI-driven development, and driving projects from design to production with technical ownership.',

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
