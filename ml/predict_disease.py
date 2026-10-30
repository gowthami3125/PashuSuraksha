import sys
import json
import os
import joblib
import pandas as pd
import numpy as np

def predict(input_json):
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, 'disease_model.joblib')
        encoder_path = os.path.join(current_dir, 'feature_encoder.joblib')
        
        if not os.path.exists(model_path) or not os.path.exists(encoder_path):
            return {"success": False, "error": "Model files not found. Train model first."}
            
        rf = joblib.load(model_path)
        encoder, metadata = joblib.load(encoder_path)
        
        data = json.loads(input_json) if isinstance(input_json, str) else input_json
        
        species = data.get('species', 'cow')
        age = float(data.get('age_months', 36))
        sex = data.get('sex', 'F')
        state = data.get('state', 'Andhra Pradesh')
        symptoms = data.get('symptoms', [])
        
        # Out of Distribution / Insufficient inputs check
        if not symptoms or len(symptoms) == 0:
            return {
                "success": False,
                "is_out_of_distribution": True,
                "warning": "Insufficient clinical inputs. Please select or describe at least one observed symptom for ML prediction.",
                "fallback_recommended": True
            }
            
        cat_df = pd.DataFrame([{ 'species': species, 'sex': sex, 'state': state }])
        encoded_cat = encoder.transform(cat_df)
        encoded_cat_df = pd.DataFrame(encoded_cat, columns=encoder.get_feature_names_out(metadata['cat_cols']))
        
        sym_dict = {}
        for sym_col in metadata['sym_cols']:
            sym_id = sym_col.replace('symptom_', '')
            sym_dict[sym_col] = 1 if sym_id in symptoms else 0
            
        sym_df = pd.DataFrame([sym_dict])
        age_df = pd.DataFrame([{ 'age_months': age }])
        
        X_sample = pd.concat([encoded_cat_df, age_df, sym_df], axis=1)
        
        # Ensure column alignment
        for col in metadata['feature_names']:
            if col not in X_sample.columns:
                X_sample[col] = 0
        X_sample = X_sample[metadata['feature_names']]
        
        probs = rf.predict_proba(X_sample)[0]
        classes = rf.classes_
        
        prob_pairs = list(zip(classes, probs))
        prob_pairs.sort(key=lambda x: x[1], reverse=True)
        
        top_preds = []
        for cls, prob in prob_pairs[:3]:
            if prob > 0.05:
                top_preds.append({
                    "disease": cls,
                    "probability": round(float(prob), 4),
                    "confidence_pct": f"{int(prob * 100)}%",
                    "risk_level": "CRITICAL HIGH" if prob > 0.6 else "HIGH" if prob > 0.3 else "MODERATE"
                })
                
        uncertainty = round(float(1.0 - prob_pairs[0][1]), 4)
        is_ood = prob_pairs[0][1] < 0.25
        
        return {
            "success": True,
            "is_out_of_distribution": is_ood,
            "uncertainty_score": uncertainty,
            "top_predictions": top_preds,
            "primary_prediction": top_preds[0] if top_preds else None,
            "safety_fallback_active": is_ood
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == '__main__':
    if len(sys.argv) > 1:
        inp = sys.argv[1]
        res = predict(inp)
        print(json.dumps(res))
