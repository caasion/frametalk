export type PictogramNode = {
  id: string;
  label: string;
  arasaacKeyword: string;
  children?: PictogramNode[];
};

// ─── Shared descriptor nodes (appended as final level to ensure depth ≥ 3) ──

const descriptors: PictogramNode[] = [
  { id: "desc-mild", label: "Mild", arasaacKeyword: "little" },
  { id: "desc-medium", label: "Medium", arasaacKeyword: "medium" },
  { id: "desc-severe", label: "Severe", arasaacKeyword: "very much" },
  { id: "desc-today", label: "Today", arasaacKeyword: "today" },
  { id: "desc-yesterday", label: "Yesterday", arasaacKeyword: "yesterday" },
  { id: "desc-many-days", label: "Many days", arasaacKeyword: "calendar" },
];

// Helper: wrap leaf items so they get descriptors as children
function leaf(id: string, label: string, keyword: string): PictogramNode {
  return { id, label, arasaacKeyword: keyword, children: descriptors };
}

// ─── Health & Body (deeply built out) ─────────────────────────────────────────

const symptoms: PictogramNode[] = [
  leaf("symptom-pain", "Pain", "pain"),
  leaf("symptom-fever", "Fever", "fever"),
  leaf("symptom-cough", "Cough", "cough"),
  leaf("symptom-breathe", "Trouble breathing", "breathe"),
  leaf("symptom-nausea", "Nausea", "nausea"),
  leaf("symptom-vomiting", "Vomiting", "vomiting"),
  leaf("symptom-diarrhea", "Diarrhea", "diarrhea"),
  leaf("symptom-dizziness", "Dizziness", "dizziness"),
  leaf("symptom-rash", "Rash", "rash"),
  leaf("symptom-swelling", "Swelling", "swollen"),
  leaf("symptom-tired", "Tired", "tired"),
  leaf("symptom-bleeding", "Bleeding", "bleeding"),
  leaf("symptom-sick", "Sick", "sick"),
];

const bodyParts: PictogramNode[] = [
  { id: "body-head", label: "Head", arasaacKeyword: "head", children: symptoms },
  { id: "body-eyes", label: "Eyes", arasaacKeyword: "eyes", children: symptoms },
  { id: "body-throat", label: "Throat", arasaacKeyword: "throat", children: symptoms },
  { id: "body-chest", label: "Chest", arasaacKeyword: "chest", children: symptoms },
  { id: "body-stomach", label: "Stomach", arasaacKeyword: "stomach", children: symptoms },
  { id: "body-back", label: "Back", arasaacKeyword: "back pain", children: symptoms },
  { id: "body-arm", label: "Arm", arasaacKeyword: "arm", children: symptoms },
  { id: "body-leg", label: "Leg", arasaacKeyword: "leg", children: symptoms },
  { id: "body-skin", label: "Skin", arasaacKeyword: "skin", children: symptoms },
  { id: "body-whole", label: "Whole body", arasaacKeyword: "body", children: symptoms },
];

const painTypes: PictogramNode[] = [
  leaf("pain-sharp", "Sharp pain", "sharp"),
  leaf("pain-burning", "Burning pain", "burn"),
  leaf("pain-pressure", "Pressure", "pressure"),
  leaf("pain-cramping", "Cramping", "cramp"),
];

const injuries: PictogramNode[] = [
  leaf("inj-cut", "Cut", "cut"),
  leaf("inj-burn", "Burn", "burn"),
  leaf("inj-bruise", "Bruise", "bruise"),
  leaf("inj-bleeding", "Bleeding", "bleeding"),
  leaf("inj-broken", "Broken bone", "fracture"),
  leaf("inj-fall", "Fall", "fall down"),
];

const medicalNeeds: PictogramNode[] = [
  leaf("med-doctor", "Need doctor", "doctor"),
  leaf("med-medicine", "Need medicine", "medicine"),
  leaf("med-hospital", "Need hospital", "hospital"),
  leaf("med-ambulance", "Need ambulance", "ambulance"),
  leaf("med-allergic", "Allergic", "allergy"),
  leaf("med-pregnant", "Pregnant", "pregnant"),
];

