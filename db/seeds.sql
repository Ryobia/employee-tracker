INSERT INTO departments
    (name)
VALUES
('Sales'),
('Web_Development');

INSERT INTO roles
    (title, salary, department_id)
VALUES
('Manager', 1000000.00, 2),
('Engineer', 80000.00, 2),
('Customer_Service', 60000.00, 1);

INSERT INTO employees 
    (first_name, last_name, role_id, manager_id)
VALUES
('Brandon', 'Anderson', 1, 1),
('Joe', 'Johnson', 2, 1),
('Kathy', 'Smith' , 2, 1),
('John', 'Newman', 3, 1),
('Tom', 'Jones', 3, 1),
('Rachel', 'West', 3, 1),
('Pam', 'Stevens', 2, NULL);




