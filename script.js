const now=new Date();
const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
const day=days[now.getDay()]; //day.substring(0,3) for Sun formatting
const month=months[now.getMonth()]; //month.substring(0,3) for Jun Formatting
const date=now.getDate();
const hour=now.getHours();
const minute=now.getMinutes();
let time;
let displayHour=(hour+12)%12; //conversion to 12 hour clock
if(displayHour==0) displayHour=12;
if(hour>=12){ 
    if(minute<10){
        time=displayHour+":"+"0"+minute+" PM";
    }
    else{
        time=displayHour+":"+minute+" PM";
    }
    
}
else {
    
    if(minute<10){
        time=displayHour+":"+"0"+minute+" AM";
    }
    else{
        time=displayHour+":"+minute+" AM";
    }
}

//header content 
const info=document.querySelector(".info");
const menuItems=info.querySelectorAll("p"); //[day,month,date,time AM/PM]
menuItems[0].textContent=day.substring(0,3);
menuItems[1].textContent=month.substring(0,3);
menuItems[2].textContent=date;
menuItems[3].textContent=time;

//task 
const addTaskButton=document.querySelector("#add-task");
const taskForm=document.querySelector("#task-form");
const taskList=document.querySelector("#task-list");
const todaysTask=document.querySelector(".task-filter").querySelectorAll("button")[0];
const allTasks=document.querySelector(".task-filter").querySelectorAll("button")[1];

let tasks=[];

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

const savedTasks=localStorage.getItem("tasks"); //savedTasks have the tasks as a json string-intially this can be null therefore we have to check if it is null before parsing it 
if(savedTasks){
    tasks=JSON.parse(savedTasks);
}

displayTasks(tasks);
addTaskButton.addEventListener("click",()=>{
    taskForm.hidden=false;
    taskList.hidden=true;
})

todaysTask.addEventListener("click",()=>{
    let today = new Date().toISOString().split("T")[0];
    let todaysTasks=tasks.filter((task)=> task.date===today);
    displayTasks(todaysTasks);
})

allTasks.addEventListener("click",()=> {
    displayTasks(tasks);
})

taskForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    taskForm.hidden=true;
    let taskname=taskForm.querySelector("#task-name").value;
    let taskdate = taskForm.querySelector("#task-date").value;
    let tasktime=taskForm.querySelector("#task-time").value;
    const task = {
        name: taskname,
        date: taskdate,
        time: tasktime,
        completed:false
    };
    tasks.push(task);
    taskForm.reset();
    taskList.hidden = false;
    saveTasks();
    displayTasks(tasks);
})


function timeToMinutes(time) {
    const parts = time.split(":");

    const hours = parts[0]*60;
    const minutes = Number(parts[1]);

    return hours + minutes;
}

