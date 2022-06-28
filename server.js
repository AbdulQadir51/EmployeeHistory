const express = require('express');
const routes = require('./controllers');
const db = require('./db/connection');
const {
    fetchData

} = require('./utils/helper');
const inquirer = require('inquirer');
const console = require('console');
const fetch = require('node-fetch');
const e = require('express');

const app = express();
const PORT = process.env.PORT || 3001;


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Application routes
app.use(routes);

// Not Found route
app.use((req, res) => {
    res.status(404).end();
});


// localhost URI
const URI = `http://localhost:${PORT}`


// Options
const options = [{
    name: 'options',
    message: 'What would you like to do?',
    type: 'list',
    choices: [
        'View all departments', 'View all roles', 'View all employees',
        'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'
    ],
}];
// department question
const q_department = [
    { name: 'name', message: 'What is the name of the department?  ' },
];
// role question
const q_role = [
    { name: 'title', message: 'What is the name of the role? ' },
    { name: 'salary', message: 'what is the salary for the role? ' },
];
// employee question
const q_employee = [
    { name: 'first_name', message: 'What is the first name of the employee? ' },
    { name: 'last_name', message: 'What is the last name of the employee?' },
];

promptOptions = () => {
    inquirer.prompt(options).then((answers) => {
        if (answers['options'] == "View all departments") {
            viewAll("department")
        } else if (answers['options'] == "View all roles") {
            viewAll("role")
        } else if (answers['options'] == "View all employees") {
            viewAll("employee")
        } else if (answers['options'] == "Add a department") {
            promptNewDepartment()
        } else if (answers['options'] == "Add a role") {
            promptNewRole()
        } else if (answers['options'] == "Add an employee") {
            promptNewEmployee()
        } else if (answers['options'] == "Update an employee role") {
            promptUpdateEmployeeRole()
        }
    }).catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.log(error.message)
        } else {
            // Something else went wrong
            console.log(error)
        }
    });
}

// view all in console.table
viewAll = (table) => {
    let URL = `${URI}/api/${table}`
    fetch(URL)
        .then(response => response.json())
        .then(json => {
            console.table(json.data);
            promptOptions()
        })
        .catch(err => console.error(err));
}

// Add a department prompt
promptNewDepartment = () => {
    inquirer.prompt(q_department).then((a) => {
        addDepartment(a).then(res => {
            console.log(res.message);
            promptOptions();
        });
    }).catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.log(error.message)
        } else {
            // Something else went wrong
            console.log(error)
        }
    });
}


// Add a new Role prompt
promptNewRole = () => {
    let body = null;
    inquirer.prompt(q_role).then((a) => {
        body = a;
        // get all departments to prompt list of all departments
        let URL = `${URI}/api/department`
        fetchData(URL, 'GET', null).then(list_departments => {
            // map list_departments with name and value
            let departments = list_departments.map((department) => {
                    return { name: department.name, value: department.id }
                })
                // prompt all departments list
            const q_select_department = [{
                name: 'department_id',
                message: 'Select the department for this role? ',
                type: 'list',
                choices: departments,
            }]
            inquirer.prompt(q_select_department).then((ans) => {
                // set department_id to body
                body.department_id = ans.department_id;
                // add role
                addRole(body).then(res => {
                    console.log(res.message)
                    promptOptions();
                });
            });
        });
    }).catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.log(error.message)
        } else {
            // Something else went wrong
            console.log(error)
        }
    });
}

