# Time recorder (frontend)

This is a project to help to keep tack of how much time you spent in
one or many activities at the end of the day.

## How to use

1. Start the backend server. See the [Time recorder
   backend](https://github.com/tmat-project/time-recoder-backend)
   repository to instructions of how to do it.
2. Enter into the directory and run the frontend web server. For
   example, using Python's `http.sever` module:
   ```shell
   python3 -m http.server 8000
   ```
   It will run the server on `localhost:8000`;
3. Type something into the log field and send to the table. Type
   "end" to finish an activity.

## How it works

It is an app that allows to start to log your activities. Every day the
API creates a new table page to that day, and you can only log things
in the current's day sheet. In the future you will be able to choose
another days.

When you type a new activity, it sets the end time of the previous
acitivity and the begin time of the new one. Type "end" to finish an
activity without start another.

## Send times to a time management app

You can send the times to your project time management app, like
Redmine, thought the [TMAT
CLI](https://github.com/tmat-project/tmat-cli). First download the CSV
from the frontend, and use the _TMAT CLI_ to send it to the Redmine. In
the future, this Redmine integration will be in the time recorder
itself.