function displayTasks(tasksToDisplay){
    taskList.innerHTML="";
    const sortedTasks = [...tasksToDisplay];
    sortedTasks.sort((a,b)=>{
        if( a.date !== b.date ){
            return new Date(a.date) - new Date(b.date);
        }
        if(a.time==="" && b.time===""){
            return 0;
        }
        else if(a.time ==="" && b.time!==""){
            return 1;
        }
        else if(a.time !=="" && b.time===""){
            return -1;
        }
        else{
            return timeToMinutes(a.time) - timeToMinutes(b.time);
        }

    })
    for(let task of sortedTasks){
        const taskDiv=document.createElement("div");
        taskDiv.setAttribute("class","Task");
        const taskCheckbox=document.createElement("input");
        taskCheckbox.setAttribute("type", "checkbox");
        const taskName=document.createElement("p");
        taskName.textContent=task.name;
        if (task.completed) {
        taskCheckbox.checked = true;
        taskName.classList.add("task-done");
        }
        const taskDate=document.createElement("p");
        const [year, month, day] = task.date.split("-");
        taskDate.textContent=`${day}/${month}/${year.slice(2)}`;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️";
        deleteButton.classList.add("delete-task");
        deleteButton.addEventListener("click", (event) => {
            const taskDiv = event.target.parentElement;
            const taskName=taskDiv.querySelectorAll("p")[0].textContent;
            for(let i = 0; i < tasks.length; i++){
                if(tasks[i].name == taskName){
                    tasks.splice(i, 1);
                    saveTasks();
                    break;
                }
            }
            taskDiv.remove();
        });
        taskCheckbox.addEventListener("input",(event)=>{
            const taskDiv=event.target.parentElement;
            const taskName=taskDiv.querySelectorAll("p")[0];
            for(let task of tasks){
                if(task.name ==taskName.textContent){
                    task.completed=!task.completed;
                    if(task.completed){
                        taskName.classList.add("task-done");
                    }
                    else{
                        taskName.classList.remove("task-done");
                    }
                    saveTasks();
                }
                
            }
        })
        taskList.appendChild(taskDiv);
        taskDiv.appendChild(taskCheckbox)
        taskDiv.appendChild(taskName);
        taskDiv.appendChild(taskDate);
        if(task.time){
            const taskTime=document.createElement("p");
            taskTime.textContent=task.time;
            taskDiv.appendChild(taskTime);
        }
        taskDiv.appendChild(deleteButton);
    }
}


//pomodoro timer && totalStudytime 
let displaySecond;
let displayMinute;
let totalSeconds = 0;
let totalStudyTime;
let timer;
let stopWatch;
let currentTimer;
let remainingSeconds;
let customHourValue;
let customMinValue;
let currentMode = 'stopwatch';
let totalCustomMins = 0;

const minStudyTime = document.querySelector(".min-time-box");
const minStudyTimeVal = minStudyTime.querySelector(".time-value");
const hourStudyTime = document.querySelector(".hour-time-box");
const hourStudyTimeVal = hourStudyTime.querySelector(".time-value");
const startFocus = document.querySelector("#start-focus");
const stopFocus = document.querySelector("#stop-focus");
const pauseFocus = document.querySelector("#pause-focus");
const resumeFocus = document.querySelector("#resume-focus");
const postStart = document.querySelector("#post-start");
const stopwatchMode = document.querySelector("#stopwatch-mode");
const timerMode = document.querySelector("#timer-mode");
const timerButtons = document.querySelector(".timer-buttons");
const customTimer = document.querySelector(".custom-timer");
const pomodoro = document.querySelector("#pomodoro");
const timerDisplay = document.querySelector("#timer-display");
const timerButton = document.querySelectorAll(".timer-button");
const customHour = document.querySelector("#hours-input");
const customMin = document.querySelector("#mins-input");


timerButtons.hidden = true;
customTimer.hidden = true;
pomodoro.classList.add("stopwatch-layout");
postStart.hidden = true;
resumeFocus.hidden = true;

let today = new Date().toISOString().split("T")[0];
let studyTimes; //object that stores studytimes for each day 
studyTimes = JSON.parse(localStorage.getItem("StudyTimes")) || {}; //the studyTimes will be stored as a JSON String in localstorage so it has to be parsed 
totalStudyTime = studyTimes[today] || 0;
updateStudyTimeDisplay();

function getCustomTime() {
    customHourValue = Number(customHour.value);
    customMinValue = Number(customMin.value);
    totalCustomMins = customHourValue * 60 + customMinValue;
}


function displayTimer(x) {
    timerDisplay.textContent = x + ":00";
}


for (let button of timerButton) {
    button.addEventListener("click", (event) => {
        currentTimer = event.target.textContent;
        customHour.value = "";
        customMin.value = "";
        totalCustomMins = 0;
        displayTimer(currentTimer);
    });
}


function startStopwatch() {
    stopWatch = setInterval(() => {
        totalSeconds++;
        displayMinute = Math.floor(totalSeconds / 60);
        displaySecond = totalSeconds % 60;
        if (displayMinute < 10) {
            displayMinute = "0" + displayMinute;
        }
        if (displaySecond < 10) {
            displaySecond = "0" + displaySecond;
        }
        timerDisplay.textContent = displayMinute + ":" + displaySecond;

    }, 1000);
}


