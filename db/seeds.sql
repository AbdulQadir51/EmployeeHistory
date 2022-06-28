USE employee_history;

INSERT INTO department (name)
VALUES
  ('Accounts'),
  ('Software'),
  ('Health'),
  ('Education'),
  ('Transportation'),
  ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
('Administrator', 15000,1),
('Database Administrator', 25000,2),
('Neurologist', 35000,3),
('Professor', 45000,4),
('Assistant', 5000,5),
('Assistant Manager', 35000,6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, 1),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 3 , 2),
  ('Charles', 'LeRoi', 4 ,3),
  ('Katherine', 'Mansfield', 5, 4),
  ('Dora', 'Carrington', 6, 5),
  ('Edward', 'Bellamy', 3, 6),
  ('Montague', 'Summers', 2, 1),
  ('Octavia', 'Butler', 1, 3),
  ('Unica', 'Zurn', 5,5);