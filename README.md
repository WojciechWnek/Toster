# Toster

This repo contains source code for project called "Robot Toster".
Some parts of the code or the docs may not be in English, although it is recommended to use English in here.
Feel free to contribute as much as you wish.

Link to docs explaining how this project works and how to hack on it is [here](docs/docs.md). 

## Starting up the server

This project is intended to be runned on raspberry pi with Gnu/Linux.
For development is is not a problem not to run it on some other unix based machine, although running it under windows may raise some problems (not tested yet).

### Requirements
- Stable or nightly build of `node.js` with `npm`.
- `python3` (for most programs)

### Setting things up

To clone the server and install npm packages:

```sh
# Clone the repo
git clone https://github.com/Mazurel/Toster.git
# Cd into directory
cd Toster
# Download node modules
cd server && npm update
```

If you want to mess around with loaded programs you may also want to modify `programs/index.json` 
which contains currently active programs.

### Starting the server

```sh
cd server 
node index.js
# If there is no error everything is propably working all right
```

## Adding custom program

**TODO**
