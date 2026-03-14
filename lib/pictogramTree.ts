export type PictogramNode = {
  id: string;
  label: string;
  label_2?: string; // Romanized Rohingya translation
  arasaacKeyword: string;
  arasaacId?: number; // Optional explicit ARASAAC pictogram id override for this node
  llmContext?: string; // Extra descriptive context to help the LLM generate a full, accurate sentence
  children?: PictogramNode[];
};

// ─── WHO selector (final level on relevant paths) ────────────────────────────

const whoIsThis: PictogramNode[] = [
  { id: "who-me",     label: "Me",           label_2: "Ani",          arasaacKeyword: "myself", arasaacId: 6632, llmContext: "The subject of the request is the speaker." },
  { id: "who-mother", label: "My mother",    label_2: "Anar ma",      arasaacKeyword: "mother", llmContext: "The subject of the request is the speaker's mother." },
  { id: "who-father", label: "My father",    label_2: "Anar baf",     arasaacKeyword: "father", llmContext: "The subject of the request is the speaker's father." },
  { id: "who-child",  label: "My child",     label_2: "Anar fua",     arasaacKeyword: "child",  llmContext: "The subject of the request is the speaker's child." },
  { id: "who-baby",   label: "My baby",      label_2: "Anar gura",    arasaacKeyword: "baby",   llmContext: "The subject of the request is the speaker's baby." },
  { id: "who-other",  label: "Someone else", label_2: "Oinno manuic", arasaacKeyword: "person", llmContext: "The subject of the request is another person not explicitly listed." },
];

// ─── SEVERITY (routes to Who) ────────────────────────────────────────────────

const severity: PictogramNode[] = [
  { id: "sev-little", label: "A little",        label_2: "Ekkan",            arasaacKeyword: "little",    arasaacId: 4716, llmContext: "The symptom severity is mild.", children: whoIsThis },
  { id: "sev-medium", label: "Medium",          label_2: "Moddomo",          arasaacKeyword: "medium",    arasaacId: 4693, llmContext: "The symptom severity is moderate.", children: whoIsThis },
  { id: "sev-lot",    label: "A lot",           label_2: "Beci",             arasaacKeyword: "very much", arasaacId: 4658, llmContext: "The symptom severity is severe or intense.", children: whoIsThis },
  { id: "sev-since",  label: "Since yesterday", label_2: "Geloikailla ottu", arasaacKeyword: "yesterday",                  llmContext: "The symptom has been ongoing since yesterday.", children: whoIsThis },
  { id: "sev-days",   label: "Many days",       label_2: "But din",          arasaacKeyword: "calendar",                   llmContext: "The symptom has been ongoing for multiple days.", children: whoIsThis },
];

// ─── FEELINGS TIME (routes to Who) ───────────────────────────────────────────

const feelingsSince: PictogramNode[] = [
  { id: "feel-today", label: "Today",     label_2: "Aijja",    arasaacKeyword: "today",    llmContext: "The feeling started today.", children: whoIsThis },
  { id: "feel-week",  label: "This week", label_2: "Ei hofta", arasaacKeyword: "week",     llmContext: "The feeling has lasted all week.", children: whoIsThis },
  { id: "feel-long",  label: "Long time", label_2: "But din",  arasaacKeyword: "calendar", llmContext: "The feeling has lasted for a long time.", children: whoIsThis },
];

// ─── HELPER FUNCTIONS FOR NEW LOGICAL FLOWS ──────────────────────────────────

function symptom(id: string, label: string, label_2: string, keyword: string, context: string): PictogramNode {
  return { id, label, label_2, arasaacKeyword: keyword, llmContext: context, children: severity };
}

function logisticWithWho(id: string, label: string, label_2: string, keyword: string, context: string): PictogramNode {
  return { id, label, label_2, arasaacKeyword: keyword, llmContext: context, children: whoIsThis };
}

function directAction(id: string, label: string, label_2: string, keyword: string, context: string): PictogramNode {
  return { id, label, label_2, arasaacKeyword: keyword, llmContext: context }; 
}

// ─── 🏥 HEALTH ────────────────────────────────────────────────────────────────

const headSymptoms: PictogramNode[] = [
  symptom("head-pain",  "Headache", "Mata bic", "headache",  "The patient is experiencing a headache."),
  symptom("head-dizzy", "Dizzy",    "Mata gura", "dizziness", "The patient is feeling dizzy or lightheaded."),
  symptom("head-eyes",  "Eye pain", "Suk bic",  "eye",       "The patient is experiencing pain in their eyes."),
  symptom("head-ear",   "Ear pain", "Xan bic",  "ear",       "The patient is experiencing pain in their ears."),
  symptom("head-fever", "Fever",    "Jor",      "fever",     "The patient has a fever."),
];

