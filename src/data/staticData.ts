import { BiteSizedTrack, CheatSheet, VocabWord, SeekResult } from '../types';

export const BITE_SIZED_TRACKS: BiteSizedTrack[] = [
  {
    id: 'charisma-mastery',
    title: 'Charisma, Gravitas & Magnetism',
    subtitle: 'Master the art of presence, vocal power, active listening, and captivating storytelling.',
    category: 'charisma',
    badge: 'High Impact',
    iconName: 'Sparkles',
    colorGradient: 'from-amber-500 to-orange-600',
    units: [
      {
        id: 'c1',
        title: 'The 3 Pillars of Gravitas: Presence, Power & Warmth',
        durationMinutes: 4,
        summary: 'Charisma is not an innate gift; it is a calibrated blend of high competence (power) balanced with genuine approachability (warmth).',
        hinglishTakeaway: 'Charisma sirf bolne ka style nahi hai, balki sunne ka dhyaan aur aawaz ki thehrav (warmth + authority) ka balance hai.',
        mentalModel: 'Olivia Fox Cabane’s Charisma Equation (Presence + Power + Warmth)',
        keyPrinciples: [
          'Eliminate physical fidgeting; stillness projects executive authority.',
          'Lower your vocal inflection at the end of sentences (statements vs. questioning tone).',
          'Practice 100% presence: do not anticipate your turn to speak while others are talking.'
        ],
        actionPrompt: 'In your next interaction, pause for 1.5 seconds before replying and maintain steady, relaxed eye contact.',
        quizQuestion: {
          question: 'What is the most effective way to convey executive authority when concluding a statement?',
          options: [
            'Raise your pitch at the end like a question',
            'Speak as fast as possible to show intelligence',
            'Lower your vocal inflection steadily at the period with an intentional pause',
            'Use many filler words like "you know" to soften the message'
          ],
          correctIndex: 2,
          explanation: 'Dropping your pitch at the end of a statement conveys conviction, whereas uptalk (rising pitch) sounds uncertain.'
        }
      },
      {
        id: 'c2',
        title: 'Julian Treasure’s HAIL Framework for Vocal Respect',
        durationMinutes: 4,
        summary: 'To make people want to listen, anchor your speech in Honesty, Authenticity, Integrity, and Love (wishing people well).',
        hinglishTakeaway: 'Jab aap sach aur dil se doosron ke fayde ki baat karte ho, toh log naturally aapki baat ko tawajjoh (importance) dete hain.',
        mentalModel: 'HAIL (Honesty, Authenticity, Integrity, Love)',
        keyPrinciples: [
          'H - Honesty: Be clear and straight.',
          'A - Authenticity: Stand in your own truth.',
          'I - Integrity: Do what you say.',
          'L - Love: Wish them well in the interaction, eliminating cynicism.'
        ],
        actionPrompt: 'Audit your speech today: Eliminate gossip, judging, and complaining from your vocabulary for 24 hours.',
        quizQuestion: {
          question: 'In Julian Treasure’s HAIL framework, what does "L" stand for?',
          options: ['Logic', 'Love (Wishing people well)', 'Loudness', 'Leadership'],
          correctIndex: 1,
          explanation: 'Love in speech means delivering hard truths with genuine empathy and good intentions for the listener.'
        }
      },
      {
        id: 'c3',
        title: 'Storytelling in Business: The Hook, The Struggle & The Transformation',
        durationMinutes: 5,
        summary: 'Data informs, but stories persuade. Learn Carmine Gallo’s 3-act narrative structure for boardroom and pitch presentations.',
        hinglishTakeaway: 'Sirf numbers mat phenko; pehle problem ka struggle dikhao, fir solution ka impact hero ban kar samne aayega.',
        mentalModel: 'The 3-Act Executive Narrative',
        keyPrinciples: [
          'Start with an arresting Hook (a surprising metric or emotional stakes).',
          'Describe the struggle or villain (the friction or inefficiency costing time/money).',
          'Deliver the Transformation (how your idea or solution creates a better reality).'
        ],
        actionPrompt: 'Reframe your next project update as a 60-second story with a hero, conflict, and victory.',
        quizQuestion: {
          question: 'Why do brain scans show higher engagement during stories than bullet-point slides?',
          options: [
            'Stories trigger neural coupling and oxytocin release in the listener',
            'Stories take longer so people get tired',
            'Slides have too many bright colors',
            'Stories only work on children'
          ],
          correctIndex: 0,
          explanation: 'Narrative structures trigger neural coupling where the listener’s brain activity mirrors the speaker’s thoughts.'
        }
      }
    ]
  },
  {
    id: 'intelligence-mental-models',
    title: 'Intelligence & Structured Thinking',
    subtitle: 'Think clearly under pressure, formulate razor-sharp arguments, and communicate with crystal clarity.',
    category: 'intelligence',
    badge: 'Core Skill',
    iconName: 'Brain',
    colorGradient: 'from-blue-600 to-indigo-700',
    units: [
      {
        id: 'i1',
        title: 'The PREP Framework for Impromptu Meetings',
        durationMinutes: 4,
        summary: 'Never freeze or ramble when called on unexpectedly. Structure any impromptu point in 4 simple moves.',
        hinglishTakeaway: 'Point bolo, Reason do, Example/Data batao, aur wapas Point ko decisive conclusion banao.',
        mentalModel: 'P.R.E.P. (Point, Reason, Example, Point)',
        keyPrinciples: [
          'Point: "I recommend we postpone the release to Thursday."',
          'Reason: "Because our regression test pass rate is currently at 88% instead of the required 98%."',
          'Example: "Last quarter, a rushed deployment caused a 4-hour downtime for 12,000 users."',
          'Point: "Therefore, taking 48 hours for QA is the safest and most cost-effective decision."'
        ],
        actionPrompt: 'Use PREP in your next answer today, whether discussing work or choosing lunch with colleagues.',
        quizQuestion: {
          question: 'What is the biggest mistake people make during impromptu speaking without PREP?',
          options: [
            'Speaking too slowly',
            'Rambling without stating the core point in the first 10 seconds',
            'Showing too much data',
            'Agreeing with everyone'
          ],
          correctIndex: 1,
          explanation: 'Without a structure, speakers tend to think out loud, losing the audience’s attention before reaching the conclusion.'
        }
      },
      {
        id: 'i2',
        title: 'BLUF: Bottom Line Up Front (Military & Executive Brevity)',
        durationMinutes: 4,
        summary: 'High-stakes leaders do not have time for suspense. Deliver your conclusion in line 1, then follow with context.',
        hinglishTakeaway: 'Suspense mat banao; sabse zaroori headline pehle bolo, fir background context do.',
        mentalModel: 'BLUF Protocol',
        keyPrinciples: [
          'First 5 seconds: What is the decision or status?',
          'Next 15 seconds: What is the primary supporting evidence?',
          'Final 10 seconds: What is the exact next step or call to action?'
        ],
        actionPrompt: 'Write your next email with the final decision/ask bolded in the very first sentence.',
        quizQuestion: {
          question: 'When is BLUF most critical?',
          options: [
            'When writing a mystery novel',
            'When communicating with busy executives, clients, or team leads',
            'When telling a comedy joke',
            'When giving birthday wishes'
          ],
          correctIndex: 1,
          explanation: 'Executives value brevity and immediate clarity to make rapid, high-confidence decisions.'
        }
      },
      {
        id: 'i3',
        title: 'First Principles Articulation: Deconstructing Complex Jargon',
        durationMinutes: 5,
        summary: 'True masters explain complex ideas so simply that a 10-year-old can grasp them without losing accuracy (The Feynman Technique).',
        hinglishTakeaway: 'Bhari-bharkam technical words ke peeche mat chhupo; fundamental reality ko simple analogy se samjhao.',
        mentalModel: 'The Feynman Analogy Engine',
        keyPrinciples: [
          'Strip out industry jargon and acronyms.',
          'Use physical analogies (e.g. "Think of a database index like the index at the back of a book").',
          'Test clarity: If you cannot explain it simply, you do not understand it deeply.'
        ],
        actionPrompt: 'Explain your current work project using an analogy from cooking, driving, or building a house.',
        quizQuestion: {
          question: 'What does the Feynman technique require when explaining a technical idea?',
          options: [
            'Using as many Latin terms as possible',
            'Explaining the core concept using plain language and intuitive analogies',
            'Reading directly from the documentation manual',
            'Refusing to answer questions'
          ],
          correctIndex: 1,
          explanation: 'Simplification without loss of truth demonstrates the highest level of conceptual mastery.'
        }
      }
    ]
  },
  {
    id: 'memory-articulation',
    title: 'Memory, Spontaneity & Diction',
    subtitle: 'Never go blank during talks, expand active vocabulary, and speak with crisp articulation.',
    category: 'memory',
    badge: 'Popular',
    iconName: 'Sparkle',
    colorGradient: 'from-emerald-600 to-teal-700',
    units: [
      {
        id: 'm1',
        title: 'Overcoming The "Brain Freeze" Blank in Public Speaking',
        durationMinutes: 4,
        summary: 'When memory lapses occur on stage or in meetings, panic makes it worse. Learn the "Bridge & Anchor" recovery technique.',
        hinglishTakeaway: 'Agar beech me bhool jao, toh panic hone ke bajay ek deep breath lo, last point ko summarize karke bridge banao.',
        mentalModel: 'The Bridge & Anchor Recovery',
        keyPrinciples: [
          'Embrace the pause: What feels like 10 seconds to you is only 1.5 seconds of thoughtful silence to them.',
          'Use the Echo Bridge: "To put that in another perspective..." or "The key takeaway here is..."',
          'Ask a reflective question to the audience to buy 5 seconds of cognitive reset.'
        ],
        actionPrompt: 'Next time you lose your train of thought, do not say "Sorry, I forgot." Say: "Let me frame this precisely..." and continue.',
        quizQuestion: {
          question: 'What is the best immediate response when you momentarily forget your next point in a presentation?',
          options: [
            'Apologize profusely and say you are nervous',
            'Take a calm, deliberate pause, take a sip of water, and summarize the preceding point',
            'Run off the stage',
            'Start whispering rapidly'
          ],
          correctIndex: 1,
          explanation: 'A calm, silent pause conveys control and poise, allowing your working memory to retrieve the next anchor.'
        }
      },
      {
        id: 'm2',
        title: 'The Rule of Three: Maximizing Retention and Rhythm',
        durationMinutes: 4,
        summary: 'The human brain is hardwired for trios (Veni, Vidi, Vici; Life, Liberty, and the pursuit of Happiness). Organize thoughts in threes.',
        hinglishTakeaway: 'Dimag 3 cheezon ko sabse jaldi yaad rakhta hai. Apne arguments ko hamesha 3 bullet points me pack karo.',
        mentalModel: 'Tricolon & The Rule of Three',
        keyPrinciples: [
          'Group your presentation into 3 main pillars.',
          'Give 3 reasons when pitching or defending a proposal.',
          'Use rhythmic cadence: short, medium, long impact cadence.'
        ],
        actionPrompt: 'Structure your next presentation outline into exactly 3 core takeaways.',
        quizQuestion: {
          question: 'Why is the Rule of Three so powerful in human communication?',
          options: [
            'Because 3 is the minimum number needed to establish a recognizable pattern in human memory',
            'Because people cannot count to four',
            'Because speeches must be 3 minutes long',
            'It is only a myth with no cognitive backing'
          ],
          correctIndex: 0,
          explanation: 'Cognitive psychology shows that 3 items form the smallest set that creates rhythm, pattern, and memorable impact.'
        }
      }
    ]
  },
  {
    id: 'decision-negotiation',
    title: 'High-Stakes Communication & Negotiation',
    subtitle: 'Master tactical empathy, salary conversations, de-escalating conflicts, and assertive pushbacks.',
    category: 'decision_making',
    badge: 'Executive',
    iconName: 'ShieldCheck',
    colorGradient: 'from-purple-600 to-indigo-900',
    units: [
      {
        id: 'd1',
        title: 'Chris Voss’s Tactical Empathy: Mirroring & Labeling',
        durationMinutes: 5,
        summary: 'FBI hostage negotiator Chris Voss reveals how to disarm defensive people without compromising your position.',
        hinglishTakeaway: 'Argument jeetne ke liye ladna nahi hota; samne wale ke emotions ko "label" karo ("It sounds like you feel...") taaki wo calm ho jaye.',
        mentalModel: 'Mirroring & Emotional Labeling',
        keyPrinciples: [
          'Mirror: Repeat the last 1 to 3 critical words with a curious, gentle tone.',
          'Label: "It seems like you feel this timeline is unrealistic..." (Neutral observation).',
          'Use "No"-oriented questions: "Is it a bad time to discuss this?" instead of "Do you have a minute?"'
        ],
        actionPrompt: 'Use a 3-word mirror in your next conversation when someone presents a complaint or problem.',
        quizQuestion: {
          question: 'What is the psychological effect of "Labeling" someone’s negative emotion during a heated discussion?',
          options: [
            'It makes them more angry',
            'It deactivates the amygdala (fear/threat center) and moves their brain into rational collaboration',
            'It makes them leave the room',
            'It proves you are weak'
          ],
          correctIndex: 1,
          explanation: 'Brain imaging proves that verbally labeling negative emotions deactivates the amygdala, replacing panic with calm.'
        }
      },
      {
        id: 'd2',
        title: 'The STAR Method for High-Stakes Interviews & Reviews',
        durationMinutes: 5,
        summary: 'How to showcase your executive accomplishments without sounding boastful or disorganized.',
        hinglishTakeaway: 'Situation, Task, Action, Result—har success story ko iss sequence me sunao taaki interviewer impress ho sake.',
        mentalModel: 'S.T.A.R. (Situation, Task, Action, Result)',
        keyPrinciples: [
          'Situation (15%): Set the stage briefly.',
          'Task (10%): What was the specific goal or crisis?',
          'Action (55%): What specific steps did YOU take?',
          'Result (20%): Quantified outcomes (e.g. "Reduced latency by 35% and saved $40k").'
        ],
        actionPrompt: 'Write out one STAR story from your recent career with a clear numerical metric in the Result.',
        quizQuestion: {
          question: 'Which component of the STAR method should take up the majority (around 50-60%) of your answer?',
          options: ['Situation', 'Task', 'Action (What you specifically planned and executed)', 'Result'],
          correctIndex: 2,
          explanation: 'Interviewers and managers evaluate your individual competency based on the specific actions, decisions, and leadership you exhibited.'
        }
      }
    ]
  }
];

