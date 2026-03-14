export type PictogramNode = {
  id: string;
  label: string;
  arasaacKeyword: string;
  children?: PictogramNode[];
};

// ─── Shared detail nodes (always the final level) ────────────────────────────
// These answer "how bad / how long" and keep depth consistent.

const severity: PictogramNode[] = [
  { id: "sev-little", label: "A little", arasaacKeyword: "little" },
  { id: "sev-lot",    label: "A lot",    arasaacKeyword: "very much" },
  { id: "sev-since",  label: "Since yesterday", arasaacKeyword: "yesterday" },
  { id: "sev-days",   label: "Many days",  arasaacKeyword: "calendar" },
];

// Helper: attach severity as final level to any symptom leaf
function withSeverity(id: string, label: string, keyword: string): PictogramNode {
  return { id, label, arasaacKeyword: keyword, children: severity };
}

// ─── Reusable symptom lists ───────────────────────────────────────────────────
// Attached AFTER the user has picked a body part or situation.
// Kept short — 4-6 items max per screen.

const generalSymptoms: PictogramNode[] = [
  withSeverity("sym-pain",     "Pain",      "pain"),
  withSeverity("sym-fever",    "Fever",     "fever"),
  withSeverity("sym-swollen",  "Swollen",   "swollen"),
  withSeverity("sym-bleeding", "Bleeding",  "bleeding"),
  withSeverity("sym-sick",     "Feel sick", "sick"),
];

const headSymptoms: PictogramNode[] = [
  withSeverity("head-pain",     "Headache",   "headache"),
  withSeverity("head-dizzy",    "Dizzy",      "dizziness"),
  withSeverity("head-eyes",     "Eye pain",   "eye"),
  withSeverity("head-ear",      "Ear pain",   "ear"),
  withSeverity("head-fever",    "Fever",      "fever"),
];

const chestSymptoms: PictogramNode[] = [
  withSeverity("chest-pain",    "Chest pain",        "chest pain"),
  withSeverity("chest-breathe", "Hard to breathe",   "breathe"),
  withSeverity("chest-cough",   "Cough",             "cough"),
  withSeverity("chest-heart",   "Heart beating fast","heart"),
];

const stomachSymptoms: PictogramNode[] = [
  withSeverity("stom-pain",     "Stomach pain",  "stomach"),
  withSeverity("stom-nausea",   "Nausea",        "nausea"),
  withSeverity("stom-vomit",    "Vomiting",      "vomiting"),
  withSeverity("stom-diarrhea", "Diarrhea",      "diarrhea"),
  withSeverity("stom-noeat",    "Cannot eat",    "eat"),
];

const backLimbSymptoms: PictogramNode[] = [
  withSeverity("limb-pain",     "Pain",      "pain"),
  withSeverity("limb-swollen",  "Swollen",   "swollen"),
  withSeverity("limb-broken",   "Broken",    "fracture"),
  withSeverity("limb-weak",     "Weak",      "weakness"),
];

const skinSymptoms: PictogramNode[] = [
  withSeverity("skin-rash",     "Rash",      "rash"),
  withSeverity("skin-itch",     "Itching",   "itching"),
  withSeverity("skin-burn",     "Burn",      "burn"),
  withSeverity("skin-cut",      "Cut",       "cut"),
  withSeverity("skin-bleed",    "Bleeding",  "bleeding"),
];

// ─── Body part picker (level 3 in the doctor/nurse path) ──────────────────────

const bodyParts: PictogramNode[] = [
  { id: "body-head",    label: "Head",       arasaacKeyword: "head",    children: headSymptoms },
  { id: "body-chest",   label: "Chest",      arasaacKeyword: "chest",   children: chestSymptoms },
  { id: "body-stomach", label: "Stomach",    arasaacKeyword: "stomach", children: stomachSymptoms },
  { id: "body-back",    label: "Back",       arasaacKeyword: "back",    children: backLimbSymptoms },
  { id: "body-arm",     label: "Arm / Hand", arasaacKeyword: "arm",     children: backLimbSymptoms },
  { id: "body-leg",     label: "Leg / Foot", arasaacKeyword: "leg",     children: backLimbSymptoms },
  { id: "body-skin",    label: "Skin",       arasaacKeyword: "skin",    children: skinSymptoms },
  { id: "body-all",     label: "Whole body", arasaacKeyword: "body",    children: generalSymptoms },
];

// ─── Doctor / Nurse path ──────────────────────────────────────────────────────
// Level 2: Hospital or Clinic → Level 3: Doctor / Nurse → Level 4: Body part → Level 5: Symptom

const doctorNurseChildren: PictogramNode[] = [
  { id: "role-doctor", label: "Doctor", arasaacKeyword: "doctor", children: bodyParts },
  { id: "role-nurse",  label: "Nurse",  arasaacKeyword: "nurse",  children: bodyParts },
];

// ─── Emergency path ───────────────────────────────────────────────────────────
// Shorter — user is in crisis, fewer taps needed

