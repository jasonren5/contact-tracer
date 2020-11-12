# FUNCTIONS README

## Using the development environment

You will need the Firebase CLI installed locally in order for this to work. Using [this](https://firebase.google.com/docs/cli) as a reference, the Firebase CLI can be installed with `npm install -g firebase-tools`.

The emulators for can be started using the command `firebase emulators:start` in root of this repo. By default, you can navigate to the emulator suite by navigating to `locahost:4000`, and the emulated deployment of the app can be found by navigating to `localhost:5000`. This should all be stated in the output of `firebase emulators:start`.

### Importing test data

Datasets are stored in `/datasets/`. You can start the Firestore emulator with a copy of these data sets by running `firebase emulators:start --import=./path/to/dataset_directory`. At the time of writing, there is a single copy of a prod dataset from 11/12/20; you can start the emulators with a copy of that dataset by running `firebase emulators:start --import=./functions/datasets/2020-11-10T20_45_46_45337`.


### Useful links to external documentation:
* [Getting started with Firebase Functions](https://firebase.google.com/docs/functions/get-started).
  * Basic guide to writing firebase functions, testing them in the emulator, and deploying them.
* [Firebase CLI reference](https://firebase.google.com/docs/cli)
