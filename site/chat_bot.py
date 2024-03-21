from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

questions = {"name": "What is your name?", "age": "How old are you?"}
curr_question = 0




@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get-response", methods=["POST"])
def get_response():
    user_message = request.json["message"]
    # Implement your chatbot logic here
    # For now, let's just echo the user message
    bot_response = "You said: " + user_message


    return jsonify({"response": bot_response})


@app.route("/get-question", methods=["POST"])
def get_question():
    question = questions.items()[curr_question]
    return jsonify({"question": question, "column": column})


def ask_question(question, column):
    return jsonify({"next_question": question, "column": column})


def handle_response(response, accepted_responses, column):
    while response not in accepted_responses:
        response = input("Sorry, I didn't understand that. Please try again: ")


if __name__ == "__main__":
    app.run(debug=True)