const emergencyProblems: PictogramNode[] = [
  withSeverity("emg-breathe",  "Cannot breathe", "breathe"),
  withSeverity("emg-bleeding", "Bleeding badly", "bleeding"),
  withSeverity("emg-conscious","Unconscious",    "unconscious"),
  withSeverity("emg-broken",   "Broken bone",    "fracture"),
  withSeverity("emg-chest",    "Chest pain",     "chest pain"),
  withSeverity("emg-allergy",  "Bad reaction",   "allergy"),
];

// ─── Appointment / check-up path ─────────────────────────────────────────────

const appointmentReasons: PictogramNode[] = [
  withSeverity("apt-checkup",  "Regular check-up",  "check up"),
  withSeverity("apt-results",  "Get test results",  "results"),
  withSeverity("apt-medicine", "Get more medicine", "medicine"),
  withSeverity("apt-first",    "First time visit",  "visit"),
  withSeverity("apt-child",    "For my child",      "child"),
];

// ─── Hospital / Clinic shared children ───────────────────────────────────────
// Level 3: why are you here at the hospital?

const hospitalReasons: PictogramNode[] = [
  { id: "hosp-see",         label: "See doctor / nurse", arasaacKeyword: "doctor",      children: doctorNurseChildren },
  { id: "hosp-emergency",   label: "Emergency",          arasaacKeyword: "emergency",   children: emergencyProblems },
  { id: "hosp-appointment", label: "I have appointment", arasaacKeyword: "appointment", children: appointmentReasons },
  { id: "hosp-test",        label: "Blood / urine test", arasaacKeyword: "blood test",  children: severity },
];

// ─── Pharmacy ─────────────────────────────────────────────────────────────────

const pharmacyNeeds: PictogramNode[] = [
  withSeverity("pharm-getmed",  "Pick up medicine",  "medicine"),
  withSeverity("pharm-refill",  "Refill medicine",   "medicine"),
  withSeverity("pharm-ask",     "Ask about medicine","pharmacist"),
  withSeverity("pharm-allergy", "Medicine allergy",  "allergy"),
  withSeverity("pharm-pain",    "Pain relief",       "painkiller"),
];

// ─── Dentist ─────────────────────────────────────────────────────────────────

const toothProblems: PictogramNode[] = [
  withSeverity("dent-pain",    "Tooth pain",    "toothache"),
  withSeverity("dent-broken",  "Broken tooth",  "tooth"),
  withSeverity("dent-gums",    "Gum pain",      "gum"),
  withSeverity("dent-bleed",   "Gum bleeding",  "bleeding"),
  withSeverity("dent-appt",    "Check-up",      "check up"),
];

// ─── Feelings ────────────────────────────────────────────────────────────────
// Renamed from "Mental Health" to reduce stigma

const feelingsSince: PictogramNode[] = [
  { id: "feel-today",    label: "Today",       arasaacKeyword: "today" },
  { id: "feel-week",     label: "This week",   arasaacKeyword: "week" },
  { id: "feel-long",     label: "Long time",   arasaacKeyword: "calendar" },
];

const feelings: PictogramNode[] = [
  { id: "feel-sad",      label: "Sad",          arasaacKeyword: "sad",      children: feelingsSince },
  { id: "feel-worried",  label: "Worried",      arasaacKeyword: "worried",  children: feelingsSince },
  { id: "feel-nosleep",  label: "Cannot sleep", arasaacKeyword: "insomnia", children: feelingsSince },
  { id: "feel-angry",    label: "Angry",        arasaacKeyword: "angry",    children: feelingsSince },
  { id: "feel-lonely",   label: "Lonely",       arasaacKeyword: "lonely",   children: feelingsSince },
  { id: "feel-scared",   label: "Scared",       arasaacKeyword: "afraid",   children: feelingsSince },
];

// ─── HEALTH (top-level category, fully built) ─────────────────────────────────
// Level 1: Health
// Level 2: Where are you going? (situation)
// Level 3+: What is wrong / what do you need?

const healthChildren: PictogramNode[] = [
  { id: "health-hospital", label: "Hospital",  arasaacKeyword: "hospital building", children: hospitalReasons },
  { id: "health-clinic",   label: "Clinic",    arasaacKeyword: "clinic",            children: hospitalReasons },
  { id: "health-pharmacy", label: "Pharmacy",  arasaacKeyword: "pharmacy",          children: pharmacyNeeds },
  { id: "health-dentist",  label: "Dentist",   arasaacKeyword: "dentist",           children: toothProblems },
  { id: "health-feelings", label: "Feelings",  arasaacKeyword: "feelings",          children: feelings },
];

// ─── EMERGENCY (top-level category) ──────────────────────────────────────────
// Level 1: Emergency
// Level 2: What kind of emergency service?
// Level 3: What is the problem?

const fireProblem: PictogramNode[] = [
  withSeverity("fire-house",  "House fire",   "fire"),
  withSeverity("fire-small",  "Small fire",   "fire"),
  withSeverity("fire-smoke",  "Smoke",        "smoke"),
];

const policeProblem: PictogramNode[] = [
  withSeverity("pol-danger",  "I am in danger", "danger"),
  withSeverity("pol-stolen",  "Something stolen","theft"),
  withSeverity("pol-lost",    "I am lost",      "lost"),
  withSeverity("pol-threat",  "Someone threats me","threat"),
];

