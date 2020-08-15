const mysql = require('mysql')
const inquirer = require('inquirer')
require('dotenv').config()

// connects mysql db to the server.js
let connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: process.env.password,
    database: 'employees_db'
});

connection.connect(function (err) {
    if (err) throw err
    console.log('connected as id ' + connection.thread_id)
    start()
});

// starts program
function start() {
    console.log('*******************************')
    console.log('**                           **')
    console.log('**     EMPLOYEE  TRACKER     **')
    console.log('**                           **')
    console.log('*******************************')
    inquirer.prompt({
        type: 'list',
        name: 'select',
        message: 'Select what you would like to do.',
        choices: [
            'Add Departments',
            'Add Roles',
            'Add Employees',
            'View Departments',
            'View Roles',
            'View Employees',
            'Update Employee Role',
            'Exit'
        ]
    })
        .then(function (answer) {
            switch (answer.select) {
                case 'Add Departments':
                    addDepartments()
                    break
                case 'Add Roles':
                    addRoles()
                    break
                case 'Add Employees':
                    addEmployees()
                    break
                case 'View Departments':
                    viewDepartments()
                    break
                case 'View Roles':
                    viewRoles()
                    break
                case 'View Employees':
                    viewEmployees()
                    break
                case 'Update Employee Roles':
                    updateEmployeeRoles()
                    break
                default:
                    connection.end()
            }
        })
}

function addDepartments() {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'Enter your department.'
    })
        .then(function (answer) {
            connection.query('INSERT INTO department SET ?', { name: answer.department }, function (err) {
                if (err) throw err
                start()
            })
        })
}

function addRoles() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err
        let emp_department = res.map(department => {
            return ({
                name: department.name,
                value: department.id
            })
        })
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter your role title.'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter salary for role.'
            },
            {
                type: 'listlist',
                name: 'department_i',
                message: 'Choose the department id for role.',
                choices: emp_department
            }
        ])
        .then(function (response) {
            connection.query('INSERT INTO role SET ?', { title: response.title, salary: response.salary, department_id: response.department_id }, function (err) {
                if (err) throw err
                start()
            })
        })
    })
}

function addEmployees() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err
        let emp_role = res.map(role => {
            return ({
                name: role.title,
                value: role.id
            })
        })
        connection.query('SELECT * FROM employee', function (err, res) {
            if (err) throw err
            let employee = res.map(emp => {
                return ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                })
            })
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter employees first name.'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter employees last name.'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Choose employees role.',
                    choices: emp_role
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select employees manager.',
                    choices: employee,
                    when: function(answers) {
                        return employee.length > 0
                    }
                }
            ])
                .then(function (response) {
                    if (!response.manager_id) {
                        connection.query('INSERT INTO employee SET ?', { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id }, function (err) {
                            if (err) throw err
                            start()
                        })
                    }
                })
        })
    })
}

function viewDepartments() {
    let view_department = 'SELECT * FROM department'
    connection.query(view_department, function (err, data) {
        if (err) throw err
        console.table(data)
        start()
    })
}

function viewEmployees() {
    let view_employee = 'SELECT * FROM employee'
    connection.query(view_employee, function (err, data) {
        if (err) throw err
        console.table(data)
        start()
    })
}

function updateEmployeeRoles() {
    let view_employee = 'SELECT * FROM employee'
    connection.query(view_employee, function (err, data) {
        if (err) throw err
        console.table(data)
        start()
    })
}