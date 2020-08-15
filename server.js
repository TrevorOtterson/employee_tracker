const mysql = require("mysql")
const inquirer = require("inquirer")
require('dotenv').config()

// connects mysql db to the server.js
let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.password,
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err
    console.log("connected as id " + connection.threadId)
    start()
});

// starts program
function start() {
    console.log("*******************************")
    console.log("**                           **")
    console.log("**     EMPLOYEE  TRACKER     **")
    console.log("**                           **")
    console.log("*******************************")
    inquirer.prompt({
        type: "list",
        name: "select",
        message: "Select what you would like to do.",
        choices: [
            "Add Departments",
            "Add Roles",
            "Add Employees",
            "View Departments",
            "View Roles",
            "View Employees",
            "Update Employee Roles",
            "Exit"
        ]
    })
        .then(function (answer) {
            switch (answer.select) {
                case "Add Departments":
                    addDepartments()
                    break
                case "Add Roles":
                    addRoles()
                    break
                case "Add Employees":
                    addEmployees()
                    break
                case "View Departments":
                    viewDepartments()
                    break
                case "View Roles":
                    viewRoles()
                    break
                case "View Employees":
                    viewEmployees()
                    break
                case "Update Employee Roles":
                    updateEmpolyeeRoles()
                    break
                default:
                    connection.end()
            }
        })
}

function addDepartments() {
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "Enter your department."
    })
        .then(function (answer) {
            connection.query("INSERT INTO department SET ?", { name: answer.department }, function (err) {
                if (err) throw err
                start()
            })
        })
}

function addRoles() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err
        let emp_department = res.map(department => {
            return ({
                name: department.name,
                value: department.id
            })
        })
    })
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter your role title."
        },
        {
            type: "input",
            name: "salary",
            message: "Enter salary for role."
        },
        {
            type: "list",
            name: "department_id",
            message: "Choose the department id for role.",
            choices: emp_department
        }
    ])
        .then(function (response) {
            connection.query("INSERT INTO role SET ?", { title: response.title, salary: response.salary, department_id: response.department_id }, function (err) {
                if (err) throw err
                start()
            })
        })
}