const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');



db.connect(function (err) {
    if (err) throw err;
    console.log(`

    ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
    ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
    █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░
    ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░
    ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
    ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝
    
    ████████╗██████╗░░█████╗░░█████╗░██╗░░██╗███████╗██████╗░
    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██╔══██╗
    ░░░██║░░░██████╔╝███████║██║░░╚═╝█████═╝░█████╗░░██████╔╝
    ░░░██║░░░██╔══██╗██╔══██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
    ░░░██║░░░██║░░██║██║░░██║╚█████╔╝██║░╚██╗███████╗██║░░██║
    ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝
    `);
    mainMenu();
});
    mainMenu = function() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View all Employees', 'View all Roles', 'View all Departments', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
        }
    ]).then(function(menu) {
        switch (menu.choice) {
            case('View all Employees'):
                db.query(`SELECT e.id, e.first_name, e.last_name,
                roles.title AS title, roles.salary,
                departments.name AS department,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employees e
                LEFT JOIN roles
                ON e.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees m 
                ON e.manager_id = m.id;`, (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    mainMenu();
                });
                break;

            case('View all Roles'):
                db.query(`SELECT * FROM roles;`,
                (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    mainMenu();
                });
                break;

            case('View all Departments'):
                db.query(`SELECT * FROM departments;`,
                (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    mainMenu();
                });
                break;

            case('Add a Department'):
                addDepartment();
                break;

            case('Add a Role'):
                addRole();
                break;

            case('Add an Employee'):
                addEmployee();
                break; 

            case('Update an Employee Role'):
                updateEmployee();
                break;
        };
    });
    };


