/**
 * The report content. Every string here is the student's own material or is written
 * directly from a source document: the placement letters, the offer letters, the
 * university goal forms and the monthly and weekly reports.
 *
 * One thing in this file still wants a check: the related coursework, whose course codes
 * come from the student's own resume coursework list and have not been read off the
 * transcript.
 */

import type { PlateKey } from '@/lib/plates';

export type GoalState = 'met' | 'partial' | 'unmet';

export interface Goal {
  ref: string;
  title: string;
  state: GoalState;
  target: string;
  outcome: string;
  evidence?: string;
}

export interface EmployerFact {
  label: string;
  value: string;
}

export interface StackItem {
  name: string;
  slug: string;
}

export interface CourseworkItem {
  code: string;
  title: string;
  relation: string;
}

export interface Acknowledgment {
  name: string;
  role: string;
  note: string;
}

export interface Term {
  id: string;
  ordinal: string;
  label: string;
  season: string;
  dates: string;
  datesShort: string;
  role: string;
  location: string;
  /** The story beat. One short clause, shown in the chronology. */
  beat: string;
  isLatest: boolean;
  plate: PlateKey;
  plateAlt: string;
  plateCaption: string;
  project: string;
  employer: {
    name: string;
    sector: string;
    description: string;
    computingRelevance: string;
    facts: EmployerFact[];
  };
  job: {
    overview: string;
    unique: string;
    skills: string[];
    stack: StackItem[];
    coursework: CourseworkItem[];
  };
  goals: Goal[];
  acknowledgments: Acknowledgment[];
}

export interface ReportMeta {
  title: string;
  kind: string;
  span: string;
  course: string;
  institution: string;
  school: string;
  submittedTo: string;
  submissionDate: string;
  confidentiality: string;
}

export const report: ReportMeta = {
  title: 'Four Work Terms in Computing',
  kind: 'Co-op Work Term Portfolio',
  span: '2024 to 2026',
  course: 'COOP',
  institution: 'University of Guelph',
  school: 'School of Computer Science',
  submittedTo: 'Co-op Advisor',
  submissionDate: '10 September 2026',
  confidentiality:
    'All four employers are named here with their permission. At JREN Energy Inc. and Badger Redwood Inc. the work is described rather than shown, because the code belongs to the firm that paid for it.'
};

export interface Student {
  name: string;
  studentId: string;
  email: string;
  program: string;
  year: string;
}

export const student: Student = {
  name: 'Adeoluwa Jason Ojulari',
  studentId: '1234554',
  email: 'aojulari@uoguelph.ca',
  program: 'Bachelor of Computing (Co-op), Minor in Business',
  year: 'Final year'
};

export interface SubmittalLetter {
  date: string;
  address: string[];
  salutation: string;
  body: string[];
  closing: string;
  signatory: string;
  signatoryMeta: string;
}

export const letter: SubmittalLetter = {
  date: '10 September 2026',
  address: [
    'Co-op Advisor',
    'School of Computer Science',
    'University of Guelph',
    'Guelph, Ontario  N1G 2W1'
  ],
  salutation: 'Dear Co-op Advisor,',
  body: [
    'This website serves as a portfolio of my four co-op work terms, completed between 2024 and 2026. It brings together my experiences, accomplishments, and reflections from each placement in one place.',
    'The website is organized into individual work term reports, allowing each placement to be explored separately. Each report covers the responsibilities I held, the work I contributed to, the goals I established, and the progress I made throughout the term. Beyond documenting my experiences, the portfolio provides an opportunity to reflect on how my skills, understanding, and professional development have evolved throughout my co-op journey.',
    'The website also includes a comparative reflection across all four placements, highlighting recurring goals, lessons learned, and areas where I experienced challenges or fell short of my initial expectations. These reflections are intended to provide a broader perspective on my development across multiple work environments.',
    'The portfolio has been designed to present my co-op experience in a clear, accessible, and organized format while providing a comprehensive record of my work term learning and professional growth.'
  ],
  closing: 'Sincerely,',
  signatory: 'Adeoluwa Jason Ojulari',
  signatoryMeta: 'Student ID 1234554'
};

export interface MarginNote {
  anchor: string;
  text: string;
}

export interface Introduction {
  lead: string;
  body: string[];
  marginNotes: MarginNote[];
}