export const VOCABULARY_POWER_BANK: VocabWord[] = [
  {
    id: 'v1',
    word: 'Articulate',
    phonetic: '/ɑːrˈtɪk.jə.lət/',
    partOfSpeech: 'adjective / verb',
    meaning: 'Having or showing the ability to speak fluently and coherently.',
    hinglishMeaning: 'Apne vichaaron ko spasht aur asardaar dhang se bayan karne wala.',
    exampleSentence: 'Her articulate presentation persuaded the entire board to greenlight the venture.',
    category: 'clarity',
    synonyms: ['Eloquent', 'Coherent', 'Lucid', 'Fluent'],
    corporateContext: 'Use during performance reviews, introductions, and stakeholder alignment.'
  },
  {
    id: 'v2',
    word: 'Gravitas',
    phonetic: '/ˈɡræv.ɪ.tɑːs/',
    partOfSpeech: 'noun',
    meaning: 'Dignity, seriousness, or solemnity of manner that commands respect.',
    hinglishMeaning: 'Vyaktitva ka wo thehrav aur gambhirta jisse log aapki baat ko izzat dete hain.',
    exampleSentence: 'He spoke with quiet gravitas, instantly commanding the attention of the executive committee.',
    category: 'charisma',
    synonyms: ['Presence', 'Solemnity', 'Authority', 'Poise'],
    corporateContext: 'Essential for leadership, keynotes, and high-stakes negotiation.'
  },
  {
    id: 'v3',
    word: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    partOfSpeech: 'adjective',
    meaning: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    hinglishMeaning: 'Vyavaharik aur realistic soch jo practical nateeje (results) par focus kare.',
    exampleSentence: 'We need a pragmatic timeline that accounts for our team’s actual sprint capacity.',
    category: 'executive',
    synonyms: ['Practical', 'Realistic', 'Sensible', 'Hardheaded'],
    corporateContext: 'Use when proposing balanced solutions over idealistic or overly complex proposals.'
  },
  {
    id: 'v4',
    word: 'Concur',
    phonetic: '/kənˈkɜːr/',
    partOfSpeech: 'verb',
    meaning: 'Be of the same opinion; agree with an assessment or viewpoint.',
    hinglishMeaning: 'Kisi baat ya faisle se poori tarah sahmat (agree) hona.',
    exampleSentence: 'I fully concur with the engineering lead’s recommendation to refactor the payment gateway.',
    category: 'executive',
    synonyms: ['Agree', 'Align', 'Harmonize', 'Endorse'],
    corporateContext: 'Elevated alternative to saying "I agree" or "Same here" in corporate meetings.'
  },
  {
    id: 'v5',
    word: 'Synthesize',
    phonetic: '/ˈsɪn.θə.saɪz/',
    partOfSpeech: 'verb',
    meaning: 'To combine a large amount of information into a coherent, structured whole.',
    hinglishMeaning: 'Bahut saare data ya ideas ko jodkar ek simple aur clear nishkarsh (summary) banana.',
    exampleSentence: 'Let me synthesize the three customer feedback threads into our core sprint goals.',
    category: 'precision',
    synonyms: ['Integrate', 'Consolidate', 'Unify', 'Distill'],
    corporateContext: 'Use when taking notes, summarizing long meetings, or writing executive briefs.'
  },
  {
    id: 'v6',
    word: 'Ambiguity',
    phonetic: '/ˌæm.bɪˈɡjuː.ə.t̬i/',
    partOfSpeech: 'noun',
    meaning: 'The quality of being open to more than one interpretation; inexactness or uncertainty.',
    hinglishMeaning: 'Asphasht-ta ya confusion jahan cheezein saaf na ho.',
    exampleSentence: 'We must eliminate ambiguity in our API specifications before starting development.',
    category: 'precision',
    synonyms: ['Uncertainty', 'Vagueness', 'Obscurity'],
    corporateContext: 'Use when pushing for explicit requirements and clear scopes.'
  },
  {
    id: 'v7',
    word: 'Compelling',
    phonetic: '/kəmˈpel.ɪŋ/',
    partOfSpeech: 'adjective',
    meaning: 'Evoking interest, attention, or admiration in a powerfully irresistible way.',
    hinglishMeaning: 'Itna zabardast aur damdaar ki sunne wale ka dhyan turant khinch le.',
    exampleSentence: 'She presented a compelling business case that demonstrated a 40% reduction in churn.',
    category: 'persuasion',
    synonyms: ['Persuasive', 'Captivating', 'Convincing', 'Irresistible'],
    corporateContext: 'Use when describing high-impact ideas, value propositions, and sales pitches.'
  },
  {
    id: 'v8',
    word: 'Discrepancy',
    phonetic: '/dɪˈskrep.ən.si/',
    partOfSpeech: 'noun',
    meaning: 'A lack of compatibility or similarity between two or more facts.',
    hinglishMeaning: 'Do cheezon ya records ke beech ka antar ya gadbadi.',
    exampleSentence: 'We noticed a minor discrepancy between our analytics logs and the billing invoice.',
    category: 'precision',
    synonyms: ['Inconsistency', 'Difference', 'Disparity', 'Mismatch'],
    corporateContext: 'Tactful way to point out errors without sounding accusatory.'
  },
  {
    id: 'v9',
    word: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adjective',
    meaning: 'Fluent or persuasive in speaking or writing; vividly expressive.',
    hinglishMeaning: 'Shaandaar aur dil ko chhoo lene wali bhasha me baat karne wala.',
    exampleSentence: 'His eloquent summary of the company vision inspired renewed dedication from the team.',
    category: 'charisma',
    synonyms: ['Expressive', 'Poignant', 'Silver-tongued'],
    corporateContext: 'Complimenting great speakers, town halls, and stakeholder communication.'
  },
  {
    id: 'v10',
    word: 'Decisive',
    phonetic: '/dɪˈsaɪ.sɪv/',
    partOfSpeech: 'adjective',
    meaning: 'Settling an issue; producing a definite result; showing the ability to make decisions quickly and firmly.',
    hinglishMeaning: 'Thos faisla lene wala, jo bina hichkichaye sahi kadam uthaye.',
    exampleSentence: 'Her decisive leadership during the server outage mitigated significant financial loss.',
    category: 'executive',
    synonyms: ['Resolute', 'Firm', 'Determined', 'Conclusive'],
    corporateContext: 'Leadership evaluations, crisis management, strategy execution.'
  },
  {
    id: 'v11',
    word: 'Nuance',
    phonetic: '/ˈnuː.ɑːns/',
    partOfSpeech: 'noun',
    meaning: 'A subtle distinction or variation in meaning, tone, or expression.',
    hinglishMeaning: 'Bohot hi baareek aur sookshm antar jo aam taur pe nazar nahi aata.',
    exampleSentence: 'There is an important nuance between product availability and full release readiness.',
    category: 'clarity',
    synonyms: ['Subtlety', 'Fine distinction', 'Shade of meaning'],
    corporateContext: 'Strategic discussions, user experience design, contract reviews.'
  },
  {
    id: 'v12',
    word: 'Vindicate',
    phonetic: '/ˈvɪn.dɪ.keɪt/',
    partOfSpeech: 'verb',
    meaning: 'Clear someone of blame or suspicion; prove to be right, reasonable, or justified.',
    hinglishMeaning: 'Sahi sabit hona ya be-kasoor thehrana.',
    exampleSentence: 'The surge in customer retention vindicated our bold UX redesign decision.',
    category: 'persuasion',
    synonyms: ['Justify', 'Validate', 'Exonerate', 'Substantiate'],
    corporateContext: 'Post-mortems, retrospective presentations, hypothesis validation.'
  }
];

