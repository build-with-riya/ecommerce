/* One direct gtag integration. Do not also install GTM or another GA tag. */
(() => {
  const config = window.STORE_CONFIG;
  const debug = new URLSearchParams(location.search).get('debug') === '1';
  const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const validId = /^G-[A-Z0-9]+$/.test(config.measurementId) && config.measurementId !== 'G-REPLACE-ME';
  const key = 'dd-consent';
  let loaded = false;
  const read = (name, fallback) => { try { return JSON.parse(localStorage.getItem(name)) ?? fallback; } catch { return fallback; } };
  const write = (name, value) => { try { localStorage.setItem(name, JSON.stringify(value)); } catch {} };
  let consent = read(key, null);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  // Basic consent model: Google script is not downloaded before acceptance.
  gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
  function initialize() {
    if (loaded || consent !== 'yes' || !validId || (localHost && !debug)) return;
    loaded = true;
    gtag('consent', 'update', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    gtag('js', new Date());
    gtag('config', config.measurementId, {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, ...(debug ? {debug_mode:true} : {})});
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.measurementId;
    tag.onerror = () => { window.dispatchEvent(new CustomEvent('tracking-error')); };
    document.head.append(tag);
  }
  function track(name, params = {}) {
    const payload = {...params, demo_mode:'portfolio', ...(debug ? {debug_mode:true} : {})};
    const queued = consent === 'yes' && loaded;
    // Queued is deliberately not called delivered: GA4 receipt requires DebugView/Realtime.
    if (consent === 'yes' || debug) {
      const log = read('dd-events', []);
      log.push({time:new Date().toISOString(), event:name, params:payload, status:queued?'queued_for_ga4':'local_only'});
      write('dd-events', log.slice(-500));
    }
    if (queued) {
      gtag('set', {ecommerce:null});
      gtag('event', name, payload);
    }
    window.dispatchEvent(new CustomEvent('tracking-event', {detail:{name, payload}}));
  }
  function pageView() {
    // Keep only campaign parameters: unknown URL fields could contain personal data.
    const url = new URL(location.href); url.hash = ''; url.search = '';
    const current = new URLSearchParams(location.search);
    for (const p of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      if(current.has(p)) url.searchParams.set(p, current.get(p).slice(0,100));
    }
    let referrer = ''; try { const ref = new URL(document.referrer); ref.search=''; ref.hash=''; referrer=ref.href; } catch {}
    track('page_view', {page_title:document.title,page_location:url.href,page_referrer:referrer});
  }
  window.Analytics = {track, read, write, debug, get consent(){return consent;}, get enabled(){return loaded && consent==='yes';},
    choose(value) {
      consent=value; write(key,value);
      if(value==='yes'){initialize(); pageView(); window.dispatchEvent(new CustomEvent('analytics-ready'));}
      else { gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'}); write('dd-events',[]); location.reload(); }
    },
    showChoices(){document.getElementById('consent-banner').hidden=false;}
  };
  document.getElementById('accept')?.addEventListener('click',()=>{Analytics.choose('yes');document.getElementById('consent-banner').hidden=true;});
  document.getElementById('decline')?.addEventListener('click',()=>Analytics.choose('no'));
  document.getElementById('privacy-settings')?.addEventListener('click',()=>Analytics.showChoices());
  if(document.getElementById('consent-banner')) document.getElementById('consent-banner').hidden=consent!==null;
  initialize(); pageView();
})();
