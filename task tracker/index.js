const fs = require("fs");
const path = require("path");

const storeTasks = path.join(__dirname,"./tasks.json");


// Color codes
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
};

// functions
function readTasks()
{
    if(fs.existsSync(storeTasks)){
        const data = fs.readFileSync(storeTasks,"utf-8");
        return JSON.parse(data);
    }
    return [];
}

function writeTasks(tasks)
{
    try{
        fs.writeFileSync(storeTasks,JSON.stringify(tasks,null,2),"utf-8");
    }
    catch(error)
    {
        console.log(error);
    }
}

function deleteTask(id)
{
    const tasks = readTasks();
    const newTasks = tasks.filter((task) => task.id !== parseInt(id));

    if (task) {
        // task.description = newDescription;

        writeTasks(newTasks);
        console.log(`Task ID ${id} deleted successfully!`);
        } else {
        console.log(`Task with ID ${id} not found.`);
    }
}

function getNextId(tasks)
{
    const ids = tasks.map((task) => task.id);
    return ids.length>0 ? Math.max(...ids)+1:1;
}

// list all the tasks by status
function listTasks(status)
{
    const tasks = readTasks();
    let filteredTasks = tasks;

    if(status)
    {
        if(status.toLowerCase() === "done")
        {
            filteredTasks = tasks.filter((task) => task.completed);
        }
        else if(status.toLowerCase() ==="to-do")
        {
            filteredTasks = tasks.filter((task) => !task.completed && !tasks.inProgress);
        }
        else if(status.toLowerCase() === "in-progress"){
            filteredTasks = tasks.filter((task) => task.inProgress);
        }
        else{
            console.log("invalid status!");
            return;
        }
    }
    if(filteredTasks.length === 0)
    {
        console.log("no tasks!");
    }
    else{
        console.log("Tasks : ");
        filteredTasks.forEach((task) => {
            console.log(
                `${task.id}. ${task.description} [${task.completed ? "Done" : task.inProgress ?  "In-progress" :  "To-do"}]`
            );
        });
        
    }



}

function addTask(title)
{
    let tasks = readTasks();

    const newTask={
        id:getNextId(tasks),
        description:title,
        completed:false,
        inProgress:false
    };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log("successfully added new task!");
    
}
function updateTask(id, newDescription) {
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));

    if (task) {
        task.description = newDescription;
        writeTasks(tasks);
        console.log(`Task ID ${id} updated successfully!`);
        } else {
        console.log(`Task with ID ${id} not found.`);
    }
}
function updateToInProgress(id)
{
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));

    if (task) {
        // task.description = newDescription;
        task.completed=false;
        task.inProgress=true;
        writeTasks(tasks);
        console.log(`Task ID ${id} updated successfully!`);
        } else {
        console.log(`Task with ID ${id} not found.`);
    }
}
function updateToDone(id)
{
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));

    if (task) {
        // task.description = newDescription;
        task.completed=true;
        task.inProgress=false;
        writeTasks(tasks);
        console.log(`Task ID ${id} updated successfully!`);
        } else {
        console.log(`Task with ID ${id} not found.`);
    }
}
function updateToNotDone(id)
{
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));

    if (task) {
        // task.description = newDescription;
        task.completed=false;
        task.inProgress=false;
        writeTasks(tasks);
        console.log(`Task ID ${id} updated successfully!`);
        } else {
        console.log(`Task with ID ${id} not found.`);
    }
}

const args = process.argv.slice(2);//remove the first 2 arguments
const method = args[0];
// const details = args[1];

if(args.includes("add"))
{
    const details = args.slice(1).join(" ");
    if(!details)
    {
        console.log("please give a task description!");
        

    }
    else{
        addTask(details);
    }
}
else if(args.includes("list"))
{
    const status = args[1];
    listTasks(status);
}
else if (args.includes("update")) {
    const id = args[1];
    const newDescription = args.slice(2).join(" ");
    if (!id || !newDescription) {
        console.log(`${colors.red}Please provide a task ID and new description.${colors.reset}`);
        console.log(`${colors.yellow}Sample: node index.js update 1 "Updated task description"${colors.reset}`);
    } else {
        updateTask(id, newDescription);
    }
} 
else if (args.includes("delete")) {
    const id = args[1];
    if (!id) {
        console.log(`${colors.red}Please provide a task ID.${colors.reset}`);
        console.log(`${colors.yellow}Sample: node index.js delete 1${colors.reset}`);
    } else {
        deleteTask(id);
    }
} 
else if (args.includes("mark-in-progress")) {
    const id = args[1];
    if (!id) {
        console.log(`${colors.red}Please provide a task ID.${colors.reset}`);
        console.log(`${colors.yellow}Sample: node index.js mark-in-progress 1${colors.reset}`);
    } else {
        updateToInProgress(id);
    }
} 
else if (args.includes("mark-done")) {
    const id = args[1];
    if (!id) {
        console.log(`${colors.red}Please provide a task ID.${colors.reset}`);
        console.log(`${colors.yellow}Sample: node index.js mark-done 1${colors.reset}`);
    } else {
        updateToDone(id);
    }
} 
else {
    console.log(`${colors.cyan}Usage: node index.js <command> [arguments]${colors.reset}`);
    console.log(`${colors.cyan}Commands:${colors.reset}`);
    console.log(`${colors.yellow}  add <task description>            - Add a new task${colors.reset}`);
    console.log(`${colors.yellow}  list [status]                     - List tasks (status: done, to-do, in-progress)${colors.reset}`);
    console.log(`${colors.yellow}  update <id> <new description>     - Update a task by ID${colors.reset}`);
    console.log(`${colors.yellow}  delete <id>                       - Delete a task by ID${colors.reset}`);
    console.log(`${colors.yellow}  mark-in-progress <id>             - Mark a task as in-progress by ID${colors.reset}`);
    console.log(`${colors.yellow}  mark-done <id>                    - Mark a task as done by ID${colors.reset}`);
}