export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: 'prep',
    title: 'PREP Method for Instant Speaking',
    acronym: 'PREP',
    tag: 'Spontaneous Meetings',
    bestUsedFor: 'When someone asks your opinion suddenly in a meeting or interview.',
    steps: [
      { step: 'P - Point', desc: 'State your bottom-line answer in 1 sentence.', example: '"I believe we should transition our team to TypeScript."' },
      { step: 'R - Reason', desc: 'Give the core logical or business justification.', example: '"Because it catches 15% of runtime bugs before they reach production."' },
      { step: 'E - Example', desc: 'Provide a real case study, past metric, or analogy.', example: '"In project Alpha, TypeScript saved us ~12 hours of debugging every sprint."' },
      { step: 'P - Point', desc: 'Reiterate the point with a decisive call to action.', example: '"Therefore, dedicating the first sprint to this migration will yield massive ROI."' }
    ],
    proTip: 'Never start with "So basically, um...". Jump straight into your Point within 3 seconds.'
  },
  {
    id: 'bluf',
    title: 'BLUF (Bottom Line Up Front)',
    acronym: 'BLUF',
    tag: 'Executive Writing & Brevity',
    bestUsedFor: 'Sending high-priority emails, Slack updates to directors, and proposals.',
    steps: [
      { step: '1. The Conclusion First', desc: 'What is the decision, status, or request?', example: '"BLUF: We request approval for a $5,000 cloud compute budget increase."' },
      { step: '2. The Direct Cause', desc: 'Why is this needed right now?', example: '"Our active user volume has doubled over the weekend."' },
      { step: '3. The Risk / Alternative', desc: 'What happens if no action is taken?', example: '"Without this, users may experience 2-second API latency during peak hours."' },
      { step: '4. The Action Required', desc: 'Specific next step for the reader.', example: '"Please reply with approval by 3:00 PM today."' }
    ],
    proTip: 'Executives read emails on phones; put the BLUF in bold so they can reply in 5 seconds.'
  },
  {
    id: 'star',
    title: 'STAR Method for Behavioral Interviews',
    acronym: 'STAR',
    tag: 'Job Interviews & Reviews',
    bestUsedFor: 'Answering questions like "Tell me about a time you handled a difficult conflict."',
    steps: [
      { step: 'S - Situation (15%)', desc: 'Set the context briefly.', example: '"Our client had an urgent deadline, but our database crashed 2 days before launch."' },
      { step: 'T - Task (10%)', desc: 'What was your specific responsibility?', example: '"I was tasked with diagnosing the failover and restoring operations without data loss."' },
      { step: 'A - Action (55%)', desc: 'What specific decisions and work did YOU execute?', example: '"I organized a 3-person triage swarm, isolated the corrupted index, and deployed a cold replica."' },
      { step: 'R - Result (20%)', desc: 'Quantified impact and key learning.', example: '"We restored service in 45 minutes with 0% data loss and automated this failover permanently."' }
    ],
    proTip: 'Spend 50%+ of your speaking time on the Action and Result. Keep Situation minimal.'
  },
  {
    id: 'mirror-label',
    title: 'Chris Voss: Mirror & Emotional Label',
    acronym: 'MIRROR',
    tag: 'De-escalating Conflicts & Negotiation',
    bestUsedFor: 'When a client, boss, or peer is angry, pushy, or unreasonable.',
    steps: [
      { step: '1. The Mirror (Last 3 Words)', desc: 'Repeat their key words with a calm, curious tone.', example: 'Client: "This deadline is completely impossible!" You: "Completely impossible?"' },
      { step: '2. The Intentional Pause (4 Sec)', desc: 'Stay completely silent; let them fill the vacuum and elaborate.', example: 'Client: "Well, what I mean is our QA team needs at least two extra days..."' },
      { step: '3. The Emotional Label', desc: 'Name their underlying anxiety without being defensive.', example: '"It sounds like you are worried about product stability on launch day."' },
      { step: '4. Calibrated Question', desc: 'Ask a "How" or "What" question to invite mutual problem-solving.', example: '"How would you like us to adjust the scope so QA has sufficient buffer?"' }
    ],
    proTip: 'Never use the word "Why" during heated negotiations—it triggers subconscious defensiveness.'
  }
];

