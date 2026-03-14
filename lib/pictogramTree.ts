export type PictogramNode = {
  id: string;
  label: string;
  arasaacKeyword: string;
  children?: PictogramNode[];
};

const symptoms: PictogramNode[] = [
  { id: "symptom-pain", label: "Pain", arasaacKeyword: "pain" },
  { id: "symptom-fever", label: "Fever", arasaacKeyword: "fever" },
  { id: "symptom-swollen", label: "Swollen", arasaacKeyword: "swollen" },
  { id: "symptom-bleeding", label: "Bleeding", arasaacKeyword: "bleeding" },
  { id: "symptom-sick", label: "Sick", arasaacKeyword: "sick" },
];

const bodyParts: PictogramNode[] = [
  { id: "body-stomach", label: "Stomach", arasaacKeyword: "stomach", children: symptoms },
  { id: "body-head", label: "Head", arasaacKeyword: "head", children: symptoms },
  { id: "body-chest", label: "Chest", arasaacKeyword: "chest", children: symptoms },
  { id: "body-back", label: "Back", arasaacKeyword: "back pain", children: symptoms },
  { id: "body-leg", label: "Leg", arasaacKeyword: "leg", children: symptoms },
  { id: "body-throat", label: "Throat", arasaacKeyword: "throat", children: symptoms },
];

const emergencySymptoms: PictogramNode[] = [
  { id: "emg-breathe", label: "Can't breathe", arasaacKeyword: "breathe" },
  { id: "emg-bleeding", label: "Bleeding", arasaacKeyword: "bleeding" },
  { id: "emg-unconscious", label: "Unconscious", arasaacKeyword: "unconscious" },
  { id: "emg-broken", label: "Broken bone", arasaacKeyword: "fracture" },
  { id: "emg-chestpain", label: "Chest pain", arasaacKeyword: "chest pain" },
];

const appointmentReasons: PictogramNode[] = [
  { id: "apt-checkup", label: "Check-up", arasaacKeyword: "check up" },
  { id: "apt-results", label: "Test results", arasaacKeyword: "results" },
  { id: "apt-refill", label: "Medicine refill", arasaacKeyword: "medicine" },
  { id: "apt-first", label: "First visit", arasaacKeyword: "visit" },
];

const hospitalChildren: PictogramNode[] = [
  { id: "hosp-doctor", label: "Doctor", arasaacKeyword: "doctor", children: bodyParts },
  { id: "hosp-nurse", label: "Nurse", arasaacKeyword: "nurse", children: bodyParts },
  { id: "hosp-emergency", label: "Emergency", arasaacKeyword: "emergency", children: emergencySymptoms },
  { id: "hosp-appointment", label: "Appointment", arasaacKeyword: "appointment", children: appointmentReasons },
];

const pharmacyChildren: PictogramNode[] = [
  { id: "pharm-medicine", label: "Medicine", arasaacKeyword: "medicine" },
  { id: "pharm-prescription", label: "Prescription", arasaacKeyword: "prescription" },
  { id: "pharm-allergy", label: "Allergy", arasaacKeyword: "allergy" },
  { id: "pharm-painrelief", label: "Pain relief", arasaacKeyword: "painkiller" },
  { id: "pharm-ask", label: "Ask pharmacist", arasaacKeyword: "pharmacist" },
];

const dentistChildren: PictogramNode[] = [
  { id: "dent-pain", label: "Tooth pain", arasaacKeyword: "toothache" },
  { id: "dent-broken", label: "Broken tooth", arasaacKeyword: "broken tooth" },
  { id: "dent-cleaning", label: "Cleaning", arasaacKeyword: "dental cleaning" },
  { id: "dent-appointment", label: "Appointment", arasaacKeyword: "appointment" },
];

const mentalHealthChildren: PictogramNode[] = [
  { id: "mh-sad", label: "Sad", arasaacKeyword: "sad" },
  { id: "mh-anxious", label: "Anxious", arasaacKeyword: "anxious" },
  { id: "mh-sleep", label: "Can't sleep", arasaacKeyword: "insomnia" },
  { id: "mh-angry", label: "Angry", arasaacKeyword: "angry" },
  { id: "mh-lonely", label: "Lonely", arasaacKeyword: "lonely" },
];

