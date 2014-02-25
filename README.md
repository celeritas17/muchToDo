#muchToDo
A Backbone.js ToDo app with a RESTful Flask backend
###Getting Started
1.  Install [Flask](http://flask.pocoo.org/) (perhaps in a virtual environment), if you haven't already.

2.  Clone the repository.

3.  Start the Flask app:

         python much_todo.py


4.  Point you browser to localhost:5000
    
###What is it?
The app uses the Backbone.js front-end framework to create an interactive "ToDo" list. The Backbone app relies on the RESTful API defined in much_todo.py to load and save "todos". 

The Flask app defines an API that supports each of the HTTP methods (GET, POST, PUT, DELETE) that a RESTful API should implement. It uses a list of python dicts (in place of a database) to store the "todos". The choice of a data structure over a database is meant to simplify setup and to maintain a focus on the design of the API and the front-end functionality. 