const chestSymptoms: PictogramNode[] = [
  symptom("chest-pain",    "Chest pain",         "Sinar bic",          "chest pain", "The patient is experiencing chest pain."),
  symptom("chest-breathe", "Hard to breathe",    "Nisac loite kosto",  "breathe",    "The patient is having difficulty breathing."),
  symptom("chest-cough",   "Cough",              "Hasi",               "cough",      "The patient has a cough."),
  symptom("chest-heart",   "Heart beating fast", "Dil farafari gorer", "heart",      "The patient feels their heart is beating abnormally fast."),
];

const stomachSymptoms: PictogramNode[] = [
  symptom("stom-pain",     "Stomach pain", "Fet bic",     "stomach",  "The patient is experiencing stomach pain."),
  symptom("stom-nausea",   "Nausea",       "Ga gulaiyer", "nausea",   "The patient is feeling nauseous."),
  { id: "stom-vomit", label: "Vomiting", label_2: "Bomi", arasaacKeyword: "vomiting", arasaacId: 7303, llmContext: "The patient has been vomiting.", children: severity },
  symptom("stom-diarrhea", "Diarrhea",     "Fet lamer",   "diarrhea", "The patient is experiencing diarrhea."),
  symptom("stom-noeat",    "Cannot eat",   "Hai nofarir", "eat",      "The patient is unable to eat."),
];

const bodyParts: PictogramNode[] = [
  { id: "body-head",    label: "Head",    label_2: "Mata", arasaacKeyword: "head",    llmContext: "The issue is located in the head area.", children: headSymptoms },
  { id: "body-chest",   label: "Chest",   label_2: "Sina", arasaacKeyword: "chest",   llmContext: "The issue is located in the chest area.", children: chestSymptoms },
  { id: "body-stomach", label: "Stomach", label_2: "Fet",  arasaacKeyword: "stomach", llmContext: "The issue is located in the stomach area.", children: stomachSymptoms },
];

const appointmentReasons: PictogramNode[] = [
  logisticWithWho("apt-checkup",  "Regular check-up", "Bala gori saita",  "check up", "The user is here for a standard medical check-up."),
  logisticWithWho("apt-results",  "Get test results", "Testor ripot",     "results",  "The user is here to retrieve medical test results."),
  logisticWithWho("apt-first",    "First time visit", "Foilla bar aicci", "visit",    "This is the user's first time visiting this medical facility."),
];

const pharmacyNeeds: PictogramNode[] = [
  logisticWithWho("pharm-getmed",  "Pick up medicine",   "Ocut loita",                 "medicine",   "The user needs to pick up a new prescription medicine."),
  logisticWithWho("pharm-refill",  "Refill medicine",    "Abar ocut loita",            "medicine",   "The user needs to refill an existing prescription."),
  logisticWithWho("pharm-ask",     "Ask about medicine", "Ocutor babote fusar gorita", "pharmacist", "The user has a question for the pharmacist about a medication."),
  logisticWithWho("pharm-allergy", "Medicine allergy",   "Ocutor elarji",              "allergy",    "The user is reporting a medication allergy."),
];

const feelings: PictogramNode[] = [
  { id: "feel-sad",    label: "Sad",    label_2: "Udaic",    arasaacKeyword: "sad",    llmContext: "The person is feeling emotionally sad or depressed.", children: feelingsSince },
  { id: "feel-scared", label: "Scared", label_2: "Doraiye",  arasaacKeyword: "afraid", llmContext: "The person is feeling scared, fearful, or intimidated.", children: feelingsSince },
];

const hospitalReasons: PictogramNode[] = [
  { id: "hosp-see",         label: "See doctor / nurse", label_2: "Daktor / Nars saita", arasaacKeyword: "doctor",      llmContext: "The user needs to see a medical professional.", children: [{ id: "role-doctor", label: "Doctor", label_2: "Daktor", arasaacKeyword: "doctor", children: bodyParts }] },
  { id: "hosp-appointment", label: "I have appointment", label_2: "Anar epoinmen ase",   arasaacKeyword: "appointment", llmContext: "The user has a pre-scheduled appointment.", children: appointmentReasons },
];