const healthChildren: PictogramNode[] = [
  { id: "health-hospital", label: "Hospital", arasaacKeyword: "hospital", children: hospitalChildren },
  { id: "health-clinic", label: "Clinic", arasaacKeyword: "clinic", children: hospitalChildren },
  { id: "health-pharmacy", label: "Pharmacy", arasaacKeyword: "pharmacy", children: pharmacyChildren },
  { id: "health-dentist", label: "Dentist", arasaacKeyword: "dentist", children: dentistChildren },
  { id: "health-mental", label: "Mental Health", arasaacKeyword: "psychologist", children: mentalHealthChildren },
];

// Placeholder categories — each has 6 leaf tiles
const foodChildren: PictogramNode[] = [
  { id: "food-eat", label: "Eat", arasaacKeyword: "eat" },
  { id: "food-drink", label: "Drink", arasaacKeyword: "drink" },
  { id: "food-bread", label: "Bread", arasaacKeyword: "bread" },
  { id: "food-fruit", label: "Fruit", arasaacKeyword: "fruit" },
  { id: "food-cook", label: "Cook", arasaacKeyword: "cook" },
  { id: "food-restaurant", label: "Restaurant", arasaacKeyword: "restaurant" },
];

const housingChildren: PictogramNode[] = [
  { id: "house-home", label: "Home", arasaacKeyword: "house" },
  { id: "house-rent", label: "Rent", arasaacKeyword: "rent" },
  { id: "house-key", label: "Key", arasaacKeyword: "key" },
  { id: "house-fix", label: "Fix", arasaacKeyword: "repair" },
  { id: "house-clean", label: "Clean", arasaacKeyword: "clean" },
  { id: "house-neighbour", label: "Neighbour", arasaacKeyword: "neighbour" },
];

const transportChildren: PictogramNode[] = [
  { id: "trans-bus", label: "Bus", arasaacKeyword: "bus" },
  { id: "trans-walk", label: "Walk", arasaacKeyword: "walk" },
  { id: "trans-car", label: "Car", arasaacKeyword: "car" },
  { id: "trans-train", label: "Train", arasaacKeyword: "train" },
  { id: "trans-ticket", label: "Ticket", arasaacKeyword: "ticket" },
  { id: "trans-map", label: "Map", arasaacKeyword: "map" },
];

const workChildren: PictogramNode[] = [
  { id: "work-job", label: "Job", arasaacKeyword: "job" },
  { id: "work-money", label: "Money", arasaacKeyword: "money" },
  { id: "work-boss", label: "Boss", arasaacKeyword: "boss" },
  { id: "work-hours", label: "Hours", arasaacKeyword: "schedule" },
  { id: "work-learn", label: "Learn", arasaacKeyword: "learn" },
  { id: "work-document", label: "Document", arasaacKeyword: "document" },
];

const familyChildren: PictogramNode[] = [
  { id: "fam-mother", label: "Mother", arasaacKeyword: "mother" },
  { id: "fam-father", label: "Father", arasaacKeyword: "father" },
  { id: "fam-child", label: "Child", arasaacKeyword: "child" },
  { id: "fam-baby", label: "Baby", arasaacKeyword: "baby" },
  { id: "fam-help", label: "Help", arasaacKeyword: "help" },
  { id: "fam-together", label: "Together", arasaacKeyword: "together" },
];

const emergencyChildren: PictogramNode[] = [
  { id: "emer-police", label: "Police", arasaacKeyword: "police" },
  { id: "emer-fire", label: "Fire", arasaacKeyword: "fire" },
  { id: "emer-ambulance", label: "Ambulance", arasaacKeyword: "ambulance" },
  { id: "emer-lost", label: "Lost", arasaacKeyword: "lost" },
  { id: "emer-danger", label: "Danger", arasaacKeyword: "danger" },
  { id: "emer-phone", label: "Phone", arasaacKeyword: "telephone" },
];

export const pictogramTree: PictogramNode[] = [
  { id: "cat-health", label: "Health", arasaacKeyword: "health", children: healthChildren },
  { id: "cat-food", label: "Food", arasaacKeyword: "food", children: foodChildren },
  { id: "cat-housing", label: "Housing", arasaacKeyword: "house", children: housingChildren },
  { id: "cat-transport", label: "Transport", arasaacKeyword: "transport", children: transportChildren },
  { id: "cat-work", label: "Work", arasaacKeyword: "work", children: workChildren },
  { id: "cat-family", label: "Family", arasaacKeyword: "family", children: familyChildren },
  { id: "cat-emergency", label: "Emergency", arasaacKeyword: "emergency", children: emergencyChildren },
];
