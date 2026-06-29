const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Counter
function updateCounter() {
    taskCount.textContent = tasks.length;
}

// Display Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if(currentFilter === "active") return !task.completed;

        if(currentFilter === "completed") return task.completed;

        return true;

    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if(task.completed){
            li.classList.add("completed");
        }

        li.dataset.id = task.id;

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">

                <button class="complete">
                    ✓
                </button>

                <button class="edit">
                    Edit
                </button>

                <button class="delete">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    updateCounter();

}

renderTasks();


// Add Task

addTaskBtn.addEventListener("click", ()=>{

    const text = taskInput.value.trim();

    if(text===""){
        alert("Please enter a task.");
        return;
    }

    tasks.push({

        id:Date.now(),

        text:text,

        completed:false

    });

    saveTasks();

    renderTasks();

    taskInput.value="";

});


// Press Enter

taskInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        addTaskBtn.click();

    }

});


// Event Delegation

taskList.addEventListener("click",(e)=>{

    const li=e.target.closest(".task");

    if(!li) return;

    const id=Number(li.dataset.id);

    const task=tasks.find(t=>t.id===id);

    if(e.target.classList.contains("complete")){

        task.completed=!task.completed;

    }

    if(e.target.classList.contains("delete")){

        tasks=tasks.filter(t=>t.id!==id);

    }

    if(e.target.classList.contains("edit")){

        const newText=prompt("Edit Task",task.text);

        if(newText!==null && newText.trim()!==""){

            task.text=newText.trim();

        }

    }

    saveTasks();

    renderTasks();

});


// Filters

filterButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        filterButtons.forEach(btn=>btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter=button.dataset.filter;

        renderTasks();

    });

});