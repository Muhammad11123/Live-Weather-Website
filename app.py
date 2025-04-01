from flask import Flask, render_template

app = Flask(__name__)

# Route for the homepage
@app.route("/")
def home():
    return render_template("index.html")

# Run the server
if __name__ == "__main__":
    app.run(debug=True)
