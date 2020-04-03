let storage = window.localStorage;

function addInStorage(object) {
    storage.setItem(object.title, JSON.stringify(object));
}

function removeInStorage(object) {
    let title = object.innerText;
    //Supprime le sablier de la deadline du titre
    title = title.split('⌛')[0];

    storage.removeItem(title);
}

function update(task) {
    storage.setItem(task.title, JSON.stringify(task));
}

function getAllTasks() {
    let tasks = [];
    forEachKey(task => tasks.push(JSON.parse(task)));
    return tasks;
}

function forEachKey(callback) {
    for (let i = 0; i < storage.length; i++)
        callback(storage.getItem(storage.key(i)));
}

function isNewSession() {
    if (storage.getItem('newSession') === null) {
        storage.setItem('newSession', 'false');
        return true;
    }
    return false;
}

document.addEventListener('deviceready', function() {
    window.sqlitePlugin.echoTest(function() {
        alert("Good");
    });
});