// agent-link-converter: turn Taobao / Tmall / Weidian / 1688 product URLs into
// shopping-agent product links. Pure functions, no network access, no tracking.
import { parseAdditionalAgentRawLink, generateAffiliateLink } from './formats.js';

/** The 18 supported agents: key -> display name and the agent host used by the format table. */
export const AGENTS = Object.freeze({
  boonbuy: { name: 'BoonBuy', host: 'boonbuy.com' },
  gtbuy: { name: 'GTBuy', host: 'gtbuy.com' },
  hipobuy: { name: 'Hipobuy', host: 'hipobuy.com' },
  joyagoo: { name: 'JoyaGoo', host: 'joyagoo.com' },
  kakobuy: { name: 'KakoBuy', host: 'www.kakobuy.com' },
  litbuy: { name: 'LitBuy', host: 'litbuy.com' },
  lolobuy: { name: 'Lolobuy', host: 'lolobuy.com' },
  loongbuy: { name: 'LoongBuy', host: 'loongbuy.com' },
  lovegobuy: { name: 'Lovegobuy', host: 'lovegobuy.com' },
  mulebuy: { name: 'Mulebuy', host: 'mulebuy.com' },
  mycnbox: { name: 'MyCNBox', host: 'mycnbox.com' },
  oopbuy: { name: 'OopBuy', host: 'oopbuy.com' },
  pikobuy: { name: 'Pikobuy', host: 'pikobuy.com' },
  sugargoo: { name: 'Sugargoo', host: 'www.sugargoo.com' },
  superbuy: { name: 'Superbuy', host: 'superbuy.com' },
  usfans: { name: 'USFans', host: 'usfans.com' },
  vigorbuy: { name: 'VigorBuy', host: 'vigorbuy.com' },
  zentbuy: { name: 'ZentBuy', host: 'zentbuy.com' },
});

/**
 * Parse a marketplace product URL.
 * @returns {{platform:'weidian'|'taobao'|'1688', id:string, rawUrl:string}|null}
 * Tmall URLs report platform 'taobao' (same item id space).
 */
export function parseProductUrl(url) {
  return parseAdditionalAgentRawLink(String(url || '').trim());
}

/**
 * Convert a product URL to an agent link.
 * @param {string} url Taobao, Tmall, Weidian or 1688 product URL.
 * @param {string} agent One of the keys in AGENTS.
 * @param {{referralCode?: string, options?: object}} [opts] Your own referral code (optional) and
 *   agent-specific link options (e.g. { inviterUserId } for Pikobuy, { referId } for MyCNBox).
 * @returns {string|null} The agent link, or null when the URL or agent is not supported.
 */
export function convert(url, agent, { referralCode = '', options = {} } = {}) {
  const a = AGENTS[String(agent || '').toLowerCase()];
  if (!a) return null;
  const source = parseProductUrl(url);
  if (!source) return null;
  const link = generateAffiliateLink(source.rawUrl, a.host, String(referralCode || ''), options || {});
  return link && link !== source.rawUrl ? link : null;
}

/** Convert one URL for every agent. Returns { key: link|null }. codes = { key: referralCode }. */
export function convertAll(url, codes = {}, optionsByAgent = {}) {
  return Object.fromEntries(Object.keys(AGENTS).map(k => [k, convert(url, k, { referralCode: codes[k] || '', options: optionsByAgent[k] || {} })]));
}
