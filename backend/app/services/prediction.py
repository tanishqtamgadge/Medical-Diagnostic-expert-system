from functools import lru_cache

from sklearn.tree import DecisionTreeClassifier

from ..schemas import PredictionResult, SymptomInput
from .knowledge_base import ALL_SYMPTOMS, DISEASE_PROFILES, RED_FLAG_SYMPTOMS, SEVERITY_WEIGHTS, SYMPTOM_WEIGHTS


def vectorize_symptoms(symptoms: list[SymptomInput]) -> list[float]:
    symptom_map = {symptom.name.lower(): symptom.severity for symptom in symptoms}
    vector: list[float] = []
    for symptom in ALL_SYMPTOMS:
        severity = symptom_map.get(symptom)
        vector.append(0.0 if severity is None else SEVERITY_WEIGHTS[severity])
    return vector


@lru_cache(maxsize=1)
def train_model() -> tuple[DecisionTreeClassifier, list[str]]:
    training_x: list[list[float]] = []
    training_y: list[str] = []

    for profile in DISEASE_PROFILES:
        for score in (1.0, 1.5, 2.0):
            vector = [score if symptom in profile.symptoms else 0.0 for symptom in ALL_SYMPTOMS]
            training_x.append(vector)
            training_y.append(profile.name)

    model = DecisionTreeClassifier(max_depth=5, random_state=42)
    model.fit(training_x, training_y)
    return model, list(model.classes_)


def predict(symptoms: list[SymptomInput]) -> tuple[list[PredictionResult], list[str]]:
    symptom_names = {symptom.name.lower() for symptom in symptoms}
    symptom_vector = vectorize_symptoms(symptoms)
    model, classes = train_model()
    probabilities = model.predict_proba([symptom_vector])[0]
    ml_scores = dict(zip(classes, probabilities))

    predictions: list[PredictionResult] = []
    for profile in DISEASE_PROFILES:
        matches = sorted(symptom_names & set(profile.symptoms))
        if not matches:
            continue

        matched_weight = sum(SYMPTOM_WEIGHTS.get(name, 1) for name in matches)
        total_weight = sum(SYMPTOM_WEIGHTS.get(name, 1) for name in profile.symptoms)
        rule_score = matched_weight / total_weight
        ml_score = ml_scores.get(profile.name, 0.0)
        probability = round(((rule_score * 0.6) + (ml_score * 0.4)) * 100, 2)

        predictions.append(
            PredictionResult(
                disease=profile.name,
                probability=probability,
                rule_score=round(rule_score * 100, 2),
                ml_score=round(ml_score * 100, 2),
                matched_symptoms=matches,
                recommendation=profile.recommendation,
                explanation=(
                    f"Matched {len(matches)} symptom(s) with the {profile.name} profile using "
                    "combined rule-based and decision-tree scoring."
                ),
            )
        )

    predictions.sort(key=lambda item: item.probability, reverse=True)
    red_flags = sorted(symptom_names & RED_FLAG_SYMPTOMS)
    return predictions, red_flags