const emergencySymptoms: PictogramNode[] = [
  leaf("emg-breathe", "Can't breathe", "breathe"),
  leaf("emg-bleeding", "Bleeding", "bleeding"),
  leaf("emg-unconscious", "Unconscious", "unconscious"),
  leaf("emg-broken", "Broken bone", "fracture"),
  leaf("emg-chestpain", "Chest pain", "chest pain"),
];

const appointmentReasons: PictogramNode[] = [
  leaf("apt-checkup", "Check-up", "check up"),
  leaf("apt-results", "Test results", "results"),
  leaf("apt-refill", "Medicine refill", "medicine"),
  leaf("apt-first", "First visit", "visit"),
];

const hospitalChildren: PictogramNode[] = [
  { id: "hosp-doctor", label: "Doctor", arasaacKeyword: "doctor", children: bodyParts },
  { id: "hosp-nurse", label: "Nurse", arasaacKeyword: "nurse", children: bodyParts },
  { id: "hosp-emergency", label: "Emergency", arasaacKeyword: "emergency", children: emergencySymptoms },
  { id: "hosp-appointment", label: "Appointment", arasaacKeyword: "appointment", children: appointmentReasons },
];

const pharmacyChildren: PictogramNode[] = [
  leaf("pharm-medicine", "Medicine", "medicine"),
  leaf("pharm-prescription", "Prescription", "prescription"),
  leaf("pharm-allergy", "Allergy", "allergy"),
  leaf("pharm-painrelief", "Pain relief", "painkiller"),
  leaf("pharm-ask", "Ask pharmacist", "pharmacist"),
];

const dentistChildren: PictogramNode[] = [
  leaf("dent-pain", "Tooth pain", "toothache"),
  leaf("dent-broken", "Broken tooth", "broken tooth"),
  leaf("dent-cleaning", "Cleaning", "dental cleaning"),
  leaf("dent-appointment", "Appointment", "appointment"),
];

const mentalHealthChildren: PictogramNode[] = [
  leaf("mh-sad", "Sad", "sad"),
  leaf("mh-anxious", "Anxious", "anxious"),
  leaf("mh-sleep", "Can't sleep", "insomnia"),
  leaf("mh-angry", "Angry", "angry"),
  leaf("mh-lonely", "Lonely", "lonely"),
];

const healthChildren: PictogramNode[] = [
  { id: "health-bodyparts", label: "Body Parts", arasaacKeyword: "body", children: bodyParts },
  { id: "health-symptoms", label: "Symptoms", arasaacKeyword: "sick", children: symptoms },
  { id: "health-pain", label: "Pain Types", arasaacKeyword: "pain", children: painTypes },
  { id: "health-injuries", label: "Injuries", arasaacKeyword: "wound", children: injuries },
  { id: "health-needs", label: "Medical Needs", arasaacKeyword: "hospital", children: medicalNeeds },
  { id: "health-hospital", label: "Hospital", arasaacKeyword: "hospital", children: hospitalChildren },
  { id: "health-clinic", label: "Clinic", arasaacKeyword: "clinic", children: hospitalChildren },
  { id: "health-pharmacy", label: "Pharmacy", arasaacKeyword: "pharmacy", children: pharmacyChildren },
  { id: "health-dentist", label: "Dentist", arasaacKeyword: "dentist", children: dentistChildren },
  { id: "health-mental", label: "Mental Health", arasaacKeyword: "psychologist", children: mentalHealthChildren },
];

// ─── Food & Drink ─────────────────────────────────────────────────────────────

const foodTypes: PictogramNode[] = [
  leaf("food-fruit", "Fruit", "fruit"),
  leaf("food-vegetables", "Vegetables", "vegetables"),
  leaf("food-meat", "Meat", "meat"),
  leaf("food-bread", "Bread / Rice", "bread"),
  leaf("food-snacks", "Snacks", "snack"),
];

