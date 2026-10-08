/* Dependency-free event/flow verification with a minimal DOM harness.
   Does not substitute for visual/browser QA or live GA4 validation. */
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
function environment(consent=null){
 class Element {constructor(){this.listeners={};this.value='';this.dataset={};this.classList={add(){},remove(){}};}addEventListener(n,f){(this.listeners[n]??=[]).push(f);}emit(n,e={}){for(const f of this.listeners[n]||[])f(e);}showModal(){this.open=true;}close(){this.open=false;this.emit('close');}append(){} }
 const elements=new Map(); const get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
 get('category').value='All';get('sort').value='featured';
 const radios={delivery:{value:'Standard'},payment:{value:'Demo UPI'}};
 const storage=new Map(consent?[['dd-consent',JSON.stringify(consent)]]:[]);
 const events={};const ctx={console,URL,URLSearchParams,Intl,Date,JSON,Object,Number,Map,setTimeout,clearTimeout,crypto:require('node:crypto').webcrypto,
   location:{search:'?debug=1',hostname:'localhost',href:'http://localhost:8000/index.html?debug=1',reload(){}},
   localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
   CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts?.detail;}},
   addEventListener:(n,f)=>(events[n]??=[]).push(f),dispatchEvent:e=>{for(const f of events[e.type]||[])f(e);},
   document:{title:'Desk & Day',referrer:'',getElementById:get,createElement:()=>new Element(),head:new Element(),querySelectorAll:()=>[],querySelector:s=>s.includes('delivery')?radios.delivery:radios.payment}
 };ctx.window=ctx;vm.createContext(ctx);
 vm.runInContext(fs.readFileSync('config.js','utf8'),ctx);ctx.STORE_CONFIG={measurementId:'G-TEST123',currency:'INR',storeName:'Desk & Day'};
 vm.runInContext(fs.readFileSync('assets/analytics.js','utf8'),ctx);vm.runInContext(fs.readFileSync('assets/app.js','utf8'),ctx);
 return {ctx,get,radios,storage,log:()=>JSON.parse(storage.get('dd-events')||'[]'),click:(id,e)=>get(id).emit('click',e)};
}
const env=environment(),{ctx,get,radios}=env;
assert.equal(ctx.dataLayer.filter(a=>a[0]==='event').length,0,'No sending before consent');
assert.equal((get('products').innerHTML.match(/class="product-card"/g)||[]).length,6);
env.click('accept');assert.equal(ctx.Analytics.enabled,true);
function target(data){return {target:{closest:selector=>selector==='[data-add]'&&data.add?{dataset:{add:data.add}}:selector==='[data-product]'&&data.product?{dataset:{product:data.product}}:selector==='[data-change],[data-remove]'?{dataset:data}:null}};}
env.click('products',target({product:'DD-001'}));get('detail-add').onclick();get('product-dialog').close();
env.click('products',target({add:'DD-002'}));get('cart-button').onclick();
env.click('cart-lines',target({change:'DD-002',delta:'1'}));env.click('cart-lines',target({change:'DD-002',delta:'-1'}));
get('checkout-button').onclick();radios.delivery.value='Express';radios.payment.value='Demo Card';get('checkout-form').emit('submit',{preventDefault(){}});
let log=env.log(),purchase=log.filter(e=>e.event==='purchase');assert.equal(purchase.length,1);assert.equal(purchase[0].params.value,1798);assert.equal(purchase[0].params.shipping,149);assert.equal(purchase[0].params.items.length,2);assert.ok(purchase[0].params.transaction_id.startsWith('DEMO-'));assert.equal(get('cart-count').textContent,0);
assert.deepEqual(log.filter(e=>['begin_checkout','add_shipping_info','add_payment_info','purchase'].includes(e.event)).map(e=>e.event),['begin_checkout','add_shipping_info','add_payment_info','purchase']);
get('checkout-form').emit('submit',{preventDefault(){}});assert.equal(env.log().filter(e=>e.event==='purchase').length,1);
// Re-run application initialization against retained state; no repeated order.
vm.runInContext(fs.readFileSync('assets/app.js','utf8'),ctx);assert.equal(env.log().filter(e=>e.event==='purchase').length,1);
const declined=environment('no');declined.click('products',target({add:'DD-001'}));assert.equal(declined.ctx.dataLayer.filter(a=>a[0]==='event').length,0);
console.log('PASS: catalogue, consent gate, product selection, cart deltas, checkout sequence, item/delivery totals, empty cart, repeat-submit guard and no purchase on initialization. DOM harness only; no browser rendering or live Google delivery.');
