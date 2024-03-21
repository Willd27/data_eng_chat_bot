from flask import Flask, render_template, request, jsonify

user_responses = []

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
    user_responses.append({column: user_response})
    if curr_question < len(questions):
        question = list(questions.values())[curr_question]  
        curr_question += 1  
        bot_response = {"question": question}  
    else:
        bot_response = {"end": "Thank you for answering all questions."}  
    return jsonify(bot_response)

@app.route("/reset_chat_session", methods=["GET"])
def reset_chat_session():
    global curr_question
    global user_responses
    curr_question = 0  # Reset the current question index
    user_responses = []  # Reset answers array
    return jsonify({"message": "Chat session reset successfully."})



