# NoteAPI

This is an api to serve notes. Server listens to port 3000. The system push new note every 10 seconds.

## Install & run

Run `npm install` to download the packages then run `node app.js` to run the backend server.

## Model

  ```Note```

  * ```title: string```
  * ```body: string```
  * ```userName: string```
  * ```date: number```

  ```User```

  * ```id: number```
  * ```name: string```

## NoteAPI endpoints

* **```GET /notes```** to get all notes

    **Response**

    * ```{ notes: Note[] }```

    * ```200``` success

* **```POST /notes```** to create new note

    **Request Body**

    * ```title``` string required

    * ```body``` string required

    * ```userName``` string required

    **Response**

    * ```200``` success

    * ```400``` bad request

## Server Events

  * ```connection``` a new user has connect
  * ```disconnect``` a user disconnects
  * ```new note``` when a new note has added to the collection. The message contains an array with the new added note