function startTimer() {
    remainingSeconds = Number(currentTimer) * 60;
    timer = setInterval(() => {
        if (remainingSeconds === 0) {
            clearInterval(timer);
            totalStudyTime += Number(currentTimer) * 60;
            studyTimes[today]=totalStudyTime;
            localStorage.setItem("StudyTimes",JSON.stringify(studyTimes));
            updateStudyTimeDisplay();
            postStart.hidden = true;
            startFocus.hidden = false;
            stopwatchMode.disabled = false;
            timerMode.disabled = false;
            pauseFocus.hidden = false;
            resumeFocus.hidden = true;
            for (let button of timerButton) {
                button.disabled = false;
            }
            customHour.value="";
            customMin.value="";
            customHour.readOnly = false;
            customMin.readOnly = false;
            return;
        }
        remainingSeconds--;
        displayMinute = Math.floor(remainingSeconds / 60);
        displaySecond = remainingSeconds % 60;
        if(displayMinute < 10) {
            displayMinute = "0" + displayMinute;
        }
        if(displaySecond < 10) {
            displaySecond = "0" + displaySecond;
        }
        timerDisplay.textContent = displayMinute + ":" + displaySecond;

    }, 1000);
}


function resumeTimer() {
    timer = setInterval(() => {
        if (remainingSeconds === 0) {
            clearInterval(timer);

            totalStudyTime += Number(currentTimer) * 60;
            studyTimes[today]=totalStudyTime;
            localStorage.setItem("StudyTimes",JSON.stringify(studyTimes));
            updateStudyTimeDisplay();

            postStart.hidden = true;
            startFocus.hidden = false;

            stopwatchMode.disabled = false;
            timerMode.disabled = false;

            pauseFocus.hidden = false;
            resumeFocus.hidden = true;

            for (let button of timerButton) {
                button.disabled = false;
            }
            customHour.value="";
            customMin.value="";
            customHour.readOnly = false;
            customMin.readOnly = false;
            return;
        }
        remainingSeconds--;
        displayMinute = Math.floor(remainingSeconds / 60);
        displaySecond = remainingSeconds % 60;
        if (displayMinute < 10) {
            displayMinute = "0" + displayMinute;
        }
        if (displaySecond < 10) {
            displaySecond = "0" + displaySecond;
        }
        timerDisplay.textContent = displayMinute + ":" + displaySecond;
    }, 1000);
}


stopwatchMode.addEventListener("click", () => {
    currentMode = "stopwatch";
    timerButtons.hidden = true;
    customTimer.hidden = true;
    pomodoro.classList.add("stopwatch-layout");
});


timerMode.addEventListener("click", () => {
    currentMode = "timer";
    timerButtons.hidden = false;
    customTimer.hidden = false;
    pomodoro.classList.remove("stopwatch-layout");
});


customHour.addEventListener("input", () => {
    getCustomTime();
    if (totalCustomMins !== 0) {
        displayTimer(totalCustomMins);
    }
});


customMin.addEventListener("input", () => {
    getCustomTime();
    if (totalCustomMins !== 0) {
        displayTimer(totalCustomMins);
    }
});

function updateStudyTimeDisplay() {

    let totalStudyHours =
        Math.floor(totalStudyTime / 3600);

    let totalStudyMin =
        Math.floor((totalStudyTime % 3600) / 60);

    if(totalStudyMin < 10){
        totalStudyMin = "0" + totalStudyMin;
    }

    hourStudyTimeVal.textContent = totalStudyHours;
    minStudyTimeVal.textContent = totalStudyMin;
}

