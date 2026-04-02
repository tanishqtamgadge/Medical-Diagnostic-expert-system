from dataclasses import dataclass


@dataclass(frozen=True)
class DiseaseProfile:
    name: str
    category: str
    symptoms: list[str]
    recommendation: str


DISEASE_PROFILES = [
    DiseaseProfile(
        name="Flu",
        category="Viral Infection",
        symptoms=["fever", "cough", "sore throat", "body ache", "fatigue", "chills", "headache"],
        recommendation="Rest, fluids, and medical review if symptoms worsen or fever remains high.",
    ),
    DiseaseProfile(
        name="Common Cold",
        category="Viral Infection",
        symptoms=["sneezing", "runny nose", "cough", "sore throat", "watery eyes", "fatigue"],
        recommendation="Hydration, rest, and monitoring are usually appropriate for mild symptoms.",
    ),
    DiseaseProfile(
        name="COVID-19",
        category="Respiratory",
        symptoms=["fever", "cough", "fatigue", "loss of taste", "shortness of breath", "headache", "sore throat"],
        recommendation="Monitor breathing closely and seek medical care if shortness of breath increases.",
    ),
    DiseaseProfile(
        name="Typhoid",
        category="Bacterial Infection",
        symptoms=["fever", "stomach pain", "weakness", "headache", "vomiting", "loss of appetite", "diarrhea"],
        recommendation="Seek medical evaluation because treatment may require antibiotics and testing.",
    ),
    DiseaseProfile(
        name="Malaria",
        category="Parasitic Infection",
        symptoms=["fever", "chills", "sweating", "headache", "nausea", "vomiting", "dizziness"],
        recommendation="Prompt evaluation is important, especially with recurring fever, vomiting, or weakness.",
    ),
    DiseaseProfile(
        name="Allergies",
        category="Immune Response",
        symptoms=["sneezing", "runny nose", "itchy eyes", "watery eyes", "rash", "skin irritation"],
        recommendation="Track triggers and consult a clinician if symptoms are frequent or difficult to control.",
    ),
    DiseaseProfile(
        name="Strep Throat",
        category="Bacterial Infection",
        symptoms=["sore throat", "fever", "swollen tonsils", "headache", "fatigue", "ear pain"],
        recommendation="A clinician can confirm this and decide whether antibiotics are needed.",
    ),
]

SEVERITY_WEIGHTS = {"low": 1.0, "medium": 1.5, "high": 2.0}

SYMPTOM_WEIGHTS = {
    "fever": 3,
    "cough": 3,
    "sore throat": 2,
    "body ache": 2,
    "fatigue": 1,
    "chills": 2,
    "headache": 2,
    "sneezing": 2,
    "runny nose": 2,
    "watery eyes": 1,
    "loss of taste": 3,
    "shortness of breath": 4,
    "stomach pain": 2,
    "weakness": 1,
    "vomiting": 2,
    "loss of appetite": 1,
    "diarrhea": 2,
    "sweating": 2,
    "nausea": 2,
    "dizziness": 2,
    "itchy eyes": 1,
    "rash": 1,
    "skin irritation": 1,
    "swollen tonsils": 2,
    "ear pain": 2,
    "chest pain": 4,
}

RED_FLAG_SYMPTOMS = {"shortness of breath", "chest pain", "vomiting", "dizziness"}
ALL_SYMPTOMS = sorted({symptom for profile in DISEASE_PROFILES for symptom in profile.symptoms} | RED_FLAG_SYMPTOMS)