// ─── 🚨 EMERGENCY (All Direct Actions) ────────────────────────────────────────

const emergencyProblems: PictogramNode[] = [
  directAction("emg-breathe",   "Cannot breathe", "Nisac loi nofarir", "breathe",     "CRITICAL MEDICAL EMERGENCY: The person is unable to breathe."),
  directAction("emg-bleeding",  "Bleeding badly", "Beci hun zar",      "bleeding",    "CRITICAL MEDICAL EMERGENCY: The person is experiencing severe bleeding."),
  { id: "emg-conscious", label: "Unconscious", label_2: "Beuc", arasaacKeyword: "unconscious", arasaacId: 38054, llmContext: "CRITICAL MEDICAL EMERGENCY: The person has lost consciousness." },
  directAction("emg-chest",     "Chest pain",     "Sinar bic",         "chest pain",  "CRITICAL MEDICAL EMERGENCY: The person is having severe chest pain, potentially a heart attack."),
];

const policeProblem: PictogramNode[] = [
  directAction("pol-danger", "I am in danger",       "Ani hotara t ason",        "danger", "POLICE EMERGENCY: The user is in immediate physical danger."),
  directAction("pol-threat", "Someone threatens me", "Hoinke anare domok diyer", "threat", "POLICE EMERGENCY: Someone is threatening the user's safety."),
];

const emergencyChildren: PictogramNode[] = [
  { id: "emer-ambulance", label: "Ambulance", label_2: "Embulens", arasaacKeyword: "ambulance", llmContext: "The user needs an ambulance immediately.", children: emergencyProblems },
  { id: "emer-police",    label: "Police",    label_2: "Fulis",    arasaacKeyword: "police",    llmContext: "The user needs police assistance immediately.", children: policeProblem },
];

// ─── 🍞 FOOD ──────────────────────────────────────────────────────────────────

const groceryShopping: PictogramNode[] = [
  { id: "groc-where", label: "Where is this?", label_2: "Iba hone?",     arasaacKeyword: "where",    arasaacId: 32872, llmContext: "The user is at a shop and needs help finding a specific item." },
  directAction("groc-price", "How much?",      "Dam hoto?",      "price",    "The user wants to know the price of an item."),
  { id: "groc-halal", label: "Is this halal?", label_2: "Iba halal ne?", arasaacKeyword: "question", arasaacId: 38794, llmContext: "The user is asking if a specific food item is certified Halal." },
];

const foodNeedsCaseworker: PictogramNode[] = [
  logisticWithWho("fneed-hungry",  "I am hungry",  "Anar buk lagiye", "hungry",  "The person is currently hungry and needs food."),
  logisticWithWho("fneed-diet",    "Special diet", "Hass khana",      "diet",    "The person requires a specific medical or religious diet."),
];

const foodChildren: PictogramNode[] = [
  { id: "food-shop", label: "At shop",     label_2: "Dukan ot",        arasaacKeyword: "supermarket", llmContext: "The user is shopping for groceries.", children: groceryShopping },
  { id: "food-need", label: "I need food", label_2: "Anare khana lage", arasaacKeyword: "hungry",      llmContext: "The user is expressing a foundational need for food assistance.", children: foodNeedsCaseworker },
];

// ─── 🏠 HOME (All Direct Actions) ─────────────────────────────────────────────

const reportProblem: PictogramNode[] = [
  directAction("rep-leak",   "Water leak",      "Fani forer", "water",  "The user is reporting a water leak in their housing."),
  directAction("rep-noheat", "No heating",      "Gorom nai",  "cold",   "The user is reporting that their housing has no functioning heating."),
  directAction("rep-pest",   "Insects / pests", "Fuk makor",  "insect", "The user is reporting an infestation of insects or pests in their home."),
];

const rentHelp: PictogramNode[] = [
  directAction("rent-how",  "How much is rent?", "Bara hoto?",          "price",   "The user is asking for the total cost of their rent."),
  directAction("rent-late", "I cannot pay",      "Ani foisa di nofarir", "problem", "The user is stating they are currently unable to pay their rent."),
];

const homeChildren: PictogramNode[] = [
  { id: "home-problem", label: "Something broken", label_2: "Kiccu bangiye", arasaacKeyword: "repair",  llmContext: "The user needs maintenance for their home.", children: reportProblem },
  { id: "home-rent",    label: "Rent",             label_2: "Gor bara",      arasaacKeyword: "rent",    llmContext: "The user has questions or issues regarding their rent.", children: rentHelp },
];

