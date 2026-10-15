// Link formats copied verbatim from the Agent Sites code (src/utils/additionalAgentProtocols.mjs
// and generateAffiliateLink in scripts/generate-vigorbuy-static.mjs). Do not add formats here
// that are not used by those sites.
export const ADDITIONAL_AGENT_NAMES = Object.freeze([
  'Lolobuy', 'Pikobuy', 'ZentBuy', 'Wheebuy', 'BoonBuy', 'MyCNBox', 'GTBuy', 'OssBuy',
]);

export const ADDITIONAL_AGENT_KEYS = Object.freeze(ADDITIONAL_AGENT_NAMES.map(name => name.toLowerCase()));

export function normalizeAdditionalAgent(agent) {
  return String(agent || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').replace(/\.com$/, '');
}

export function parseAdditionalAgentRawLink(rawLink) {
  try {
    const url = new URL(rawLink);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const host = url.hostname.toLowerCase();
    const matches = domain => host === domain || host.endsWith(`.${domain}`);
    let platform, id;
    if (matches('weidian.com')) {
      platform = 'weidian';
      id = [...url.searchParams.entries()].find(([key]) => key.toLowerCase() === 'itemid')?.[1];
    } else if (matches('taobao.com') || matches('tmall.com')) {
      platform = 'taobao';
      id = url.searchParams.get('id');
    } else if (matches('1688.com')) {
      platform = '1688';
      id = url.pathname.match(/^\/offer\/(\d+)\.html\/?$/)?.[1];
    }
    return platform && /^\d+$/.test(id || '') ? { platform, id, rawUrl: url.href } : null;
  } catch {
    return null;
  }
}

export function additionalAgentProductLink(rawLink, agent, promo = '', options = {}) {
  const key = normalizeAdditionalAgent(agent);
  if (!ADDITIONAL_AGENT_KEYS.includes(key)) return null;
  const source = parseAdditionalAgentRawLink(rawLink);
  if (!source) return '';
  const { platform, id, rawUrl } = source;
  let url;
  if (key === 'lolobuy') {
    // The official router uses this path component as a view key. The complete
    // query URL, not the route key, identifies the source product.
    url = new URL(`/productDetail/${id}`, 'https://www.lolobuy.com');
    url.searchParams.set('url', rawUrl);
  } else if (key === 'pikobuy') {
    url = new URL('/product/detail', 'https://www.pikobuy.com');
    if (options.inviterUserId) url.searchParams.set('inviterUserId', String(options.inviterUserId));
    url.searchParams.set('invitedCode', promo);
    url.searchParams.set('productUrl', rawUrl);
    return url.href;
  } else if (key === 'mycnbox') {
    url = new URL('/goodsDetail', 'https://mycnbox.com');
    url.searchParams.set('mallType', platform);
    url.searchParams.set('itemId', id);
    if (options.referId) url.searchParams.set('referId', String(options.referId));
  } else if (key === 'ossbuy') {
    url = new URL('/product-detail', 'https://www.ossbuy.com');
    url.searchParams.set('url', rawUrl);
  } else {
    const channels = key === 'wheebuy'
      ? { weidian: 'WEIDIAN', taobao: 'TAOBAO', '1688': '1688' }
      : { weidian: '2', taobao: '1', '1688': '0' };
    const host = key === 'zentbuy' ? 'www.zentbuy.com' : `${key}.com`;
    url = new URL(`/product/${channels[platform]}/${id}`, `https://${host}`);
  }
  url.searchParams.set('inviteCode', promo);
  if (key === 'wheebuy' || key === 'gtbuy') {
    url.searchParams.set('goodsInviteCode', promo);
    url.searchParams.set('sourceChannel', '41');
    url.searchParams.set('idp', '1');
  }
  return url.href;
}

function platformId(directLink){
  const link=String(directLink||'');
  if(link.includes('weidian.com')){const m=link.match(/itemID=(\d+)/i); if(m) return {id:m[1], platform:'weidian'};}
  if(link.includes('tmall.com')||link.includes('taobao.com')){const m=link.match(/id=(\d+)/i); if(m) return {id:m[1], platform:'taobao'};}
  if(link.includes('1688.com')){const m=link.match(/offer\/(\d+)\.html/i); if(m) return {id:m[1], platform:'1688'};}
  return {id:'', platform:''};
}

function generateAffiliateLink(directLink, agent='vigorbuy.com', promo='', options={}){
  if(!directLink) return '';
  const additional=additionalAgentProductLink(directLink,agent,promo,options);
  if(additional!==null) return additional;
  const clean=String(agent||'').replace(/^https?:\/\//i,'').replace(/^www\./i,'');
  const formatted=clean.endsWith('.com')?clean:`${clean}.com`;
  const a=formatted.toLowerCase();
  if(a==='superbuy.com') return `https://www.superbuy.com/en/page/buy/?nTag=Home-search&from=search-input&url=${encodeURIComponent(directLink)}${promo?`&partnercode=${encodeURIComponent(promo)}`:''}`;
  const {id,platform}=platformId(directLink);
  const enc=encodeURIComponent(directLink);
  const q=promo?encodeURIComponent(promo):'';
  if(a==='vigorbuy.com'&&id){const t=platform==='weidian'?'2':platform==='taobao'?'1':'0'; return `https://vigorbuy.com/product/${t}/${id}${q?`?inviteCode=${q}`:''}`;}
  if(a==='hipobuy.com'&&id){const t=platform==='weidian'?'weidian':platform==='taobao'?'1':'0'; return `https://hipobuy.com/product/${t}/${id}${q?`?inviteCode=${q}`:''}`;}
  if(a==='joyagoo.com'&&id){const t=platform==='weidian'?'WEIDIAN':platform==='taobao'?'TAOBAO':'ALI_1688'; return `https://joyagoo.com/product?id=${id}&platform=${t}${q?`&ref=${q}`:''}`;}
  if(a==='kakobuy.com') return `https://www.kakobuy.com/item/details?url=${enc}${q?`&affcode=${q}`:''}`;
  if(a==='litbuy.com'&&id){const t=platform==='weidian'?'weidian':platform==='taobao'?'1':'0'; return `https://litbuy.com/product/${t}/${id}${q?`?inviteCode=${q}`:''}`;}
  if(a==='loongbuy.com') return `https://www.loongbuy.com/product-details?url=${enc}${q?`&invitecode=${q}`:''}`;
  if(a==='lovegobuy.com'&&id){const t=platform==='weidian'?'weidian':platform==='taobao'?'taobao':'ali_1688'; return `https://www.lovegobuy.com/product?id=${id}&shop_type=${t}${q?`&invite_code=${q}`:''}`;}
  if(a==='mulebuy.com'&&id){const t=platform==='weidian'?'WEIDIAN':platform==='taobao'?'TAOBAO':'ALI_1688'; return `https://mulebuy.com/product?id=${id}&platform=${t}&ref=${q}`;}
  if(a==='oopbuy.com'&&id){const t=platform==='weidian'?'weidian':platform==='taobao'?'1':'0'; return `https://oopbuy.com/product/${t}/${id}${q?`?inviteCode=${q}`:''}`;}
  if(a==='sugargoo.com') return `https://www.sugargoo.com/productDetail?productLink=${enc}${q?`&memberId=${q}`:''}`;
  if(a==='usfans.com'&&id){const t=platform==='weidian'?'3':platform==='taobao'?'2':'1'; return `https://www.usfans.com/product/${t}/${id}${q?`?ref=${q}`:''}`;}
  return directLink;
}

export { platformId, generateAffiliateLink };