startFocus.addEventListener("click", () => {
    if (currentMode === "stopwatch") {
        startStopwatch();
        startFocus.hidden = true;
        postStart.hidden = false;
        stopwatchMode.disabled = true;
        timerMode.disabled = true;
    }

    else if (currentMode === "timer") {
        getCustomTime();
        if (currentTimer === undefined && totalCustomMins === 0) {
            alert("Please select a time!");
            return;
        }
        startFocus.hidden = true;
        postStart.hidden = false;
        stopwatchMode.disabled = true;
        timerMode.disabled = true;
        // Disable preset timer buttons
        for (let button of timerButton) {
            button.disabled = true;
        }
        if (totalCustomMins !== 0) {
            currentTimer = totalCustomMins;
            startTimer();
            customHour.readOnly = true;
            customMin.readOnly = true;
        }
        else {
            startTimer();
            customHour.readOnly = true;
            customMin.readOnly = true;
        }
    }
});

stopFocus.addEventListener("click", () => {
    startFocus.hidden = false;
    postStart.hidden = true;

    stopwatchMode.disabled = false;
    timerMode.disabled = false;
    for(let button of timerButton){
        button.disabled = false;
    }
    pauseFocus.hidden = false;
    resumeFocus.hidden = true;
    if(currentMode === "stopwatch"){
        clearInterval(stopWatch);
        totalStudyTime += totalSeconds;
        studyTimes[today]=totalStudyTime;
        localStorage.setItem("StudyTimes",JSON.stringify(studyTimes));
        totalSeconds = 0;
    }
    else if(currentMode === "timer"){
        clearInterval(timer);
        // Total selected time - time remaining
        let studiedSeconds =
            (Number(currentTimer) * 60) - remainingSeconds;
        totalStudyTime += studiedSeconds;
        studyTimes[today]=totalStudyTime;
        localStorage.setItem("StudyTimes",JSON.stringify(studyTimes));
        remainingSeconds = 0;
    }
    customHour.value = "";
    customMin.value = "";
    customHour.readOnly = false;
    customMin.readOnly = false;
    totalCustomMins = 0;
    currentTimer = undefined;
    timerDisplay.textContent = "00:00";
    updateStudyTimeDisplay();
});

pauseFocus.addEventListener("click", () => {
    pauseFocus.hidden = true;
    resumeFocus.hidden = false;
    if (currentMode === "stopwatch") {
        clearInterval(stopWatch);
    }
    else if (currentMode === "timer") {
        clearInterval(timer);
    }
});

resumeFocus.addEventListener("click", () => {
    pauseFocus.hidden = false;
    resumeFocus.hidden = true;
    if (currentMode === "stopwatch") {
        startStopwatch();
    }
    else if (currentMode === "timer") {
        resumeTimer();
    }
});

//countdown 
const addEvent=document.querySelector("#addEvent");
const countdownForm=document.querySelector("#countdown-form");
const countdownList=document.querySelector("#countdown-list");
let events=[];

function saveEvents(){
    localStorage.setItem("events", JSON.stringify(events));
}

function daysBetween(startDate,endDate){
    let timeBetween=endDate-startDate;
    let daysBetween=timeBetween/(1000*3600*24);
    return daysBetween;
}
function displayCountdowns(countdownsToDisplay){
    countdownList.innerHTML="";
    const sortedCountdowns = [...countdownsToDisplay];
    sortedCountdowns.sort((a,b)=>{
        return new Date(a.date) - new Date(b.date)});
    for (let countdownEvent of sortedCountdowns){
        //creating div 
        const eventDiv=document.createElement("div");
        eventDiv.setAttribute("class","Event");
        //giving event name
        const eventName=document.createElement("p");
        eventName.textContent=countdownEvent.name;
        //finding days between
        let eventDate=new Date(countdownEvent.date);
        eventDate.setHours(0,0,0,0);
        let today=new Date();
        today.setHours(0, 0, 0, 0);
        const daysLeft=daysBetween(today,eventDate);
        if (daysLeft < 0){
            const index = events.findIndex((savedEvent) => {
                return savedEvent.name === countdownEvent.name;
            });

            if (index !== -1) {
                events.splice(index, 1);
                saveEvents();
            }
        }
        //displaying days between
        else{
            const countdown=document.createElement("p");
            daysLeft===1?countdown.textContent=daysLeft+" day to go.":(daysLeft===0?countdown.textContent="GoodLuck!":countdown.textContent=daysLeft+" days to go.");
            //creating delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "🗑️";
            deleteButton.classList.add("delete-event");
            deleteButton.addEventListener("click", (event) => {
                const eventDiv = event.target.parentElement;
                const eventName=eventDiv.querySelectorAll("p")[0].textContent;
                for(let i = 0; i < events.length; i++){
                    if(events[i].name == eventName){
                        events.splice(i, 1);
                        saveEvents();
                        break;
                    }
                }
                eventDiv.remove();
            });
            countdownList.appendChild(eventDiv);
            eventDiv.appendChild(eventName);
            eventDiv.appendChild(countdown);
            eventDiv.appendChild(deleteButton);
        }
    }
}

