/* Motion Prompt Mobile — 非公式のモバイル版。素の JS、依存なし。
   上流 showheyohtaki/motion-prompt（MIT）の catalog.json・pack.js・api/v1 を vendor/motion-prompt/ から読む。
   描画の呼び出し方（clear / save / restore、位相、停止時のコマ）と、ハッシュでの詳細表示・「選んだ物をコピー」の
   文面は上流の assets/site.js に合わせている。 */
(function () {
  'use strict';
  var MP = window.MotionPrompt;
  var VENDOR = 'vendor/motion-prompt/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;

  // ------------------------------------------------------------------ text
  var I18N = {
    ja: {
      title: 'Motion Prompt Mobile（非公式）', unofficial: '非公式',
      tabsLabel: 'タブ', tabBrowse: '見本', tabPicks: '選んだ物', tabFavs: 'お気に入り', tabInfo: '情報',
      titleBrowse: 'Motion Prompt', titlePicks: '選んだ物', titleFavs: 'お気に入り', titleInfo: '情報',
      searchLabel: '見本を探す', searchPh: '名前・番号・タグで探す', packFilterLabel: 'パックで絞り込む', all: 'すべて',
      count: '{n}個', countOf: '{n}個（全{total}個）',
      empty: '見つかりませんでした。別の言葉や番号で探してみてください。',
      openLabel: '#{id} {name}の詳細を開く', loadFailed: '読み込めませんでした',
      pause: '一時停止', play: '再生', pauseLabel: 'すべての見本を一時停止', playLabel: 'すべての見本を再生',
      colsLabel: '2列で表示', colsLabel1: '1列で表示',
      pick: '選ぶ', picked: '選択中', pickLabel: '#{id} {name}を選ぶ', unpickLabel: '#{id} {name}を外す',
      fav: 'お気に入り', faved: 'お気に入り済み', unfavLabel: '#{id} {name}をお気に入りから外す',
      share: '共有', copyPrompt: 'プロンプトをコピー', copyCode: 'コードをコピー', showCode: 'コードを見る',
      promptLabel: 'コピーされるプロンプト', tagsLabel: 'タグ',
      dAsk: 'AIへの頼み方の例', dSpec: '動きの仕様', dUse: '使いどころ',
      prev: '前の名前', next: '次の名前', close: '閉じる',
      size: '{w}×{h}px・1周{c}秒', codeLoading: '読み込み中です…', codeFailed: 'コードを読み込めませんでした。',
      copied: 'コピーしました', copyFailed: 'コピーできませんでした',
      picksLead: '選んだ物をまとめてコピーし、Claude や ChatGPT のアプリに貼り付けて使います。',
      picksEmpty: '見本の「選ぶ」を押すと、ここに並びます。', favsEmpty: '詳細画面の星を押すと、ここに並びます。',
      noteLabel: '#{id} のメモ（任意）', notePh: 'メモ（任意）例: 冒頭のタイトルに',
      copyPicked: '選んだ物をコピー', clearAll: 'すべて外す', clearConfirm: '選んだ物をすべて外しますか？',
      pickedLive: '#{id} {name}を選びました。選んだ物は{n}個です。', unpickedLive: '#{id} {name}を外しました。選んだ物は{n}個です。',
      clearedLive: '選択をすべて外しました。', favLive: '#{id} をお気に入りに入れました。', unfavLive: '#{id} をお気に入りから外しました。',
      langH: '言語', aboutH: 'このアプリについて',
      aboutP1: 'Motion Prompt の見本を iPhone で見やすくした、非公式のモバイル版です。上流の作者とは関係なく、個人が作っています。',
      aboutP2: '見本・名前・説明文・描画コードは、上流の Motion Prompt をそのまま同梱しています。',
      upstreamSite: '上流のサイト（公式）', upstreamRepo: '上流の GitHub', thisRepo: 'このモバイル版の GitHub',
      authorLabel: '作者', authorName: '大滝昇平', shaLabel: '同梱している上流のコミット',
      howH: '使い方',
      how1: '「見本」で動きを見て、使いたい物の「選ぶ」を押します。',
      how2: '「選んだ物」で、必要なら要素ごとに一言のメモを書きます。',
      how3: '「選んだ物をコピー」を押し、Claude や ChatGPT のアプリに貼り付けて頼みます。1 つだけなら、詳細の「プロンプトをコピー」でも渡せます。',
      installH: 'ホーム画面に追加する',
      install1: 'Safari でこのページを開きます。',
      install2: '画面下の共有ボタン（四角から上向きの矢印）を押します。',
      install3: '「ホーム画面に追加」を選び、「追加」を押します。',
      installP: 'ホーム画面から開くとアプリのように全画面で動きます。一度開けば、通信がなくても見本を見られます。',
      licenseH: 'ライセンス', licenseP: '上流の Motion Prompt は MIT ライセンスです。全文は次のとおりです。',
      noticesLink: '上流の THIRD-PARTY-NOTICES',
      ownLicenseP: 'このモバイル版の画面とコードも MIT ライセンスです（Copyright (c) 2026 atani）。',
      ownLicenseLink: 'このモバイル版の LICENSE',
      // 「選んだ物をコピー」の文面。上流 assets/site.js の outIntro / outDemo / outSpec / outNote / outEnd と同じ
      outIntro: 'motion-prompt のギャラリーで、次の{n}個を選びました。これを使って編集してください。',
      outDemo: '見本', outSpec: '仕様とコード', outNote: 'メモ',
      outEnd: '詳しい仕様は motion-prompt スキルの get で取れます（スキルが入っていなければ、各行の「仕様とコード」のURLを読んでください）。',
    },
    en: {
      title: 'Motion Prompt Mobile (unofficial)', unofficial: 'Unofficial',
      tabsLabel: 'Tabs', tabBrowse: 'Gallery', tabPicks: 'Picks', tabFavs: 'Favorites', tabInfo: 'Info',
      titleBrowse: 'Motion Prompt', titlePicks: 'Picks', titleFavs: 'Favorites', titleInfo: 'Info',
      searchLabel: 'Search the gallery', searchPh: 'Name, number or tag', packFilterLabel: 'Filter by pack', all: 'All',
      count: '{n} names', countOf: '{n} of {total} names',
      empty: 'Nothing found. Try another word or a number.',
      openLabel: 'Open #{id} {name}', loadFailed: 'Could not load',
      pause: 'Pause', play: 'Play', pauseLabel: 'Pause all samples', playLabel: 'Play all samples',
      colsLabel: 'Show two columns', colsLabel1: 'Show one column',
      pick: 'Pick', picked: 'Picked', pickLabel: 'Pick #{id} {name}', unpickLabel: 'Remove #{id} {name}',
      fav: 'Favorite', faved: 'Favorited', unfavLabel: 'Remove #{id} {name} from favorites',
      share: 'Share', copyPrompt: 'Copy prompt', copyCode: 'Copy code', showCode: 'View code',
      promptLabel: 'The prompt that is copied', tagsLabel: 'Tags',
      dAsk: 'How to ask an AI', dSpec: 'Motion spec', dUse: 'When to use it',
      prev: 'Previous name', next: 'Next name', close: 'Close',
      size: '{w}×{h} px, {c} s loop', codeLoading: 'Loading…', codeFailed: 'Could not load the code.',
      copied: 'Copied', copyFailed: 'Could not copy',
      picksLead: 'Copy your picks in one go and paste them into the Claude or ChatGPT app.',
      picksEmpty: 'Press "Pick" on a sample and it appears here.', favsEmpty: 'Press the star in the detail view and it appears here.',
      noteLabel: 'Note for #{id} (optional)', notePh: 'Note (optional), e.g. for the opening title',
      copyPicked: 'Copy picks', clearAll: 'Clear all', clearConfirm: 'Remove all picks?',
      pickedLive: 'Picked #{id} {name}. {n} picked.', unpickedLive: 'Removed #{id} {name}. {n} picked.',
      clearedLive: 'Cleared all picks.', favLive: 'Added #{id} to favorites.', unfavLive: 'Removed #{id} from favorites.',
      langH: 'Language', aboutH: 'About this app',
      aboutP1: 'An unofficial mobile version of Motion Prompt, made for the iPhone. It is a personal project and is not affiliated with the upstream author.',
      aboutP2: 'The samples, names, descriptions and drawing code are bundled unchanged from the upstream Motion Prompt.',
      upstreamSite: 'Upstream site (official)', upstreamRepo: 'Upstream on GitHub', thisRepo: 'This mobile version on GitHub',
      authorLabel: 'Author', authorName: 'Shohei Ohtaki', shaLabel: 'Bundled upstream commit',
      howH: 'How to use',
      how1: 'Watch the samples in "Gallery" and press "Pick" on the ones you want.',
      how2: 'In "Picks", add a short note to each one if you like.',
      how3: 'Press "Copy picks" and paste the text into the Claude or ChatGPT app. For a single name, "Copy prompt" in the detail view works too.',
      installH: 'Add to the Home Screen',
      install1: 'Open this page in Safari.',
      install2: 'Tap the Share button (a square with an arrow pointing up).',
      install3: 'Choose "Add to Home Screen", then tap "Add".',
      installP: 'Opened from the Home Screen, it runs full screen like an app. After the first visit, the samples work offline.',
      licenseH: 'License', licenseP: 'The upstream Motion Prompt is released under the MIT License. Full text:',
      noticesLink: 'Upstream THIRD-PARTY-NOTICES',
      ownLicenseP: 'The screens and code of this mobile version are also MIT licensed (Copyright (c) 2026 atani).',
      ownLicenseLink: 'LICENSE of this mobile version',
      // "Copy picks" text: same strings as outIntro / outDemo / outSpec / outNote / outEnd in upstream assets/site.js
      outIntro: 'I picked these {n} from the motion-prompt gallery. Please use them for the edit.',
      outDemo: 'Demo', outSpec: 'Spec and code', outNote: 'Note',
      outEnd: 'The get command of the motion-prompt skill returns the full spec (without the skill, read the "Spec and code" URL on each line).',
    },
  };

  // ------------------------------------------------------------------ storage (失敗しても動く)
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode etc. */ } },
    json: function (k) { try { var v = JSON.parse(store.get(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } },
  };
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  var state = {
    lang: root.lang === 'en' ? 'en' : 'ja',
    tab: 'browse', pack: 'all', q: '',
    cols: store.get('mpm-cols') === '2' ? 2 : 1,
    playing: !reduceMotion.matches,
    open: null,
    picks: [], notes: {}, favs: [],
  };
  var CAT = null, SITE = '', packBy = {}, elBy = {}, order = [];

  function t(key, vars) {
    var s = I18N[state.lang][key];
    if (s == null) s = I18N.ja[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function names(el) {
    var ja = state.lang === 'ja';
    return { main: ja ? el.name.ja : el.name.en, sub: ja ? el.name.en : el.name.ja };
  }
  function txt(field) { return field ? field[state.lang] || field.en || '' : ''; }
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  var CHECK_SVG = '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.4l3 3 6-6.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var X_SVG = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var STAR_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3.8l2.5 5.1 5.6.8-4.05 3.95.96 5.6L12 16.6l-5.01 2.65.96-5.6L3.9 9.7l5.6-.8z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  function pickBox() { var s = h('span', { class: 'pick-box', 'aria-hidden': 'true' }); s.innerHTML = CHECK_SVG; return s; }

  // ------------------------------------------------------------------ packs (上流の描画コード)
  var ready = {};
  if (MP) {
    var realPack = MP.pack;
    MP.pack = function (id, factory) { // 初期化で例外を出すパックがあってもページ全体は止めない
      try { return realPack.call(MP, id, factory); } catch (e) { ready[id] = 'failed'; return null; }
    };
  }
  function loadPack(p) {
    var s = document.createElement('script');
    s.src = VENDOR + 'packs/' + p.pack + '/pack.js';
    s.onload = function () {
      var reg = MP.packs[p.pack];
      if (!reg || ready[p.pack] === 'failed') return fail();
      var base = new URL(VENDOR + 'packs/' + p.pack + '/', document.baseURI);
      var fonts = (reg.fonts && reg.fonts.length) ? MP.loadFonts(reg, base) : Promise.resolve();
      ready[p.pack] = 'ok'; markDirty(p.pack);
      fonts.catch(function () {}).then(function () { markDirty(p.pack); });
    };
    s.onerror = fail;
    function fail() { ready[p.pack] = 'failed'; tiles.forEach(function (tl) { if (tl.el.pack === p.pack) breakTile(tl); }); }
    document.head.appendChild(s);
  }

  // ------------------------------------------------------------------ drawing
  var tiles = [];
  var detail = { canvas: $('#d-canvas'), ctx: null, scale: 1, dirty: false, el: null, broken: false, u: 0 };
  var STILL = 0.4; // 停止中はループのこの位置を見せる（上流と同じ）
  var clock = 0, lastNow = 0;

  function paint(ctx, el, u, scale) { // 上流 site.js の paint() と同じ手順
    var reg = MP.packs[el.pack];
    var cell = reg && reg.cells[+el.no - 1];
    if (!cell) return false;
    var w = el.width, hgt = el.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w * scale, hgt * scale);
    ctx.save();
    if (scale !== 1) ctx.scale(scale, scale);
    try { cell(ctx, w, hgt, u); } catch (e) { ctx.restore(); return false; }
    ctx.restore();
    return true;
  }
  function timeFor(el, offset) {
    var u = (clock + offset * el.cycle) % el.cycle;
    return u < 0 ? u + el.cycle : u;
  }
  function breakTile(tl) {
    if (tl.broken) return;
    tl.broken = true;
    tl.box.classList.add('is-broken');
  }
  function setDetailBroken(on) {
    detail.broken = on;
    sheet.classList.toggle('is-broken', on);
    $('.d-broken', sheet).hidden = !on;
  }
  function markDirty(pack) {
    tiles.forEach(function (tl) { if (!pack || tl.el.pack === pack) tl.dirty = true; });
    detail.dirty = true;
  }
  function frame(now) { // rAF はこの 1 本だけ
    requestAnimationFrame(frame);
    var dt = lastNow ? Math.min((now - lastNow) / 1000, 0.1) : 0;
    lastNow = now;
    if (state.playing) clock += dt;
    if (state.open) { // 詳細を開いている間は詳細だけ描く
      var el = detail.el;
      if (el && !detail.broken && ready[el.pack] === 'ok' && (state.playing || detail.dirty)) {
        detail.dirty = false;
        if (state.playing) detail.u = (detail.u + dt) % el.cycle;
        if (!paint(detail.ctx, el, detail.u, detail.scale)) setDetailBroken(true);
      }
      return;
    }
    if (state.tab !== 'browse') return;
    for (var i = 0; i < tiles.length; i++) {
      var tl = tiles[i];
      if (!tl.visible || tl.broken || ready[tl.el.pack] !== 'ok') continue;
      if (!state.playing && !tl.dirty) continue;
      tl.dirty = false;
      if (!paint(tl.ctx, tl.el, timeFor(tl.el, tl.offset), 1)) breakTile(tl);
    }
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var tl = en.target._tile;
      if (!tl) return;
      tl.visible = en.isIntersecting;
      if (tl.visible) tl.dirty = true;
    });
  }, { rootMargin: '120px 0px' }) : null;

  // ------------------------------------------------------------------ gallery
  var grid = $('#grid');
  function buildGrid() {
    if (io) io.disconnect();
    tiles = [];
    grid.textContent = '';
    CAT.packs.forEach(function (p) {
      var list = h('div', { class: 'tiles' });
      CAT.elements.forEach(function (el) {
        if (el.pack !== p.pack) return;
        var nm = names(el);
        var canvas = h('canvas', { width: el.width, height: el.height, 'aria-hidden': 'true' });
        var a = h('a', { class: 'tile', href: '#' + el.id, 'data-id': el.id, 'aria-label': t('openLabel', { id: el.id, name: nm.main }) }, [
          h('span', { class: 'tile-stage', style: 'aspect-ratio:' + el.width + '/' + el.height }, [canvas]),
          h('span', { class: 'tile-cap' }, [
            h('span', { class: 'tile-top' }, [h('span', { class: 'tile-id', text: '#' + el.id }), h('span', { class: 'tile-name', text: nm.main })]),
            h('span', { class: 'tile-meaning', text: txt(el.meaning) }),
          ]),
        ]);
        var pb = h('button', { type: 'button', class: 'tile-pick', 'aria-pressed': 'false', 'data-pick': el.id }, [
          pickBox(), h('span', { class: 'tile-pick-t' }),
        ]);
        var box = h('div', { class: 'tile-box', 'data-id': el.id }, [a, pb]);
        var tl = { el: el, a: a, box: box, pick: pb, canvas: canvas, ctx: canvas.getContext('2d'), visible: !io, dirty: true, broken: false,
          offset: reduceMotion.matches ? STILL : (el._i * 0.6180339887) % 1 };
        a._tile = tl;
        pb.addEventListener('click', function () { togglePick(el.id); });
        a.addEventListener('click', function (ev) { openFromApp(ev, el.id); });
        markTile(tl);
        if (ready[el.pack] === 'failed') breakTile(tl);
        tiles.push(tl);
        list.appendChild(box);
        if (io) io.observe(a);
      });
      grid.appendChild(h('section', { class: 'pack', 'data-pack': p.pack }, [
        h('h2', { class: 'pack-h' }, [h('span', { text: p.title[state.lang] || p.title.en }), h('small', { text: '#' + p.first + '–' + p.last })]),
        list,
      ]));
    });
    applyCols();
    applyFilter();
  }
  function applyCols() {
    grid.classList.toggle('cols-2', state.cols === 2);
    var b = $('#cols');
    b.setAttribute('aria-pressed', state.cols === 2 ? 'true' : 'false');
    b.setAttribute('aria-label', t(state.cols === 2 ? 'colsLabel1' : 'colsLabel'));
  }

  function haystack(el) { // 上流と同じく、番号・名前・意味・要約・タグ・パック名を ja / en 横断で探す
    var p = packBy[el.pack];
    var c = p.categories.filter(function (x) { return x.slug === el.category; })[0] || {};
    return ['#' + el.id, el.id, String(+el.id), el.slug, el.pack, el.name.ja, el.name.en, el.meaning ? (el.meaning.ja || '') + ' ' + (el.meaning.en || '') : '',
      el.summary.ja, el.summary.en, el.tags.join(' '), p.title.ja, p.title.en, c.ja || '', c.en || ''].join(' ').toLowerCase();
  }
  function matches(el) {
    if (state.pack !== 'all' && el.pack !== state.pack) return false;
    if (!state.q) return true;
    if (!el._hay) el._hay = haystack(el);
    var terms = state.q.toLowerCase().replace(/＃/g, '#').split(/[\s　]+/).filter(Boolean);
    return terms.every(function (term) {
      if (/^#?\d{1,3}$/.test(term)) { // 「12」「012」「#012」はどれも #012
        var d = term.replace('#', '');
        return el.id === ('000' + d).slice(-3) || (d.length === 3 && el.id === d);
      }
      return el._hay.indexOf(term) >= 0;
    });
  }
  var shown = [];
  function applyFilter() {
    shown = [];
    tiles.forEach(function (tl) {
      var ok = matches(tl.el);
      tl.box.hidden = !ok;
      if (ok) shown.push(tl.el.id);
    });
    $$('.pack', grid).forEach(function (sec) { sec.hidden = !$('.tile-box:not([hidden])', sec); });
    $('#empty').hidden = shown.length > 0;
    $('#count').textContent = shown.length === CAT.count ? t('count', { n: CAT.count }) : t('countOf', { n: shown.length, total: CAT.count });
  }
  function buildChips() {
    var box = $('#packs');
    box.textContent = '';
    function chip(label, pressed, small, onClick) {
      var b = h('button', { type: 'button', class: 'chip', 'aria-pressed': pressed ? 'true' : 'false', text: label });
      if (small) b.appendChild(h('small', { text: small }));
      b.addEventListener('click', onClick);
      return b;
    }
    box.appendChild(chip(t('all'), state.pack === 'all', String(CAT.count), function () { setPack('all'); }));
    CAT.packs.forEach(function (p) {
      box.appendChild(chip(p.title[state.lang] || p.title.en, state.pack === p.pack, String(p.count), function () { setPack(p.pack); }));
    });
  }
  function setPack(pack) {
    state.pack = pack;
    $$('#packs .chip').forEach(function (b, i) {
      var key = i === 0 ? 'all' : CAT.packs[i - 1].pack;
      b.setAttribute('aria-pressed', key === pack ? 'true' : 'false');
    });
    applyFilter();
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------ copy / share
  // text は文字列か Promise。iOS Safari ではタップから時間が空くと書き込めないので、Promise は ClipboardItem に渡す
  function copyText(text) {
    function legacy(s) {
      var ta = h('textarea', { 'aria-hidden': 'true', tabindex: '-1', readonly: '', style: 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px' });
      ta.value = s;
      var back = document.activeElement;
      document.body.appendChild(ta);
      ta.focus({ preventScroll: true }); ta.select(); ta.setSelectionRange(0, s.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (back && back.focus) back.focus({ preventScroll: true });
      return ok;
    }
    var cb = navigator.clipboard;
    if (typeof text !== 'string') {
      if (cb && cb.write && window.ClipboardItem) {
        try {
          var item = new ClipboardItem({ 'text/plain': text.then(function (s) { return new Blob([s], { type: 'text/plain' }); }) });
          return cb.write([item]).then(function () { return true; }, function () { return text.then(function (s) { return copyText(s); }); });
        } catch (e) { /* 古い実装: 下で文字列を待ってから書く */ }
      }
      return text.then(function (s) { return copyText(s); }, function () { return false; });
    }
    if (cb && cb.writeText) {
      return cb.writeText(text).then(function () { return true; }, function () { return legacy(text); });
    }
    return Promise.resolve(legacy(text));
  }
  var toastTimer = 0;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 1800);
  }
  function copyAndTell(text) { return copyText(text).then(function (ok) { toast(t(ok ? 'copied' : 'copyFailed')); return ok; }); }
  function shareText(title, text) { // 共有シートが無ければコピーする
    if (navigator.share) {
      return navigator.share({ title: title, text: text }).then(function () { return true; }, function (e) {
        if (e && e.name === 'AbortError') return false;
        return copyAndTell(text);
      });
    }
    return copyAndTell(text);
  }

  // ------------------------------------------------------------------ text files (api/v1)
  var textCache = {};
  function fetchText(path) {
    if (!textCache[path]) {
      textCache[path] = fetch(VENDOR + path).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      });
      textCache[path].catch(function () { delete textCache[path]; });
    }
    return textCache[path];
  }
  var loaded = {}; // 取得済みの本文（同期でコピーできるように）
  function getText(path) {
    if (loaded[path] != null) return loaded[path];
    return fetchText(path).then(function (s) { loaded[path] = s; return s; });
  }
  function promptPath(id, lang) { return 'api/v1/' + lang + '/p/' + id + '.txt'; }
  function codePath(id, lang) { return 'api/v1/' + lang + '/e/' + id + '.txt'; }

  // ------------------------------------------------------------------ detail sheet
  var sheet = $('#sheet'), backdrop = $('#backdrop'), sheetBody = $('#sheet-body');
  function sizeDetailCanvas() { // 上流と同じく scalable なパックだけ高精細に描く
    var el = detail.el;
    if (!el) return;
    var cssW = detail.canvas.parentNode.clientWidth || el.width;
    var want = Math.ceil(cssW * (window.devicePixelRatio || 1) / el.width);
    var scale = packBy[el.pack].scalable ? Math.max(1, Math.min(3, want)) : 1;
    if (detail.canvas.width !== el.width * scale || detail.canvas.height !== el.height * scale) {
      detail.canvas.width = el.width * scale; detail.canvas.height = el.height * scale;
    }
    detail.scale = scale; detail.dirty = true;
  }
  function fillDetail(el) {
    var p = packBy[el.pack], nm = names(el), lang = state.lang;
    var c = p.categories.filter(function (x) { return x.slug === el.category; })[0];
    detail.el = el; setDetailBroken(ready[el.pack] === 'failed');
    detail.u = state.playing ? 0 : STILL * el.cycle; // 動きの頭から見せる
    detail.ctx = detail.canvas.getContext('2d');
    detail.canvas.style.aspectRatio = el.width + '/' + el.height;
    sheet.setAttribute('data-id', el.id);
    $('#d-id').textContent = '#' + el.id;
    $('#d-where').textContent = (p.title[lang] || p.title.en) + (c ? ' / ' + (c[lang] || c.en) : '');
    $('#d-name').textContent = nm.main;
    $('#d-sub').textContent = nm.sub + ' · ' + t('size', { w: el.width, h: el.height, c: el.cycle });
    var mean = $('#d-meaning'), ask = $('#d-ask'), askH = $('#d-ask-h');
    mean.textContent = txt(el.meaning); mean.hidden = !mean.textContent;
    ask.textContent = txt(el.ask); ask.hidden = askH.hidden = !ask.textContent;
    $('#d-summary').textContent = txt(el.summary);
    var spec = $('#d-spec'); spec.textContent = '';
    (el.spec[lang] || el.spec.en).forEach(function (s) { spec.appendChild(h('li', { text: s })); });
    $('#d-use').textContent = txt(el.use);
    var tags = $('#d-tags'); tags.textContent = '';
    el.tags.forEach(function (s) { tags.appendChild(h('li', { text: s })); });
    var pre = $('#d-prompt'), code = $('#d-code');
    pre.textContent = t('codeLoading'); code.textContent = t('codeLoading');
    Promise.resolve(getText(promptPath(el.id, lang))).then(function (s) {
      if (detail.el === el && state.lang === lang) pre.textContent = s;
    }, function () { if (detail.el === el) pre.textContent = t('codeFailed'); });
    Promise.resolve(getText(codePath(el.id, lang))).then(function (s) {
      if (detail.el === el && state.lang === lang) code.textContent = s;
    }, function () { if (detail.el === el) code.textContent = t('codeFailed'); });
    var list = shown.indexOf(el.id) >= 0 ? shown : order; // 絞り込みの外から開いたときは全体を順に送る
    var i = list.indexOf(el.id);
    $('#d-prev').disabled = i <= 0; $('#d-next').disabled = i >= list.length - 1;
    $('#d-prev')._to = list[i - 1]; $('#d-next')._to = list[i + 1];
    markDetail();
    document.title = '#' + el.id + ' ' + nm.main + ' | ' + t('title');
  }
  var lastFocus = null;
  function openDetail(id) {
    var el = elBy[id];
    if (!el) return closeDetail(true);
    var first = sheet.hidden;
    state.open = id;
    fillDetail(el);
    if (first) {
      lastFocus = document.activeElement;
      root.classList.add('modal-open');
      sheet.hidden = false; backdrop.hidden = false;
      sheet.style.transform = '';
      requestAnimationFrame(function () { sheet.classList.add('is-open'); backdrop.classList.add('is-open'); });
      $('#main').setAttribute('aria-hidden', 'true');
      $('#d-name').focus({ preventScroll: true });
    }
    sheetBody.scrollTop = 0;
    sizeDetailCanvas();
  }
  function closeDetail(silent) {
    if (!state.open && sheet.hidden) return;
    var id = state.open;
    state.open = null; detail.el = null;
    sheet.classList.remove('is-open'); backdrop.classList.remove('is-open');
    sheet.style.transform = '';
    sheet.hidden = true; backdrop.hidden = true;
    root.classList.remove('modal-open');
    $('#main').removeAttribute('aria-hidden');
    document.title = t('title');
    markDirty();
    if (silent) return;
    var tile = id && state.tab === 'browse' && $('.tile[data-id="' + id + '"]');
    var back = tile && !tile.parentNode.hidden ? tile : lastFocus;
    if (back && back.focus && document.contains(back)) back.focus({ preventScroll: true });
  }
  function hashId() {
    var m = /^#(\d{1,3})$/.exec(location.hash);
    return m ? ('000' + m[1]).slice(-3) : null;
  }
  function syncFromHash() {
    if (!CAT) return;
    var id = hashId();
    if (id && elBy[id]) openDetail(id);
    else closeDetail(false);
  }
  // アプリ内のリンクから開くときは pushState で履歴を 1 つ積み、目印 { mpm: 1 } を付ける。
  // 閉じるときは目印がある時だけ history.back() する（iOS の戻るジェスチャーと同じ動きになる）。
  // 直リンク（#001）で来たときは目印が無いので、ハッシュを消すだけで閉じる。
  function openFromApp(ev, id) {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button) return;
    ev.preventDefault();
    if (hashId() !== id) history.pushState({ mpm: 1 }, '', '#' + id);
    syncFromHash();
  }
  function requestClose() {
    if (history.state && history.state.mpm) { history.back(); return; }
    history.replaceState(null, '', location.pathname + location.search);
    syncFromHash();
  }
  function step(id) {
    if (!id) return;
    history.replaceState(history.state, '', '#' + id); // 横移動では履歴を積まない
    openDetail(id);
  }
  window.addEventListener('hashchange', syncFromHash);
  window.addEventListener('popstate', syncFromHash);
  $('#d-close').addEventListener('click', requestClose);
  backdrop.addEventListener('click', requestClose);
  $('#d-prev').addEventListener('click', function () { step(this._to); });
  $('#d-next').addEventListener('click', function () { step(this._to); });
  document.addEventListener('keydown', function (ev) {
    if (!state.open || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var tag = ev.target && ev.target.tagName;
    if (ev.key === 'Escape') { ev.preventDefault(); requestClose(); return; }
    if (tag === 'PRE' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); step($('#d-prev')._to); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); step($('#d-next')._to); }
  });
  window.addEventListener('resize', function () { if (state.open) sizeDetailCanvas(); });

  // スワイプ: 左右で前後の要素、上端から下へ引くと閉じる
  (function () {
    var sx = 0, sy = 0, dx = 0, dy = 0, mode = null, active = false;
    function skip(target) { return target.closest && target.closest('pre, input, textarea, details[open] pre'); }
    sheet.addEventListener('touchstart', function (ev) {
      if (ev.touches.length !== 1 || skip(ev.target)) { active = false; return; }
      active = true; mode = null; dx = dy = 0;
      sx = ev.touches[0].clientX; sy = ev.touches[0].clientY;
    }, { passive: true });
    sheet.addEventListener('touchmove', function (ev) {
      if (!active) return;
      dx = ev.touches[0].clientX - sx; dy = ev.touches[0].clientY - sy;
      if (!mode && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        var inBar = ev.target.closest && ev.target.closest('.sheet-bar');
        if (Math.abs(dx) > Math.abs(dy) * 1.4) mode = 'x';
        else if (dy > 0 && (inBar || sheetBody.scrollTop <= 0)) mode = 'down';
        else mode = 'none';
      }
      if (mode === 'down') {
        if (ev.cancelable) ev.preventDefault();
        sheet.style.transition = 'none';
        sheet.style.transform = 'translateY(' + Math.max(0, dy) + 'px)';
      }
    }, { passive: false });
    function end() {
      if (!active) return;
      active = false;
      sheet.style.transition = '';
      if (mode === 'down') {
        if (dy > 110) { requestClose(); return; }
        sheet.style.transform = '';
      } else if (mode === 'x' && Math.abs(dx) > 60) {
        step(dx < 0 ? $('#d-next')._to : $('#d-prev')._to);
      }
    }
    sheet.addEventListener('touchend', end);
    sheet.addEventListener('touchcancel', end);
  })();

  $('#d-copy-prompt').addEventListener('click', function () {
    var el = detail.el; if (!el) return;
    copyAndTell(getText(promptPath(el.id, state.lang)));
  });
  $('#d-copy-code').addEventListener('click', function () {
    var el = detail.el; if (!el) return;
    copyAndTell(getText(codePath(el.id, state.lang)));
  });
  $('#d-share').addEventListener('click', function () {
    var el = detail.el; if (!el) return;
    var title = '#' + el.id + ' ' + names(el).main;
    var s = getText(promptPath(el.id, state.lang));
    if (typeof s === 'string') shareText(title, s);
    else s.then(function (v) { shareText(title, v); }, function () { toast(t('copyFailed')); });
  });
  $('#d-pick').addEventListener('click', function () { if (detail.el) togglePick(detail.el.id); });
  $('#d-fav').addEventListener('click', function () { if (detail.el) toggleFav(detail.el.id); });
  $('#d-stage').addEventListener('click', function (ev) { if (!ev.target.closest('#d-play')) togglePlay(); });

  // ------------------------------------------------------------------ picks / favorites
  var NOTE_MAX = 300;
  function cleanIds(list) {
    var out = [];
    (Array.isArray(list) ? list : []).forEach(function (x) {
      var m = /^#?(\d{1,3})$/.exec(String(x).trim());
      var id = m && ('000' + m[1]).slice(-3);
      if (id && elBy[id] && out.indexOf(id) < 0) out.push(id);
    });
    return out;
  }
  function loadSaved() {
    var p = store.json('mpm-picks');
    if (p) {
      state.picks = cleanIds(p.ids);
      var notes = p.notes && typeof p.notes === 'object' ? p.notes : {};
      state.notes = {};
      state.picks.forEach(function (id) { if (typeof notes[id] === 'string' && notes[id]) state.notes[id] = notes[id].slice(0, NOTE_MAX); });
    }
    var f = store.json('mpm-favs');
    if (f) state.favs = cleanIds(f.ids);
  }
  function savePicks() { store.set('mpm-picks', JSON.stringify({ ids: state.picks, notes: state.notes })); }
  function saveFavs() { store.set('mpm-favs', JSON.stringify({ ids: state.favs })); }
  function isPicked(id) { return state.picks.indexOf(id) >= 0; }
  function isFav(id) { return state.favs.indexOf(id) >= 0; }
  function markTile(tl) {
    var on = isPicked(tl.el.id);
    tl.box.classList.toggle('is-picked', on);
    tl.pick.setAttribute('aria-pressed', on ? 'true' : 'false');
    tl.pick.setAttribute('aria-label', t('pickLabel', { id: tl.el.id, name: names(tl.el).main }));
    tl.pick.lastChild.textContent = t(on ? 'picked' : 'pick');
  }
  function markDetail() {
    var el = detail.el;
    if (!el) return;
    var on = isPicked(el.id), b = $('#d-pick');
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-label', t('pickLabel', { id: el.id, name: names(el).main }));
    $('#d-pick-t').textContent = t(on ? 'picked' : 'pick');
    var fv = isFav(el.id);
    $('#d-fav').setAttribute('aria-pressed', fv ? 'true' : 'false');
    $('#d-fav-t').textContent = t(fv ? 'faved' : 'fav');
  }
  function togglePick(id) {
    var el = elBy[id];
    if (!el) return;
    var i = state.picks.indexOf(id);
    if (i >= 0) { state.picks.splice(i, 1); delete state.notes[id]; } else state.picks.push(id);
    savePicks();
    tiles.forEach(function (tl) { if (tl.el.id === id) markTile(tl); });
    markDetail(); renderPicks();
    toast(t(i >= 0 ? 'unpickedLive' : 'pickedLive', { id: id, name: names(el).main, n: state.picks.length }));
  }
  function toggleFav(id) {
    var i = state.favs.indexOf(id);
    if (i >= 0) state.favs.splice(i, 1); else state.favs.push(id);
    saveFavs(); markDetail(); renderFavs();
    toast(t(i >= 0 ? 'unfavLive' : 'favLive', { id: id }));
  }
  function rowLink(id) {
    var el = elBy[id], nm = names(el);
    var a = h('a', { class: 'row-link', href: '#' + id, 'aria-label': t('openLabel', { id: id, name: nm.main }) }, [
      h('span', { class: 'row-top' }, [h('span', { class: 'row-id', text: '#' + id }), h('span', { class: 'row-name', text: nm.main })]),
      h('span', { class: 'row-meaning', text: txt(el.meaning) }),
    ]);
    a.addEventListener('click', function (ev) { openFromApp(ev, id); });
    return a;
  }
  function renderPicks() {
    var n = state.picks.length, list = $('#pick-list');
    var badge = $('#pick-badge');
    badge.hidden = !n; badge.textContent = String(n);
    $('#tb-picks').setAttribute('aria-label', t('tabPicks') + (n ? ' ' + n : ''));
    $('#pick-empty').hidden = n > 0;
    $('#pick-acts').hidden = !n;
    list.textContent = '';
    state.picks.forEach(function (id, i) {
      var nm = names(elBy[id]);
      var x = h('button', { type: 'button', class: 'row-x', 'aria-label': t('unpickLabel', { id: id, name: nm.main }) });
      x.innerHTML = X_SVG;
      x.addEventListener('click', function () {
        togglePick(id);
        var xs = $$('.row-x', list), next = xs[Math.min(i, xs.length - 1)];
        if (next) next.focus();
      });
      var note = h('input', { type: 'text', class: 'row-note', maxlength: String(NOTE_MAX), autocomplete: 'off', enterkeyhint: 'done',
        placeholder: t('notePh'), 'aria-label': t('noteLabel', { id: id }) });
      note.value = state.notes[id] || '';
      note.addEventListener('input', function () {
        var v = note.value.slice(0, NOTE_MAX);
        if (v.trim()) state.notes[id] = v; else delete state.notes[id];
        savePicks();
      });
      note.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') note.blur(); });
      list.appendChild(h('li', { class: 'row', 'data-id': id }, [
        h('div', { class: 'row-main' }, [h('span', { class: 'row-n', 'aria-hidden': 'true', text: String(i + 1) }), rowLink(id), x]),
        note,
      ]));
    });
  }
  function renderFavs() {
    var list = $('#fav-list');
    $('#fav-empty').hidden = state.favs.length > 0;
    list.textContent = '';
    state.favs.forEach(function (id) {
      var nm = names(elBy[id]);
      var x = h('button', { type: 'button', class: 'row-x row-star', 'aria-label': t('unfavLabel', { id: id, name: nm.main }) });
      x.innerHTML = STAR_SVG;
      x.addEventListener('click', function () { toggleFav(id); });
      list.appendChild(h('li', { class: 'row', 'data-id': id }, [h('div', { class: 'row-main' }, [rowLink(id), x])]));
    });
  }
  // 上流 site.js の pickedText() と同じ文面。違いは 1 点だけで、要素ごとのメモがあればその要素の行の下に
  // 「   メモ: …」を足す（メモが無ければ上流と 1 文字も違わない）。
  function pickedText() {
    var lang = state.lang, lines = [t('outIntro', { n: state.picks.length }), ''];
    state.picks.forEach(function (id, i) {
      var nm = names(elBy[id]);
      var sub = nm.sub && nm.sub !== nm.main ? (lang === 'ja' ? '（' + nm.sub + '）' : ' (' + nm.sub + ')') : '';
      lines.push((i + 1) + '. #' + id + ' ' + nm.main + sub);
      lines.push('   ' + t('outDemo') + ': ' + SITE + '#' + id);
      lines.push('   ' + t('outSpec') + ': ' + SITE + 'api/v1/' + lang + '/e/' + id + '.txt');
      var note = (state.notes[id] || '').trim();
      if (note) lines.push('   ' + t('outNote') + ': ' + note);
    });
    lines.push('', t('outEnd'));
    return lines.join('\n');
  }
  $('#pick-copy').addEventListener('click', function () { if (state.picks.length) copyAndTell(pickedText()); });
  $('#pick-share').addEventListener('click', function () { if (state.picks.length) shareText('Motion Prompt', pickedText()); });
  $('#pick-clear').addEventListener('click', function () {
    if (!state.picks.length) return;
    if (!window.confirm(t('clearConfirm'))) return;
    state.picks = []; state.notes = {}; savePicks();
    tiles.forEach(markTile); markDetail(); renderPicks();
    toast(t('clearedLive'));
  });

  // ------------------------------------------------------------------ tabs / language / playback
  function setTab(tab) {
    if (state.open) closeDetail(true);
    if (hashId()) history.replaceState(null, '', location.pathname + location.search);
    state.tab = tab;
    $$('.tab').forEach(function (s) { s.hidden = s.getAttribute('data-tab') !== tab; });
    $$('.tb').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-go') === tab ? 'true' : 'false'); });
    $('#browse-acts').hidden = tab !== 'browse';
    $('#appbar-title').textContent = t('title' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (tab === 'browse') markDirty();
    window.scrollTo(0, 0);
  }
  $$('.tb').forEach(function (b) {
    b.addEventListener('click', function () {
      var go = b.getAttribute('data-go');
      if (go === state.tab) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      setTab(go);
    });
  });
  function applyText() {
    var lang = state.lang;
    root.lang = lang;
    $$('[data-t]').forEach(function (n) { n.textContent = t(n.getAttribute('data-t')); });
    $$('[data-t-attr]').forEach(function (n) {
      n.getAttribute('data-t-attr').split(',').forEach(function (pair) {
        var kv = pair.split(':'); n.setAttribute(kv[0].trim(), t(kv[1].trim()));
      });
    });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    $('#d-prev').setAttribute('aria-label', t('prev'));
    $('#d-next').setAttribute('aria-label', t('next'));
    $('#d-close').setAttribute('aria-label', t('close'));
    $('#appbar-title').textContent = t('title' + state.tab.charAt(0).toUpperCase() + state.tab.slice(1));
    if (!state.open) document.title = t('title');
    applyPlay();
  }
  function setLang(lang) {
    if (lang === state.lang) return;
    state.lang = lang;
    store.set('mpm-lang', lang);
    applyText(); buildChips(); buildGrid(); renderPicks(); renderFavs();
    if (state.open) fillDetail(elBy[state.open]);
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
  function applyPlay() {
    [$('#play'), $('#d-play')].forEach(function (b) {
      b.setAttribute('aria-pressed', state.playing ? 'true' : 'false');
      b.setAttribute('aria-label', t(state.playing ? 'pause' : 'play'));
    });
    $('#play').setAttribute('aria-label', t(state.playing ? 'pauseLabel' : 'playLabel'));
  }
  function togglePlay() { state.playing = !state.playing; applyPlay(); markDirty(); }
  $('#play').addEventListener('click', togglePlay);
  $('#d-play').addEventListener('click', togglePlay);
  $('#cols').addEventListener('click', function () {
    state.cols = state.cols === 2 ? 1 : 2;
    store.set('mpm-cols', String(state.cols));
    applyCols();
  });
  var q = $('#q');
  q.addEventListener('input', function () { state.q = q.value.trim(); applyFilter(); });
  q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') q.blur(); });

  // ------------------------------------------------------------------ info
  function loadInfo() {
    fetchText('UPSTREAM_SHA').then(function (s) { $('#sha').textContent = s.trim(); }, function () { $('#sha').textContent = '-'; });
    fetchText('UPSTREAM-LICENSE').then(function (s) { $('#license-text').textContent = s; }, function () { $('#license-text').textContent = t('loadFailed'); });
  }

  // ------------------------------------------------------------------ start
  function start(cat) {
    CAT = cat;
    SITE = CAT.site || 'https://showheyohtaki.github.io/motion-prompt/';
    CAT.packs.forEach(function (p) { packBy[p.pack] = p; });
    CAT.elements.forEach(function (e, i) { elBy[e.id] = e; e._i = i; order.push(e.id); });
    loadSaved();
    applyText();
    buildChips();
    buildGrid();
    renderPicks();
    renderFavs();
    loadInfo();
    CAT.packs.forEach(loadPack);
    requestAnimationFrame(frame);
    syncFromHash();
    root.classList.add('is-ready');
  }
  applyText();
  if (!MP) { $('#count').textContent = t('loadFailed'); return; }
  fetch(VENDOR + 'api/v1/catalog.json').then(function (r) {
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  }).then(start, function () { $('#count').textContent = t('loadFailed'); });

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* オフライン対応なしで動く */ });
    });
  }
})();
