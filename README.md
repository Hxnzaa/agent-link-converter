# agent-link-converter

Small, dependency-free JavaScript library that turns a Taobao, Tmall, Weidian or 1688 **product URL**
into the product-link format of 18 shopping agents. Pure functions: no network requests, no tracking,
works in Node 18+ and modern browsers (ES modules).

> Status: unpublished draft (v0.1.0). Not on npm, no public repository yet.

## Disclosure

The author of this project runs 18 independent agent spreadsheet sites, one per supported agent, and
earns referral commissions from them. The sites are not affiliated with the agents. Each is linked once here:

[BoonBuy](https://boonbuy-spreadsheet.site) ·
[GTBuy](https://gtbuy-spreadsheet.site) ·
[Hipobuy](https://hipobuy-spreadsheet.site) ·
[JoyaGoo](https://joyagoo-spreadsheet.site) ·
[KakoBuy](https://kakobuy-spreadsheet.site) ·
[LitBuy](https://litbuy-spreadsheet.site) ·
[Lolobuy](https://lolobuy-spreadsheet.site) ·
[LoongBuy](https://loongbuy-spreadsheet.site) ·
[Lovegobuy](https://lovegobuysheet.shop) ·
[Mulebuy](https://mulebuy-spreadsheet.site) ·
[MyCNBox](https://mycnbox-spreadsheet.site) ·
[OopBuy](https://oopbuyspreadsheet.site) ·
[Pikobuy](https://pikobuy-spreadsheet.site) ·
[Sugargoo](https://sugargoo-spreadsheet.site) ·
[Superbuy](https://superbuy-sheet.site) ·
[USFans](https://usfans-spreadsheet.site) ·
[VigorBuy](https://vigorbuyspreadsheet.site) ·
[ZentBuy](https://zentbuy-spreadsheet.site)

**The library itself contains no referral codes.** You pass your own code (or none). The owner's codes
exist only in `examples/our-sites.config.js`, which is clearly labelled as an example and is not
imported by `src/`.

## Usage

```js
import { convert, convertAll, parseProductUrl, AGENTS } from 'agent-link-converter';

convert('https://weidian.com/item.html?itemID=7560353403', 'vigorbuy');
// 'https://vigorbuy.com/product/2/7560353403'

convert('https://item.taobao.com/item.htm?id=681234567890', 'usfans', { referralCode: 'YOURCODE' });
// 'https://www.usfans.com/product/2/681234567890?ref=YOURCODE'

convert('https://shop123.taobao.com/', 'kakobuy'); // null (not a single product)

convertAll(url, { kakobuy: 'YOURCODE' });          // { boonbuy: '…', …, zentbuy: '…' }
```

- `convert(url, agent, { referralCode, options })` returns a link string, or `null` if the URL or agent is unsupported.
- `options` carries agent-specific extras that the formats already support: `{ inviterUserId }` for Pikobuy, `{ referId }` for MyCNBox.
- `parseProductUrl(url)` returns `{ platform: 'weidian' | 'taobao' | '1688', id, rawUrl }` or `null`. Tmall URLs report platform `taobao`.

## Supported input

| Marketplace | Recognised URL | Read from |
|---|---|---|
| Weidian | `weidian.com/...?itemID=` | `itemID` |
| Taobao, Tmall | `taobao.com`, `tmall.com` with `?id=` | `id` |
| 1688 | `1688.com/offer/<number>.html` | the offer number |

Shop pages, search pages, short share links and image URLs are not converted. Open short links in a
browser first and copy the final product address.

## Formats

Formats are copied verbatim from the code of the sites above (`src/formats.js`) and are covered by
tests in `test/`. Some formats keep an empty parameter (for example `inviteCode=`) when no code is
given, exactly as the source code does. Agents can change their URL formats at any time; this library
makes no promise that a generated link will keep working, and it says nothing about the agents' prices,
fees or services.

## Demo

`demo/index.html` is a static page. Serve the project root with any static server
(for example `npx serve .`) and open `/demo/`. The example config is off by default; a checkbox turns
it on, with a note explaining whose codes they are.

## Tests

```sh
npm test
```

## License

MIT, see [LICENSE](LICENSE).
