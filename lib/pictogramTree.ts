export type PictogramNode = {
  id: string;
  label: string;
  arasaacKeyword: string;
  arasaacId?: number; // Optional explicit ARASAAC pictogram id override for this node
  llmContext?: string; // Extra descriptive context to help the LLM generate a full, accurate sentence
  children?: PictogramNode[];
};

// ─── WHO selector (final level on relevant paths) ────────────────────────────

const whoIsThis: PictogramNode[] = [
  { id: "who-me",     label: "Me",           arasaacKeyword: "myself", arasaacId: 6632, llmContext: "The subject of the request is the speaker." },
  { id: "who-mother", label: "My mother",    arasaacKeyword: "mother", llmContext: "The subject of the request is the speaker's mother." },
  { id: "who-father", label: "My father",    arasaacKeyword: "father", llmContext: "The subject of the request is the speaker's father." },
  { id: "who-child",  label: "My child",     arasaacKeyword: "child",  llmContext: "The subject of the request is the speaker's child." },
  { id: "who-baby",   label: "My baby",      arasaacKeyword: "baby",   llmContext: "The subject of the request is the speaker's baby." },
  { id: "who-other",  label: "Someone else", arasaacKeyword: "person", llmContext: "The subject of the request is another person not explicitly listed." },
];

// ─── SEVERITY (routes to Who) ────────────────────────────────────────────────

const severity: PictogramNode[] = [
  { id: "sev-little", label: "A little",       arasaacKeyword: "little",    arasaacId: 4716, llmContext: "The symptom severity is mild.", children: whoIsThis },
  { id: "sev-medium", label: "Medium",         arasaacKeyword: "medium",    arasaacId: 4693, llmContext: "The symptom severity is moderate.", children: whoIsThis },
  { id: "sev-lot",    label: "A lot",          arasaacKeyword: "very much", arasaacId: 4658, llmContext: "The symptom severity is severe or intense.", children: whoIsThis },
  { id: "sev-since",  label: "Since yesterday",arasaacKeyword: "yesterday", llmContext: "The symptom has been ongoing since yesterday.", children: whoIsThis },
  { id: "sev-days",   label: "Many days",      arasaacKeyword: "calendar",  llmContext: "The symptom has been ongoing for multiple days.", children: whoIsThis },
];

// ─── FEELINGS TIME (routes to Who) ───────────────────────────────────────────

const feelingsSince: PictogramNode[] = [
  { id: "feel-today", label: "Today",     arasaacKeyword: "today",    llmContext: "The feeling started today.", children: whoIsThis },
  { id: "feel-week",  label: "This week", arasaacKeyword: "week",     llmContext: "The feeling has lasted all week.", children: whoIsThis },
  { id: "feel-long",  label: "Long time", arasaacKeyword: "calendar", llmContext: "The feeling has lasted for a long time.", children: whoIsThis },
];

// ─── HELPER FUNCTIONS FOR NEW LOGICAL FLOWS ──────────────────────────────────

// 1. For physical pain/illness (Flow: Node -> Severity -> Who -> Translation)
function symptom(id: string, label: string, keyword: string, context: string): PictogramNode {
  return { id, label, arasaacKeyword: keyword, llmContext: context, children: severity };
}

// 2. For logistical needs applied to a person (Flow: Node -> Who -> Translation)
function logisticWithWho(id: string, label: string, keyword: string, context: string): PictogramNode {
  return { id, label, arasaacKeyword: keyword, llmContext: context, children: whoIsThis };
}

// 3. For instant needs/emergencies (Flow: Node -> Translation)
function directAction(id: string, label: string, keyword: string, context: string): PictogramNode {
  return { id, label, arasaacKeyword: keyword, llmContext: context }; 
}

// ─── 🏥 HEALTH ────────────────────────────────────────────────────────────────

const headSymptoms: PictogramNode[] = [
  symptom("head-pain",  "Headache", "headache",  "The patient is experiencing a headache."),
  symptom("head-dizzy", "Dizzy",    "dizziness", "The patient is feeling dizzy or lightheaded."),
  symptom("head-eyes",  "Eye pain", "eye",       "The patient is experiencing pain in their eyes."),
  symptom("head-ear",   "Ear pain", "ear",       "The patient is experiencing pain in their ears."),
  symptom("head-fever", "Fever",    "fever",     "The patient has a fever."),
];

const chestSymptoms: PictogramNode[] = [
  symptom("chest-pain",    "Chest pain",         "chest pain", "The patient is experiencing chest pain."),
  symptom("chest-breathe", "Hard to breathe",    "breathe",    "The patient is having difficulty breathing."),
  symptom("chest-cough",   "Cough",              "cough",      "The patient has a cough."),
  symptom("chest-heart",   "Heart beating fast", "heart",      "The patient feels their heart is beating abnormally fast."),
];