const drinks: PictogramNode[] = [
  leaf("drink-water", "Water", "water"),
  leaf("drink-juice", "Juice", "juice"),
  leaf("drink-tea", "Tea", "tea"),
  leaf("drink-coffee", "Coffee", "coffee"),
  leaf("drink-milk", "Milk", "milk"),
];

const foodNeeds: PictogramNode[] = [
  leaf("fneed-hungry", "I am hungry", "hungry"),
  leaf("fneed-thirsty", "I am thirsty", "thirsty"),
  leaf("fneed-allergy", "Food allergy", "allergy"),
  leaf("fneed-nopork", "No pork", "forbidden"),
];

const foodChildren: PictogramNode[] = [
  { id: "food-types", label: "Food Types", arasaacKeyword: "food", children: foodTypes },
  { id: "food-drinks", label: "Drinks", arasaacKeyword: "drink", children: drinks },
  { id: "food-needs", label: "Food Needs", arasaacKeyword: "hungry", children: foodNeeds },
  leaf("food-eat", "Eat", "eat"),
  leaf("food-cook", "Cook", "cook"),
  leaf("food-restaurant", "Restaurant", "restaurant"),
];

// ─── Home & Living ────────────────────────────────────────────────────────────

const housingTypes: PictogramNode[] = [
  leaf("htype-apartment", "Apartment", "apartment"),
  leaf("htype-house", "House", "house"),
  leaf("htype-shelter", "Shelter", "shelter"),
  leaf("htype-room", "Room", "room"),
];

const utilities: PictogramNode[] = [
  leaf("util-electricity", "Electricity", "electricity"),
  leaf("util-water", "Water", "water"),
  leaf("util-heating", "Heating", "heating"),
  leaf("util-internet", "Internet", "internet"),
];

const homeProblems: PictogramNode[] = [
  leaf("hprob-noelec", "No electricity", "electricity"),
  leaf("hprob-nowater", "No water", "water"),
  leaf("hprob-leak", "Leak", "leak"),
  leaf("hprob-broken", "Broken appliance", "broken"),
  leaf("hprob-pest", "Pest problem", "insect"),
];

const housingChildren: PictogramNode[] = [
  { id: "home-types", label: "Housing", arasaacKeyword: "house", children: housingTypes },
  { id: "home-utils", label: "Utilities", arasaacKeyword: "electricity", children: utilities },
  { id: "home-problems", label: "Home Problems", arasaacKeyword: "repair", children: homeProblems },
  leaf("home-rent", "Rent", "rent"),
  leaf("home-key", "Key", "key"),
  leaf("home-clean", "Clean", "clean"),
];

// ─── Transportation ───────────────────────────────────────────────────────────

const transportTypes: PictogramNode[] = [
  leaf("ttype-bus", "Bus", "bus"),
  leaf("ttype-train", "Train", "train"),
  leaf("ttype-taxi", "Taxi", "taxi"),
  leaf("ttype-car", "Car", "car"),
  leaf("ttype-walking", "Walking", "walk"),
];

const directions: PictogramNode[] = [
  leaf("dir-where", "Where is this", "where"),
  leaf("dir-left", "Left", "left"),
  leaf("dir-right", "Right", "right"),
  leaf("dir-straight", "Straight", "straight"),
  leaf("dir-near", "Near", "near"),
  leaf("dir-far", "Far", "far"),
];

const transportProblems: PictogramNode[] = [
  leaf("tprob-late", "Late", "late"),
  leaf("tprob-missed", "Missed bus", "bus"),
  leaf("tprob-ride", "Need ride", "car"),
];

const transportChildren: PictogramNode[] = [
  { id: "trans-types", label: "Transport Types", arasaacKeyword: "transport", children: transportTypes },
  { id: "trans-dir", label: "Directions", arasaacKeyword: "map", children: directions },
  { id: "trans-problems", label: "Problems", arasaacKeyword: "problem", children: transportProblems },
  leaf("trans-ticket", "Ticket", "ticket"),
  leaf("trans-map", "Map", "map"),
];

// ─── Money & Shopping ─────────────────────────────────────────────────────────

