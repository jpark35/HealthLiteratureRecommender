# HealthLiteratureRecommender

This is a web application that leverages Health.gov API to curate user targeted recommendations to improve health literacy. Users have the ability to input their age, sex, and other health conditions such as pregnancy, tobacco usage, and sexual activity to get material regarding advice and other relevant content.

## Introduction

HealtLiteratureRecommender's goal is to improve users' health literacy by providing quick access to relevant content. By using SQLite and JSON Web Tokens, users will be able to register and login to personal accounts to query health literature. 

## Features

* User Age: Users can enter their age to get relevant material regarding their age.
* User Sex (Male or Female): Users can enter their sex to get relevant material regarding their sex.
* User Pregancy Status (Yes or No): Users can enter their pregnancy condition to get relevant material regarding pregnancy. Default field value is No.
* User Tobacco Usage (Yes or No): Users can enter their tobacco usage to get relevant material regarding smoking. Default field value is No.
* User Sexual Activity (Yes or No): Users can enter their sexual activity to get relevant material regarding sex. Defaul field value is No.

## Installation

This project uses React, Axios, Express, SQLite3, CORS, and Body-Parser:
* React: npx create-react-app my-app
* Axios: npm install axios
* Express, SQLite3, CORS, Body-Parser: npm install express sqlite3 cors body-parser

To run the backend server:
* node server.js

To run the frontend server:
Navigate to React project directory and run:
* npm start