export const introduction: Introduction = {
  lead:
    'I arrived at Guelph very young, took a first internship at eighteen with no real idea what I was doing, and four work terms later the systems I write run in production.',
  body: [
    'The four terms in order: a Customer Management and Support System for RAA I.T. over the summer of 2024, maintenance and feature work on the JREN Energy public website and its Chilink conferencing application through the winter of 2025, full-stack features and tests on a supply chain management application at Badger Redwood in the autumn of 2025, and then a production website and a ten-workflow AI agent platform at Value-N-Action Consulting in the summer of 2026.',
    'The through-line is less flattering than that list. The first goal I ever set for a work term was about not being able to turn pseudocode into code. I could describe a solution accurately and then stall at writing it. The fourth-term version of the same goal is about becoming comfortable working with AI models. Three production systems sit between those two sentences, which is the only reason the goal was able to move that far.',
    'Section 5.0 is where the four terms are compared against each other rather than described one after another. Two of the four threads it tracks did not close cleanly. Collaboration is recorded as only partially met in Work Term 2, because my own reflection said the feedback only somewhat confirmed it. Time management was set as a goal in two separate terms and is still open.'
  ],
  marginNotes: [
    {
      anchor: 'On scope',
      text:
        'Sections 2.0 to 4.0 report one placement at a time, and every term is reported at the same depth.'
    },
    {
      anchor: 'On unmet goals',
      text:
        'Goals that were not met are shown at the same weight as goals that were, with the reason attached rather than summarised away.'
    }
  ]
};

export interface Interstitial {
  after: 'wt1' | 'wt2' | 'wt3';
  label: string;
  text: string;
}

/* Connective tissue. One term is on screen at a time, so each of these attaches to
   the top of the term it leads into rather than sitting between two chapters. */
export const interstitials: Interstitial[] = [
  {
    after: 'wt1',
    label: 'Carried in from Work Term 1',
    text:
      'The first placement was guided the whole way through. There was a Head of Development who walked me into the work and someone to ask whenever I was stuck. JREN was smaller and fully remote, and one of the three goals I set there was to find a technology that could benefit the firm and then put it into a project. That meant proposing the tool myself instead of being handed one.'
  },
  {
    after: 'wt2',
    label: 'Carried in from Work Term 2',
    text:
      'At JREN I mostly kept existing things working. That meant the public website, and features inside a conferencing application other people had built. Badger Redwood gave me full-stack features of my own, rotating between the front end and the back end, and expected unit and integration tests on both sides. Writing the tests was the part that was genuinely new.'
  },
  {
    after: 'wt3',
    label: 'Carried in from Work Term 3',
    text:
      'Badger Redwood was one codebase and one queue of work. Value-N-Action was three concurrent workstreams, and the work changed in kind as well as in volume. Instead of writing application code end to end, I was building systems whose job is to call a language model and then constrain what comes back out of it.'
  }
];

export interface ConclusionPoint {
  heading: string;
  body: string;
}

export interface Conclusions {
  lead: string;
  points: ConclusionPoint[];
}

export const conclusions: Conclusions = {
  lead: 'What four terms of goal forms actually record, read in order.',
  points: [
    {
      heading: 'The standard for writing code rose each time the goal came back',
      body:
        'The same goal about proficiency in code appears in Work Terms 1, 2 and 4. Work Term 3 did not set it. Read as a list, that looks like a goal that was never met. The opposite is true. In 2024 clearing it meant turning pseudocode into something that ran. In 2025 it meant contributing reviewed code to projects I had not started. In 2026 it meant ten workflows calling a model directly and a website in production. The goal came back because the bar for clearing it kept moving up.'
    },
    {
      heading: 'I stopped asking first and started investigating first',
      body:
        'Work Term 3 records this in its own reflection. Instead of seeking immediate assistance, I now approach a problem systematically, break it down and consider the potential causes before I raise it. That is a change in behaviour rather than a skill acquired, which is why it survived into the next term and into work nobody could have answered for me.'
    },
    {
      heading: 'Building from a written specification, not just wiring up a library',
      body:
        'For three terms, most of my work was wiring together libraries somebody else had written. The fourth term was the first time I had to build something from a written specification instead. The clearest case was checking that an incoming WhatsApp message really came from the messaging service it claimed to come from. That check needs a standard signing routine, and the tool I was working inside offered no way to do it, so I wrote the routine myself from the published specification and tested it against thousands of cases before I let it guard anything. Reading a specification and building to it is now part of what I can do.'
    },
    {
      heading: 'Time management is the goal I am still carrying',
      body:
        'I set it in Work Term 3. I set it again in Work Term 4, with the word Further in front of an otherwise identical sentence. That word is my own admission that the third term had not closed it. The evidence is about three weeks where a third workstream sat blocked and I kept checking on it instead of moving my hours to the two projects I could finish. Section 5.4 records the goal as partially met. That is the honest result, and it is what I take into my final term.'
    }
  ]
};

export interface AppendixRow {
  term: string;
  focus: string;
}