promptNewEmployee = () => {
    let body = null;
    // prompt q_employee
    inquirer.prompt(q_employee).then((a) => {
        body = a;
        // get all roles to prompt list_roles
        let URL = `${URI}/api/role`
            // getAll helper function
        fetchData(URL, 'GET', null).then(list_roles => {
            // map list_roles with name and value
            let roles = list_roles.map((role) => {
                    return { name: role.title, value: role.id }
                })
                // prompt roles list
            const q_employee_role = [{
                name: 'role_id',
                message: 'What is the role of the employee?',
                type: 'list',
                choices: roles,
            }]
            inquirer.prompt(q_employee_role).then((ans) => {
                // set role_id to body
                body.role_id = ans.role_id;
                // get all employee or manager_list
                URL = `${URI}/api/employee`
                    // getAll helper function
                fetchData(URL, 'GET', null).then(list_employees => {
                    // map employee list with name and value
                    let employees = list_employees.map((emp) => {
                            return {
                                name: emp.name,
                                value: emp.id
                            }
                        })
                        // promp list managers
                    const q_employee_manager = [{
                        name: 'manager_id',
                        message: 'Who is the manager of this Employee?',
                        type: 'list',
                        choices: employees,
                    }];
                    inquirer.prompt(q_employee_manager).then((answer) => {
                        // set manager_id to body
                        body.manager_id = answer.manager_id;
                        // add employee 
                        addEmployee(body).then(res => {
                            console.log(res.message)
                            promptOptions();
                        });
                    });
                });

            });
        });
    }).catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.log(error.message)
        } else {
            // Something else went wrong
            console.log(error)
        }
    });
}


promptUpdateEmployeeRole = () => {
    let body = {};
    let URL = `${URI}/api/employee`
    fetchData(URL, 'GET', null).then(list_employees => {
        // map list_departments with name and value
        let employees = list_employees.map((emp) => {
                return { name: emp.name, value: emp.id }
            })
            // prompt all employee list
        const q_select_employees = [{
            name: 'employee_id',
            message: "Which employee's role do you want to update? ",
            type: 'list',
            choices: employees,
        }]
        inquirer.prompt(q_select_employees).then((answer) => {
            // set employee_id to body
            body.id = answer.employee_id;

            //get all roles
            URL = `${URI}/api/role`
            fetchData(URL, 'GET', null).then(list_roles => {
                // map list_departments with name and value
                let roles = list_roles.map((role) => {
                        return { name: role.title, value: role.id }
                    })
                    // prompt all role list
                const q_select_employee_role_update = [{
                    name: 'role_id',
                    message: "Which role do you want to assign the selected employee? ",
                    type: 'list',
                    choices: roles,
                }]

                inquirer.prompt(q_select_employee_role_update).then((ans) => {
                    // set role_id to body
                    body.role_id = ans.role_id;

                    // get employee data to update
                    URL = `${URI}/api/employee/${body.id}`
                    fetchData(URL, 'GET', null).then(employee => {
                        body.first_name = employee.first_name;
                        body.last_name = employee.last_name;
                        body.manager_id = employee.manager_id;
                        updateEmployeeRole(body).then(res => {
                            console.log(res.message)
                            promptOptions();
                        });
                    });

                });
            });

        });
    });

}

addDepartment = (body) => {
    return new Promise((resolve, reject) => {
        let URL = `${URI}/api/department`;
        // fetchData helper function
        res = fetchData(URL, 'POST', body);
        resolve(res);
    });
}

addRole = (body) => {
    return new Promise((resolve, reject) => {
        let URL = `${URI}/api/role`;
        // fetchData helper function
        const resp = fetchData(URL, 'POST', body);
        resolve(resp)
    })
}

addEmployee = (body) => {
    return new Promise((resolve, reject) => {
        let URL = `${URI}/api/employee`;
        // fetchData helper function
        const resp = fetchData(URL, 'POST', body);
        resolve(resp)
    })
}

updateEmployeeRole = (body) => {
    return new Promise((resolve, reject) => {
        let URL = `${URI}/api/employee/${body.id}`;
        // fetchData helper function
        const resp = fetchData(URL, 'PUT', body);
        resolve(resp)
    })
}


// TODO: Create a function to initialize app
function init() {
    promptOptions();
}



// start server after db connection
db.connect(err => {
    if (err) throw err;
    console.log("Database connection established");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT }`));
    // Function call to initialize app
    init();


})