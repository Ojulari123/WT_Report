/**
 * Placeholder content awaiting the real report. Every string here is written to the
 * right shape, length and register, but is not the final copy.
 *
 * Course codes are plausible but unverified. Check them against the current calendar.
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
  title: 'Four Work Terms in Computer Science',
  kind: 'Co-op Work Term Portfolio',
  span: 'January 2024 to August 2026',
  course: 'COOP*1100',
  institution: 'University of Guelph',
  school: 'School of Computer Science',
  submittedTo: 'Faculty Advisor, Co-op Work Term Reports',
  submissionDate: '15 September 2026',
  confidentiality:
    'Contains no confidential or proprietary employer information. System descriptions are limited to what each employer publishes publicly.'
};

export interface Student {
  name: string;
  studentId: string;
  email: string;
  program: string;
  year: string;
}

export const student: Student = {
  name: 'Adeoluwa Ojulari',
  studentId: '0000000',
  email: 'ojulari.o@northeastern.edu',
  program: 'BSc Computer Science, Co-operative Education',
  year: 'Fourth year'
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
  date: '15 September 2026',
  address: [
    'Faculty Advisor, Co-op Work Term Reports',
    'School of Computer Science',
    'University of Guelph',
    'Guelph, Ontario  N1G 2W1'
  ],
  salutation: 'Dear Faculty Advisor,',
  body: [
    'This portfolio covers all four of my co-operative education work terms, completed between January 2024 and August 2026, and is submitted in partial fulfilment of the requirements of COOP*1100.',
    'The four placements were a regional hospital network, a business software company, a municipal open data programme and a freight software platform. They are reported in sequence rather than separately, because the thing I want the reader to see is what moved between them.',
    'I have written each term to the same structure so that they can be compared. Three short passages sit between the chapters recording what carried forward, and Section 5.0 sets out the four goals that recur across all four terms. One of those goals is still unmet after four terms, and I have left it recorded as unmet rather than rounding it up.',
    'The work described is my own. Where a supervisor changed the direction of a piece of work, as happened with the idempotency key in Section 5.1, I have said so. No confidential employer information is included.'
  ],
  closing: 'Sincerely,',
  signatory: 'Adeoluwa Ojulari',
  signatoryMeta: 'Student ID 0000000'
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
    'Four placements over two and a half years, reported in sequence because the goals did not reset between them.',
  body: [
    'The four terms look, from the outside, like a normal progression: helpdesk, then internal tools, then a public API, then a production platform. That is the version that fits on a resume and it is not very interesting.',
    'What the sequence actually records is one habit taking four terms to change. In the first term I escalated problems rather than investigating them, because escalating was correct in a hospital. In the second I inherited that habit into a job where it was no longer correct, and it cost me a feature. The third term made me write for people I would never meet. The fourth handed me a pager for a service I had written, which is the first time not knowing was my problem to solve.',
    'Section 5.0 is where the four terms are compared against each other rather than read one after another. If you read one section, read that one.'
  ],
  marginNotes: [
    {
      anchor: 'How to read this',
      text:
        'Sections 2.0 to 5.0 are the four terms in order, each written to the same structure so they can be compared. Exhibit A maps them and links into each chapter.'
    },
    {
      anchor: 'On unmet goals',
      text:
        'Goals recorded as unmet are shown at the same weight as goals that were met. Three of the four terms contain at least one.'
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
      'I finished the first term able to describe a problem accurately and unable to fix one. I chose the next placement specifically for the programming surface, which is the only placement decision in this portfolio I made deliberately rather than by application deadline.'
  },
  {
    after: 'wt2',
    label: 'Carried in from Work Term 2',
    text:
      'I left Latitude with unfinished work and a habit I could not yet name. The next placement put my work in front of people I would never meet and could not ask, which turned out to be the fastest available lesson in the difference between a requirement and an assumption.'
  },
  {
    after: 'wt3',
    label: 'Carried in from Work Term 3',
    text:
      'Writing for external developers taught me to be precise on paper. It did not make me responsible for anything staying up. That arrived in the fourth term, with the pager.'
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
  lead: 'What I would tell the student who started the first term.',
  points: [
    {
      heading: 'The bottleneck was never knowledge',
      body:
        'For three terms I assumed I was held up by not knowing enough. I was held up by not asking early enough. The feature I owned in the fourth term shipped because I raised a schema constraint in the second week. The feature I abandoned in the second term failed because I raised an equivalent constraint in the sixth, by which point there was no time left to act on the answer.'
    },
    {
      heading: 'Writing for strangers is a technical skill',
      body:
        'The municipal term produced no impressive system. It produced the first documentation I wrote for people who could not come and ask me what I meant, and that constraint improved my design work more than any framework I learned. I did not expect the least technical-sounding placement to be the one that changed how I write code.'
    },
    {
      heading: 'Carrying the pager changes the definition of finished',
      body:
        'Being on call for the ingestion service meant reading my own error handling at two in the morning. No coursework produces that feedback loop. My logging improved within one rotation for the straightforward reason that I had become the person who had to read it.'
    },
    {
      heading: 'One goal is still open after four terms, and that is the result',
      body:
        'In every term I stopped at the edge of my job description on infrastructure. I can deploy, roll back and read a dashboard, and I still could not rebuild an environment from nothing. Four terms is long enough that this stops being a gap and starts being a pattern, which is why it is recorded as unmet in Section 6.0 rather than softened to partial.'
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
    'Condensed from the weekly logs kept during each work term and countersigned by the respective supervisors. Full logs available on request.',
  rows: [
    { term: 'Work Term 1', focus: 'Ticket triage, account provisioning, endpoint imaging. No code released.' },
    { term: 'Work Term 2', focus: 'Three internal dashboards released. One reporting feature returned unfinished.' },
    { term: 'Work Term 3', focus: 'Two public dataset endpoints released with developer documentation.' },
    { term: 'Work Term 4', focus: 'Deduplication layer designed, released behind a staged flag. Two on-call rotations.' }
  ]
};

export const terms: Term[] = [
  {
    id: 'wt1',
    ordinal: '01',
    label: 'Work Term 1',
    season: 'Winter 2024',
    dates: 'January to April 2024',
    datesShort: 'Jan to Apr 2024',
    role: 'IT Support Analyst',
    location: 'Guelph, Ontario',
    beat: 'Learning how a workplace works, and writing nothing that outlived the term.',
    isLatest: false,
    plate: 'term1',
    plateAlt:
      'A hospital network room under fluorescent light, grey server cabinets with patch cabling and a laminated notice beside the door.',
    plateCaption:
      'The network room at Northview Health Network. Access was audited, so nothing here could be experimented on.',
    project: 'Internal support queue',
    employer: {
      name: 'Northview Health Network',
      sector: 'Healthcare IT',
      description:
        'A regional hospital network operating shared clinical and administrative systems across four sites.',
      computingRelevance:
        'Clinical systems are a constraint-heavy computing environment. Uptime is not negotiable and access control is a legal obligation rather than a preference, so the correct action is almost always to escalate rather than investigate.',
      facts: [
        { label: 'Staff supported', value: 'About 4,000' },
        { label: 'Sites', value: 'Four' },
        { label: 'Access changes', value: 'Audited approval trail required' }
      ]
    },
    job: {
      overview:
        'I worked the internal support queue: account provisioning, device imaging and first-line triage on clinical software faults. Anything touching patient records was escalated rather than investigated.',
      unique:
        'I was not permitted to experiment. That forced me to learn how to write a handoff a stranger could act on without calling me back, which is the only transferable thing I took from the term.',
      skills: ['Ticket triage', 'Written handoffs', 'Directory administration', 'Endpoint imaging'],
      stack: [
        { name: 'PowerShell', slug: '' },
        { name: 'Windows Server', slug: '' }
      ],
      coursework: [
        {
          code: 'CIS*1500',
          title: 'Introduction to Programming',
          relation:
            'Scripting repetitive provisioning steps, which was as far as the role allowed me to take it.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Function inside a professional engineering environment',
        state: 'met',
        target: 'Learn how work is assigned, reviewed and handed off on a real team.',
        outcome:
          'Met. By the second month I was running my own queue unprompted and knew which faults belonged to which team.'
      },
      {
        ref: '4.2',
        title: 'Explain technical problems to non-technical colleagues',
        state: 'partial',
        target: 'Describe a fault to a nurse or an administrator without using jargon.',
        outcome:
          'Partially met. I became good at explaining what I had done and stayed bad at explaining what I could not do, which meant I over-promised on timelines I did not control.'
      },
      {
        ref: '4.3',
        title: 'Write code that somebody else runs',
        state: 'unmet',
        target: 'Contribute a script or tool that outlives the work term.',
        outcome:
          'Unmet. The role had almost no programming surface and I did not go looking for one. I treated the job description as a ceiling.'
      }
    ],
    acknowledgments: [
      {
        name: 'Service Desk Lead',
        role: 'Direct supervisor',
        note: 'Rewrote my first three escalations in front of me and explained every edit as it was made.'
      }
    ]
  },
  {
    id: 'wt2',
    ordinal: '02',
    label: 'Work Term 2',
    season: 'Fall 2024',
    dates: 'September to December 2024',
    datesShort: 'Sep to Dec 2024',
    role: 'Software Developer, Internal Tools',
    location: 'Kitchener, Ontario',
    beat: 'First code in production, and one feature handed back unfinished.',
    isLatest: false,
    plate: 'term2',
    plateAlt:
      'A plain office desk beside a window on an overcast day, two monitors seen from behind, a whiteboard with faintly erased diagrams.',
    plateCaption:
      'The internal tools desk at Latitude Systems. My users sat two desks away, which was the most useful review process available.',
    project: 'Operations dashboards and a reporting feature',
    employer: {
      name: 'Latitude Systems',
      sector: 'Business software',
      description:
        'A mid-sized software company selling workflow products to operations teams, with a small internal platform group supporting its own staff.',
      computingRelevance:
        'Internal tooling is where the difficulty of software stops being implementation and becomes the people who have to use it. Requirements arrive as descriptions of an existing workaround rather than of a need.',
      facts: [
        { label: 'Team size', value: 'Five' },
        { label: 'Internal users', value: 'About 200' },
        { label: 'Release cadence', value: 'Weekly, manual QA' }
      ]
    },
    job: {
      overview:
        'I built and maintained internal dashboards for the operations team, and took on a reporting feature intended to replace a spreadsheet process that several people depended on.',
      unique:
        'My users sat two desks away, so I could watch somebody misuse my interface in real time. That is a faster and less flattering critique than any code review.',
      skills: ['Interface implementation', 'API design', 'Requirements gathering', 'Code review'],
      stack: [
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'React', slug: 'react' },
        { name: 'Node.js', slug: 'nodedotjs' },
        { name: 'PostgreSQL', slug: 'postgresql' }
      ],
      coursework: [
        {
          code: 'CIS*2520',
          title: 'Data Structures',
          relation:
            'Choosing the aggregation structure behind the dashboards, and understanding why the naive version did not hold at the sizes involved.'
        },
        {
          code: 'CIS*3750',
          title: 'System Analysis and Design in Applications',
          relation:
            'Directly relevant to the feature I did not finish. The course teaches validating requirements against the data before committing, which is exactly the step I skipped.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Own a feature from requirements through release',
        state: 'unmet',
        target: 'Take one piece of work end to end without a senior developer driving it.',
        outcome:
          'Unmet, and the most useful entry in this portfolio. I built to the requirements as given without interrogating them, found in the sixth week that the underlying data could not support the report, and handed the work back. The failure was not technical. I did not test the assumption while there was still time to respond to the answer.'
      },
      {
        ref: '4.2',
        title: 'Write code that others review and depend on',
        state: 'met',
        target: 'Contribute reviewed code to a shared production codebase.',
        outcome: 'Met. Three dashboards went into production and were still in use when I left.',
        evidence: 'Reviewed pull requests across the internal tools repository.'
      },
      {
        ref: '4.3',
        title: 'Explain technical tradeoffs to non-technical stakeholders',
        state: 'partial',
        target: 'Carried forward from the first term. Be able to say no, with a reason attached.',
        outcome:
          'Partially met. I learned to flag risk and still framed it as an apology, which invited reassurance instead of a decision.'
      },
      {
        ref: '4.4',
        title: 'Understand how the application is deployed',
        state: 'unmet',
        target: 'Learn what happens between a merged pull request and a running release.',
        outcome:
          'Unmet. Releases were run by one person on the team and I never asked to watch. The same gap appears in every term of this portfolio.'
      }
    ],
    acknowledgments: [
      {
        name: 'Internal Tools Manager',
        role: 'Direct supervisor',
        note: 'Treated the unfinished feature as a design review rather than a failure, and walked through where the assumption should have been tested.'
      }
    ]
  },
  {
    id: 'wt3',
    ordinal: '03',
    label: 'Work Term 3',
    season: 'Summer 2025',
    dates: 'May to August 2025',
    datesShort: 'May to Aug 2025',
    role: 'Backend Developer',
    location: 'Guelph, Ontario',
    beat: 'Writing for people I would never meet, which changed how I design.',
    isLatest: false,
    plate: 'term3',
    plateAlt:
      'A municipal government office in an older building, tall sash window onto a wet street, a plain desk with a monitor showing a grey data table, beige filing cabinets and a cork notice board.',
    plateCaption:
      'The open data office at the City of Guelph. Nothing about the room suggested that its output was consumed by strangers through an API.',
    project: 'Public dataset endpoints and developer documentation',
    employer: {
      name: 'City of Guelph, Open Data Programme',
      sector: 'Municipal government',
      description:
        'The municipal programme that publishes city datasets for public use: transit schedules, service requests, permits and budget lines. A small team inside a much larger and slower organisation, publishing to an audience it cannot survey.',
      computingRelevance:
        'Open data is an interface design problem disguised as a publishing problem. The consumers are anonymous, they cannot be asked what they meant, and once a field name is published somebody has written code against it. That makes backwards compatibility a civic obligation rather than an engineering preference.',
      facts: [
        { label: 'Datasets published', value: 'Around 60' },
        { label: 'Team', value: 'Two developers, one analyst' },
        { label: 'Consumers', value: 'Anonymous and uncontactable' }
      ]
    },
    job: {
      overview:
        'I built two public endpoints over existing municipal datasets, replacing a monthly CSV export that residents and local developers had been scraping. The larger part of the work was not the endpoints. It was the documentation, the field definitions and deciding what the response shape would commit the city to supporting.',
      unique:
        'I could not ask my users anything. In the previous term my users sat two desks away; here they were anonymous, and the only way to find out whether a field name was clear was to publish it and read what people built. That inverted how I approached design.',
      skills: [
        'Public API design',
        'Technical writing for external developers',
        'Data modelling',
        'Backwards compatibility',
        'Stakeholder consultation'
      ],
      stack: [
        { name: 'Python', slug: 'python' },
        { name: 'PostgreSQL', slug: 'postgresql' },
        { name: 'FastAPI', slug: 'fastapi' },
        { name: 'OpenAPI', slug: 'openapiinitiative' }
      ],
      coursework: [
        {
          code: 'CIS*3530',
          title: 'Data Base Systems and Concepts',
          relation:
            'Normalising municipal datasets that had been maintained as spreadsheets, and choosing what to expose rather than what was stored.'
        },
        {
          code: 'CIS*3750',
          title: 'System Analysis and Design in Applications',
          relation:
            'Applied properly this time. I interviewed the analyst and two external users of the old CSV export before designing the response shape.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Own a feature from requirements through release',
        state: 'partial',
        target:
          'Carried forward from the second term, where I did not finish. Take one piece of work end to end.',
        outcome:
          'Partially met. Both endpoints were released and are in use, but the response shape was decided by my supervisor before I started. I executed a design rather than making one, and I did not notice the difference until the following term.'
      },
      {
        ref: '4.2',
        title: 'Write for an audience I cannot ask questions of',
        state: 'met',
        target: 'Produce documentation that a developer outside the organisation can use unaided.',
        outcome:
          'Met, and it is the outcome I am most confident about. A local developer rebuilt a transit tool against my endpoint without contacting the city once, which is the only clean signal I received all term.',
        evidence: 'Published OpenAPI specification and field definitions for both endpoints.'
      },
      {
        ref: '4.3',
        title: 'Explain technical tradeoffs to non-technical stakeholders',
        state: 'partial',
        target: 'Carried forward from the first two terms.',
        outcome:
          'Partially met. I was clear in writing and still deferred in the room. When a manager asked for a field I thought was a mistake to publish, I documented my objection and published it anyway without ever saying the objection out loud.'
      },
      {
        ref: '4.4',
        title: 'Understand how the service is provisioned',
        state: 'unmet',
        target: 'Learn what creates and maintains the environment the endpoints run in.',
        outcome:
          'Unmet for the third term running. The hosting was managed by a central IT group in another building and I accepted that as a boundary.'
      }
    ],
    acknowledgments: [
      {
        name: 'Open Data Lead',
        role: 'Direct supervisor',
        note: 'Made me write the field definitions before writing the endpoint, which I resented at the time and now copy.'
      },
      {
        name: 'Programme Analyst',
        role: 'Subject matter reviewer',
        note: 'Explained which municipal datasets were politically sensitive and why some fields could not be published at all.'
      }
    ]
  },
  {
    id: 'wt4',
    ordinal: '04',
    label: 'Work Term 4',
    season: 'Summer 2026',
    dates: 'May to August 2026',
    datesShort: 'May to Aug 2026',
    role: 'Software Engineer, Platform',
    location: 'Toronto, Ontario',
    beat: 'Carrying the pager for something I had written.',
    isLatest: true,
    plate: 'term4',
    plateAlt:
      'A logistics operations room at night, wall-mounted screens showing route maps and dashboards, a dim desk with a headset in the foreground.',
    plateCaption:
      'The operations room at Meridian Logistics. Duplicate events surfaced here first, as shipments that appeared to change state on their own.',
    project: 'Deduplicating shipment events in the carrier ingestion pipeline',
    employer: {
      name: 'Meridian Logistics',
      sector: 'Supply chain software',
      description:
        'Meridian builds the software that freight carriers and shippers use to track shipments in transit. Customers integrate their own systems against Meridian APIs, which makes the data pipeline the product rather than a supporting detail. The platform team owns ingestion, storage and the public API surface.',
      computingRelevance:
        'The engineering problem is high-volume event ingestion from sources that are inconsistent and outside your control. Carrier systems send the same event in different shapes, deliver it late, and deliver it more than once. That makes it a distributed systems problem wearing the clothes of a data problem, and it is where correctness, idempotency and observability stop being vocabulary.',
      facts: [
        { label: 'Carrier integrations', value: 'Several hundred' },
        { label: 'Platform team', value: 'Nine engineers, owning on-call' },
        { label: 'Public API', value: 'Versioned, so a break is a contract issue' }
      ]
    },
    job: {
      overview:
        'I worked on the shipment event ingestion service. My assigned project was deduplication. Carriers frequently resend the same status event, which reached customers as a shipment bouncing between states. I designed the idempotency key, implemented the deduplication layer and took it through a staged rollout.',
      unique:
        'This was the first placement where I was on the on-call rotation for something I had written. Owning the pager changes what you are willing to call finished, and that is the difference between this term and the three before it.',
      skills: [
        'Idempotent system design',
        'Incident response',
        'Staged rollout',
        'Technical writing',
        'Design review'
      ],
      stack: [
        { name: 'Go', slug: 'go' },
        { name: 'PostgreSQL', slug: 'postgresql' },
        { name: 'Apache Kafka', slug: 'apachekafka' },
        { name: 'Docker', slug: 'docker' },
        { name: 'Grafana', slug: 'grafana' }
      ],
      coursework: [
        {
          code: 'CIS*3110',
          title: 'Operating Systems',
          relation:
            'Concurrency and ordering. The duplicate-event problem is a race between producers that cannot be coordinated.'
        },
        {
          code: 'CIS*3530',
          title: 'Data Base Systems and Concepts',
          relation:
            'The idempotency key is a uniqueness constraint problem, and my first version failed for a reason the course covers directly.'
        },
        {
          code: 'CIS*4250',
          title: 'Software Design',
          relation: 'Writing a design document that two engineers could review and reject on its merits.'
        }
      ]
    },
    goals: [
      {
        ref: '4.1',
        title: 'Own a feature from design through production',
        state: 'met',
        target:
          'Carried forward from the second and third terms. Take one piece of work from problem statement to production traffic, including the design.',
        outcome:
          'Met. The difference was raising the schema constraint in the second week rather than the sixth. I wrote a short design document, had it reviewed by two engineers, changed the key strategy because the first version missed a duplicate case they identified, and rolled out behind a flag.',
        evidence:
          'Design document reviewed and revised; feature released behind a staged flag with duplicate-rate monitoring.'
      },
      {
        ref: '4.2',
        title: 'Explain technical tradeoffs to non-technical stakeholders',
        state: 'met',
        target: 'Carried forward from all three previous terms. Say no, or not yet, out loud.',
        outcome:
          'Met. When support asked for the deduplication window to be widened, I gave them the cost in delayed events rather than a verdict, and said plainly that I thought the wider window was wrong. They chose it anyway, for a reason about customer expectations I had not considered, and they were right.'
      },
      {
        ref: '4.3',
        title: 'Write tests that other engineers depend on',
        state: 'partial',
        target: 'Leave behind coverage that catches regressions after I am gone.',
        outcome:
          'Partially met. Unit coverage was solid. Integration coverage was thin because I deferred it repeatedly, and one duplicate-event edge case reached staging as a result. It was caught before any customer saw it, but it was caught by a person rather than by a test.'
      },
      {
        ref: '4.4',
        title: 'Understand how our infrastructure is provisioned',
        state: 'unmet',
        target: 'Be able to explain, and ideally reproduce, how the service environment is built.',
        outcome:
          'Unmet for the fourth term running. I could deploy, roll back and read a dashboard, and I never learned what created the environment underneath. Four terms of the same answer is no longer a gap in an assignment, it is a decision I keep making.'
      }
    ],
    acknowledgments: [
      {
        name: 'Platform Team Lead',
        role: 'Direct supervisor',
        note: 'Put a co-op student on the on-call rotation, then made sure I was never alone on it.'
      },
      {
        name: 'Senior Platform Engineer',
        role: 'Design reviewer',
        note: 'Rejected my first idempotency key and explained the duplicate case it would have missed.'
      },
      {
        name: 'Co-op Coordinator',
        role: 'Academic advisor',
        note: 'Pushed back on the goals I set in the first term for being written so that they could not be failed.'
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
    title: 'Owning a piece of work end to end',
    cells: [
      { termId: 'wt1', state: 'na', note: 'No development surface in the role.' },
      { termId: 'wt2', state: 'unmet', note: 'Tested the assumption too late and handed the work back.' },
      { termId: 'wt3', state: 'partial', note: 'Shipped it, but executed a design rather than making one.' },
      { termId: 'wt4', state: 'met', note: 'Raised the constraint in week two and shipped the design.' }
    ],
    arc:
      'Three attempts before this one landed. What changed was not skill but the week in which I asked the question.'
  },
  {
    ref: '5.2',
    title: 'Saying no to a non-technical stakeholder',
    cells: [
      { termId: 'wt1', state: 'partial', note: 'Could explain what I had done, not what I could not do.' },
      { termId: 'wt2', state: 'partial', note: 'Flagged risk, framed it as an apology.' },
      { termId: 'wt3', state: 'partial', note: 'Objected in writing, stayed silent in the room.' },
      { termId: 'wt4', state: 'met', note: 'Said it out loud, was overruled, and the decision was better for it.' }
    ],
    arc:
      'Partial three times, which is the honest record of a soft skill. It took four terms and being overruled in public.'
  },
  {
    ref: '5.3',
    title: 'Code and writing that others depend on',
    cells: [
      { termId: 'wt1', state: 'unmet', note: 'Nothing outlived the term.' },
      { termId: 'wt2', state: 'met', note: 'Three dashboards in production use.' },
      { termId: 'wt3', state: 'met', note: 'A public endpoint rebuilt against by a developer I never met.' },
      { termId: 'wt4', state: 'partial', note: 'Unit coverage solid, integration coverage thin.' }
    ],
    arc:
      'This one went backwards in the last term, and the reason matters. The standard for depended on rose faster than my habits did.'
  },
  {
    ref: '5.4',
    title: 'Understanding the layer below my own',
    cells: [
      { termId: 'wt1', state: 'unmet', note: 'Escalated rather than investigated.' },
      { termId: 'wt2', state: 'unmet', note: 'Never asked to watch a release.' },
      { termId: 'wt3', state: 'unmet', note: 'Accepted another building as a boundary.' },
      { termId: 'wt4', state: 'unmet', note: 'Could deploy, could not rebuild.' }
    ],
    arc:
      'Unmet in all four terms. Every time there was a reasonable local explanation, which is how a pattern survives four attempts at noticing it.'
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
  { ref: 'Plate', title: 'One photograph per placement, with the selected term', anchor: 'sec-2' },
  { ref: 'Figure 3.1', title: 'Position of the deduplication layer in the ingestion path', anchor: 'figure-3-1' },
  { ref: 'Table 5.1', title: 'Goal state by work term', anchor: 'table-5-1' }
];
