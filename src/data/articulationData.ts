import { ArticulationDrill } from '../types';

export const ARTICULATION_DRILLS: ArticulationDrill[] = [
  {
    id: 'art-1',
    title: 'Diaphragmatic Belly Breath & Vocal Resonance Anchor',
    stage: 'breath',
    stageName: 'Stage 1: Breath & Resonance',
    durationMinutes: 4,
    description: 'Establish low-frequency chest resonance and eliminate shallow throat breathing before high-stakes talks.',
    hinglishTip: 'Gale (throat) se bolne ke bajay pet (diaphragm) se saans lo taaki aawaz me authority aur thehrav aaye.',
    instructions: [
      'Place one hand on your stomach and breathe in through your nose for 4 seconds, feeling your belly expand.',
      'Hold the air gently for 2 seconds without tensing your shoulders.',
      'Exhale on a sustained deep "Hummmm" vibration in your chest for 6 seconds.',
      'Speak the sample sentence keeping that low, steady chest vibration.'
    ],
    audioDrillPrompt: 'Inhale deeply into your diaphragm... Hold... Now speak with rich, centered chest resonance:',
    targetPhonetics: ['/m/', '/n/', '/ŋ/', 'Vocal Low Resonance'],
    sampleSentence: 'Good morning executive team. Today we will outline our strategic roadmap with precision and clarity.',
    xpReward: 40,
    difficulty: 'Beginner'
  },
  {
    id: 'art-2',
    title: 'Crisp Plosives & Consonant Punch (P, B, T, D, K, G)',
    stage: 'consonants',
    stageName: 'Stage 2: Consonant Precision',
    durationMinutes: 5,
    description: 'Sharpen lazy consonants that cause mumbling. Train your lips and tongue to pop terminal consonants cleanly.',
    hinglishTip: 'Words ke aakhri letters (jaise T, D, K) ko slip mat hone do; unhe crisp pop ke saath pronounce karo.',
    instructions: [
      'Warm up with rapid consonant bursts: "Pa-Ta-Ka", "Pa-Ta-Ka", "Pa-Ta-Ka" (10 times).',
      'Feel the air pressure release sharply behind your lips and teeth.',
      'Read the tongue twister emphasizing the crisp ending of every single consonant.'
    ],
    audioDrillPrompt: 'Practice this crisp plosive articulation sequence with high dental precision:',
    targetPhonetics: ['/p/', '/b/', '/t/', '/d/', '/k/', '/g/'],
    sampleSentence: 'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.',
    xpReward: 50,
    difficulty: 'Intermediate'
  },
  {
    id: 'art-3',
    title: 'Tongue Agility & Sibilant Distinction (S vs. SH vs. CH)',
    stage: 'consonants',
    stageName: 'Stage 2: Consonant Precision',
    durationMinutes: 4,
    description: 'Eliminate slurring and lisping between sharp S and soft SH sounds for high-clarity microphone audio.',
    hinglishTip: 'S aur SH ke beech ka farq bilkul saaf rakhein. Tongue ko teeth ridge ke paas steady rakhein.',
    instructions: [
      'Arch the tip of your tongue to touch the alveolar ridge for "S".',
      'Pull your tongue slightly backward with rounded lips for "SH".',
      'Alternate deliberately: "See-She-See-She" (5 times).'
    ],
    audioDrillPrompt: 'Speak this classic agility drill focusing on clean distinction between S and SH:',
    targetPhonetics: ['/s/', '/ʃ/', '/tʃ/'],
    sampleSentence: 'She sells seashells by the seashore, and the shells she sells are surely seashells.',
    xpReward: 50,
    difficulty: 'Intermediate'
  },
  {
    id: 'art-4',
    title: 'Cadence Regulation & The 2-Second Strategic Pause',
    stage: 'cadence',
    stageName: 'Stage 3: Cadence & Pacing',
    durationMinutes: 5,
    description: 'Tame rapid, rushed speech. Master the deliberate 2-second punctuation pause to command executive room gravity.',
    hinglishTip: 'Jaldi-jaldi bolne se intelligence nahi dikhti; pauses lene se log aapki har baat par dhyan dete hain.',
    instructions: [
      'Deliver the first thought in a measured 130 WPM tempo.',
      'Insert a full 2-second silent pause at the double slash [ // ]. Do not utter "um" or "like".',
      'Drop your vocal pitch at the period to signal firm conviction.'
    ],
    audioDrillPrompt: 'Deliver this statement taking deliberate 2-second pauses at each double slash [ // ]:',
    targetPhonetics: ['Cadence 130 WPM', 'Downward Inflection', '2-Sec Silence'],
    sampleSentence: 'We reviewed three distinct architectural proposals. // The data overwhelmingly favors option two. // We recommend executing this immediately.',
    xpReward: 60,
    difficulty: 'Intermediate'
  },
  {
    id: 'art-5',
    title: 'Executive Pitch Modulation & Stress-Emphasis Shifting',
    stage: 'gravitas',
    stageName: 'Stage 4: Executive Gravitas',
    durationMinutes: 5,
    description: 'Eliminate monotone robotic delivery. Learn how shifting word emphasis completely transforms executive intent.',
    hinglishTip: 'Monotone aawaz me log so jaate hain. Har sentence ke main power word par thoda stress aur volume badhao.',
    instructions: [
      'Read sentence 1 stressing ONLY the capitalized word.',
      'Notice how the underlying psychological message changes dynamically with each shift.'
    ],
    audioDrillPrompt: 'Emphasize the bolded capitalized words with melodic contrast and confident projection:',
    targetPhonetics: ['Pitch Modulation', 'Syllable Stress', 'Dynamic Range'],
    sampleSentence: 'I never said she stole my money. / I never SAID she stole my money. / I never said SHE stole my money. / I never said she stole MY money.',
    xpReward: 65,
    difficulty: 'Master'
  },
  {
    id: 'art-6',
    title: 'Spontaneous Thought Structuring (BLUF + PREP Articulation)',
    stage: 'structure',
    stageName: 'Stage 5: Thought Structuring',
    durationMinutes: 6,
    description: 'Train your neural articulation to translate complex thoughts into 3 concise pillars without wandering or stammering.',
    hinglishTip: 'Bina soche bolna shuru mat karo; pehle dimag me Point-Reason-Example ka map banao aur saaf aawaz me bolo.',
    instructions: [
      'Take 3 seconds of calm mental preparation.',
      'State Point -> Reason -> Metric -> Conclusion in under 45 seconds.',
      'Maintain continuous eye contact and relaxed facial muscles.'
    ],
    audioDrillPrompt: 'Deliver this structured executive answer with zero hesitation or filler words:',
    targetPhonetics: ['Structured Delivery', 'Zero Filler Words', 'Clarity Anchor'],
    sampleSentence: 'The critical takeaway is efficiency. By automating our staging deployments, we save twenty engineering hours every sprint, allowing us to hit our Q3 launch on schedule.',
    xpReward: 70,
    difficulty: 'Master'
  }
];
