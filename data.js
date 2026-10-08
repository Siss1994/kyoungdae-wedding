/* 경대♥예슬 — 단일 콘텐츠 소스. 모든 시안이 이 파일을 참조합니다.
   내용 수정은 여기 한 곳만 고치면 전 시안에 반영됩니다. */
window.WED = {
  date: { y:2026, m:12, d:12, hh:16, mm:0,
    ko:'2026년 12월 12일 토요일 오후 4시',
    koShort:'2026. 12. 12. 토 오후 4시',
    dow:'토요일', dowEn:'SATURDAY', dowEn3:'SAT',
    en:'Saturday, December 12, 2026 at 4:00 PM',
    monthEn:'December', monthKo:'12월'
  },
  venue: {
    ko:'서초동 성당', hall:'2층 대성전', koFull:'서초동 성당 2층 대성전',
    en:'Seocho Catholic Church', enFull:'Seocho Catholic Church, Seoul',
    addr:'서울 서초구 서초대로64길 73', city:'서울, 서초동', cityEn:'Seoul',
    tel:'02-585-6101',
    copy:'서울 서초구 서초대로64길 73 서초동성당',
    naver:'https://map.naver.com/p/search/%EC%84%9C%EC%B4%88%EB%8F%99%EC%84%B1%EB%8B%B9',
    kakao:'https://map.kakao.com/?q=%EC%84%9C%EC%B4%88%EB%8F%99%EC%84%B1%EB%8B%B9'
  },
  groom:{ ko:'백경대', bap:'토마스', en:'Kyoungdae Baek', enFirst:'Kyoungdae',
    rel:'차남', father:'', fatherBap:'', mother:'유환영', motherBap:'' },
  bride:{ ko:'김예슬', bap:'소화데레사', en:'Yeaseul Kim', enFirst:'Yeaseul',
    rel:'차녀', father:'김영환', fatherBap:'요셉', mother:'김석자', motherBap:'마리아' },
  greet:{
    title:'초대합니다',
    lines:['각자의 시간을 걸어온 두 사람이 만나','이제는 함께 시간이라는 여행을 시작하려 합니다.','',
           '설레이는 여정의 시작에','여러분들을 초대합니다.'],
    html:'각자의 시간을 걸어온 두 사람이 만나<br>이제는 함께 시간이라는 여행을 시작하려 합니다.<br><br>설레이는 여정의 시작에<br>여러분들을 초대합니다.',
    htmlNarrow:'각자의 시간을 걸어온 두 사람이 만나<br>이제는 함께 시간이라는 여행을<br>시작하려 합니다.<br><br>설레이는 여정의 시작에<br>여러분들을 초대합니다.'
  },
  accounts:{
    groom:[ {bank:'우리은행', no:'117-097844-12-001', who:'유환영', rel:'어머니'},
            {bank:'우리은행', no:'1002-658-016582',   who:'백경대', rel:'신랑'} ],
    bride:[ {bank:'우리은행', no:'407-053747-02-101', who:'김영환', rel:'아버지'},
            {bank:'국민은행', no:'130-21-0064-251',   who:'김석자', rel:'어머니'},
            {bank:'카카오뱅크', no:'3333-04-6209726', who:'김예슬', rel:'신부'} ]
  },
  ways:[
    { k:'지하철', en:'SUBWAY',
      main:'<em>2·3호선 교대역 1번 출구</em> 직진 → 경부고속도로 굴다리(서초1교) 전 횡단보도 우측 골목 300m → 서초현대3차 APT 앞 (도보 10~15분)',
      notes:['※ 마을버스 : 교대역 2호선 2·5번, 3호선 13번 출구 → 03번 → 성당 앞 하차',
             '※ 강남역 8번 출구 도보 10분'] },
    { k:'버스', en:'BUS',
      main:'<em>창신교회 앞</em> 하차 — 144 · 350 (간선)<br><em>유원아파트</em> 하차 — 740 (간선)', notes:[] },
    { k:'마을버스', en:'VILLAGE BUS',
      main:'03번 신사역→교대역 : 창신교회 하차<br>03번 교대역→신사역 : 서초동성당 · 삼성레포츠 하차<br>21번 창신교회 하차 &nbsp;·&nbsp; 10번 유원아파트 하차', notes:[] }
  ],
  // 가톨릭 혼배미사 특수 안내 (리서치: 미사는 40분~1시간으로 일반 예식보다 길어
  // 하객 사전 안내가 실용적으로 필요. 서초동성당 혼인미사는 토 12시·16시 운영)
  mass:{
    durationKo:'혼배미사는 약 40분~1시간 소요됩니다.',
    noteKo:'일반 예식보다 다소 길며, 미사 중 기도와 성찬 전례가 함께 진행됩니다.',
    noteEn:'The nuptial Mass runs approximately 40–60 minutes.'
  },
  parking:{
    html:'성당 주차 공간이 넉넉하지 않습니다.<br>가까운 지하철이나 버스를 이용해 주시면 감사하겠습니다.'
  },

  meal:{
    html:'식사시간은 예식 전 30분, 예식 후 1시간으로<br>총 2시간 30분이오니 참고 바랍니다.'
  },

  notice:{
    html:'축하 화환, 화분, 꽃바구니 등을 대신하여<br><b>“축복미(쌀화환)”</b>로 함께하여주세요.<br>'
        +'<span class="sub">축복미는 성당에 문의해주세요.<br>'
        +'서초동성당 <a href="tel:025856101">02-585-6101</a>, <a href="tel:025855883">02-585-5883</a></span>',
    plain:'축하 화환, 화분, 꽃바구니 등을 대신하여 "축복미(쌀화환)"로 함께하여주세요. 축복미는 성당에 문의해주세요. 서초동성당 02-585-6101, 02-585-5883'
  },
  photos:{
    hero:'photo-08', heroAlt:'photo-05', portrait:'photo-01',
    all:['photo-01','photo-02','photo-03','photo-04','photo-05','photo-06','photo-07','photo-08','photo-09','photo-10',
         'photo-11','photo-12','photo-13','photo-14','photo-15','photo-16','photo-17','photo-18','photo-19','photo-20'],
    // 세로 사진만 (가로: 02,03,06,13)
    tall:['photo-01','photo-04','photo-05','photo-07','photo-08','photo-09','photo-10','photo-11','photo-12',
          'photo-14','photo-15','photo-16','photo-17','photo-18','photo-19','photo-20'],
    wide:['photo-02','photo-03','photo-06','photo-13'],
    pick9:['photo-05','photo-08','photo-01','photo-14','photo-09','photo-18','photo-12','photo-19','photo-17'],
    pick12:['photo-05','photo-08','photo-01','photo-04','photo-14','photo-09','photo-18','photo-15','photo-11','photo-12','photo-19','photo-17']
  },
  verses:[
    {t:'이제 그들은 둘이 아니라 한 몸이다.', s:'마태 19,6'},
    {t:'사랑은 참고 기다립니다. 사랑은 친절합니다.', s:'1코린 13,4'},
    {t:'사랑은 모든 것을 덮어 주고 모든 것을 믿으며 모든 것을 바라고 모든 것을 견디어 냅니다.', s:'1코린 13,7'},
    {t:'하느님께서 맺어 주신 것을 사람이 갈라놓아서는 안 된다.', s:'마르 10,9'}
  ]
};

/* data-w="경로" 속성을 WED 값으로 채웁니다. data-w-html 이면 innerHTML. */
window.fillWED = function () {
  var get = function (p) { return p.split('.').reduce(function (o, k) { return o && o[k]; }, window.WED); };
  document.querySelectorAll('[data-w]').forEach(function (el) {
    var v = get(el.getAttribute('data-w'));
    if (v == null) return;
    if (el.hasAttribute('data-w-html')) el.innerHTML = v; else el.textContent = v;
  });
  document.querySelectorAll('[data-w-href]').forEach(function (el) {
    var v = get(el.getAttribute('data-w-href')); if (v) el.setAttribute('href', v);
  });
  document.querySelectorAll('[data-w-copy]').forEach(function (el) {
    var v = get(el.getAttribute('data-w-copy')); if (v) el.setAttribute('data-copy', v);
  });
};
