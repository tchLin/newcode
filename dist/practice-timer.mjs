export const timerDurations=[15,20,30,45,60,90];
export function defaultMinutes(problem,isLab=false){return isLab?problem.time:problem.difficulty==='Hard'?45:problem.difficulty==='Medium'?30:20;}
export function remainingSeconds(timer,now=Date.now()){
 return timer.deadline===null?timer.remaining:Math.max(0,Math.ceil((timer.deadline-now)/1000));
}
export function restoreTimer(value,minutes=30,now=Date.now()){
 const duration=timerDurations.includes(value?.duration/60)?value.duration:minutes*60;
 const remaining=Number.isFinite(value?.remaining)?Math.max(0,Math.min(duration,Math.floor(value.remaining))):duration;
 const deadline=Number.isFinite(value?.deadline)&&value.deadline>0?Math.min(value.deadline,now+duration*1000):null;
 return {duration,remaining,deadline};
}
export function toggleCountdown(timer,now=Date.now()){
 if(timer.deadline!==null){timer.remaining=remainingSeconds(timer,now);timer.deadline=null;return 'paused';}
 if(timer.remaining===0)timer.remaining=timer.duration;
 timer.deadline=now+timer.remaining*1000;return 'started';
}
export function resetCountdown(timer,minutes=timer.duration/60){
 if(!timerDurations.includes(minutes))throw new Error('Choose a supported timer duration.');
 Object.assign(timer,{duration:minutes*60,remaining:minutes*60,deadline:null});
}
export function portableTimer(timer,now=Date.now()){
 const clean=restoreTimer(timer,30,now);return {...clean,remaining:remainingSeconds(clean,now),deadline:null};
}