const stomachSymptoms: PictogramNode[] = [
  symptom("stom-pain",     "Stomach pain", "stomach",  "The patient is experiencing stomach pain."),
  symptom("stom-nausea",   "Nausea",       "nausea",   "The patient is feeling nauseous."),
  { id: "stom-vomit", label: "Vomiting", arasaacKeyword: "vomiting", arasaacId: 7303, llmContext: "The patient has been vomiting.", children: severity },
  symptom("stom-diarrhea", "Diarrhea",     "diarrhea", "The patient is experiencing diarrhea."),
  symptom("stom-noeat",    "Cannot eat",   "eat",      "The patient is unable to eat."),
];

const bodyParts: PictogramNode[] = [
  { id: "body-head",    label: "Head",       arasaacKeyword: "head",    llmContext: "The issue is located in the head area.", children: headSymptoms },
  { id: "body-chest",   label: "Chest",      arasaacKeyword: "chest",   llmContext: "The issue is located in the chest area.", children: chestSymptoms },
  { id: "body-stomach", label: "Stomach",    arasaacKeyword: "stomach", llmContext: "The issue is located in the stomach area.", children: stomachSymptoms },
];

const appointmentReasons: PictogramNode[] = [
  logisticWithWho("apt-checkup",  "Regular check-up",  "check up", "The user is here for a standard medical check-up."),
  logisticWithWho("apt-results",  "Get test results",  "results",  "The user is here to retrieve medical test results."),
  logisticWithWho("apt-first",    "First time visit",  "visit",    "This is the user's first time visiting this medical facility."),
];

const pharmacyNeeds: PictogramNode[] = [
  logisticWithWho("pharm-getmed",  "Pick up medicine",   "medicine",   "The user needs to pick up a new prescription medicine."),
  logisticWithWho("pharm-ask",     "Ask about medicine", "pharmacist", "The user has a question for the pharmacist about a medication."),
  logisticWithWho("pharm-allergy", "Medicine allergy",   "allergy",    "The user is reporting a medication allergy."),
];

const feelings: PictogramNode[] = [
  { id: "feel-sad",     label: "Sad",     arasaacKeyword: "sad",     llmContext: "The person is feeling emotionally sad or depressed.", children: feelingsSince },
  { id: "feel-scared",  label: "Scared",  arasaacKeyword: "afraid",  llmContext: "The person is feeling scared, fearful, or intimidated.", children: feelingsSince },
];

const hospitalReasons: PictogramNode[] = [
  { id: "hosp-see",         label: "See doctor / nurse", arasaacKeyword: "doctor",      llmContext: "The user needs to see a medical professional.", children: [{ id: "role-doctor", label: "Doctor", arasaacKeyword: "doctor", children: bodyParts }] },
  { id: "hosp-appointment", label: "I have appointment", arasaacKeyword: "appointment", llmContext: "The user has a pre-scheduled appointment.", children: appointmentReasons },
];

// ─── 🚨 EMERGENCY (All Direct Actions) ────────────────────────────────────────

const emergencyProblems: PictogramNode[] = [
  directAction("emg-breathe",   "Cannot breathe", "breathe",     "CRITICAL MEDICAL EMERGENCY: The person is unable to breathe."),
  directAction("emg-bleeding",  "Bleeding badly", "bleeding",    "CRITICAL MEDICAL EMERGENCY: The person is experiencing severe bleeding."),
  { id: "emg-conscious", label: "Unconscious", arasaacKeyword: "unconscious", arasaacId: 38054, llmContext: "CRITICAL MEDICAL EMERGENCY: The person has lost consciousness." },
  directAction("emg-chest",     "Chest pain",     "chest pain",  "CRITICAL MEDICAL EMERGENCY: The person is having severe chest pain, potentially a heart attack."),
];

const policeProblem: PictogramNode[] = [
  directAction("pol-danger", "I am in danger",       "danger", "POLICE EMERGENCY: The user is in immediate physical danger."),
  directAction("pol-threat", "Someone threatens me", "threat", "POLICE EMERGENCY: Someone is threatening the user's safety."),
];

const emergencyChildren: PictogramNode[] = [
  { id: "emer-ambulance", label: "Ambulance",  arasaacKeyword: "ambulance",   llmContext: "The user needs an ambulance immediately.", children: emergencyProblems },
  { id: "emer-police",    label: "Police",     arasaacKeyword: "police",      llmContext: "The user needs police assistance immediately.", children: policeProblem },
];

// ─── 🍞 FOOD ──────────────────────────────────────────────────────────────────

const groceryShopping: PictogramNode[] = [
  { id: "groc-where", label: "Where is this?", arasaacKeyword: "where", arasaacId: 32872, llmContext: "The user is at a shop and needs help finding a specific item." },
  directAction("groc-price", "How much?",       "price",    "The user wants to know the price of an item."),
  { id: "groc-halal", label: "Is this halal?", arasaacKeyword: "question", arasaacId: 38794, llmContext: "The user is asking if a specific food item is certified Halal." },
];

const foodNeedsCaseworker: PictogramNode[] = [
  logisticWithWho("fneed-hungry",  "I am hungry",   "hungry",  "The person is currently hungry and needs food."),
  logisticWithWho("fneed-diet",    "Special diet",  "diet",    "The person requires a specific medical or religious diet."),
];