const shoppingLocations: PictogramNode[] = [
  leaf("shop-grocery", "Grocery store", "supermarket"),
  leaf("shop-pharmacy", "Pharmacy", "pharmacy"),
  leaf("shop-clothing", "Clothing store", "clothes"),
];

const payment: PictogramNode[] = [
  leaf("pay-cash", "Cash", "money"),
  leaf("pay-card", "Card", "credit card"),
];

const price: PictogramNode[] = [
  leaf("price-howmuch", "How much", "how much"),
  leaf("price-expensive", "Too expensive", "expensive"),
  leaf("price-cheap", "Cheap", "cheap"),
];

const shoppingChildren: PictogramNode[] = [
  { id: "shop-locations", label: "Shops", arasaacKeyword: "supermarket", children: shoppingLocations },
  { id: "shop-payment", label: "Payment", arasaacKeyword: "money", children: payment },
  { id: "shop-price", label: "Price", arasaacKeyword: "expensive", children: price },
  leaf("shop-money", "Money", "money"),
  leaf("shop-job", "Job", "job"),
  leaf("shop-document", "Document", "document"),
];

// ─── People & Communication ──────────────────────────────────────────────────

const familyMembers: PictogramNode[] = [
  leaf("fam-mother", "Mother", "mother"),
  leaf("fam-father", "Father", "father"),
  leaf("fam-child", "Child", "child"),
  leaf("fam-baby", "Baby", "baby"),
];

const helpPhrases: PictogramNode[] = [
  leaf("help-need", "I need help", "help"),
  leaf("help-me", "Help me", "help"),
  leaf("help-canyou", "Can you help", "help"),
];

const basicComm: PictogramNode[] = [
  leaf("comm-thanks", "Thank you", "thank you"),
  leaf("comm-sorry", "Sorry", "sorry"),
  leaf("comm-please", "Please", "please"),
  leaf("comm-nounderstand", "I don't understand", "not understand"),
  leaf("comm-repeat", "Repeat please", "repeat"),
];

const familyChildren: PictogramNode[] = [
  { id: "people-family", label: "Family", arasaacKeyword: "family", children: familyMembers },
  { id: "people-help", label: "Help", arasaacKeyword: "help", children: helpPhrases },
  { id: "people-comm", label: "Communication", arasaacKeyword: "talk", children: basicComm },
  leaf("people-together", "Together", "together"),
];

// ─── Safety & Emergency ──────────────────────────────────────────────────────

const dangerTypes: PictogramNode[] = [
  leaf("danger-fire", "Fire", "fire"),
  leaf("danger-crime", "Crime", "crime"),
  leaf("danger-hurt", "Someone hurt", "wound"),
  leaf("danger-indanger", "I am in danger", "danger"),
];

const emergencyServices: PictogramNode[] = [
  leaf("eserv-police", "Police", "police"),
  leaf("eserv-ambulance", "Ambulance", "ambulance"),
  leaf("eserv-hospital", "Hospital", "hospital"),
];

const emergencyChildren: PictogramNode[] = [
  { id: "emer-danger", label: "Danger", arasaacKeyword: "danger", children: dangerTypes },
  { id: "emer-services", label: "Emergency Services", arasaacKeyword: "emergency", children: emergencyServices },
  leaf("emer-lost", "Lost", "lost"),
  leaf("emer-phone", "Phone", "telephone"),
];

// ─── Root tree ────────────────────────────────────────────────────────────────

export const pictogramTree: PictogramNode[] = [
  { id: "cat-health", label: "Health", arasaacKeyword: "health", children: healthChildren },
  { id: "cat-food", label: "Food", arasaacKeyword: "food", children: foodChildren },
  { id: "cat-home", label: "Home", arasaacKeyword: "house", children: housingChildren },
  { id: "cat-transport", label: "Transport", arasaacKeyword: "transport", children: transportChildren },
  { id: "cat-shopping", label: "Shopping", arasaacKeyword: "supermarket", children: shoppingChildren },
  { id: "cat-people", label: "People", arasaacKeyword: "family", children: familyChildren },
  { id: "cat-emergency", label: "Emergency", arasaacKeyword: "emergency", children: emergencyChildren },
];
