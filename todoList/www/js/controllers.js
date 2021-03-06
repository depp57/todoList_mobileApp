/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////
  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };


    // Nuke all tasks
    page.querySelector('[component="button/remove-all-tasks"').onclick = function() {
      ons.notification.confirm(
          {
            title: 'Tout supprimer ?',
            message: 'Toutes les données seront supprimées.',
            buttonLabels: ['Annuler', 'Valider']
          }
      ).then((index) => {
        if (index === 1) myApp.services.tasks.removeAll();
      })
    };

    // Nuke all outdated tasks
    page.querySelector('[component="button/remove-all-outdated-tasks"').onclick = function() {
      ons.notification.confirm(
          {
            title: 'Supprimer toutes les tâches passées ?',
            message: 'Toutes les tâches passées seront supprimées.',
            buttonLabels: ['Annuler', 'Valider']
          }
      ).then((index) => {
        if (index === 1) myApp.services.tasks.removeAllPastTasks();
      })
    };


    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage("html/new_task.html");
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    // Change tabbar animation depending on platform.
    page.querySelector('#myTabbar').setAttribute('animation', ons.platform.isAndroid() ? 'slide' : 'none');

    //Ajout listener bouton tri
    $('[component="button/sort"]').click((e) => {
      ons.createElement('sortPopover.html', { append: true })
          .then(function(popover) {
            popover.show(e);
          });
    });
  },

  ////////////////////////
  // Menu Page Controller //
  ////////////////////////
  menuPage: function(page) {
    // Set functionality for 'No Category' and 'All' default categories respectively.
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));

    // Change splitter animation depending on platform.
    document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
  },

  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////
  newTaskPage: function(page) {
    // Set button functionality to save a new task.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function (element) {
      element.onclick = function () {
        var newTitle = page.querySelector('#title-input').value;

        if (newTitle) {
          let inputNewCateg = page.querySelector('#category-input').value;
          let categorie = inputNewCateg !== '' ? inputNewCateg : $('#categories-list').text();


          var newTask = {
            title: newTitle,
            category: categorie,
            description: page.querySelector('#description-input').value,
            highlight: page.querySelector('#highlight-input').checked,
            urgent: page.querySelector('#urgent-input').checked,
            status: 'pending',
            deadline: page.querySelector('#deadline-input').value,
            sortIndex: getNewSortIndex()
          };
          // If input title is not empty, create a new task.
          myApp.services.tasks.create(newTask);

          // Set selected category to 'All', refresh and pop page.
          document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          document.querySelector('#default-category-list ons-list-item').updateCategoryView();
          document.querySelector('#myNavigator').popPage();

        } else {
          // Show alert if the input title is empty.
          ons.notification.alert('Le titre ne peut pas être vide.');
        }
        addInStorage(newTask);
      };
    });

    //Ajoute les catégories à la liste des catégories dans la page de création de tâches
    this.addCategoriesInList();

    //Retire le placeholder de l'input date (jj/mm/aaaa)
    this.removeInputDatePlaceholder();
  },


  ////////////////////////////////
  // Details Task Page Controller //
  ///////////////////////////////
  detailsTaskPage: function(page) {
    // Get the element passed as argument to pushPage.
    var element = page.data.element;

    // Fill the view with the stored data.
    page.querySelector('#title-input').value = element.data.title;
    page.querySelector('#category-input').value = element.data.category;
    page.querySelector('#description-input').value = element.data.description;
    page.querySelector('#highlight-input').checked = element.data.highlight;
    page.querySelector('#urgent-input').checked = element.data.urgent;
    page.querySelector('#deadline-input').value = element.data.deadline;

    // Set button functionality to save an existing task.
    page.querySelector('[component="button/save-task"]').onclick = function() {
      var newTitle = page.querySelector('#title-input').value;

      if (newTitle) {
        // If input title is not empty, ask for confirmation before saving.
        ons.notification.confirm(
          {
            title: 'Sauvegarder',
            message: 'Les anciennes données seront supprimées.',
            buttonLabels: ['Annuler', 'Sauvegarder']
          }
        ).then(function(buttonIndex) {
          if (buttonIndex === 1) {

            // If 'Save' button was pressed, overwrite the task.
            myApp.services.tasks.update(element,
              {
                title: newTitle,
                category: page.querySelector('#category-input').value,
                description: page.querySelector('#description-input').value,
                urgent: element.data.urgent,
                highlight: page.querySelector('#highlight-input').checked,
                status: page.data.element.data.status,
                deadline: page.querySelector('#deadline-input').value
              }
            );

            // Set selected category to 'All', refresh and pop page.
            document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
            document.querySelector('#default-category-list ons-list-item').updateCategoryView();
            document.querySelector('#myNavigator').popPage();
          }
        });

      } else {
        // Show alert if the input title is empty.
        ons.notification.alert('Le titre ne peut pas être vide.');
      }
    };

    //Ajoute les catégories à la liste des catégories dans la page de création de tâches
    this.addCategoriesInList();

    //Retire le placeholder de l'input date (jj/mm/aaaa)
    this.removeInputDatePlaceholder();
  },

  removeInputDatePlaceholder: function () {
    let deadlineInput = $('#deadline-input').find('input');
    deadlineInput.focus(() => deadlineInput.prop('type', 'date'));
    deadlineInput.focusout(() => deadlineInput.prop('type', 'text'));
  },

  addCategoriesInList: function () {
    let categ = myApp.services.categories.categoriesExistantes;
    categ.forEach(categorieCourante => {
      let list = $('#categories-list');

      let option = $(`<option value=${categorieCourante}>`);
      option.text(categorieCourante);


      //Ajout du listener
      list.click(e => {
        let options = list.prop("options");
        let selectedOption = options[list.prop("selectedIndex")].value;
        $('#category-input').prop("value", selectedOption);
      });

      list.find('select').append(option);
    });
  }
};