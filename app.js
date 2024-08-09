// Wait for the DOM to be fully loaded before executing any code
$(document).ready(function() {
  // Define the URL for the API endpoint that manages tasks
  const apiUrl = 'http://localhost:3000/tasks';

  // Function to fetch tasks from the API and display them
  function fetchTasks() {
      // Make a GET request to the API to retrieve tasks
      $.get(apiUrl, function(tasks) {
          // Clear any existing tasks in the task list
          $('#task-list').empty();
          // Iterate over each task returned by the API
          tasks.forEach(task => {
              // Append each task as a list item to the task list
              $('#task-list').append(`
                  <li class="list-group-item">
                    <div>
                      <h5>${task.title}</h5>
                      <p>${task.description}</p>
                    </div>
                    <div>
                      <!-- Edit button with data-id attribute for identifying the task -->
                      <button class="btn btn-warning btn-sm edit-task" data-id="${task.id}">Edit</button>
                      <!-- Delete button with data-id attribute for identifying the task -->
                      <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                    </div>
                  </li>
              `);
          });
      });
  }

  // Event handler for form submission
  $('#task-form').submit(function(event) {
      // Prevent the default form submission action
      event.preventDefault();

      // Retrieve values from the form fields
      const id = $('#task-id').val();
      const title = $('#task-title').val();
      const description = $('#task-description').val();
      
      // Create a task object with the form data
      const task = { title, description };

      if (id) {
          // If an ID exists, update the existing task
          $.ajax({
              url: `${apiUrl}/${id}`, // Endpoint for updating a specific task
              method: 'PUT', // HTTP method for updating data
              contentType: 'application/json', // Data type sent to the server
              data: JSON.stringify(task), // Convert task object to JSON string
              success: function() {
                  // Clear the form and reset the input fields
                  $('#task-id').val('');
                  $('#task-form')[0].reset();
                  // Fetch the updated list of tasks
                  fetchTasks();
              }
          });
      } else {
          // If no ID, create a new task
          $.ajax({
              url: apiUrl, // Endpoint for creating a new task
              method: 'POST', // HTTP method for creating new data
              contentType: 'application/json', // Data type sent to the server
              data: JSON.stringify(task), // Convert task object to JSON string
              success: function() {
                  // Reset the form fields
                  $('#task-form')[0].reset();
                  // Fetch the updated list of tasks
                  fetchTasks();
              }
          });
      }
  });

  // Event handler for deleting a task
  $('#task-list').on('click', '.delete-task', function() {
      // Get the task ID from the button's data-id attribute
      const id = $(this).data('id');
      // Make a DELETE request to remove the task
      $.ajax({
          url: `${apiUrl}/${id}`, // Endpoint for deleting a specific task
          method: 'DELETE', // HTTP method for deleting data
          success: function() {
              // Fetch the updated list of tasks after deletion
              fetchTasks();
          }
      });
  });

  // Event handler for editing a task
  $('#task-list').on('click', '.edit-task', function() {
      // Get the task ID from the button's data-id attribute
      const id = $(this).data('id');
      // Make a GET request to retrieve the task details
      $.get(`${apiUrl}/${id}`, function(task) {
          // Populate the form fields with the task details for editing
          $('#task-id').val(task.id);
          $('#task-title').val(task.title);
          $('#task-description').val(task.description);
      });
  });

  // Initial fetch of tasks when the page loads
  fetchTasks();
});