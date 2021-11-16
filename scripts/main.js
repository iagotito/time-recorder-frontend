let API_URL = "http://localhost:8001";

let $logBtn = document.querySelector("#log-btn");
$logBtn.addEventListener("click", logActivity);

let $logInput = document.querySelector("#log-input");

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
        //displayActivities();
    })
    .catch(err => { console.log(err); })
}

function logActivity() {
    let text = $logInput.value;

    let activity = {
        "name": text
    }

    fetch(API_URL + "/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity)
    })
    .then(res => { return res.json(); })
    .then(data => {
        appendToTable(data.activity);
    })
    .catch(err => { console.log(err); })
}

function appendToTable(activity) {
    let ACTIVITY_FIELDS = ["name", "description", "date", "beginning", "end", "total"];

    let row = $activitiesTable.insertRow(-1);

    for (let i = 0; i < ACTIVITY_FIELDS.length; i++) {
        let cell = row.insertCell(i);

        let text;
        if (activity[ACTIVITY_FIELDS[i]] === null || activity[ACTIVITY_FIELDS[i]] === -1) {
            text = "";
        } else {
            text = activity[ACTIVITY_FIELDS[i]];
        }

        let cellText = document.createTextNode(text);
        cell.appendChild(cellText);
    }
}
