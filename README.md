# Quizer
A quiz web application 

## About
This project is built in order to practice mostly backend web structure.

## NOTE
**THIS PROJECT IS STILL IN DEVELOPMENT**. DO NOT USE AS A FULL WORKING APPLICATION. BUT ACTUAL VERSION CAN BE RUN LOCALLY.

## How to install locally
1. You need to install node.js, mongodb, and git on your computer.
2. Open a terminal.
3. Go into folder where you want to setup project.
4. Run this command to copy repository locally: `git clone https://github.com/alisariyer/quizer.git`
5. Go into project folder by running this command: `cd quizer`
6. As we need to run database and server, it's recommended to open project in VSCode. To do this run in terminal: `code .`
7. Open terminal in VSCode by using shortcut: **CTLR+`**
8. Then install all dependencies: `npm install`
9. Run your mongo database: `mongod` (for windows)
10. Open a second terminal in VSCode terminal panel.
11. Check current folder that is the project folder.
12. Copy .env.example file and rename as **.env**. Then in .env file modify environment variables. (You can just for now change DB_NAME).
13. Seed the database by the sample data(questions): `npm run seed`
14. Run server app: `npm start`
15. Voilà. Go to http://localhost:3000 page to see project.
16. Now you sign up and test yourself.

## Used Technologies
- Node.js
- **Express.js**
- **SASS**
- **MongoDB**
- Ejs
- VSCode
- Git Version Control
- Figma
- Adobe Illustrator

## Specifications:
- A random quiz (actually only front-end questions)
- User registration/login
- Score table
- Add/Edit/Delete questions

## RESTful Routes (Route vs Request result)
- GET /                           : Home page
- GET /login                      : Login page
- POST /login                     : Login process
- GET /signup                     : Registration page
- POST /signup                    : Registration process
- GET /logout                     : Logout process
- GET /quiz                       : Quiz page
- POST /quiz                      : Submit answers
- GET /questions/new              : New question page
- POST /questions/new             : Add new question process
- GET /questions                  : All questions page (for admin)
- GET /questions/:id              : Specified question page
- PUT /questions/:id              : Update a question process
- DELETE /questions/:id           : Delete a question process
- GET /scores                     : User scores table page

## Credits:
- ...
