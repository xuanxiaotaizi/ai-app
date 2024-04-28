import json
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

DASHSCOPE_API_KEY = "sk-dc0cbfe73e334e3588ffbcad8cc7e85e" ###申请的App-key
DASHSCOPE_API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

def parse_and_validate_input(input_string):
    try:
        data = json.loads(input_string)
        if not data or 'input' not in data or 'messages' not in data['input']:
            return False, {"error": "Invalid input data. 'input' and 'input.messages' fields are required."}, 400
        return True, data, None
    except json.JSONDecodeError:
        return False, {"error": "Invalid input. Please provide a valid JSON string."}, 400

@app.route('/api/chat', methods=['POST'])
def chat():
    input_string = request.data.decode('utf-8')  # Assuming the input is sent in the body as raw text

    is_valid, parsed_data, error_code = parse_and_validate_input(input_string)
    if not is_valid:
        return jsonify(parsed_data), error_code

    headers = {
        'Authorization': f'Bearer {DASHSCOPE_API_KEY}',
        'Content-Type': 'application/json'
    }

    payload = {
        "model": "qwen-turbo",
        "input": parsed_data['input'],
        "parameters": {
            "result_format": "message"
        }
    }

    try:
        response = requests.post(DASHSCOPE_API_URL, headers=headers, json=payload)
        response.raise_for_status()
    except requests.exceptions.HTTPError as errh:
        return jsonify({"error": f"HTTP Error: {errh}"}), response.status_code
    except requests.exceptions.ConnectionError as errc:
        return jsonify({"error": f"Error Connecting: {errc}"}), 500
    except requests.exceptions.Timeout as errt:
        return jsonify({"error": f"Timeout Error: {errt}"}), 504
    except requests.exceptions.RequestException as err:
        return jsonify({"error": f"Something went wrong: {err}"}), 500

    response_data = response.json()

    return jsonify({"status": "success", "response": response_data}), 200

if __name__ == '__main__':
    app.run(debug=True)
