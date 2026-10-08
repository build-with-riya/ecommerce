/* Optional QA: npm install; start the server in another terminal; npm test. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext();
 const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Offline GA stub verifies generated payloads, not delivery to Google's service.
 await page.route('https://www.googletagmanager.com/**',route=>route.fulfill({contentType:'application/javascript',body:'/* GA stub */'}));
 await page.route('**/config.js',route=>route.fulfill({contentType:'application/javascript',body:"window.STORE_CONFIG={measurementId:'G-TEST123456',currency:'INR',storeName:'Desk & Day'};"}));
 await page.goto('http://localhost:8000/index.html?debug=1');
 assert.equal(await page.locator('.product-card').count(),6);
 assert.equal(await page.evaluate(()=>dataLayer.filter(a=>a[0]==='event').length),0,'No Google event before consent');
 await page.click('#accept');
 await page.click('[data-product="DD-001"]');await page.click('#detail-add');await page.click('[data-close="product-dialog"]');
 await page.click('[data-add="DD-002"]');await page.click('#cart-button');
 await page.click('[data-change="DD-002"][data-delta="1"]');await page.click('[data-change="DD-002"][data-delta="-1"]');
 await page.click('#checkout-button');await page.check('input[name=delivery][value=Express]');await page.check('input[name=payment][value="Demo Card"]');
 await page.click('button[type=submit]');
 let log=await page.evaluate(()=>JSON.parse(localStorage.getItem('dd-events')));
 const purchase=log.filter(e=>e.event==='purchase');assert.equal(purchase.length,1);assert.equal(purchase[0].params.value,1798);assert.equal(purchase[0].params.shipping,149);assert.equal(purchase[0].params.items.length,2);assert.ok(purchase[0].params.transaction_id.startsWith('DEMO-'));
 assert.deepEqual(log.filter(e=>['begin_checkout','add_shipping_info','add_payment_info','purchase'].includes(e.event)).map(e=>e.event),['begin_checkout','add_shipping_info','add_payment_info','purchase']);
 assert.equal(await page.locator('#cart-count').textContent(),'0');
 await page.reload();log=await page.evaluate(()=>JSON.parse(localStorage.getItem('dd-events')));assert.equal(log.filter(e=>e.event==='purchase').length,1,'No purchase on refresh');
 await page.fill('#search','private@example.com');await page.waitForTimeout(700);log=await page.evaluate(()=>JSON.parse(localStorage.getItem('dd-events')));assert.equal(log.findLast(e=>e.event==='search').params.search_term,'other');
 await page.goto('http://localhost:8000/inspector.html');assert.equal(await page.locator('#order-total').textContent(),'1');
 await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:8000/index.html?debug=1');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile width');
 await page.screenshot({path:'../storefront-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'../storefront-desktop.png',fullPage:true});
 // Decline clears diagnostics and prevents further GA requests/events after reload.
 await page.click('#privacy-settings');await page.click('#decline');await page.waitForLoadState();
 await page.waitForFunction(()=>window.Analytics?.consent==='no');await page.click('[data-add="DD-001"]');
 assert.equal(await page.evaluate(()=>dataLayer.filter(a=>a[0]==='event').length),0);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: consent gating, item payloads, cart quantities, checkout order, purchase totals, deduplication on refresh, search privacy, inspector, mobile layout, decline. Google delivery was not tested.');
})().catch(e=>{console.error(e);process.exit(1);});
