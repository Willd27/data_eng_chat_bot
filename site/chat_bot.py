from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

user_responses = {}

app = Flask(__name__)

questions = {
    'country': 'What country are you from ? [China, France, Germany, Iran, Spain, UAE, Republic of Korean, Other, Other-EUR]',
    'contact': 'Have you been in contact with someone who has covid? [Yes, No, Dont-Know]',
    'gender': 'What is your gender ? [Female, Male, Transgender]',
    'age': 'What is your age ?',
    'None_Experiencing' : 'Have you ever had covid? [Yes, No]',
    'Diarrhea' : 'Do you have Diarrhea? [Yes, No]',
    'Runny-Nose' : 'Do you have a Runny-Nose? [Yes, No]',
    'Nasal-Congestion' : 'Do you have Nasal-Congestion? [Yes, No]',
    'Pains' : 'Do you have Pains? [Yes, No]',
    'None_Sympton' : 'Do you have any symptoms? [Yes, No]',
    'Sore-Throat' : 'Do you have a Sore-Throat? [Yes, No]',
    'Difficulty-in-Breathing': 'Do you have Difficulty-in-Breathing? [Yes, No]',
    'Dry-Cough' : 'Do you have a Dry-Cough? [Yes, No]',
    'Tiredness' : 'Do you have Tiredness? [Yes, No]',
    'Fever' : 'Do you have a Fever? [Yes, No]',
} # type: ignore
curr_question = 0




data = pd.read_csv('./Cleaned-Data.csv')
columns = ['Fever', 'Tiredness', 'Dry-Cough', 'Difficulty-in-Breathing', 'Sore-Throat', 'None_Sympton',
           'Pains', 'Nasal-Congestion', 'Runny-Nose', 'Diarrhea', 'None_Experiencing', 'Age_0-9', 'Age_10-19',
           'Age_20-24', 'Age_25-59', 'Age_60+', 'Gender_Female', 'Gender_Male', 'Gender_Transgender', 
           'Contact_Dont-Know', 'Contact_No', 'Contact_Yes', "Country"]

X = data[columns]
y = data['Severity_Severe']

# Encoder les variables catégorielles (genre, gravité, etc.)
X = pd.get_dummies(X,dtype=int)


# Fractionner les données en ensembles d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# Construire le modèle d'arbre de décision
clf = DecisionTreeClassifier(random_state=42, criterion="entropy")
clf.fit(X_train, y_train)

def transform_features(features):
    countries = ['China', 'France', 'Germany', 'Iran', 'Italy', 'Republic of Korean', 'Spain', 'UAE', 'Other', 'Other-EUR']
    countries_features = {'Country_' + country: 1 if features['country'] == country else 0 for country in countries}
    genders = ['Female', 'Male', 'Transgender']
    genders_features = {'Gender_' + gender: 1 if features['gender'] == gender else 0 for gender in genders}
    age = int(features['age'])
    age_ranges = {
        'Age_0-9': 1 if age <= 9 else 0,
        'Age_10-19': 1 if 9 < age <= 19 else 0,
        'Age_20-24': 1 if 19 < age <= 24 else 0,
        'Age_25-59': 1 if 24 < age <= 59 else 0,
        'Age_60+': 1 if age > 59 else 0
    }
    contacts = ["No", "Yes", "Dont-Know"]
    contact_features = {'Contact_' + contact: 1 if features['contact'] == contact else 0 for contact in contacts}
    features.pop('country')
    features.pop('gender')
    features.pop('age')
    features.pop('contact')
    
    features = {key: 1 if value == 'Yes' else 0 for key, value in features.items()}

    features = {**features, **countries_features, **genders_features, **age_ranges, **contact_features}  
    print(features)  
    #return pd.DataFrame([features])



# Example prediction function
def predict_severity(features):
    return clf.predict(pd.DataFrame([features]))[0]

@app.route("/")
def index():
    return render_template("index.html")


@app.route('/get_user_responses', methods=['GET'])
def get_user_responses():
    return jsonify(user_responses)


@app.route("/get_response", methods=["POST"])
def get_response():
    user_message = request.json["message"]
    # Implement your chatbot logic here
    # For now, let's just echo the user message
    bot_response = "You said: " + user_message


    return jsonify({"response": bot_response})


@app.route("/get_question", methods=["POST"])
def get_question():
    global curr_question
    global user_responses
    user_response = request.json["response"]
    column = list(questions.keys())[curr_question - 1]  
    user_responses[column] = user_response
    if curr_question < len(questions):
        question = list(questions.values())[curr_question]  
        curr_question += 1  
        bot_response = {"question": question}  
    else:
        bot_response = {"end": "Thank you for answering all questions."}
        features = transform_features(user_responses)
        severity = predict_severity(features)
        print({"severity": severity})
          
    return jsonify(bot_response)

@app.route("/reset_chat_session", methods=["GET"])
def reset_chat_session():
    global curr_question
    global user_responses
    curr_question = 0  # Reset the current question index
    user_responses = {}  # Reset answers array
    return jsonify({"message": "Chat session reset successfully."})



