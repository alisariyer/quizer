# Quizer
A quiz web application 

## About
This project is built in order to practice mostly backend web structure.

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