// ─── 🚌 TRANSPORT (All Direct Actions) ────────────────────────────────────────

const howToRideTransit: PictogramNode[] = [
  { id: "ride-where", label: "Where does this go?", label_2: "Iba hore zar?",        arasaacKeyword: "where", arasaacId: 32872, llmContext: "The user is asking for the destination of the current bus or train." },
  directAction("ride-pay",    "How do I pay?",       "Bara hen gori diyum?", "pay",   "The user is asking how to pay the fare for public transit."),
];

const transportChildren: PictogramNode[] = [
  { id: "trans-bus", label: "Ride the bus", label_2: "Bas ot uta", arasaacKeyword: "bus", llmContext: "The user is navigating the public bus system.", children: howToRideTransit },
  directAction("trans-walk", "Walking distance?", "Hainti zai faribou ne?", "walk", "The user is asking if a location is close enough to walk to."),
];

// ─── 💼 WORK (All Direct Actions) ─────────────────────────────────────────────

const lookingForWork: PictogramNode[] = [
  directAction("lfw-find",    "Find a job",      "Ham bicara",     "job",      "The user is looking for assistance in finding employment."),
  directAction("lfw-resume",  "I need a resume", "Anare rizumi lage", "document", "The user needs help creating or updating a professional resume."),
];

const workRights: PictogramNode[] = [
  directAction("rts-pay",    "I was not paid",     "Tiya no fai",         "money", "The user is reporting wage theft or unpaid wages from an employer."),
  directAction("rts-hurt",   "I was hurt at work", "Ham ot zohom oiyom", "wound", "The user is reporting a workplace injury."),
];

const workChildren: PictogramNode[] = [
  { id: "work-find",   label: "Find a job", label_2: "Ham bicara", arasaacKeyword: "job", llmContext: "The user is engaging in job-seeking activities.", children: lookingForWork },
  { id: "work-rights", label: "My rights",  label_2: "Anar hok",   arasaacKeyword: "law", llmContext: "The user needs help regarding labor rights and workplace disputes.", children: workRights },
];

// ─── 🏥 HEALTH (top-level children) ──────────────────────────────────────────

const healthChildren: PictogramNode[] = [
  { id: "health-hospital", label: "Hospital / Clinic", label_2: "Hasfatail / Kilinik", arasaacKeyword: "hospital",  arasaacId: 3116,  llmContext: "The user is at or needs to go to a hospital or clinic.", children: hospitalReasons },
  { id: "health-pharmacy", label: "Pharmacy",          label_2: "Farmasi",             arasaacKeyword: "pharmacy",                    llmContext: "The user is at or needs to go to a pharmacy.", children: pharmacyNeeds },
  { id: "health-body",     label: "Body pain",         label_2: "Ga bic",              arasaacKeyword: "pain",      arasaacId: 38423, llmContext: "The user is experiencing physical pain or discomfort.", children: bodyParts },
  { id: "health-feelings", label: "Feelings",          label_2: "Monor hal",           arasaacKeyword: "feelings",                    llmContext: "The user wants to express emotional feelings.", children: feelings },
];

// ─── ROOT TREE ────────────────────────────────────────────────────────────────

export const pictogramTree: PictogramNode[] = [
  { id: "cat-health",    label: "Health",    label_2: "Sehoit",    arasaacKeyword: "health",    llmContext: "The overarching context is medical health and wellbeing.", children: healthChildren },
  { id: "cat-emergency", label: "Emergency", label_2: "Zoruri",    arasaacKeyword: "emergency", llmContext: "The overarching context is an urgent emergency requiring immediate response.", children: emergencyChildren },
  { id: "cat-food",      label: "Food",      label_2: "Khana",     arasaacKeyword: "food",      llmContext: "The overarching context is food, groceries, or dietary needs.", children: foodChildren },
  { id: "cat-home",      label: "Home",      label_2: "Gor",       arasaacKeyword: "house",     llmContext: "The overarching context is housing, rent, and home maintenance.", children: homeChildren },
  { id: "cat-transport", label: "Transport", label_2: "Gari gura", arasaacKeyword: "bus stop", arasaacId: 10351, llmContext: "The overarching context is transportation and navigation.", children: transportChildren },
  { id: "cat-work",      label: "Work",      label_2: "Ham",       arasaacKeyword: "work",      llmContext: "The overarching context is employment, jobs, and labor rights.", children: workChildren },
];
