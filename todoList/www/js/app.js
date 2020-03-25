// App logic.

window.myApp = {};

var created = false;

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  $('#completed-list').ready(createTasks);
  $('#progress-list').ready(createTasks);
  $('#pending-list').ready(createTasks);

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.

  function createTasks() {
    if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
      if (document.querySelector('#menuPage')
          && document.querySelector('#pendingTasksPage')
          && !document.querySelector('#pendingTasksPage ons-list-item')
          && document.querySelector('#progress-list')
          && document.querySelector('#completed-list')
          && !created
      ) {
        //myApp.services.fixtures.forEach(function(data) {
        //myApp.services.tasks.create(data);
        //});

        // AJOUTE TOUTES LES TACHES DU LOCALSTORAGE
        created = true;
        getAllTasks().forEach(data => myApp.services.tasks.create(data));
      }
    }
  }

});