export interface Appendix {
  title: string;
  note: string;
  rows: AppendixRow[];
}

export const appendix: Appendix = {
  title: 'Professional Log Summary',
  note:
    'Condensed from the monthly and weekly reports submitted during each placement. The full logs are available on request.',
  rows: [
    {
      term: 'Work Term 1',
      focus:
        'Built a Customer Management and Support System for RAA I.T., covering authentication, role-based access, product workflows and a real-time chat channel.'
    },
    {
      term: 'Work Term 2',
      focus:
        'Maintained and optimised the JREN Energy website and shipped features and fixes inside Chilink, the conferencing application the firm runs in-house.'
    },
    {
      term: 'Work Term 3',
      focus:
        'Implemented full-stack features, dashboards and both unit and integration tests for a supply chain management application at Badger Redwood.'
    },
    {
      term: 'Work Term 4',
      focus:
        'Shipped the Value-N-Action website to production and built an AI agent platform of ten workflows across three agents.'
    }
  ]
};

export const terms: Term[] = [
  {
    id: 'wt1',
    ordinal: '01',
    label: 'Work Term 1',
    season: '2024 Summer',
    dates: 'May to September 2024',
    datesShort: 'May to Sep 2024',
    role: 'Intern Software Developer',
    location: 'Salford, United Kingdom (remote)',
    beat: 'A first internship, guided the whole way, and one system built end to end.',
    isLatest: false,
    plate: 'term1',
    plateAlt:
      'The Raa i.T. logo. The word Raa in dark grey rounded letters, then a lower-case i in orange and a capital T in red, each followed by a full stop.',
    plateCaption:
      'The Raa I.T. mark, taken from the contract of employment for this placement. Work Term 1 ran from May to September 2024, remote to Salford, and was hosted by Cyraatek, a sister company of the firm.',
    project: 'Customer Management and Support System',
    employer: {
      name: 'RAA I.T.',
      sector: 'IT services and research',
      description:
        'An IT services and research firm based in Salford. The placement itself was hosted by Cyraatek, a sister company of RAA I.T., and the day to day work was set and reviewed by the development team there.',
      computingRelevance:
        'The work sat on a real internal product rather than a training exercise, which is where authentication, access control and data modelling stop being coursework topics. On a customer system those three decide whether one customer can see another customer record, so an error there is a security failure.',
      facts: [
        { label: 'Team and reporting', value: 'Reported to the Head of Development' },
        { label: 'Schedule', value: '35 hours per week, fully remote' },
        { label: 'Check-in cadence', value: 'Weekly, plus an extra meeting in any week that needed one' }
      ]
    },
    job: {
      overview:
        'I developed a Customer Management and Support System to streamline how the firm handled its customers and its products. I built the user authentication and the role-based access control that sat over it, and a real-time chat channel over WebSockets so support conversations happened inside the system rather than beside it. I designed the product management workflows behind all of that, including the CRUD operations and the image handling. On the administrative side I enabled bulk customer management and dynamic conversation tracking, so an administrator could act on many records at once and follow a conversation as it moved.',
      unique:
        'It was my first internship and I had no working picture of what a developer actually does all day. Being given one system to build, and a supervisor who explained the reasoning instead of just correcting the code, is the reason the three terms after it were possible.',
      skills: [
        'REST API design',
        'Relational data modelling',
        'Authentication and access control',
        'Real-time messaging over WebSockets',
        'Working to code review'
      ],
      stack: [
        { name: 'FastAPI', slug: 'fastapi' },
        { name: 'Python', slug: 'python' },
        { name: 'SQLAlchemy', slug: 'sqlalchemy' },
        { name: 'PostgreSQL', slug: 'postgresql' }
      ],
      coursework: [
        {
          code: 'CIS*2430',
          title: 'Object Oriented Programming',
          relation:
            'The customer and product models were classes before they were tables, and SQLAlchemy is an object relational mapper, so the schema was designed by designing the objects.'
        },
        {
          code: 'CIS*3210',
          title: 'Computer Networks',
          relation:
            'The support chat holds a WebSocket open for the length of a conversation, which is a different connection model from the request and response the rest of the API runs on.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Improve the technical aspect of writing code',
        state: 'met',
        target:
          'In my own words at the time, while I am fairly conversant and good at pseudo-code, I tend to struggle a bit when it comes to actually writing code. The plan was code reviews with my supervisor acting as a mentor, plus contributing to open source for hands-on experience. Success meant regularly producing functional, efficient code that passed review and met the project criteria on time.',
        outcome:
          'Met. I successfully improved my technical coding skills by actively engaging in code previews with a mentor and contributing to open-source projects. I have made significant improvement as my code now consistently meets project criteria, passes reviews, and I have received positive feedback from my supervisor.',
        evidence: 'Weekly check-ins with the Head of Development, plus an extra meeting in any week that needed one.'
      },
      {
        ref: '4.2',
        title: 'Think further outside the box, and learn more libraries and functions',
        state: 'met',
        target:
          'Improve my capacity to think outside the box while solving problems, and learn more about the various libraries and functions available to me.',
        outcome:
          'Met. By constantly experimenting with new tools and problem-solving techniques, I was able to successfully improve my capacity for creative thinking as well as my ability to use a variety of libraries and functions.'
      },
      {
        ref: '4.3',
        title: 'Improve my teamwork skills in an office setting',
        state: 'met',
        target:
          'Collaborate effectively with colleagues, communicate clearly and contribute positively to the team.',
        outcome:
          'Met. I successfully improved my teamwork skills by actively participating in team meetings. A positive atmosphere with colleagues and supervisor confirmed my enhanced ability to communicate and contribute effectively.'
      }
    ],
    acknowledgments: [
      {
        name: 'Solomon Adeleke',
        role: 'Head of Development, direct supervisor',
        note:
          'Walked me through everything on my first ever internship and made an entirely unfamiliar setting feel manageable. He still checks in to ask how I am doing.'
      },
      {
        name: 'Mr. Akin',
        role: 'Owner, RAA I.T. and Cyraatek',
        note:
          'Backed the placement in the same spirit, and made the first term somewhere a beginner could ask an obvious question without paying for it.'
      }
    ]
  },
  {
    id: 'wt2',
    ordinal: '02',
    label: 'Work Term 2',
    season: '2025 Winter',
    dates: 'January to May 2025',
    datesShort: 'Jan to May 2025',
    role: 'Software Development Intern',
    location: 'Calgary, Alberta (remote)',
    beat: 'A smaller remote team, where choosing the tool was part of the job.',
    isLatest: false,
    plate: 'term2',
    plateAlt:
      'The Jren Energy letterhead mark. The words Jren Energy in blue, a thin grey rule under them, and the line Value Added Services in grey below that.',
    plateCaption:
      'The Jren Energy letterhead, taken from the offer of placement. The firm sets its own name as type rather than as a drawn logo, so this is the mark as the firm itself uses it. Work Term 2 ran from January to May 2025, remote to Calgary, with the final week on site.',
    project: 'Chilink, the conferencing application, and the public website',
    employer: {
      name: 'JREN Energy Inc.',
      sector: 'Energy services',
      description:
        'An energy services firm in Calgary, which describes what it offers as Value Added Services. Its software includes the public-facing website and Chilink, the conferencing application it runs in-house.',
      computingRelevance:
        'The firm is not a software company, so its software is maintained by whoever is in a position to maintain it. Front-end feature work, hosting administration and database access all sat inside the same role, and a slow page was a business problem in the same week rather than a ticket for next quarter.',
      facts: [
        { label: 'Reporting', value: 'Reported to the Director' },
        { label: 'Arrangement', value: 'Remote, with the final week on site in Calgary' },
        { label: 'How the firm describes itself', value: 'Value Added Services' }
      ]
    },
    job: {
      overview:
        'I maintained and optimised the public-facing website, improving page performance, resolving bugs and making sure it behaved the same way across browsers. Alongside that I developed features and fixes for Chilink, the core conferencing application, which runs React on the front end against a MariaDB database. The team was distributed and worked in an Agile cycle, so I contributed to sprint planning, code reviews and version-controlled releases. My monthly log records the progression through the term. January was spent learning cPanel and web hosting administration, February went deeper into JavaScript with asynchronous operations and optimising API calls, and by March I was shipping consistent updates to Chilink.',
      unique:
        'One of the three goals I set was to find a technology that could benefit JREN and then put it into a project. Nobody handed me a tool to evaluate. Deciding what was worth introducing, and then being the person responsible for making it work in a live application, was new.',
      skills: [
        'Front-end feature development',
        'Web performance and cross-browser work',
        'Asynchronous JavaScript',
        'Web hosting administration',
        'Agile collaboration on a distributed team'
      ],
      stack: [
        { name: 'React', slug: 'react' },
        { name: 'JavaScript', slug: 'javascript' },
        { name: 'MariaDB', slug: 'mariadb' },
        { name: 'Git', slug: 'git' },
        { name: 'cPanel', slug: '' }
      ],
      coursework: [
        {
          code: 'CIS*2520',
          title: 'Data Structures',
          relation:
            'Reasoning about the cost of the client-side work behind the pages I was asked to speed up, rather than guessing at what was slow.'
        },
        {
          code: 'CIS*3110',
          title: 'Operating Systems',
          relation:
            'The month spent learning cPanel and hosting administration, where the site is a set of processes, file permissions and services on a shared host rather than only the code in the pages.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Continuously improve my proficiency in developing code',
        state: 'met',
        target:
          'Keep improving how I write code, through review with my technical supervisor and by contributing to live projects rather than practice ones.',
        outcome:
          'Met. I improved my coding skills by reviewing code with my technical supervisor and contributing to a few projects. This hands-on experience improved my ability to write functional and efficient code.'
      },
      {
        ref: '4.2',
        title: 'Enhance my collaboration skills in a cross-functional team',
        state: 'partial',
        target:
          'Take part in team meetings, code reviews and brainstorming sessions, and look for confirmation in the feedback from coworkers and supervisors.',
        outcome:
          'Partially met. By participating in team meetings, code reviews, and brainstorming sessions, I enhanced my collaboration skills within a cross-functional team. Some positive feedback from coworkers and supervisors somewhat confirmed my growth in this area.',
        evidence:
          'Recorded as partially met rather than met because of the hedge in my own reflection. Feedback that somewhat confirmed growth is not confirmation of it.'
      },
      {
        ref: '4.3',
        title: 'Explore new technology that could benefit JREN',
        state: 'met',
        target:
          'Research tools and frameworks that could help the firm, and integrate at least one new tool or technology into a project.',
        outcome:
          'Met. I researched new tools, and frameworks to see which technologies could benefit JRENenergy software. During this search, I successfully integrated a new tool into a project, thereby improving its performance.'
      }
    ],
    acknowledgments: [
      {
        name: 'The JREN Energy team',
        role: 'Colleagues and supervisors',
        note:
          'The whole team, and the firm around it, carried this term. No one person is named here because the support was general rather than owed to a single desk.'
      }
    ]
  },
  {
    id: 'wt3',
    ordinal: '03',
    label: 'Work Term 3',
    season: '2025 Fall',
    dates: 'September to December 2025',
    datesShort: 'Sep to Dec 2025',
    role: 'Application Developer Intern',
    location: 'Mississauga, Ontario (remote)',
    beat: 'Full-stack features of my own, and the first term where I wrote the tests.',
    isLatest: false,
    plate: 'term3',
    plateAlt:
      'The Badger Redwood logo. A tall pale orange redwood tree beside the words Badger Redwood, with Badger in bold navy and Redwood in a lighter navy.',
    plateCaption:
      'The Badger Redwood mark, taken from the scanned offer letter, which is why the edges are soft. Work Term 3 ran from September to December 2025, remote to Mississauga, on a supply chain management application used by clients of the firm.',
    project: 'Supply chain management application',
    employer: {
      name: 'Badger Redwood Inc.',
      sector: 'Supply chain technology',
      description:
        'A supply chain technology firm in Mississauga. The product I worked on is a supply chain management application used by clients of the firm.',
      computingRelevance:
        'Most of the engineering in supply chain software is the problem of showing a client their own data in a form they can act on today. That put dashboard and visualisation work directly alongside back-end data work in one role, and made tests the only practical way to know a change had not quietly broken a view somebody was relying on.',
      facts: [
        { label: 'Reporting', value: 'Reported to the Products Technology Lead' },
        { label: 'Schedule', value: '40 hours per week, fully remote' },
        { label: 'Term', value: 'Four months, September to December 2025' }
      ]
    },
    job: {
      overview:
        'I implemented and maintained full-stack features for a supply chain management application, working in React, TypeScript and Python and rotating between front-end and back-end responsibilities. On the front end I built responsive UI components and interactive dashboards to visualise client supply chain data. I wrote and maintained unit and integration tests across both ends. The role also covered troubleshooting technical issues, code reviews, documentation and version control, and I took part in Agile sprints and remote standups with a distributed team.',
      unique:
        'Rotating across both ends of the same application meant I could not leave either side to somebody else. It was also the first placement where writing the tests was part of the work itself rather than something to get to afterwards.',
      skills: [
        'Full-stack feature development',
        'Data visualisation and dashboard design',
        'Unit and integration testing',
        'Systematic debugging',
        'Code review and documentation'
      ],
      stack: [
        { name: 'React', slug: 'react' },
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'Python', slug: 'python' },
        { name: 'Git', slug: 'git' }
      ],
      coursework: [
        {
          code: 'CIS*3750',
          title: 'System Analysis and Design in Applications',
          relation:
            'Working inside an application whose requirements arrived as client behaviour, and deciding what a dashboard needed to show before deciding how to draw it.'
        },
        {
          code: 'CIS*2750',
          title: 'Software Systems Development and Integration',
          relation:
            'Features that had to fit an application already in front of clients, built across the front end and the back end together, with the tests and the version control part of delivering them rather than steps after them.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Develop stronger problem-solving skills through complex debugging and integration',
        state: 'met',
        target:
          'Take on the harder debugging and integration work rather than routing around it, and work each problem through before escalating it.',
        outcome:
          'Met. Working on more difficult debugging and integration tasks has helped me improve my critical thinking skills when problem solving. Instead of seeking immediate assistance, I now approach challenges in a more systematic manner, breaking them down and considering potential causes.'
      },
      {
        ref: '4.2',
        title: 'Work on time management by balancing multiple tasks and meeting deadlines',
        state: 'met',
        target:
          'Balance multiple project tasks and meet deadlines consistently. Set while noting that time management was not necessarily an issue, which is worth reading against the fourth term.',
        outcome:
          'Met. Setting clearer daily priorities and keeping better track of my work allowed me to manage projects more effectively and stay on top of deadlines without feeling rushed, giving me more time to focus on quality and professionalism.'
      },
      {
        ref: '4.3',
        title: 'Improve my technological skills with version control, documentation and integration frameworks',
        state: 'met',
        target:
          'Become familiar with the tools the team used every day: version control, documentation systems and integration frameworks.',
        outcome:
          'Met. Regular use of version control helped me better understand how changes are managed and tracked, while paying more attention to documentation improved how I record and explain my work.'
      }
    ],
    acknowledgments: [
      {
        name: 'The Badger Redwood team',
        role: 'Colleagues and supervisors',
        note:
          'The team and the firm supported the whole term. No one person is named here, for the same reason as the term before it.'
      }
    ]
  },
  {
    id: 'wt4',
    ordinal: '04',
    label: 'Work Term 4',
    season: '2026 Summer',
    dates: '18 May to 6 September 2026',
    datesShort: 'May to Sep 2026',
    role: 'Full-Stack Developer Intern',
    location: 'Toronto, Ontario (remote)',
    beat: 'Three workstreams at once, and systems whose job is to call a model and then constrain it.',
    isLatest: true,
    plate: 'term4',
    plateAlt:
      'The Value-N-Action Consulting logo. A navy V, N and A monogram overlapping a globe, with the words VALUE-N-ACTION above the word CONSULTING beneath it.',
    plateCaption:
      'The Value-N-Action Consulting mark, taken from the website assets the firm supplied. Work Term 4 ran from 18 May to 6 September 2026, remote to Toronto, and is the placement this report was written at the end of.',
    project: 'The company website, and an AI agent platform',
    employer: {
      name: 'Value-N-Action Consulting',
      sector: 'Innovation and management consulting',
      description:
        'A boutique consulting firm specialising in innovation and value creation, helping clients advance projects towards successful commercialisation and bridging science and business. Clients are served in both English and French.',
      computingRelevance:
        'A consulting firm this size has no platform team, so anything built for it has to keep running without someone watching it. That pushed the term towards the work that keeps a system up rather than towards new features. Pages had to load quickly, images had to be handled properly, the site had to deploy cleanly, and the agents had to fail quietly and carry on when a service they depend on does not answer.',
      facts: [
        { label: 'Reporting', value: 'Reported to the direct supervisor and the Founder and Innovation Principal' },
        { label: 'Term', value: '16 weeks, 40 hours per week' }
      ]
    },
    job: {
      overview:
        'The term had two deliverables. The first was the company website. I built the front end, the back end and a password-protected admin console the firm uses to manage its own content, and the site is deployed and live. The second was an AI agent platform, which I set up and host myself. Three agents run on it, ten workflows in total. The scheduler is the largest at seven. It takes in email from two mailboxes, proposes meeting slots, sends a morning brief and an evening digest, prepares a brief before a meeting and accepts commands over WhatsApp. The slot proposal is written once and called by the workflows that need it, so none of them repeats it. The researcher agent is one workflow and the marketing agent is two.',
      unique:
        'Two things here were new to me. Every WhatsApp message to the scheduler has to be proved genuine before it is acted on. The tool it runs inside gave me no way to run that check, so I wrote the check myself from the published specification. The second was a choice. I put plain rules after the language model, so wording a user typed by hand passes through as it is. The model can propose text. It cannot rewrite what a person already wrote.',
      skills: [
        'Systems integration across many services at once',
        'Security-conscious backend work',
        'Full-stack API design',
        'Keeping a system running when a service it depends on fails',
        'Designing AI workflows with plain rules around the model'
      ],
      stack: [
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'Python', slug: 'python' },
        { name: 'React', slug: 'react' },
        { name: 'FastAPI', slug: 'fastapi' },
        { name: 'n8n', slug: 'n8n' },
        { name: 'PostgreSQL', slug: 'postgresql' },
        { name: 'Docker', slug: 'docker' },
        { name: 'Anthropic Claude', slug: 'anthropic' },
        /* Simple Icons carries no twilio slug, so the CDN 404s on it. Left empty, as
           cPanel is in Work Term 2, which renders the pill as text only. */
        { name: 'Twilio', slug: '' },
        { name: 'Vercel', slug: 'vercel' }
      ],
      coursework: [
        {
          code: 'CIS*2750',
          title: 'Software Systems Development and Integration',
          relation:
            'Very little of the platform is my own code running on its own. It calls out to two mailboxes, a calendar, a messaging service and a language model, and the work is in getting them to agree with each other.'
        },
        {
          code: 'CIS*3210',
          title: 'Computer Networks',
          relation:
            'An incoming WhatsApp message has to be shown to have come from the messaging service before anything acts on it. That is a question about the request itself rather than about what it says.'
        },
        {
          code: 'CIS*3490',
          title: 'Analysis and Design of Computer Algorithms',
          relation:
            'The security check was an algorithm I had to build step by step from a written description, then prove correct on a large set of generated inputs. Working from the description rather than from a library is what the course asks for.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Continuously improve my proficiency in writing code and become more comfortable with AI models',
        state: 'met',
        target:
          'Carry the coding goal forward from the earlier terms, and extend it to working with AI models directly rather than through tooling that hides them.',
        outcome:
          'This work term gave me more room to write code than any of the previous three, and most of it involved AI models directly. Building the three agents meant calling the model myself rather than leaning on a ready-made block, which made me learn how prompts, structured output and model choice actually work instead of treating the model as a black box. Shipping the company website alongside that, front end and back end, kept me writing ordinary application code at the same time. I am noticeably more comfortable with both than I was in May, though I would still like more practice writing prompts that hold up when the input is messy.',
        evidence:
          'Ten workflows across three agents. The company website and its admin console are both live.'
      },
      {
        ref: '4.2',
        title: 'Build confidence in solving complex technical problems through hands-on debugging',
        state: 'met',
        target:
          'Take on problems where the answer is not available to look up, and work them out by debugging and reading specifications rather than by substituting a library.',
        outcome:
          'The hardest problem this term was proving that an incoming message came from the service it claimed to come from. The tool I was working in had no way to run that check. So I built the check from its published specification and tested it against thousands of generated cases before I was willing to let it guard access to a calendar and a mailbox. Working through that, and through smaller problems like splitting long replies without ever breaking a link, changed how I approach an unfamiliar problem. I now read the specification first and build up from something I can verify, rather than searching for an existing solution to copy. I am more confident than I was, mostly because I have seen that I can get to a correct answer slowly when there is no shortcut available.'
      },
      {
        ref: '4.3',
        title: 'Further work on time management by balancing multiple project tasks and meeting deadlines',
        state: 'partial',
        target:
          'Carried over from Work Term 3. The goal text is the third-term goal almost word for word, with the single word Further added in front of it.',
        outcome:
          'I set this goal again because I did not finish with it last term, and I have not finished with it this term either. Running the website, the agent platform and a third client workstream at the same time was manageable while all three were moving, but for about three weeks one of them was blocked waiting on a plan and an email address I did not control, and I handled that badly. I kept checking in on the blocked work instead of committing the time to the two projects that were unblocked. Weekly reporting helped me see where the time was actually going, and the work still shipped, but balancing genuinely competing priorities is the thing I am carrying into my final term rather than something I can call finished.'
      }
    ],
    acknowledgments: [
      {
        name: 'Mr. Ochuba and Dr Nadia Al-Banna',
        role: 'Direct supervisor, and Founder and Innovation Principal',
        note:
          'Between them they made this a term where I never hesitated to raise a problem with either of them. Problems got raised early rather than sat on, and that is most of the reason the hard parts of the term got solved at all.'
      }
    ]
  }
];

export interface ThreadCell {
  termId: string;
  state: GoalState | 'na';
  note: string;
}

export interface GoalThread {
  ref: string;
  title: string;
  cells: ThreadCell[];
  arc: string;
}

/** Table 5.1. The cross-term comparison, and the argument of the portfolio. */
export const threads: GoalThread[] = [
  {
    ref: '5.1',
    title: 'Writing code that works, not just pseudocode',
    cells: [
      {
        termId: 'wt1',
        state: 'met',
        note: 'The original goal named the gap outright. Good at pseudo-code, struggling to write the code.'
      },
      { termId: 'wt2', state: 'met', note: 'Restated as continuously improving proficiency in developing code.' },
      { termId: 'wt3', state: 'na', note: 'Not set as a goal this term.' },
      { termId: 'wt4', state: 'met', note: 'The same goal again, now extended to working with AI models.' }
    ],
    arc:
      'The same goal comes back in Work Terms 1, 2 and 4, and each time it asked more than the time before. The repetition shows the standard rising rather than the goal failing.'
  },
  {
    ref: '5.2',
    title: 'Problem solving and debugging',
    cells: [
      {
        termId: 'wt1',
        state: 'met',
        note: 'Framed generically as thinking outside the box and learning more libraries and functions.'
      },
      { termId: 'wt2', state: 'na', note: 'Not set as a goal this term.' },
      {
        termId: 'wt3',
        state: 'met',
        note: 'Sharpened to complex debugging and integration. The reflection records no longer asking for help first.'
      },
      {
        termId: 'wt4',
        state: 'met',
        note: 'Confidence on hard problems, shown by building a security check from its written specification.'
      }
    ],
    arc:
      'The wording gets more specific every time this thread appears, from creative thinking in the first term to a named debugging practice by the third and a security check built from a written specification by the fourth.'
  },
  {
    ref: '5.3',
    title: 'Teamwork and collaboration',
    cells: [
      { termId: 'wt1', state: 'met', note: 'Teamwork in an office setting, and the reflection is clear.' },
      { termId: 'wt2', state: 'partial', note: 'The reflection says the feedback only somewhat confirmed the growth.' },
      { termId: 'wt3', state: 'na', note: 'Not set as a goal this term.' },
      { termId: 'wt4', state: 'na', note: 'Not set as a goal this term.' }
    ],
    arc:
      'Collaboration stops appearing as a goal after Work Term 2. The partial mark comes from the way I worded my own reflection, not from anyone else judging the work.'
  },
  {
    ref: '5.4',
    title: 'Time management and personal organisation',
    cells: [
      { termId: 'wt1', state: 'na', note: 'Not set as a goal this term.' },
      { termId: 'wt2', state: 'na', note: 'Not set as a goal this term.' },
      {
        termId: 'wt3',
        state: 'met',
        note: 'Introduced as a goal, while noting that time management was not necessarily an issue.'
      },
      {
        termId: 'wt4',
        state: 'partial',
        note: 'Further in front of the same sentence again, against about three weeks of a blocked third workstream.'
      }
    ],
    arc:
      'The clearest carry-forward in the whole portfolio. Work Term 3 introduced it while calling it not necessarily an issue, and Work Term 4 repeated the sentence almost word for word and added Further, which is my own marker that it was not finished.'
  }
];

export const stateLabel: Record<GoalState | 'na', string> = {
  met: 'Met',
  partial: 'Partially met',
  unmet: 'Unmet',
  na: 'Not applicable'
};

export interface ContentsRow {
  ref: string;
  title: string;
  anchor: string;
  front: boolean;
}

export const contents: ContentsRow[] = [
  { ref: '', title: 'Letter of Submittal', anchor: 'letter', front: true },
  { ref: '1.0', title: 'Introduction', anchor: 'sec-1', front: false },
  { ref: 'A', title: 'Exhibit A. Work Term Chronology', anchor: 'exhibit-a', front: true },
  { ref: '2.0', title: 'Employer Information', anchor: 'sec-2', front: false },
  { ref: '3.0', title: 'Role and Project', anchor: 'sec-3', front: false },
  { ref: '4.0', title: 'Goals', anchor: 'sec-4', front: false },
  { ref: '5.0', title: 'Goal Progression Across Four Terms', anchor: 'sec-5', front: false },
  { ref: '6.0', title: 'Conclusions', anchor: 'sec-6', front: false },
  { ref: '7.0', title: 'Acknowledgments', anchor: 'sec-7', front: false },
  { ref: 'App. A', title: 'Professional Log Summary', anchor: 'appendix-a', front: true }
];

export interface FigureRow {
  ref: string;
  title: string;
  anchor: string;
}

export const figures: FigureRow[] = [
  { ref: 'Exhibit A', title: 'Work term chronology', anchor: 'exhibit-a' },
  { ref: 'Plate', title: 'One employer mark per placement, with the selected term', anchor: 'sec-2' },
  {
    ref: 'Figure 3.1',
    title: 'Inbound channels, the session router and the three agents of the Work Term 4 platform',
    anchor: 'figure-3-1'
  },
  { ref: 'Table 5.1', title: 'Goal state by work term', anchor: 'table-5-1' }
];
