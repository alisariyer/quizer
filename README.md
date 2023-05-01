# Quizer
A quiz web application

## Quizer screenshot
![Quizer screenshot](https://github.com/alisariyer/quizer/blob/main/screeenshot.png)

## Project Details:
- Start date: 25 April 2023

## Used Technologies (Or will be used)
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
- A randomize front-end quiz for guest.
- User must be enregistered.
- Admin can add more questions and edit them.
- Score table shows current scores
- Data will be stored in a MongoDB

## Project Structure:
- Homepage
  - Questions
- Login
- Registration
- Admin
  - New
  - Edit
- About

## REST Structure
- GET /                           : welcome page
- GET /questions                  : get all questions
- GET /questions/new              : add a new question
- GET /questions/question/:id     : get a specific question
- PUT /questions/question/:id     : update a specific question
- DELETE /questions/question/:id  : delete a specific question
