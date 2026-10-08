(() => {
  const A=window.Analytics, currency=STORE_CONFIG.currency;
  const products=[
    {id:'DD-001',name:'Daily Carry Backpack',category:'On the go',price:1499,icon:'🎒',color:'#d9eef3',tag:'Bestseller',description:'A lightweight companion with room for your laptop and daily essentials.'},
    {id:'DD-002',name:'Focus Notebook',category:'Workspace',price:299,icon:'📓',color:'#e6e8ff',tag:'Daily favourite',description:'Dotted pages for plans, ideas, and the occasional very good doodle.'},
    {id:'DD-003',name:'Slow Morning Mug',category:'Everyday',price:499,icon:'☕',color:'#ffe3cf',tag:'',description:'A ceramic mug for your morning coffee or an afternoon pause.'},
    {id:'DD-004',name:'Everywhere Bottle',category:'On the go',price:799,icon:'🥤',color:'#e1f0d5',tag:'',description:'A reusable insulated bottle made for busy days and longer walks.'},
    {id:'DD-005',name:'Desk Headphones',category:'Workspace',price:2499,icon:'🎧',color:'#dce3ef',tag:'Focus essential',description:'Over-ear headphones for a little less noise and a little more focus.'},
    {id:'DD-006',name:'Weekend Tote',category:'Everyday',price:599,icon:'👜',color:'#ffe4e6',tag:'',description:'An easy carryall for groceries, books, and unplanned weekend adventures.'}
  ];
  const $=id=>document.getElementById(id), money=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency,maximumFractionDigits:0}).format(v);
  let cart=A.read('dd-cart',{});
  cart=Object.fromEntries(Object.entries(cart).filter(([id,q])=>products.some(p=>p.id===id)&&Number.isInteger(q)&&q>0&&q<=99));
  let selected=null, checkoutOpen=false, submitting=false;
  const item=(p,q=1)=>({item_id:p.id,item_name:p.name,item_brand:'Desk & Day',item_category:p.category,item_list_id:'daily_essentials',item_list_name:'Daily essentials',price:p.price,quantity:q});
  const items=()=>products.filter(p=>cart[p.id]).map(p=>item(p,cart[p.id]));
  const value=()=>items().reduce((sum,p)=>sum+p.price*p.quantity,0);
  const event=(name,its,extra={})=>A.track(name,{currency,value:its.reduce((s,p)=>s+p.price*p.quantity,0),items:its,...extra});
  const save=()=>{A.write('dd-cart',cart);$('cart-count').textContent=Object.values(cart).reduce((s,q)=>s+q,0);};
  let toastTimer; const toast=text=>{$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2200);};
  window.addEventListener('tracking-error',()=>toast('Analytics tag could not load. Check blockers and your connection.'));
  function visibleProducts(){let result=products.filter(p=>($('category').value==='All'||p.category===$('category').value)&&p.name.toLowerCase().includes($('search').value.trim().toLowerCase()));if($('sort').value==='low')result.sort((a,b)=>a.price-b.price);if($('sort').value==='high')result.sort((a,b)=>b.price-a.price);return result;}
  function listEvent(){const ps=visibleProducts();if(ps.length)A.track('view_item_list',{item_list_id:'daily_essentials',item_list_name:'Daily essentials',items:ps.map((p,index)=>({...item(p),index}))});}
  function renderProducts(){const ps=visibleProducts();$('result-count').textContent=`${ps.length} essentials`;$('empty').hidden=!!ps.length;$('products').innerHTML=ps.map(p=>`<article class="product-card"><button class="product-art" data-product="${p.id}" style="background:${p.color}" aria-label="View ${p.name}"><span aria-hidden="true">${p.icon}</span>${p.tag?`<span class="tag">${p.tag}</span>`:''}</button><div class="product-info"><div><h3>${p.name}</h3><p>${p.category}</p></div><span class="price">${money(p.price)}</span></div><button class="add" data-add="${p.id}">Add to bag</button></article>`).join('');}
  function add(id){const p=products.find(p=>p.id===id);if((cart[id]||0)>=99){toast('Maximum 99 per item');return;}cart[id]=(cart[id]||0)+1;save();event('add_to_cart',[item(p)]);toast(`${p.name} added`);}
  function renderCart(){const ps=products.filter(p=>cart[p.id]);$('cart-lines').innerHTML=ps.length?ps.map(p=>`<div class="cart-line"><div><strong>${p.icon} ${p.name}</strong><p>${money(p.price)} each</p><button class="link" data-remove="${p.id}">Remove</button></div><div class="qty"><button data-change="${p.id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span>${cart[p.id]}</span><button data-change="${p.id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button></div></div>`).join(''):'<p>Your bag is empty. Pick an everyday essential.</p>';$('cart-summary').innerHTML=`<div class="totals"><div><span>Subtotal</span><span>${money(value())}</span></div></div>`;$('checkout-button').disabled=!ps.length;}
  function shipping(){return document.querySelector('input[name=delivery]:checked').value==='Express'?149:value()>=2000?0:49;}
  function renderOrder(){const sub=value(),fee=shipping();$('order-summary').innerHTML=`<div class="totals"><div><span>Items</span><span>${money(sub)}</span></div><div><span>Delivery</span><span>${money(fee)}</span></div><div><span>Demo total</span><span>${money(sub+fee)}</span></div></div>`;}
  $('products').addEventListener('click',e=>{const addButton=e.target.closest('[data-add]');if(addButton){add(addButton.dataset.add);return;}const b=e.target.closest('[data-product]');if(!b)return;selected=products.find(p=>p.id===b.dataset.product);const p=selected;A.track('select_item',{item_list_id:'daily_essentials',item_list_name:'Daily essentials',items:[item(p)]});event('view_item',[item(p)]);$('product-detail').innerHTML=`<div class="detail-art" style="background:${p.color}" aria-hidden="true">${p.icon}</div><p class="eyebrow">${p.category.toUpperCase()}</p><h2>${p.name}</h2><p>${p.description}</p><h3>${money(p.price)}</h3><button id="detail-add" class="dark wide">Add to bag</button>`;$('detail-add').onclick=()=>add(p.id);$('product-dialog').showModal();});
  let searchTimer;$('search').addEventListener('input',()=>{renderProducts();clearTimeout(searchTimer);searchTimer=setTimeout(()=>{const query=$('search').value.trim();/* Only catalogue vocabulary goes to GA; arbitrary typed text may contain PII. */if(query)A.track('search',{search_term:query.toLowerCase().split(/\s+/).every(w=>products.some(p=>p.name.toLowerCase().split(/\s+/).includes(w)))?query.toLowerCase():'other',result_count:visibleProducts().length});listEvent();},600);});
  for(const id of ['category','sort'])$(id).addEventListener('change',()=>{renderProducts();A.track('catalog_filter',{filter_type:id,filter_value:$(id).value});listEvent();});
  $('cart-button').onclick=()=>{renderCart();event('view_cart',items());$('cart-dialog').showModal();};
  $('cart-lines').addEventListener('click',e=>{const b=e.target.closest('[data-change],[data-remove]');if(!b)return;const id=b.dataset.change||b.dataset.remove,p=products.find(p=>p.id===id);if(b.dataset.remove){event('remove_from_cart',[item(p,cart[id])]);delete cart[id];}else{const delta=Number(b.dataset.delta);if(delta>0&&cart[id]>=99)return;event(delta>0?'add_to_cart':'remove_from_cart',[item(p)]);cart[id]+=delta;if(cart[id]===0)delete cart[id];}save();renderCart();});
  $('checkout-button').onclick=()=>{if(!items().length)return;$('cart-dialog').close();checkoutOpen=true;submitting=false;event('begin_checkout',items());renderOrder();$('checkout-dialog').showModal();};
  $('checkout-form').addEventListener('change',renderOrder);
  $('checkout-form').addEventListener('submit',e=>{e.preventDefault();if(!checkoutOpen||submitting||!items().length)return;submitting=true;const its=items(),sub=value(),fee=shipping(),shippingTier=document.querySelector('input[name=delivery]:checked').value,paymentType=document.querySelector('input[name=payment]:checked').value;
    event('add_shipping_info',its,{shipping_tier:shippingTier});event('add_payment_info',its,{payment_type:paymentType});
    const transaction_id='DEMO-'+crypto.randomUUID();
    // Revenue excludes delivery and tax; delivery is a separate GA parameter.
    event('purchase',its,{transaction_id,shipping:fee,tax:0});
    A.write('dd-last-order',{transaction_id,value:sub,shipping:fee,items:its,time:new Date().toISOString()});cart={};save();checkoutOpen=false;$('checkout-dialog').close();$('order-confirmation').innerHTML=`<p>Your simulated order is confirmed.</p><p class="mono">${transaction_id}</p><p>Demo total: <strong>${money(sub+fee)}</strong></p><p>No payment has been collected. ${A.enabled?'Analytics events were queued. Verify receipt in GA4.':'GA4 sending is off. Accept analytics and configure your ID to measure future orders.'}</p>`;$('success-dialog').showModal();
  });
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
  $('checkout-dialog').addEventListener('close',()=>{checkoutOpen=false;});
  window.addEventListener('analytics-ready',listEvent);
  renderProducts();save();listEvent();
})();
