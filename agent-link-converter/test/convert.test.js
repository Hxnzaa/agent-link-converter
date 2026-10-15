import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, convert, convertAll, parseProductUrl } from '../src/index.js';
import { EXAMPLE_REFERRAL_CODES, EXAMPLE_LINK_OPTIONS } from '../examples/our-sites.config.js';

const WD = 'https://weidian.com/item.html?itemID=7560353403';
const TB = 'https://item.taobao.com/item.htm?id=681234567890';
const TM = 'https://detail.tmall.com/item.htm?id=681234567890';
const A1688 = 'https://detail.1688.com/offer/712345678901.html';

test('18 agents', () => { assert.equal(Object.keys(AGENTS).length, 18); });

test('parseProductUrl', () => {
  assert.deepEqual(parseProductUrl(WD), { platform: 'weidian', id: '7560353403', rawUrl: WD });
  assert.equal(parseProductUrl(TB).platform, 'taobao');
  assert.equal(parseProductUrl(TM).platform, 'taobao');
  assert.deepEqual(parseProductUrl(A1688), { platform: '1688', id: '712345678901', rawUrl: A1688 });
  for (const bad of ['', 'not a url', 'javascript:alert(1)', 'https://shop123.taobao.com/', 'https://weidian.com/?userid=1', 'https://example.com/item.htm?id=1', 'ftp://item.taobao.com/item.htm?id=1', 'https://detail.1688.com/offer/abc.html'])
    assert.equal(parseProductUrl(bad), null, bad);
});

test('every agent converts every marketplace; unsupported input returns null', () => {
  for (const u of [WD, TB, TM, A1688]) for (const [k, v] of Object.entries(convertAll(u))) assert.match(v, /^https:\/\//, `${k} ${u}`);
  assert.equal(convert('https://shop123.taobao.com/', 'kakobuy'), null);
  assert.equal(convert(WD, 'no-such-agent'), null);
});

test('formats with the example config match the live sites (Weidian)', () => {
  const got = convertAll(WD, EXAMPLE_REFERRAL_CODES, EXAMPLE_LINK_OPTIONS);
  const e = encodeURIComponent(WD);
  assert.deepEqual(got, {
    boonbuy: 'https://boonbuy.com/product/2/7560353403?inviteCode=IZ8MFPRES',
    gtbuy: 'https://gtbuy.com/product/2/7560353403?inviteCode=R04KJUIQT&goodsInviteCode=R04KJUIQT&sourceChannel=41&idp=1',
    hipobuy: 'https://hipobuy.com/product/weidian/7560353403?inviteCode=23M48IEBV',
    joyagoo: 'https://joyagoo.com/product?id=7560353403&platform=WEIDIAN&ref=300579015',
    kakobuy: `https://www.kakobuy.com/item/details?url=${e}&affcode=kakosheet`,
    litbuy: 'https://litbuy.com/product/weidian/7560353403?inviteCode=TZ5I9P6HL',
    lolobuy: `https://www.lolobuy.com/productDetail/7560353403?url=${e}&inviteCode=6767lolo`,
    loongbuy: `https://www.loongbuy.com/product-details?url=${e}&invitecode=66P8J80N`,
    lovegobuy: 'https://www.lovegobuy.com/product?id=7560353403&shop_type=weidian&invite_code=FQD9IQ',
    mulebuy: 'https://mulebuy.com/product?id=7560353403&platform=WEIDIAN&ref=200326058',
    mycnbox: 'https://mycnbox.com/goodsDetail?mallType=weidian&itemId=7560353403&referId=LiBeVe&inviteCode=AACWgY',
    oopbuy: 'https://oopbuy.com/product/weidian/7560353403?inviteCode=UARU6VFDV',
    pikobuy: `https://www.pikobuy.com/product/detail?inviterUserId=1018990&invitedCode=X76T3K&productUrl=${e}`,
    sugargoo: `https://www.sugargoo.com/productDetail?productLink=${e}&memberId=3351272992916512046`,
    superbuy: `https://www.superbuy.com/en/page/buy/?nTag=Home-search&from=search-input&url=${e}&partnercode=8QxbmD`,
    usfans: 'https://www.usfans.com/product/3/7560353403?ref=KEAVN7',
    vigorbuy: 'https://vigorbuy.com/product/2/7560353403?inviteCode=7OnrzXqO',
    zentbuy: 'https://www.zentbuy.com/product/2/7560353403?inviteCode=8JI4JHYKL',
  });
});

test('platform codes for Taobao and 1688', () => {
  assert.equal(convert(TB, 'usfans', { referralCode: 'X' }), 'https://www.usfans.com/product/2/681234567890?ref=X');
  assert.equal(convert(A1688, 'joyagoo'), 'https://joyagoo.com/product?id=712345678901&platform=ALI_1688');
  assert.equal(convert(A1688, 'lovegobuy'), 'https://www.lovegobuy.com/product?id=712345678901&shop_type=ali_1688');
  assert.equal(convert(A1688, 'mycnbox'), 'https://mycnbox.com/goodsDetail?mallType=1688&itemId=712345678901&inviteCode=');
});

test('referral code is URL-encoded and optional', () => {
  assert.equal(convert(WD, 'vigorbuy', { referralCode: 'a b&c' }), 'https://vigorbuy.com/product/2/7560353403?inviteCode=a%20b%26c');
  assert.equal(convert(WD, 'vigorbuy'), 'https://vigorbuy.com/product/2/7560353403');
});
