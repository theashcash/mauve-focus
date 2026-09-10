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

//timer
let displaySecond;
let displayMinute;
let totalSeconds=0;
let totalStudyTime=0;
let timer;
let stopWatch;
let currentTimer;
let remainingSeconds;
let currentMode='stopwatch';


let minStudyTime=document.querySelector(".min-time-box");
let minStudyTimeVal=minStudyTime.querySelector(".time-value");
let hourStudyTime=document.querySelector(".hour-time-box");
let hourStudyTimeVal=hourStudyTime.querySelector(".time-value");


const startFocus=document.querySelector("#start-focus");
const stopFocus=document.querySelector("#stop-focus");
const pauseFocus=document.querySelector("#pause-focus");
const resumeFocus=document.querySelector("#resume-focus");
const postStart=document.querySelector("#post-start");
const stopwatchMode = document.querySelector("#stopwatch-mode");
const timerMode = document.querySelector("#timer-mode");
const timerButtons = document.querySelector(".timer-buttons");
const customTimer = document.querySelector(".custom-timer");
const pomodoro = document.querySelector("#pomodoro");
const timerDisplay=document.querySelector("#timer-display");
const timerButton = document.querySelectorAll(".timer-button");


function startStopwatch(){
    stopWatch=setInterval(()=> {
        totalSeconds++;
        displayMinute=Math.floor(totalSeconds/60);
        displaySecond=totalSeconds%60;
        if(displayMinute<10) displayMinute="0"+displayMinute;
        if(displaySecond<10) displaySecond="0"+displaySecond; 
        timerDisplay.textContent=displayMinute+":"+displaySecond;
    },1000);
}
function startTimer(){
    remainingSeconds = Number(currentTimer) * 60;
    timer = setInterval(() => {
        if(remainingSeconds === 0){
            clearInterval(timer);
            return;
        }
        remainingSeconds--;
        displayMinute = Math.floor(remainingSeconds / 60);
        displaySecond = remainingSeconds % 60;
        if(displayMinute < 10) displayMinute = "0" + displayMinute;
        if(displaySecond < 10) displaySecond = "0" + displaySecond;
        timerDisplay.textContent = displayMinute + ":" + displaySecond;

    },1000);
}
function resumeTimer(){
    timer = setInterval(() => {
        displayMinute = Math.floor(remainingSeconds / 60);
        displaySecond = remainingSeconds % 60;
        if(displayMinute < 10) displayMinute = "0" + displayMinute;
        if(displaySecond < 10) displaySecond = "0" + displaySecond;
        timerDisplay.textContent = displayMinute + ":" + displaySecond;
        if(remainingSeconds === 0){
            clearInterval(timer);
            return;
        }
        remainingSeconds--;
    },1000);
}
function displayTimer(x){
    timerDisplay.textContent = x+":00";
}

for(let button of timerButton){
    button.addEventListener("click",(event)=>{
        currentTimer=event.target.textContent;
        displayTimer(currentTimer);
    });
}

timerButtons.hidden = true;
customTimer.hidden = true;
pomodoro.classList.add("stopwatch-layout");
postStart.hidden=true;
resumeFocus.hidden=true;

stopwatchMode.addEventListener("click", () => {
    currentMode="stopwatch";
    timerButtons.hidden = true;
    customTimer.hidden = true;
    pomodoro.classList.add("stopwatch-layout");
});
timerMode.addEventListener("click", () => {
    currentMode="timer";
    timerButtons.hidden = false;
    customTimer.hidden = false;
    pomodoro.classList.remove("stopwatch-layout");
});

startFocus.addEventListener("click",() => {
    startFocus.hidden=true;
    postStart.hidden=false;
    if(currentMode === "stopwatch"){
        startStopwatch();
    }
    else if(currentMode === "timer"){
        startTimer();
    } 
});
stopFocus.addEventListener("click",()=>{
    // Show Start button again
    startFocus.hidden=false;
    // Hide Pause/Resume/Stop buttons
    postStart.hidden=true;
    // Reset Pause/Resume buttons for the next session
    pauseFocus.hidden=false;
    resumeFocus.hidden=true;

    // STOPWATCH
    if(currentMode === "stopwatch"){
        // Stop the stopwatch interval
        clearInterval(stopWatch);
        // Add the time studied in this session
        totalStudyTime += totalSeconds;
        // Reset stopwatch seconds
        totalSeconds=0;
    }
    // TIMER
    else if(currentMode === "timer"){
        // Stop the timer interval
        clearInterval(timer);
        // Calculate how many seconds were studied
        let studiedSeconds = (Number(currentTimer) * 60) - remainingSeconds;
        // Add the studied time to total study time
        totalStudyTime += studiedSeconds;
        // Reset remaining timer
        remainingSeconds=0;
    }
    // Reset timer display
    timerDisplay.textContent="00:00";
    // Update Today's Study Time
    let totalStudyHours=Math.floor(totalStudyTime/3600);
    let totalStudyMin=Math.floor((totalStudyTime%3600)/60);
    if(totalStudyMin<10){
        totalStudyMin="0"+totalStudyMin;
    }
    hourStudyTimeVal.textContent=totalStudyHours;
    minStudyTimeVal.textContent=totalStudyMin;
});
pauseFocus.addEventListener("click",()=>{
    pauseFocus.hidden=true;
    resumeFocus.hidden=false;

    if(currentMode === "stopwatch"){
        clearInterval(stopWatch);
    }
    else if(currentMode === "timer"){
        clearInterval(timer);
    }
});
resumeFocus.addEventListener("click",()=>{
    pauseFocus.hidden=false;
    resumeFocus.hidden=true;

    if(currentMode === "stopwatch"){
        startStopwatch();
    }
    else if(currentMode === "timer"){
        resumeTimer();
    }
});



