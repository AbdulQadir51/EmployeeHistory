const express = require('express');
const routes = require('./controllers');
const db = require('./db/connection');
const {
    searchTable,
    postData,
    getAll
} = require('./utils/helper');
const inquirer = require('inquirer');
const console = require('console');
const fetch = require('node-fetch');

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
}]

const q_department = [
    { name: 'name', message: 'What is the name of the department?  ' },
]

const q_role = [
    { name: 'title', message: 'What is the name of the role? ' },
    { name: 'salary', message: 'what is the salary for the role? ' },


]



const q_employee = [
    { name: 'first_name', message: 'What is the first name of the employee? ' },
    { name: 'last_name', message: 'What is the last name of the employee?' },
    { name: 'role', message: 'What is the role of the employee?' },
    { name: 'manager', message: 'Who is the manager of this Employee?' },

]

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

        } else if (answers['options'] == "Update an employee role") {

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

promptNewRole = () => {
    inquirer.prompt(q_role).then((a) => {
        let URL = `${URI}/api/department`
        getAll(URL).then(list_departments => {
            let departments = list_departments.map((department) => {
                return { name: department.name, value: department.id }
            })

            const q_select_department = [{
                name: 'department_id',
                message: 'Select the department for this role? ',
                type: 'list',
                choices: departments,
            }]
            inquirer.prompt(q_select_department).then((a) => {
                console.log(a)
                    // addRole(a).then(res => {
                    //     console.log(res.message)
                    //     promptOptions();
                    // });
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



addDepartment = (body) => {
    return new Promise((resolve, reject) => {
        let URL = `${URI}/api/department`
        res = postData(URL, body);
        resolve(res);
    });
}




addRole = (body) => {
    return new Promise((resolve, reject) => {
        // Search department name
        // searchTable("department", "name", body.department_name, (result) => {
        //     let URL = `${URI}/api/role`
        //     let department = null;
        //     department = result;
        //     if (department == null) {
        //         // If department does not exist Insert department
        //         addDepartment({ name: body.department_name }).then(response => {
        //             department = response.data;
        //             // set department_id to body
        //             body.department_id = department.id;
        //             // Insert role
        //             const resp = postData(URL, body)
        //             resolve(resp)

        //         });

        //     } else {
        //         // If department exist Insert role
        //         const resp = postData(URL, body)
        //         resolve(resp)

        //     }
        // })
    })
}


addEmployee = (body) => {

}


// TODO: Create a function to initialize app
function init() {
    promptOptions();
}



// start server after db connection
db.connect(err => {
    if (err) throw err;
    console.log("Database connection established");
    app.listen(PORT, () => console.log(`Server listening on port ${ PORT }`));
    // Function call to initialize app
    init();


})