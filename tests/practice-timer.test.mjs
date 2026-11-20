import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreTimer,remainingSeconds,toggleCountdown,resetCountdown,portableTimer,defaultMinutes} from '../dist/practice-timer.mjs';
test('Countdown pauses, resumes, expires and restarts without losing time',()=>{
 const timer=restoreTimer(null,20,0);assert.equal(toggleCountdown(timer,1000),'started');assert.equal(remainingSeconds(timer,61000),1140);
 assert.equal(toggleCountdown(timer,61000),'paused');assert.equal(remainingSeconds(timer,999000),1140);
 toggleCountdown(timer,1000000);assert.equal(remainingSeconds(timer,2140000),0);
 toggleCountdown(timer,2140000);assert.equal(timer.remaining,0);toggleCountdown(timer,2200000);assert.equal(remainingSeconds(timer,2200000),1200);
});
test('Durations reset explicitly and imported timers are paused with remaining time',()=>{
 const timer=restoreTimer(null,45,0);toggleCountdown(timer,1000);const copy=portableTimer(timer,31000);
 assert.deepEqual(copy,{duration:2700,remaining:2670,deadline:null});assert.notEqual(timer.deadline,null);
 resetCountdown(timer,15);assert.deepEqual(timer,{duration:900,remaining:900,deadline:null});assert.throws(()=>resetCountdown(timer,-1));
 assert.equal(restoreTimer({duration:-1,remaining:Infinity,deadline:'bad'},30).remaining,1800);
});
test('Problem defaults scale by difficulty and lab defaults use their brief',()=>{
 assert.equal(defaultMinutes({difficulty:'Easy'}),20);assert.equal(defaultMinutes({difficulty:'Medium'}),30);assert.equal(defaultMinutes({difficulty:'Hard'}),45);assert.equal(defaultMinutes({time:60},true),60);
});
