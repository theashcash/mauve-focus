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



let minStudyTime=document.querySelector(".min-time-box");
let minStudyTimeVal=minStudyTime.querySelector(".time-value");
let hourStudyTime=document.querySelector(".hour-time-box");
let hourStudyTimeVal=hourStudyTime.querySelector(".time-value");


const timerDisplay=document.querySelector("#timer-display");
const startFocus=document.querySelector("#start-focus");
const stopFocus=document.querySelector("#stop-focus");
const pauseFocus=document.querySelector("#pause-focus");
const resumeFocus=document.querySelector("#resume-focus");
const postStart=document.querySelector("#post-start");

function startStopwatch(){
    timer=setInterval(()=> {
        totalSeconds++;
        displayMinute=Math.floor(totalSeconds/60);
        displaySecond=totalSeconds%60;
        if(displayMinute<10) displayMinute="0"+displayMinute;
        if(displaySecond<10) displaySecond="0"+displaySecond; 
        timerDisplay.textContent=displayMinute+":"+displaySecond;
    },1000);
}

postStart.hidden=true;
resumeFocus.hidden=true;
startFocus.addEventListener("click",() => {
    startFocus.hidden=true;
    postStart.hidden=false;
    startStopwatch();
    
});
stopFocus.addEventListener("click",()=>{
    startFocus.hidden=false;
    postStart.hidden=true;
    timerDisplay.textContent="00:00";
    clearInterval(timer);
    totalStudyTime+=totalSeconds;
    totalSeconds=0;
    let totalStudyHours=Math.floor(totalStudyTime/3600);
    let totalStudyMin=Math.floor((totalStudyTime%3600)/60);
    if(totalStudyMin<10) totalStudyMin="0"+totalStudyMin;
    minStudyTimeVal.textContent=totalStudyMin;
    hourStudyTimeVal.textContent=totalStudyHours;
});
pauseFocus.addEventListener("click",()=>{
    pauseFocus.hidden=true;
    resumeFocus.hidden=false;
    clearInterval(timer);

});
resumeFocus.addEventListener("click",()=>{
    pauseFocus.hidden=false;
    resumeFocus.hidden=true;
    startStopwatch();
});



