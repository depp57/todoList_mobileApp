let storage = window.localStorage;

function addInStorage(object) {
    storage.setItem(object.title, JSON.stringify(object));
}

function removeInStorage(object) {
    let title = object.innerText;
    storage.removeItem(title);
}

function update(task) {
    storage.setItem(task.title, JSON.stringify(task));
}

function getAllTasks() {
    let tasks = [];
    console.log(storage)
    forEachKey(task => tasks.push(JSON.parse(task)));
    return tasks;
}

function forEachKey(callback) {
    for (let i = 0; i < storage.length; i++)
        callback(storage.getItem(storage.key(i)));
}