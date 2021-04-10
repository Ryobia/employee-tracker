const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

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
mainMenu = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View all Employees",
          "View all Roles",
          "View all Departments",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then(function (menu) {
      switch (menu.choice) {
        case "View all Employees":
          db.query(
            `SELECT e.id, e.first_name, e.last_name,
                roles.title AS title, roles.salary,
                departments.name AS department,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employees e
                LEFT JOIN roles
                ON e.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees m 
                ON e.manager_id = m.id;`,
            (err, rows) => {
              if (err) throw err;
              console.table(rows);
              mainMenu();
            }
          );
          break;

        case "View all Roles":
          db.query(
            `SELECT roles.id, roles.title, roles.salary, departments.name as department
                          FROM roles
                          LEFT JOIN departments
                          ON roles.department_id = departments.id;`,
            (err, rows) => {
              if (err) throw err;
              console.table(rows);
              mainMenu();
            }
          );
          break;

        case "View all Departments":
          db.query(`SELECT * FROM departments;`, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            mainMenu();
          });
          break;

        case "Add a Department":
          addDepartment();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Update an Employee Role":
          updateEmployee();
          break;
      }
    });
};

addDepartment = function () {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Please give the new Department a name:",
      },
    ])
    .then(function (department) {
      db.query(
        `INSERT INTO departments (name)
                  VALUES ('${department.department}');`,
        (err, rows) => {
          if (err) throw err;
          console.log(`${department.department} was added to Departments`);
          mainMenu();
        }
      );
    });
};

addRole = function () {
  db.query(`SELECT * FROM departments;`, (err, rows) => {
    if (err) throw err;
    console.table(rows);
  });
  inquirer
    .prompt([
      {
        type: "number",
        name: "depID",
        message: `What is this Role's department id?`,
      },
      {
        type: "input",
        name: "title",
        message: "Please give the new Role a title:",
      },
      {
        type: "number",
        name: "salary",
        message: "What is this Role's salary?",
      },
    ])
    .then(function (role) {
      db.query(
        `INSERT INTO roles (title, salary, department_id)
                  VALUES ('${role.title}', ${role.salary}, ${role.depID});`,
        (err, rows) => {
          if (err) throw err;
          db.query(
            `SELECT roles.id, roles.title, roles.salary, departments.name as department
                          FROM roles
                          LEFT JOIN departments
                          ON roles.department_id = departments.id;`,
            (err, rows) => {
              if (err) throw err;
              console.table(rows);
              mainMenu();
            }
          );
        }
      );
    });
};

addEmployee = function () {
    db.query(
        `SELECT employees.id, employees.first_name, employees.last_name FROM employees;`, 
            (err, rows) => {
            if (err) throw err;
            console.table(rows);
        });
    db.query(    
        `SELECT roles.id, roles.title from roles;`,
            (err, rows) => {
            if (err) throw err;
            console.table(rows);
        });
  inquirer
    .prompt([
      {
        type: "number",
        name: "role",
        message: `What is this Employee's role in the company (enter role ID)?`,
      },
      {
        type: "input",
        name: "first",
        message: "What is this Employee's first name?",
      },
      {
        type: "input",
        name: "last",
        message: "What is this Employee's last name?",
      },
      {
        type: "number",
        name: "managerID",
        message: `What is this Employee's Manager's id?`,
      },
    ])
    .then(function (employee) {
      db.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES ('${employee.first}', '${employee.last}', ${employee.role}, ${employee.managerID});`,
        (err, rows) => {
          if (err) throw err;
          db.query(
            `SELECT e.id, e.first_name, e.last_name,
                roles.title AS title, roles.salary,
                departments.name AS department,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employees e
                LEFT JOIN roles
                ON e.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees m 
                ON e.manager_id = m.id;`,
            (err, rows) => {
              if (err) throw err;
              console.table(rows);
              mainMenu();
            }
          );
        }
      );
    });
};

updateEmployee = function () {
    db.query(
        `SELECT employees.id, employees.first_name, employees.last_name FROM employees;`, 
            (err, rows) => {
            if (err) throw err;
            console.table(rows);
        });
    db.query(    
        `SELECT roles.id, roles.title from roles;`,
            (err, rows) => {
            if (err) throw err;
            console.table(rows);
        });
    inquirer.prompt([
        {
            type: 'number',
            name: 'employeeID',
            message: 'Which Employee would you like to update? (enter employee id)'
        },
        {
            type: 'number',
            name: 'role',
            message: `What is this employee's new role? (enter role id)`
        }
    ]).then(function(update) {
        db.query(
            `UPDATE employees SET role_id = ${update.role} WHERE employees.id = ${update.employeeID};`,
            (err, rows) => {
                if (err) throw err;
                db.query(
                    `SELECT e.id, e.first_name, e.last_name,
                    roles.title AS title, roles.salary,
                    departments.name AS department,
                    CONCAT(m.first_name, ' ', m.last_name) AS manager
                    FROM employees e
                    LEFT JOIN roles
                    ON e.role_id = roles.id
                    LEFT JOIN departments
                    ON roles.department_id = departments.id
                    LEFT JOIN employees m 
                    ON e.manager_id = m.id
                    WHERE e.id = ${update.employeeID};`,
                    (err, rows) => {
                    console.table(rows);
                    mainMenu();
                    });
            })
    })
};
