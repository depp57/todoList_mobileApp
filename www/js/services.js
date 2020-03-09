/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

function deleteTask(task) {
  ons.notification.confirm('Etes vous sûr de supprimer la tâche <i>"' + task.innerText + '"</i> ?', {title : 'Supprimer'})
      .then((e) => {
        if (e) {
          $(task).parentsUntil("div").remove();
          ons.notification.toast('Tâche supprimée !', {timeout : 2000, modifier:'success'});
        }
      });
}

function toggleTask(task) {
  let item = $(task).parentsUntil('div');
  let checkBox = item.find('input');
  checkBox.prop('checked', !checkBox.prop('checked'));
}

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.
    create: function (data) {
      // Task item template.
      let taskItem = ons.createElement(
        //'<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
        '<div><ons-list-item tappable category="' + data.category + '">' +
        '<label class="left">' +
        '<ons-checkbox></ons-checkbox>' +
        '</label>' +
        '<div class="center">' +
        data.title +
        '</div>' +
        '<div class="right">' +
        '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
        '</div>' +
        '</ons-list-item></div>'
      );

      //Ajout du drag pour supprimer la tâche ou la valider
      taskItem.addEventListener('swiperight', (e) => deleteTask(e.target));
      taskItem.addEventListener('swipeleft', (e) => toggleTask(e.target));

      // Store data within the element.
      taskItem.data = data;

      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      let pendingList = document.querySelector('#pending-list');
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
    },

  },

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: [
    {
      title: 'Download OnsenUI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Install Monaca CLI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Star Onsen UI repo on Github',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Register in the community forum',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Send donations to Fran and Andreas',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Profit',
      category: '',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Visit Japan',
      category: 'Travels',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Enjoy an Onsen with Onsen UI team',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'TEST1',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'TEST2',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'TEST3',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'TEST4',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    }
  ]
};
