const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
const now=new Date();
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

//pomodoro timer 
//pomodoro timer 
let displaySecond;
let displayMinute;
let totalSeconds = 0;
let totalStudyTime = 0;
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
        totalSeconds = 0;
    }
    else if(currentMode === "timer"){
        clearInterval(timer);
        // Total selected time - time remaining
        let studiedSeconds =
            (Number(currentTimer) * 60) - remainingSeconds;
        totalStudyTime += studiedSeconds;
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