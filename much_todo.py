from flask import Flask, abort, jsonify, request, render_template
app = Flask(__name__)

todos = []

todo_count = len(todos)

def bad_request(request):
	return ((not request.json) or 
		('todo' in request.json and type(request.json['todo']) is not unicode))

@app.route('/muchtodo/todos', methods=['GET'])
def get_todos():
	return jsonify({'todos': todos})

@app.route('/muchtodo/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
	todo = [todo for todo in todos if todo['id'] == todo_id]
	if len(todo) == 0:
		abort(404)
	return jsonify(todo[0])

@app.route('/muchtodo/todos', methods=['POST'])
def add_todo():
	if bad_request(request) or not request.json['todo']:
		abort(400)
	global todo_count
	todo_count += 1
	todo = {
		'id': todo_count, 
		'todo': request.json['todo'],
		'complete': False
	}
	todos.append(todo)
	return jsonify(todo), 201

@app.route('/muchtodo/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
	if bad_request(request):
		abort(400)
	todo = [todo for todo in todos if todo['id'] == todo_id]
	if len(todo) == 0:
		abort(404)

	todo = todo[0]
	if 'todo' in request.json:
		todo['todo'] = request.json['todo']
	if 'complete' in request.json:
		todo['complete'] = request.json['complete']
	return jsonify(todo)

@app.route('/muchtodo/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
	todo = [todo for todo in todos if todo['id'] == todo_id]
	if len(todo) == 0:
		abort(404)
	todos.remove(todo[0])
	return jsonify({'removed': True})

@app.route('/', methods=['GET'])
def much_todo():
	return render_template('much_todo.html')

if __name__ == '__main__':
	app.run(debug=True)