const foodChildren: PictogramNode[] = [
  { id: "food-shop", label: "At shop",     arasaacKeyword: "supermarket", llmContext: "The user is shopping for groceries.", children: groceryShopping },
  { id: "food-need", label: "I need food", arasaacKeyword: "hungry",      llmContext: "The user is expressing a foundational need for food assistance.", children: foodNeedsCaseworker },
];

// ─── 🏠 HOME (All Direct Actions) ─────────────────────────────────────────────

const reportProblem: PictogramNode[] = [
  directAction("rep-leak",    "Water leak",       "water",       "The user is reporting a water leak in their housing."),
  directAction("rep-noheat",  "No heating",       "cold",        "The user is reporting that their housing has no functioning heating."),
  directAction("rep-pest",    "Insects / pests",  "insect",      "The user is reporting an infestation of insects or pests in their home."),
];

const rentHelp: PictogramNode[] = [
  directAction("rent-how",  "How much is rent?", "price",   "The user is asking for the total cost of their rent."),
  directAction("rent-late", "I cannot pay",      "problem", "The user is stating they are currently unable to pay their rent."),
];

const homeChildren: PictogramNode[] = [
  { id: "home-problem", label: "Something broken", arasaacKeyword: "repair",  llmContext: "The user needs maintenance for their home.", children: reportProblem },
  { id: "home-rent",    label: "Rent",             arasaacKeyword: "rent",    llmContext: "The user has questions or issues regarding their rent.", children: rentHelp },
];

// ─── 🚌 TRANSPORT (All Direct Actions) ────────────────────────────────────────

const howToRideTransit: PictogramNode[] = [
  { id: "ride-where", label: "Where does this go?", arasaacKeyword: "where", arasaacId: 32872, llmContext: "The user is asking for the destination of the current bus or train." },
  directAction("ride-pay",    "How do I pay?",        "pay",      "The user is asking how to pay the fare for public transit."),
];

const transportChildren: PictogramNode[] = [
  { id: "trans-bus", label: "Ride the bus", arasaacKeyword: "bus", llmContext: "The user is navigating the public bus system.", children: howToRideTransit },
  directAction("trans-walk", "Walking distance?", "walk", "The user is asking if a location is close enough to walk to."),
];

// ─── 💼 WORK (All Direct Actions) ─────────────────────────────────────────────

const lookingForWork: PictogramNode[] = [
  directAction("lfw-find",    "Find a job",           "job",      "The user is looking for assistance in finding employment."),
  directAction("lfw-resume",  "I need a resume",      "document", "The user needs help creating or updating a professional resume."),
];

const workRights: PictogramNode[] = [
  directAction("rts-pay",    "I was not paid",    "money", "The user is reporting wage theft or unpaid wages from an employer."),
  directAction("rts-hurt",   "I was hurt at work","wound", "The user is reporting a workplace injury."),
];

const workChildren: PictogramNode[] = [
  { id: "work-find",   label: "Find a job", arasaacKeyword: "job", llmContext: "The user is engaging in job-seeking activities.", children: lookingForWork },
  { id: "work-rights", label: "My rights",  arasaacKeyword: "law", llmContext: "The user needs help regarding labor rights and workplace disputes.", children: workRights },
];

// ─── 🏥 HEALTH (top-level children) ──────────────────────────────────────────

const healthChildren: PictogramNode[] = [
  { id: "health-hospital", label: "Hospital / Clinic", arasaacKeyword: "hospital", arasaacId: 3116, llmContext: "The user is at or needs to go to a hospital or clinic.", children: hospitalReasons },
  { id: "health-pharmacy", label: "Pharmacy",          arasaacKeyword: "pharmacy",  llmContext: "The user is at or needs to go to a pharmacy.", children: pharmacyNeeds },
  { id: "health-body",     label: "Body pain",         arasaacKeyword: "pain",      arasaacId: 38423, llmContext: "The user is experiencing physical pain or discomfort.", children: bodyParts },
  { id: "health-feelings", label: "Feelings",          arasaacKeyword: "feelings",  llmContext: "The user wants to express emotional feelings.", children: feelings },
];

// ─── ROOT TREE ────────────────────────────────────────────────────────────────

export const pictogramTree: PictogramNode[] = [
  { id: "cat-health",    label: "Health",    arasaacKeyword: "health",    llmContext: "The overarching context is medical health and wellbeing.", children: healthChildren },
  { id: "cat-emergency", label: "Emergency", arasaacKeyword: "emergency", llmContext: "The overarching context is an urgent emergency requiring immediate response.", children: emergencyChildren },
  { id: "cat-food",      label: "Food",      arasaacKeyword: "food",      llmContext: "The overarching context is food, groceries, or dietary needs.", children: foodChildren },
  { id: "cat-home",      label: "Home",      arasaacKeyword: "house",     llmContext: "The overarching context is housing, rent, and home maintenance.", children: homeChildren },
  { id: "cat-transport", label: "Transport", arasaacKeyword: "bus stop", arasaacId: 10351, llmContext: "The overarching context is transportation and navigation.", children: transportChildren },
  { id: "cat-work",      label: "Work",      arasaacKeyword: "work",      llmContext: "The overarching context is employment, jobs, and labor rights.", children: workChildren },
];