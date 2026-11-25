const typesEl=document.querySelector('#types'),entriesEl=document.querySelector('#entries'),status=document.querySelector('#status');
const supported=('PerformanceObserver'in window)?(PerformanceObserver.supportedEntryTypes||[]):[];
const wanted=['navigation','resource','paint','mark','measure','longtask'];
for(const type of wanted){const span=document.createElement('span');span.className='chip';span.textContent=type+(supported.includes(type)?' ✓':' · unsupported');typesEl.append(span)}
function add(entry){const li=document.createElement('li'),d={type:entry.entryType,name:entry.name,startTime:Number(entry.startTime.toFixed(2)),duration:Number(entry.duration.toFixed(2))};li.textContent=JSON.stringify(d);entriesEl.prepend(li);while(entriesEl.children.length>80)entriesEl.lastChild.remove()}
if('PerformanceObserver'in window&&supported.length){const observer=new PerformanceObserver(list=>list.getEntries().forEach(add));try{observer.observe({entryTypes:wanted.filter(t=>supported.includes(t))})}catch(error){status.textContent='Observer setup: '+error.message}}else status.textContent='PerformanceObserver is not available.';
function refresh(){performance.getEntries().forEach(add)}
document.querySelector('#measure').addEventListener('click',()=>{const id=Date.now();performance.mark('lab-start-'+id);setTimeout(()=>{performance.mark('lab-end-'+id);performance.measure('lab-measure-'+id,'lab-start-'+id,'lab-end-'+id);refresh()},40)});
document.querySelector('#refresh').addEventListener('click',refresh);
document.querySelector('#clear').addEventListener('click',()=>{performance.clearMarks();performance.clearMeasures();entriesEl.replaceChildren();status.textContent='User Timing marks and measures cleared.'});
refresh();
