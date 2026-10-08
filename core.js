/* ============================================================
   경대♥예슬 청첩장 — 공용 코어
   모든 시안이 공유. 효과는 data-* 속성으로 opt-in.
   ============================================================ */
(function () {
  'use strict';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = document;

  /* ── 0. 콘텐츠 주입 ─────────────────────────────────────── */
  if (window.fillWED) window.fillWED();

  /* ── 1. 이미지 확대 차단 (전 시안 공통 필수) ─────────────── */
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (ev) {
    D.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
  });
  var lastTap = 0;
  D.addEventListener('touchend', function (e) {
    var t = Date.now();
    if (t - lastTap <= 320) e.preventDefault();
    lastTap = t;
  }, { passive: false });
  D.addEventListener('touchmove', function (e) {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
  D.addEventListener('contextmenu', function (e) { if (e.target.tagName === 'IMG') e.preventDefault(); });
  D.addEventListener('dragstart', function (e) { if (e.target.tagName === 'IMG') e.preventDefault(); });

  /* ── 2. 복사 + 토스트 ───────────────────────────────────── */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = D.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      D.body.appendChild(ta); ta.select();
      try { D.execCommand('copy'); res(); } catch (e) { rej(e); } finally { D.body.removeChild(ta); }
    });
  }
  var tTimer;
  function toast(msg) {
    var el = D.getElementById('toast');
    if (!el) { el = D.createElement('div'); el.id = 'toast'; D.body.appendChild(el); }
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { el.classList.remove('is-on'); }, 1900);
  }
  D.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    e.preventDefault();
    copyText(b.getAttribute('data-copy'))
      .then(function () { toast(b.getAttribute('data-copy-msg') || '복사되었습니다'); })
      .catch(function () { toast('복사에 실패했어요'); });
  });

  /* ── 3. 아코디언 ────────────────────────────────────────── */
  D.addEventListener('click', function (e) {
    var h = e.target.closest('[data-acc]'); if (!h) return;
    var p = h.nextElementSibling;
    var open = h.classList.toggle('is-open');
    h.setAttribute('aria-expanded', open);
    p.style.maxHeight = open ? p.scrollHeight + 'px' : '';
  });

  /* ── 4. 탭 ──────────────────────────────────────────────── */
  D.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]'); if (!t) return;
    var group = t.closest('[data-tabs]'); if (!group) return;
    var key = t.getAttribute('data-tab');
    group.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.toggle('is-on', b === t); });
    group.querySelectorAll('[data-panel]').forEach(function (p) {
      p.classList.toggle('is-on', p.getAttribute('data-panel') === key);
    });
  });

  /* ── 5. 텍스트 분할 (char / word / line) ────────────────── */
  function splitText(el, mode) {
    if (el.dataset.split === 'done') return;
    var raw = el.textContent.trim();
    var parts = mode === 'char' ? Array.from(raw) : raw.split(/(\s+)/);
    el.textContent = '';
    var i = 0;
    parts.forEach(function (p) {
      if (/^\s+$/.test(p)) { el.appendChild(D.createTextNode(p)); return; }
      var o = D.createElement('span'); o.className = 'sp-o';
      var s = D.createElement('span'); s.className = 'sp-i';
      s.textContent = p; s.style.setProperty('--i', i++);
      o.appendChild(s); el.appendChild(o);
    });
    el.style.setProperty('--n', i);
    el.dataset.split = 'done';
  }
  D.querySelectorAll('[data-split]').forEach(function (el) { splitText(el, el.getAttribute('data-split')); });

  /* ── 6. 등장 애니메이션 (+ stagger) ─────────────────────── */
  var revealed = new WeakSet();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting || revealed.has(en.target)) return;
      revealed.add(en.target);
      var el = en.target;
      var stag = parseFloat(el.getAttribute('data-stagger') || 0);
      // 리서치 권장 구간: 60~100ms. 40ms 미만은 깜빡임, 150ms 초과는 느려 보임
      if (stag) stag = Math.max(60, Math.min(100, stag));
      if (stag) {
        var kids = el.children;
        for (var i = 0; i < kids.length; i++) kids[i].style.transitionDelay = (i * stag) + 'ms';
      }
      el.classList.add('is-in');
      if (!el.hasAttribute('data-repeat')) io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  D.querySelectorAll('.rv,[data-rv]').forEach(function (el) { io.observe(el); });

  /* ── 7. SVG 선 그리기 애니메이션 ────────────────────────── */
  D.querySelectorAll('[data-draw]').forEach(function (svg) {
    svg.querySelectorAll('path,line,circle,ellipse,polyline,rect').forEach(function (p) {
      var len;
      try { len = p.getTotalLength ? p.getTotalLength() : 0; } catch (e) { len = 0; }
      if (!len) { var bb = p.getBBox(); len = (bb.width + bb.height) * 2.2; }
      p.style.setProperty('--len', len);
      p.style.strokeDasharray = len; p.style.strokeDashoffset = RM ? 0 : len;
    });
    io.observe(svg);
  });

  /* ── 8. 스크럼: 요소의 뷰포트 진행도 → CSS 변수 --p (0~1) ─ */
  var scrubEls = Array.prototype.slice.call(D.querySelectorAll('[data-scrub]'));
  var paraEls = Array.prototype.slice.call(D.querySelectorAll('[data-parallax]'));
  var progBar = D.querySelector('[data-progress]');
  var needRAF = scrubEls.length || paraEls.length || progBar;
  var ticking = false;

  function frame() {
    ticking = false;
    var vh = window.innerHeight;

    scrubEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var mode = el.getAttribute('data-scrub');
      var p;
      if (mode === 'cover') {           // 요소가 뷰포트를 지나는 동안 0→1
        p = (vh - r.top) / (vh + r.height);
      } else if (mode === 'enter') {    // 아래에서 들어와 화면 중앙까지 0→1
        p = (vh - r.top) / vh;
      } else {                          // 'self': 요소 상단이 뷰포트 상단에 붙어있는 동안
        p = -r.top / Math.max(1, r.height - vh);
      }
      el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));
    });

    if (!RM) paraEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var amt = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      var mid = r.top + r.height / 2 - vh / 2;
      el.style.setProperty('--y', (-mid * amt).toFixed(2) + 'px');
    });

    if (progBar) {
      var h = D.documentElement.scrollHeight - vh;
      progBar.style.setProperty('--p', h > 0 ? (window.scrollY / h).toFixed(4) : 0);
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  if (needRAF) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    frame();
  }

  /* ── 9. 숫자 카운터 ─────────────────────────────────────── */
  D.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dur = parseInt(el.getAttribute('data-count-dur') || 1400, 10);
    var ob = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      ob.disconnect();
      if (RM) { el.textContent = end; return; }
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * e);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: .4 });
    ob.observe(el);
  });

  /* ── 10. D-day ──────────────────────────────────────────── */
  var W = window.WED;
  if (W) {
    var tgt = new Date(W.date.y, W.date.m - 1, W.date.d);
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var diff = Math.round((tgt - now) / 86400000);
    // 리서치: 한국 모바일청첩장은 예식 후 '신혼 N일차'로 자동 전환되는 것이 관행.
    // 식이 끝나도 하객이 링크를 계속 열어보게 만드는 디테일.
    var label = diff > 0 ? 'D-' + diff
              : diff === 0 ? 'D-DAY'
              : '신혼 ' + Math.abs(diff) + '일차';
    D.querySelectorAll('[data-dday]').forEach(function (el) { el.textContent = label; });
    D.querySelectorAll('[data-dday-num]').forEach(function (el) { el.textContent = Math.abs(diff); });

    /* 실시간 카운트다운 (일/시/분/초) */
    var cd = D.querySelector('[data-countdown]');
    if (cd) {
      var tgtT = new Date(W.date.y, W.date.m - 1, W.date.d, W.date.hh, W.date.mm);
      var pad = function (n) { return String(n).padStart(2, '0'); };
      (function tick() {
        var s = Math.max(0, Math.floor((tgtT - Date.now()) / 1000));
        var set = function (k, v) { var e = cd.querySelector('[data-cd="' + k + '"]'); if (e) e.textContent = v; };
        set('d', Math.floor(s / 86400));
        set('h', pad(Math.floor(s % 86400 / 3600)));
        set('m', pad(Math.floor(s % 3600 / 60)));
        set('s', pad(s % 60));
        setTimeout(tick, 1000);
      })();
    }
  }

  /* ── 11. 가로 갤러리 — 현재 인덱스 표시 ─────────────────── */
  D.querySelectorAll('[data-rail]').forEach(function (rail) {
    // 레일이 래퍼(data-lightbox 등) 안에 있어도 찾도록 섹션 범위까지 올려서 탐색
    var scope = rail.closest('section') || rail.parentElement;
    var dots = scope.querySelector('[data-rail-dots]');
    var cnt = scope.querySelector('[data-rail-count]');
    var n = rail.children.length;
    if (dots) {
      if (n > 12) dots.classList.add('is-many');
      for (var i = 0; i < n; i++) dots.appendChild(D.createElement('i'));
    }
    var upd = function () {
      var idx = Math.round(rail.scrollLeft / (rail.scrollWidth / n));
      idx = Math.max(0, Math.min(n - 1, idx));
      if (dots) Array.prototype.forEach.call(dots.children, function (d, j) { d.classList.toggle('is-on', j === idx); });
      if (cnt) cnt.textContent = (idx + 1) + ' / ' + n;
    };
    rail.addEventListener('scroll', function () {
      if (rail._t) return; rail._t = requestAnimationFrame(function () { rail._t = 0; upd(); });
    }, { passive: true });
    upd();
  });

  /* ── 11-a. 레일 ↔ 썸네일 인덱스 연동 ─────────────────── */
  D.querySelectorAll('[data-rail-for]').forEach(function (idx) {
    var rail = D.querySelector(idx.getAttribute('data-rail-for'));
    if (!rail) return;
    var thumbs = Array.prototype.slice.call(idx.children);

    // 썸네일 탭 → 레일을 해당 사진으로 이동
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        rail.scrollTo({ left: i * (rail.scrollWidth / rail.children.length), behavior: RM ? 'auto' : 'smooth' });
      });
    });

    // 레일 스크롤 → 현재 썸네일 활성화
    var sync = function () {
      var i = Math.round(rail.scrollLeft / (rail.scrollWidth / rail.children.length));
      i = Math.max(0, Math.min(thumbs.length - 1, i));
      thumbs.forEach(function (t, j) { t.classList.toggle('is-on', j === i); });
    };
    rail.addEventListener('scroll', function () {
      if (idx._t) return;
      idx._t = requestAnimationFrame(function () { idx._t = 0; sync(); });
    }, { passive: true });
    sync();
  });

  /* ── 11-b. 라이트박스 — 탭하면 한 장씩, 옆으로 스와이프. 줌은 불가 ── */
  (function () {
    var box = null, rail = null, cnt = null, imgs = [];
    function build() {
      box = D.createElement('div');
      box.className = 'lb';
      box.innerHTML =
        '<button class="lb-x" aria-label="닫기"></button>' +
        '<div class="lb-rail"></div>' +
        '<div class="lb-n"></div>';
      D.body.appendChild(box);
      rail = box.querySelector('.lb-rail');
      cnt = box.querySelector('.lb-n');
      box.querySelector('.lb-x').addEventListener('click', close);
      box.addEventListener('click', function (e) { if (e.target === box || e.target === rail) close(); });
      rail.addEventListener('scroll', function () {
        if (rail._t) return;
        rail._t = requestAnimationFrame(function () {
          rail._t = 0;
          var i = Math.round(rail.scrollLeft / rail.clientWidth);
          cnt.textContent = (Math.max(0, Math.min(imgs.length - 1, i)) + 1) + ' / ' + imgs.length;
        });
      }, { passive: true });
      D.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    function open(list, idx) {
      if (!box) build();
      imgs = list;
      rail.innerHTML = list.map(function (src) {
        return '<figure><img src="' + src + '" alt=""></figure>';
      }).join('');
      D.body.classList.add('is-locked');
      box.classList.add('is-on');
      // 레이아웃 확정 후 해당 인덱스로 점프
      requestAnimationFrame(function () {
        rail.scrollLeft = idx * rail.clientWidth;
        cnt.textContent = (idx + 1) + ' / ' + list.length;
      });
    }
    function close() {
      if (!box) return;
      box.classList.remove('is-on');
      D.body.classList.remove('is-locked');
      setTimeout(function () { rail.innerHTML = ''; }, 320);
    }
    D.addEventListener('click', function (e) {
      var hit = e.target.closest('[data-lightbox] img');
      if (!hit) return;
      var wrap = hit.closest('[data-lightbox]');
      var all = Array.prototype.slice.call(wrap.querySelectorAll('img'));
      // 썸네일 경로를 원본으로 승격 + 중복 제거 (레일·그리드에 같은 사진이 있어도 한 번만)
      var srcs = [], map = [];
      all.forEach(function (im) {
        var src = im.getAttribute('src').replace('/thumbs/', '/photos/');
        var i = srcs.indexOf(src);
        if (i === -1) { i = srcs.length; srcs.push(src); }
        map.push(i);
      });
      open(srcs, map[all.indexOf(hit)]);
    });
  })();

  /* ── 12. 섹션 네비 (현재 섹션 하이라이트 + 부드러운 이동) ── */
  var navLinks = D.querySelectorAll('[data-navto]');
  if (navLinks.length) {
    navLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var t = D.getElementById(a.getAttribute('data-navto'));
        if (t) t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
      });
    });
    var secIO = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-navto') === en.target.id); });
      });
    }, { threshold: .4 });
    navLinks.forEach(function (a) { var t = D.getElementById(a.getAttribute('data-navto')); if (t) secIO.observe(t); });
  }

  /* ── 13. 인트로 커튼 (data-intro 가 있으면) ─────────────── */
  var intro = D.querySelector('[data-intro]');
  if (intro) {
    var openIt = function () {
      intro.classList.add('is-out');
      D.body.classList.remove('is-locked');
      setTimeout(function () { intro.remove(); }, 1600);
    };
    D.body.classList.add('is-locked');
    var btn = intro.querySelector('[data-intro-open]');
    if (btn) btn.addEventListener('click', openIt);
    else setTimeout(openIt, 2000);
  }

  /* ── 14. 공유하기 ───────────────────────────────────────── */
  D.addEventListener('click', function (e) {
    var b = e.target.closest('[data-share]'); if (!b) return;
    e.preventDefault();
    var payload = {
      title: (W ? W.groom.ko + ' ♥ ' + W.bride.ko : '') + ' 결혼합니다',
      text: W ? W.date.ko + ' · ' + W.venue.koFull : '',
      url: location.href
    };
    if (navigator.share) navigator.share(payload).catch(function () {});
    else copyText(location.href).then(function () { toast('링크가 복사되었습니다'); });
  });

  /* ── 15. 맨 위로 ────────────────────────────────────────── */
  D.addEventListener('click', function (e) {
    if (!e.target.closest('[data-top]')) return;
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  });

  /* ── 16. BGM 토글 (오디오 파일이 있을 때만) ─────────────── */
  var bgmBtn = D.querySelector('[data-bgm]');
  if (bgmBtn) {
    var audio = D.getElementById('bgm');
    bgmBtn.addEventListener('click', function () {
      if (!audio) return;
      if (audio.paused) { audio.play().then(function(){ bgmBtn.classList.add('is-on'); }).catch(function(){}); }
      else { audio.pause(); bgmBtn.classList.remove('is-on'); }
    });
  }

  D.documentElement.classList.add('js-ready');
})();
