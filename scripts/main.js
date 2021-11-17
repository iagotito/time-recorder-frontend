let API_URL = "http://localhost:8001";
let ACTIVITY_FIELDS = ["name", "description", "beginning", "end", "total"];

let $logBtn = document.querySelector("#log-btn");
$logBtn.addEventListener("click", logActivity);

let $logInput = document.querySelector("#log-input");

let $downloadBtn = document.querySelector("#download-btn");
$downloadBtn.addEventListener("click", downloadData);

let $activitiesTable = document.querySelector("#activities-table");

(function init() {
    loadStoredActivities();
})();

function loadStoredActivities() {
    fetch(API_URL + "/activities", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(res => { return res.json(); })
    .then(data => {
        activities = data.activities;
        activities.forEach(activity => appendToTable(activity));
    })
    .catch(err => { console.log(err); })
}

function logActivity() {
    let text = $logInput.value.split(" ");
    let name = text[0];
    let description = text.slice(1).join(" ");

    let activity = {
        "name": name,
        "description": description
    }

    fetch(API_URL + "/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity)
    })
    .then(res => { return res.json(); })
    .then(data => {
        if (data.new_activity !== null) {
            appendToTable(data.new_activity);
        }
        if (data.finished_activity !== null) {
            updateActivity(data.finished_activity);
        }
    })
    .catch(err => { console.log(err); })
}

function updateActivity(activity) {
    let $activityRow = document.getElementById(activity._id);

    $activityRow.childNodes.forEach(element => {
        let column = element.className.split(" ")[0];
        if (activity[column] !== undefined) {
            element.innerText = activity[column];
        }
    });
}

function appendToTable(activity) {
    let $tbody = $activitiesTable.getElementsByTagName("tbody")[0];
    let row = $tbody.insertRow(-1);
    row.id = activity._id;

    for (let i = 0; i < ACTIVITY_FIELDS.length; i++) {
        let cell = row.insertCell(i);
        cell.className = `${ACTIVITY_FIELDS[i]} text-area`

        let text;
        if (activity[ACTIVITY_FIELDS[i]] === null || activity[ACTIVITY_FIELDS[i]] === -1) {
            text = "";
        } else {
            text = activity[ACTIVITY_FIELDS[i]];
        }

        let cellText = document.createTextNode(text);
        cell.appendChild(cellText);
    }

    let cell = row.insertCell(-1);
    cell.className = "edit-cell";
    let editBtn = document.createElement("div");
    editBtn.className = "edit-btn";
    editBtn.title = "Edit row";
    editBtn.addEventListener("click", function () {
        editRow(activity._id);
    });
    cell.appendChild(editBtn);
}

function editRow(activity_id) {
    let $row = document.getElementById(activity_id);
    let textAreas = $row.getElementsByClassName("text-area");
    for (let element of textAreas) {
        element.contentEditable = true;
    };
    let rowBeforeEdit = $row.innerHTML;
    $row.deleteCell(-1);

    let confirmCell = $row.insertCell(-1);
    confirmCell.className = "confirm-edit-cell";
    let confirmEditBtn = document.createElement("div");
    confirmEditBtn.className = "confirm-edit-btn";
    confirmEditBtn.title = "Confirm";
    confirmEditBtn.addEventListener("click", function () {
        saveRowEdit(activity_id, $row);
    });
    confirmCell.appendChild(confirmEditBtn);

    let cancelCell = $row.insertCell(-1);
    cancelCell.className = "cancel-edit-cell";
    let cancelEditBtn = document.createElement("div");
    cancelEditBtn.className = "cancel-edit-btn";
    cancelEditBtn.title = "Cancel";
    cancelEditBtn.addEventListener("click", function () {
        $row.innerHTML = rowBeforeEdit;
        setEditBtnListener($row.id);
        for (let element of textAreas) {
            element.contentEditable = false;
        };
    });
    cancelCell.appendChild(cancelEditBtn);
}

function saveRowEdit(activity_id, $row) {
    let editedActivity = {}
    ACTIVITY_FIELDS.forEach(fieldName => {
        editedActivity[fieldName] = $row.getElementsByClassName(fieldName)[0].innerText;
    });
    fetch(API_URL + `/activity/${activity_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedActivity)
    })
    .then(res => { return res.json(); })
    .then(data => {
        ACTIVITY_FIELDS.forEach(fieldName => {
            $row.getElementsByClassName(fieldName)[0].innerText = data.updated_activity[fieldName];
        });
        $row.deleteCell(-1);
        $row.deleteCell(-1);
        let cell = $row.insertCell(-1);
        cell.className = "edit-cell";
        let editBtn = document.createElement("div");
        editBtn.className = "edit-btn";
        editBtn.addEventListener("click", function () {
            editRow(activity_id);
        });
        cell.appendChild(editBtn);

    })
    .catch(err => { console.log(err); })
}

function setEditBtnListener(rowId) {
    let $row = document.getElementById(rowId);
    let editBtn = $row.getElementsByClassName("edit-btn")[0];
    editBtn.addEventListener("click", function () {
        editRow($row.id);
    });
}

function downloadData() {
    let date = (new Date()).toISOString().split('T')[0];
    fetch(API_URL + `/download?date=${date}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(res => { return res.blob(); })
    .then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `${date}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(err => { console.log(err); })
}
