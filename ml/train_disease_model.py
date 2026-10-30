import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import classification_report, accuracy_score

def train():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, 'dataset.csv')
    
    df = pd.read_csv(dataset_path)
    print(f"Loaded dataset with {len(df)} records across {df['disease'].nunique()} target diseases.")
    
    cat_cols = ['species', 'sex', 'state']
    sym_cols = [col for col in df.columns if col.startswith('symptom_')]
    
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    encoded_cat = encoder.fit_transform(df[cat_cols])
    encoded_cat_df = pd.DataFrame(encoded_cat, columns=encoder.get_feature_names_out(cat_cols))
    
    X = pd.concat([encoded_cat_df, df[['age_months']].reset_index(drop=True), df[sym_cols].reset_index(drop=True)], axis=1)
    y = df['disease']
    
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf.fit(X, y)
    
    # Accuracy score
    preds = rf.predict(X)
    acc = accuracy_score(y, preds)
    print(f"Model Training Accuracy: {acc * 100:.2f}%")
    print(classification_report(y, preds))
    
    model_path = os.path.join(current_dir, 'disease_model.joblib')
    encoder_path = os.path.join(current_dir, 'feature_encoder.joblib')
    
    metadata = {
        'cat_cols': cat_cols,
        'sym_cols': sym_cols,
        'feature_names': list(X.columns),
        'classes': list(rf.classes_)
    }
    
    joblib.dump(rf, model_path)
    joblib.dump((encoder, metadata), encoder_path)
    print(f"Successfully saved trained model to: {model_path}")

if __name__ == '__main__':
    train()