export const SEEK_PRESET_QUERIES = [
  {
    query: 'How to introduce myself powerfully in 30 seconds (Executive Elevator Pitch)?',
    category: 'Public Speaking',
    expert: 'Carmine Gallo & Dale Carnegie',
    desc: 'The 3-part blueprint for memorable introductions in networking and interviews.'
  },
  {
    query: 'How to disagree politely with a senior manager without offending them?',
    category: 'Workplace Diplomacy',
    expert: 'Chris Voss & Kim Scott (Radical Candor)',
    desc: 'Using tactical empathy, calibrated questions, and framing around shared company goals.'
  },
  {
    query: 'How to eliminate filler words ("um", "like", "basically") permanently?',
    category: 'Vocal Mastery',
    expert: 'Julian Treasure & Toastmasters International',
    desc: 'The power of the deliberate 2-second pause and diaphragmatic breath resetting.'
  },
  {
    query: 'How to answer questions when you do not know the answer?',
    category: 'Executive Presence',
    expert: 'Harvard Business Review Communication Lab',
    desc: 'Phrasing techniques that preserve credibility while outlining clear next steps.'
  }
];

export const FIELD_MOTIVATION_CONFIG = {
  tech: {
    label: 'Tech & Engineering',
    color: 'from-blue-500 to-indigo-600',
    coreInsight: 'The most successful engineers are not just great coders; they are exceptional translators who turn complex architectures into undeniable business value.',
    executivePhrase: 'Architecting high-availability systems with measurable business throughput.',
    dailyAffirmation: 'I explain complex technical truths with clarity, patience, and commanding poise.'
  },
  leadership: {
    label: 'Management & Leadership',
    color: 'from-amber-500 to-red-600',
    coreInsight: 'Leadership is the art of giving others the confidence, clarity, and psychological safety to achieve what they believed was impossible.',
    executivePhrase: 'Aligning cross-functional stakeholders around strategic vision and decisive execution.',
    dailyAffirmation: 'I lead with calm conviction, listening deeply before offering strategic direction.'
  },
  marketing_sales: {
    label: 'Marketing & Sales',
    color: 'from-emerald-500 to-teal-600',
    coreInsight: 'People do not buy products or features; they buy better, more capable versions of themselves.',
    executivePhrase: 'Positioning value propositions that resonate with core emotional catalysts.',
    dailyAffirmation: 'I articulate value with magnetic warmth, understanding client pain points intimately.'
  },
  student: {
    label: 'Student & Fresh Graduate',
    color: 'from-purple-500 to-pink-600',
    coreInsight: 'Confidence comes from preparation and daily compounding micro-habits. Your communication will set you apart from 99% of your peers.',
    executivePhrase: 'Demonstrating proactive ownership, rapid learning agility, and articulate collaboration.',
    dailyAffirmation: 'Every 15-minute practice session accelerates my career readiness and self-belief.'
  },
  finance: {
    label: 'Finance & Consulting',
    color: 'from-cyan-600 to-blue-800',
    coreInsight: 'Precision in language builds trust faster than any financial model. Let your words reflect rigorous clarity.',
    executivePhrase: 'Synthesizing quantitative indicators into actionable fiscal strategies.',
    dailyAffirmation: 'I deliver data-driven recommendations with unshakeable credibility and structure.'
  },
  creative: {
    label: 'Creative & Design',
    color: 'from-fuchsia-500 to-rose-600',
    coreInsight: 'A brilliant design without articulate defense is vulnerable to endless revision. Learn to pitch the rationale, not just the pixels.',
    executivePhrase: 'Translating human emotion into elegant, intuitive, high-conversion interfaces.',
    dailyAffirmation: 'I defend my creative vision with storytelling, empathy, and strategic clarity.'
  },
  general: {
    label: 'Self-Mastery & Life',
    color: 'from-indigo-500 to-violet-700',
    coreInsight: 'The quality of your life is determined by the quality of your communication with yourself and with the world.',
    executivePhrase: 'Speaking with intention, warmth, authentic authority, and active listening.',
    dailyAffirmation: 'I communicate with radiant clarity, deep presence, and magnetic self-confidence.'
  }
};