const emergencyChildren: PictogramNode[] = [
  { id: "emer-ambulance", label: "Ambulance",   arasaacKeyword: "ambulance",  children: emergencyProblems },
  { id: "emer-fire",      label: "Fire truck",  arasaacKeyword: "firefighter",children: fireProblem },
  { id: "emer-police",    label: "Police",      arasaacKeyword: "police",     children: policeProblem },
];

// ─── FOOD (placeholder — situation-first structure roughed in) ────────────────

const foodPlaceholderChildren: PictogramNode[] = [
  { id: "food-hungry",     label: "I am hungry",   arasaacKeyword: "hungry",      children: severity },
  { id: "food-thirsty",    label: "I am thirsty",  arasaacKeyword: "thirsty",     children: severity },
  { id: "food-allergy",    label: "Food allergy",  arasaacKeyword: "allergy",     children: severity },
  { id: "food-nopork",     label: "No pork",       arasaacKeyword: "forbidden",   children: severity },
  { id: "food-restaurant", label: "Restaurant",    arasaacKeyword: "restaurant",  children: severity },
  { id: "food-cook",       label: "Cook at home",  arasaacKeyword: "cook",        children: severity },
];

// ─── HOME (placeholder) ───────────────────────────────────────────────────────

const homePlaceholderChildren: PictogramNode[] = [
  { id: "home-rent",    label: "Rent",         arasaacKeyword: "rent",        children: severity },
  { id: "home-broken",  label: "Something broken", arasaacKeyword: "broken",  children: severity },
  { id: "home-nowater", label: "No water",     arasaacKeyword: "water",       children: severity },
  { id: "home-noelec",  label: "No electricity", arasaacKeyword: "electricity", children: severity },
  { id: "home-key",     label: "Key / Lock",   arasaacKeyword: "key",         children: severity },
  { id: "home-clean",   label: "Cleaning",     arasaacKeyword: "clean",       children: severity },
];

// ─── TRANSPORT (placeholder) ──────────────────────────────────────────────────

const transportPlaceholderChildren: PictogramNode[] = [
  { id: "trans-bus",    label: "Bus",       arasaacKeyword: "bus",      children: severity },
  { id: "trans-train",  label: "Train",     arasaacKeyword: "train",    children: severity },
  { id: "trans-taxi",   label: "Taxi",      arasaacKeyword: "taxi",     children: severity },
  { id: "trans-lost",   label: "I am lost", arasaacKeyword: "lost",     children: severity },
  { id: "trans-ticket", label: "Ticket",    arasaacKeyword: "ticket",   children: severity },
  { id: "trans-walk",   label: "Walking",   arasaacKeyword: "walk",     children: severity },
];

// ─── WORK (placeholder) ───────────────────────────────────────────────────────

const workPlaceholderChildren: PictogramNode[] = [
  { id: "work-job",     label: "Find a job",   arasaacKeyword: "job",       children: severity },
  { id: "work-pay",     label: "Get paid",     arasaacKeyword: "money",     children: severity },
  { id: "work-hours",   label: "Work hours",   arasaacKeyword: "clock",     children: severity },
  { id: "work-doc",     label: "Documents",    arasaacKeyword: "document",  children: severity },
  { id: "work-learn",   label: "Learn skill",  arasaacKeyword: "learn",     children: severity },
  { id: "work-help",    label: "Need help",    arasaacKeyword: "help",      children: severity },
];

// ─── FAMILY / PEOPLE (placeholder) ───────────────────────────────────────────

const familyPlaceholderChildren: PictogramNode[] = [
  { id: "fam-mother",   label: "Mother",    arasaacKeyword: "mother",    children: severity },
  { id: "fam-father",   label: "Father",    arasaacKeyword: "father",    children: severity },
  { id: "fam-child",    label: "Child",     arasaacKeyword: "child",     children: severity },
  { id: "fam-baby",     label: "Baby",      arasaacKeyword: "baby",      children: severity },
  { id: "fam-help",     label: "Need help", arasaacKeyword: "help",      children: severity },
  { id: "fam-together", label: "Together",  arasaacKeyword: "together",  children: severity },
];

// ─── ROOT TREE ────────────────────────────────────────────────────────────────

export const pictogramTree: PictogramNode[] = [
  { id: "cat-health",    label: "Health",    arasaacKeyword: "health",       children: healthChildren },
  { id: "cat-emergency", label: "Emergency", arasaacKeyword: "emergency",    children: emergencyChildren },
  { id: "cat-food",      label: "Food",      arasaacKeyword: "food",         children: foodPlaceholderChildren },
  { id: "cat-home",      label: "Home",      arasaacKeyword: "house",        children: homePlaceholderChildren },
  { id: "cat-transport", label: "Transport", arasaacKeyword: "bus stop",     children: transportPlaceholderChildren },
  { id: "cat-work",      label: "Work",      arasaacKeyword: "work",         children: workPlaceholderChildren },
  { id: "cat-family",    label: "Family",    arasaacKeyword: "family",       children: familyPlaceholderChildren },
];