let savedEvents=localStorage.getItem("events");
if(savedEvents){
    events=JSON.parse(localStorage.getItem("events"));
}
displayCountdowns(events);

addEvent.addEventListener("click",()=>{
    countdownForm.hidden=false;
    countdownList.hidden=true;
})

countdownForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    countdownList.hidden=false;
    let eventName=document.querySelector("#event-name").value;
    let eventDate=document.querySelector("#event-date").value;
    let newEvent={
        name:eventName,
        date:eventDate
    };
    events.push(newEvent);
    countdownForm.reset();
    countdownForm.hidden=true;
    saveEvents();
    displayCountdowns(events);
});

// Projects

let projects = [];

function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

const savedProjects = localStorage.getItem("projects");

if (savedProjects) {
    projects = JSON.parse(savedProjects);
}

const addProject = document.querySelector("#add-project");
const projectForm = document.querySelector("#project-form");
const projectList = document.querySelector("#project-list");

addProject.addEventListener("click", () => {
    projectForm.hidden = false;
    projectList.hidden = true;
});
projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let projectName = projectForm.querySelector("#project-name").value;
    let projectDescription = projectForm.querySelector("#project-description").value;
    const project = {
        name: projectName,
        description: projectDescription,
        status: "Yet to Start"
    };
    projects.push(project);
    projectForm.reset();
    projectForm.hidden = true;
    projectList.hidden = false;
    saveProjects();
    displayProjects(projects);
});
function displayProjects(projectsToDisplay) {
    projectList.innerHTML = "";
    for (let project of projectsToDisplay) {

        // Creating project div
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("Project");
        // Creating project name
        const projectName = document.createElement("p");
        projectName.textContent = project.name;
        // Creating project description
        const projectDescription = document.createElement("p");
        projectDescription.textContent = project.description;
        // Creating status dropdown
        const statusSelect = document.createElement("select");
        const statuses = [
            "Yet to Start",
            "In Progress",
            "Completed",
            "On Hold"
        ];
        for (let status of statuses) {
            const option = document.createElement("option");
            option.textContent = status;
            option.value = status;
            statusSelect.appendChild(option);
        }
        // Set current project status in dropdown
        statusSelect.value = project.status;
        statusSelect.addEventListener("change", () => {
            project.status = statusSelect.value;
            saveProjects();
        });
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️";
        deleteButton.classList.add("delete-project");
        deleteButton.addEventListener("click", (event) => {
            const projectDiv = event.target.parentElement;
            const projectName = projectDiv.querySelectorAll("p")[0].textContent;
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].name === projectName) {
                    projects.splice(i, 1);
                    saveProjects();
                    break;
                }
            }
            projectDiv.remove();
        });
        // Adding everything to the project
        projectList.appendChild(projectDiv);
        projectDiv.appendChild(projectName);
        projectDiv.appendChild(projectDescription);
        projectDiv.appendChild(statusSelect);
        projectDiv.appendChild(deleteButton);
    }
}
displayProjects(projects);