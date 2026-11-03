/* ===== 2.9 深度生活：資料表（特質庫、性格類型、小怪癖、台詞） ===== */
const L29={};
/* 特質分類 */
L29.CATS=[['pers','性格'],['soc','社交'],['emo','情緒'],['int','興趣'],['abi','能力'],['hab','生活習慣'],['spc','特殊']];
/* ai：活動權重倍率；nd：需求下降速度倍率；x：衝突特質 */
L29.BASE={
 lazy:{c:'hab',ai:{nap:1.8,shade:1.5,bench:1.4,explore:.5,butterfly:.5,tag:.5,tidy:.4},nd:{fat:1.3},x:['hardworking','athletic']},
 sleepy:{c:'hab',ai:{nap:2.2,home:1.4},nd:{sleep:1.4},x:['nightowl']},
 curious:{c:'pers',ai:{explore:2,observe:2.4,butterfly:1.3,wander:1.2},nd:{fun:1.2}},
 clingy:{c:'soc',ai:{stroll:1.8,chat:1.6,campfire:1.3},nd:{social:1.5},x:['loner']},
 tsun:{c:'pers',ai:{chat:.8},nd:{}},
 shy:{c:'soc',ai:{chat:.45,explore:.8,read:1.3,daydream:1.3},nd:{social:.7},x:['extrovert']},
 hot:{c:'pers',ai:{tag:1.8,butterfly:1.5,dance:1.5,nap:.6},nd:{fat:1.2,fun:1.2},x:['calm']},
 gentle:{c:'pers',ai:{garden:1.6,flowers:1.4,chat:1.2},nd:{}},
 sharp:{c:'soc',ai:{chat:.9},nd:{}},
 chatty:{c:'soc',ai:{chat:2,stroll:1.4},nd:{social:1.3},x:['quiet']},
 quiet:{c:'soc',ai:{chat:.5,read:1.4,fish:1.3,daydream:1.3},nd:{social:.6},x:['chatty']},
 sporty:{c:'abi',ai:{tag:2,butterfly:1.6,explore:1.3,nap:.6},nd:{fat:.8,hunger:1.3}},
 homebody:{c:'hab',ai:{home:1.8,furniture:1.6,explore:.5,read:1.3},nd:{}},
 dreamer:{c:'spc',ai:{stargaze:1.8,daydream:2,sunset:1.5},nd:{}},
 prank:{c:'pers',ai:{tag:1.6,butterfly:1.3,chat:1.2},nd:{fun:1.3}},
 foodie:{c:'hab',ai:{eat:2,drink:1.3},nd:{hunger:1.5},x:['picky']}
};
L29.TRAITS=[
 /* 性格 */
 {id:'introvert',c:'pers',em:'🌙',t:'內向',d:'獨處能充電，人多會累',fx:{social:-20},ai:{chat:.6,read:1.4,daydream:1.3,fish:1.2},nd:{social:.6},x:['extrovert'],idle:['一個人的時間剛剛好。','安靜一點比較自在。']},
 {id:'extrovert',c:'pers',em:'☀️',t:'外向',d:'越熱鬧越有精神',fx:{social:22,expr:8},ai:{chat:1.8,stroll:1.5,campfire:1.5,dance:1.4,read:.7},nd:{social:1.5},x:['introvert','shy','loner'],idle:['有沒有人要一起玩？','大家都在哪裡呀～']},
 {id:'cheerful',c:'pers',em:'🌼',t:'活潑',d:'笑容多、步伐輕快',fx:{lively:18,expr:12},ai:{butterfly:1.4,dance:1.5,tag:1.3},nd:{fun:1.2},idle:['今天也要開開心心！','啦啦啦～']},
 {id:'optimist',c:'pers',em:'🌈',t:'樂觀',d:'總能看到好的一面',fx:{expr:6,friendly:6},ai:{},nd:{},mood:'happy',x:['pessimist'],idle:['明天一定會更好！','下雨也沒關係，可以聽雨聲。']},
 {id:'pessimist',c:'pers',em:'🌧️',t:'悲觀',d:'容易往壞處想',fx:{expr:-6},ai:{daydream:1.3},nd:{},mood:'calm',x:['optimist'],idle:['萬一等一下下雨怎麼辦…','好事應該不會輪到我吧。']},
 {id:'stubborn',c:'pers',em:'🪨',t:'固執',d:'決定的事不輕易改變',fx:{indep:14},ai:{},nd:{},stay:1.6,idle:['我說要這樣就要這樣。','嗯，我還是覺得我是對的。']},
 {id:'carefree',c:'pers',em:'🍃',t:'隨性',d:'想到什麼做什麼',fx:{pace:-6},ai:{wander:1.5,daydream:1.3},nd:{},x:['perfectionist','serious'],idle:['隨便走走好了。','計畫什麼的，晚點再說～']},
 {id:'serious',c:'pers',em:'📏',t:'認真',d:'做事一絲不苟',fx:{expr:-8},ai:{read:1.4,tidy:1.4,garden:1.2},nd:{},x:['carefree','childish'],idle:['做事要有始有終。','我再確認一次。']},
 {id:'childish',c:'pers',em:'🍭',t:'孩子氣',d:'天真愛玩，情緒直接',fx:{lively:12,expr:16},ai:{butterfly:1.6,tag:1.5,dance:1.3},nd:{fun:1.4},x:['serious','mature'],idle:['我也要玩！','嘿嘿，抓不到我～']},
 {id:'mature',c:'pers',em:'🍵',t:'成熟穩重',d:'冷靜可靠的大人感',fx:{lively:-10,expr:-6,friendly:6},ai:{read:1.3,bench:1.3,chat:1.1},nd:{},x:['childish'],idle:['慢慢來，不急。','大家玩得開心就好。']},
 {id:'brave',c:'pers',em:'🦁',t:'勇敢',d:'不怕新事物與黑夜',fx:{indep:10},ai:{explore:1.6,stargaze:1.2},nd:{},x:['timid'],idle:['交給我吧！','黑漆漆的也不怕。']},
 {id:'timid',c:'pers',em:'🐭',t:'膽小',d:'容易被嚇到',fx:{indep:-10,social:-6},ai:{explore:.6,home:1.3,shelter:1.6},nd:{comfort:1.3},x:['brave'],idle:['剛剛那是什麼聲音…','我、我才沒有在發抖。']},
 {id:'perfectionist',c:'pers',em:'💎',t:'完美主義',d:'追求一切都剛剛好',fx:{pace:-6},ai:{tidy:1.8,garden:1.3},nd:{comfort:1.2},x:['carefree','messy'],idle:['這裡歪了一點點…','再調整一下就完美了。']},
 /* 社交 */
 {id:'friendlyhost',c:'soc',em:'🤗',t:'熱情好客',d:'喜歡招呼大家',fx:{friendly:18,social:12},ai:{chat:1.6,campfire:1.6,stroll:1.3},nd:{social:1.3},idle:['大家快來這邊坐！','要不要喝杯茶？']},
 {id:'loner',c:'soc',em:'🐺',t:'獨行俠',d:'習慣一個人行動',fx:{social:-18,indep:20},ai:{chat:.4,explore:1.5,fish:1.4,stroll:.5},nd:{social:.5},x:['clingy','extrovert','friendlyhost'],idle:['一個人走走也不錯。','不用等我。']},
 {id:'caring',c:'soc',em:'🩹',t:'會照顧人',d:'看到別人累了會關心',fx:{friendly:16},ai:{chat:1.4},care:1,nd:{},idle:['大家都還好嗎？','累了要說喔。']},
 {id:'jealous',c:'soc',em:'💚',t:'愛吃醋',d:'看到別人被摸會在意',fx:{expr:10},ai:{},jealous:1,nd:{},idle:['…為什麼只摸牠。','我也要。']},
 {id:'leader',c:'soc',em:'🚩',t:'領袖氣質',d:'喜歡帶頭找大家玩',fx:{social:12,indep:10},ai:{stroll:1.5,tag:1.3,campfire:1.3},lead:1,nd:{},idle:['跟我來！','大家集合～']},
 {id:'polite',c:'soc',em:'🎩',t:'有禮貌',d:'說話客氣、會道謝',fx:{friendly:8},ai:{},nd:{},idle:['謝謝你。','不好意思，打擾了。']},
 /* 情緒 */
 {id:'sensitive',c:'emo',em:'🫧',t:'敏感',d:'情緒起伏比較大，容易被影響',fx:{expr:12},ai:{shelter:1.4,daydream:1.2},nd:{comfort:1.3},emo:1.5,idle:['剛剛那句話是不是在說我…','下雨天心情也濕濕的。']},
 {id:'calm',c:'emo',em:'🧘',t:'冷靜',d:'不太會慌張',fx:{expr:-10,pace:-4},ai:{fish:1.3,read:1.2},nd:{},emo:.6,x:['moody','hot'],idle:['沒什麼好緊張的。','深呼吸。']},
 {id:'moody',c:'emo',em:'🎢',t:'情緒化',d:'心情說變就變',fx:{expr:16},ai:{},nd:{},emo:1.6,x:['calm'],idle:['現在心情超好！…等等又不好了。','哼，不想說話。']},
 {id:'crybaby',c:'emo',em:'😢',t:'愛哭鬼',d:'感動或難過都會掉眼淚',fx:{expr:14},ai:{},nd:{},emo:1.4,idle:['嗚…好感動。','我才沒有哭…']},
 {id:'romantic',c:'emo',em:'💗',t:'浪漫',d:'喜歡夕陽、星星與小驚喜',fx:{expr:8},ai:{sunset:1.8,stargaze:1.6,flowers:1.4},nd:{},idle:['夕陽好美，像在作夢。','要是有流星就好了。']},
 /* 興趣 */
 {id:'nature',c:'int',em:'🌿',t:'喜歡自然',d:'花草樹木最療癒',fx:{},ai:{flowers:1.8,garden:1.7,shade:1.4,explore:1.2,home:.8},nd:{},idle:['聞到青草的味道了。','樹葉的聲音好舒服。']},
 {id:'bookworm',c:'int',em:'📚',t:'熱愛閱讀',d:'有空就想翻書',fx:{lively:-6},ai:{read:2.6},nd:{},idle:['這本書的結局好想知道。','再讀一章就好。']},
 {id:'music',c:'int',em:'🎵',t:'熱愛音樂',d:'走路都在哼歌',fx:{expr:8},ai:{dance:1.8},hum:1,nd:{},idle:['啦～啦啦～','這首歌好好聽。']},
 {id:'artsy',c:'int',em:'🎨',t:'創意豐富',d:'腦中充滿點子',fx:{expr:8},ai:{daydream:1.6,observe:1.4,flowers:1.2},nd:{fun:1.2},idle:['我想到一個點子！','如果把雲畫成魚會怎樣？']},
 {id:'stargazer',c:'int',em:'🔭',t:'星空迷',d:'夜晚最期待看星星',fx:{},ai:{stargaze:2.4,campfire:1.2},nd:{},idle:['今晚會有流星嗎？','那是天鵝座喔。']},
 {id:'sealover',c:'int',em:'🐚',t:'海洋迷',d:'喜歡海浪與碼頭',fx:{},ai:{fish:2.4,sunset:1.3},nd:{},idle:['海浪在跟我說話。','碼頭邊最舒服了。']},
 {id:'gourmet',c:'int',em:'🍳',t:'美食家',d:'對吃很講究',fx:{},ai:{eat:1.6},nd:{hunger:1.2},idle:['今天想吃點特別的。','這個香味…是可可！']},
 {id:'collector',c:'int',em:'💠',t:'收藏家',d:'喜歡撿小東西收藏',fx:{},ai:{explore:1.4,fish:1.2},collect:1,nd:{},idle:['這顆石頭好漂亮，帶回家。','我的收藏又多一件了。']},
 {id:'fashion',c:'int',em:'👗',t:'時尚達人',d:'在意穿搭與外表',fx:{expr:6},ai:{},nd:{},idle:['今天的穿搭還可以吧？','這個顏色跟我很配。']},
 /* 能力 */
 {id:'smart',c:'abi',em:'🧠',t:'聰明',d:'學什麼都快',fx:{},ai:{read:1.5,observe:1.3},nd:{},idle:['原來是這樣運作的！','我算過了，沒問題。']},
 {id:'clumsy',c:'abi',em:'🌀',t:'冒失鬼',d:'常常不小心跌倒',fx:{pace:6},ai:{},clumsy:1,nd:{},idle:['哎呀，又絆到了。','剛剛什麼都沒發生喔！']},
 {id:'athletic',c:'abi',em:'🏅',t:'運動神經好',d:'跑得快、跳得高',fx:{pace:14,lively:10},ai:{tag:1.8,butterfly:1.4},speed:1.15,nd:{fat:.8},x:['lazy']},
 {id:'handy',c:'abi',em:'🔧',t:'手巧',d:'喜歡整理與修東西',fx:{},ai:{tidy:1.6,observe:1.3,furniture:1.3},nd:{},idle:['這個我來修修看。','整理好了！']},
 {id:'cook',c:'abi',em:'🧁',t:'料理高手',d:'喜歡在營火邊做點心',fx:{friendly:4},ai:{eat:1.3,campfire:1.6},nd:{},idle:['我來烤棉花糖給大家！','這次加了一點蜂蜜。']},
 /* 生活習慣 */
 {id:'hardworking',c:'hab',em:'🐝',t:'勤奮',d:'閒不下來，總想做點事',fx:{pace:10},ai:{tidy:1.6,garden:1.6,nap:.6,daydream:.6},nd:{},x:['lazy'],idle:['來做點有用的事吧。','休息？等等再說。']},
 {id:'tidy',c:'hab',em:'🧹',t:'愛乾淨',d:'看到落葉就想掃',fx:{},ai:{tidy:2.6},nd:{},x:['messy'],idle:['地上有落葉…我來掃。','乾乾淨淨心情好。']},
 {id:'messy',c:'hab',em:'🧦',t:'不拘小節',d:'亂一點也沒關係',fx:{},ai:{tidy:.3,wander:1.2},nd:{},x:['tidy','perfectionist'],idle:['亂中有序嘛～','東西放哪了？算了。']},
 {id:'picky',c:'hab',em:'🥄',t:'挑食',d:'對食物很挑剔',fx:{},ai:{eat:.8},picky:1,nd:{},x:['foodie','bigeater'],idle:['這個…我不太想吃。','只吃喜歡的。']},
 {id:'bigeater',c:'hab',em:'🍱',t:'大胃王',d:'吃很多、餓得快',fx:{},ai:{eat:1.8},nd:{hunger:1.6},x:['picky'],idle:['再來一碗！','肚子又在叫了。']},
 {id:'earlybird',c:'hab',em:'🐓',t:'早起',d:'清晨最有精神',fx:{},ai:{},chrono:-1.6,nd:{},x:['nightowl'],idle:['早安！清晨的空氣最棒了。','早起的鳥兒有蟲吃。']},
 {id:'nightowl',c:'hab',em:'🦉',t:'夜貓子',d:'越晚越有精神',fx:{},ai:{stargaze:1.5,campfire:1.3},chrono:1.8,nd:{},x:['earlybird','sleepy'],idle:['夜晚才剛開始呢。','睡覺？還早吧。']},
 {id:'napper',c:'hab',em:'🛌',t:'午睡控',d:'中午一定要睡一下',fx:{},ai:{nap:1.6},nap:1,nd:{},idle:['午餐後最適合睡覺了。']},
 {id:'walker',c:'hab',em:'👣',t:'愛散步',d:'飯後一定要走走',fx:{pace:4},ai:{wander:1.6,stroll:1.4,explore:1.2},nd:{},idle:['去散散步吧。']},
 /* 特殊 */
 {id:'mysterious',c:'spc',em:'🔮',t:'神秘',d:'總說些意味深長的話',fx:{expr:-10},ai:{daydream:1.4,stargaze:1.3},nd:{},idle:['命運的齒輪開始轉動了…','你相信預感嗎？']},
 {id:'lucky',c:'spc',em:'🍀',t:'幸運兒',d:'常常撿到好東西',fx:{},ai:{explore:1.2},lucky:1,nd:{},idle:['今天好像會有好事。','又撿到了耶！']},
 {id:'weather',c:'spc',em:'⛅',t:'天氣通',d:'總能猜中天氣變化',fx:{},ai:{},nd:{},idle:['等一下好像會下雨喔。','明天會是好天氣。']},
 {id:'scaredark',c:'spc',em:'🕯️',t:'怕黑',d:'夜晚喜歡待在有光的地方',fx:{},ai:{campfire:1.8,stargaze:.5,home:1.4,explore:.5},nd:{comfort:1.2},x:['brave'],idle:['火光旁邊比較安心。','天黑了…要點燈嗎？']}
];
/* 性格類型（活力 × 外向，十六型） */
L29.TYPES=[
 ['安靜觀察家','喜歡在角落安靜看著世界，觀察力一流。'],['慢活詩人','步調悠閒，對小事物很有感觸。'],['溫柔陪伴者','話不多但很溫暖，總在身邊陪著大家。'],['慵懶開心果','懶洋洋卻很愛笑，讓人放鬆。'],
 ['細心工匠','專注又仔細，喜歡把事情做好。'],['穩健思考者','冷靜理性，凡事想清楚再行動。'],['可靠好鄰居','親切穩重，大家有事都會找牠。'],['和氣調停者','擅長讓氣氛變好，朋友很多。'],
 ['獨行探險家','精力充沛卻喜歡自己行動，常有新發現。'],['好奇研究員','充滿好奇心，看到新東西就要研究。'],['熱心小幫手','活力滿滿又愛幫忙，是島上的開心來源。'],['人氣交際家','喜歡熱鬧與聊天，總是在人群中心。'],
 ['一匹狼冒險王','動作快、主意多，喜歡挑戰未知。'],['行動派挑戰者','想到就做，停不下來的衝勁。'],['元氣運動員','永遠充滿精神，跑跳是日常。'],['派對超級巨星','越熱鬧越興奮，走到哪都是派對。']];
/* 小怪癖：每個選項都有實際的遊戲參數 */
L29.Q={
 walk:{t:'走路方式',o:[['normal','普通',{sp:1}],['bouncy','蹦蹦跳跳',{sp:1.06}],['shuffle','慢吞吞拖步',{sp:.8}],['strut','抬頭挺胸',{sp:1}],['tiptoe','踮腳小碎步',{sp:1.12}],['sway','搖搖擺擺',{sp:.92}]]},
 stance:{t:'站姿',o:[['normal','普通'],['proud','挺胸'],['shy','縮著身子'],['relaxed','放鬆搖晃'],['restless','靜不下來']]},
 sit:{t:'坐姿',o:[['normal','普通'],['curl','縮成一團'],['sprawl','攤平'],['proper','端正']]},
 sleep:{t:'睡相',o:[['normal','普通'],['curl','捲成一團'],['starfish','大字型'],['toss','翻來覆去'],['snore','會打呼'],['talk','說夢話']]},
 eat:{t:'進食速度',o:[['normal','普通',{d:7}],['slow','細嚼慢嚥',{d:11}],['fast','狼吞虎嚥',{d:4}]]},
 appetite:{t:'食量',o:[['normal','普通',{k:1}],['small','小鳥胃',{k:.7}],['big','大胃王',{k:1.45}]]},
 greet:{t:'打招呼',o:[['wave','揮揮手'],['bow','鞠躬'],['hop','跳起來'],['hug','抱抱'],['nod','點點頭'],['peek','躲著偷看']]},
 volume:{t:'說話音量',o:[['normal','普通'],['soft','輕聲細語'],['loud','大嗓門']]},
 nervous:{t:'緊張時',o:[['fidget','扭來扭去'],['freeze','僵住不動'],['sweat','冒冷汗'],['hide','遮住臉']]},
 happy:{t:'開心時',o:[['hop','跳一跳'],['spin','轉圈圈'],['sparkle','閃閃發亮'],['dance','小舞步'],['blush','臉紅紅']]}
};
L29.HABITS=[['hum','哼歌','走路或發呆時會哼歌'],['skygaze','看天空','常常抬頭看雲'],['stretch','伸懶腰','動不動就伸懶腰'],['selftalk','自言自語','會小聲跟自己說話'],['snack','偷吃點心','發呆時會掏出小點心'],['collect','撿小東西','看到漂亮的小石頭就撿'],['tidyup','順手整理','經過時會把東西擺好'],['nap','隨地打盹','累了就地睡著']];
L29.TRIG=[['morning','早上'],['eat','吃東西後'],['happy','開心時'],['bored','無聊時'],['rain','下雨時'],['night','夜晚'],['meet','遇到朋友'],['idle','發呆時']];
L29.ACTN=[['say','說一句話'],['hum','哼歌'],['spin','轉圈'],['hop','跳一跳'],['sparkle','閃閃發亮'],['stretch','伸懶腰'],['look','東張西望'],['hearts','冒愛心']];
L29.QDEF={walk:'normal',stance:'normal',sit:'normal',sleep:'normal',eat:'normal',appetite:'normal',greet:'wave',volume:'normal',nervous:'fidget',happy:'hop'};
/* 需求 */
L29.NEEDS=[['hunger','飽足','#F4A65B'],['thirst','解渴','#5DB3E0'],['energy','精力','#86BC4E'],['sleep','睡眠','#9585DD'],['fun','娛樂','#E884AE'],['social','社交','#EC7878'],['comfort','舒適','#45B596']];
/* 活動對需求的回復（每秒） */
L29.FX={eat:{hunger:.11},drink:{thirst:.16},nap:{energy:.02,sleep:.016,comfort:.006},home:{energy:.02,sleep:.02,comfort:.01},shade:{energy:.012,comfort:.008},bench:{energy:.01,comfort:.008},sunset:{energy:.008,comfort:.008,fun:.004},
 read:{fun:.01,comfort:.006,energy:.004},fish:{fun:.008,comfort:.004},flowers:{fun:.01,comfort:.004},garden:{fun:.008},tidy:{fun:.004,comfort:.004},campfire:{comfort:.012,social:.006,fun:.004},stargaze:{fun:.01,comfort:.004},
 butterfly:{fun:.03},tag:{fun:.03,social:.02},dance:{fun:.03,social:.015},stroll:{social:.02,fun:.006},explore:{fun:.02},observe:{fun:.02},daydream:{comfort:.008,energy:.004},sunbathe:{comfort:.012,energy:.008},shelter:{comfort:.014},gather:{social:.02},furniture:{comfort:.012,energy:.01}};
/* 地點 */
L29.PLACE={fish:'dock',sunset:'bench',bench:'bench',flowers:'meadow',garden:'meadow',shade:'tree',nap:'tree',read:'tree',campfire:'campfire',home:'home',stargaze:'field',drink:'well',eat:'picnic',sunbathe:'meadow',tidy:'tree'};
L29.PLACEN={dock:'碼頭',bench:'看海長椅',meadow:'花海',tree:'大樹下',campfire:'營火',home:'小屋',field:'草原',well:'飲水台',picnic:'野餐墊'};
L29.ACTN2={eat:'吃點心',drink:'喝水',read:'看書',tidy:'整理環境',garden:'照顧花草',observe:'觀察新東西',daydream:'發呆',sunbathe:'曬太陽',fish:'看海',flowers:'聞花香',shade:'乘涼',nap:'打盹',campfire:'烤火',stargaze:'看星星',sunset:'看夕陽',bench:'坐長椅',butterfly:'追蝴蝶',shelter:'躲雨',home:'回家休息',explore:'探險',wander:'散步',stroll:'結伴散步',tag:'玩鬼抓人',dance:'跳舞',gather:'集合',idle:'休息一下',furniture:'使用家具'};
/* ===== 2.9 深度生活：核心（資料、個性合併、需求、情緒、小怪癖、AI、願望、對話、成長） ===== */
(()=>{'use strict';
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const day=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

/* ---------- 1. 角色延伸資料（存在設定檔，不受 Persona.norm 截斷） ---------- */
const ST=()=>{const v=Cfg.v;if(!v.l29||typeof v.l29!=='object')v.l29={};const s=v.l29;if(!s.ch||typeof s.ch!=='object')s.ch={};if(!s.opt||typeof s.opt!=='object')s.opt={suggest:true};return s};
const LOG0=()=>({act:{},tod:{},rainRead:0,afterEat:0,furn:{},place:{},food:{},chats:0,night:0,collect:0,happy:0});
function X(id){const s=ST();let x=s.ch[id];if(!x||typeof x!=='object')x=s.ch[id]={};
 const A=(k,v)=>{if(!Array.isArray(x[k]))x[k]=v};const O=(k,v)=>{if(!x[k]||typeof x[k]!=='object'||Array.isArray(x[k]))x[k]=v};
 A('traits',[]);A('custom',[]);A('locked',[]);A('habits',[]);A('cq',[]);A('mem',[]);O('acq',{});O('declined',{});O('snooze',{});O('quirks',{});O('log',LOG0());O('wn',{d:'',n:0});
 for(const k in L29.QDEF)if(!x.quirks[k])x.quirks[k]=L29.QDEF[k];const lg=x.log,l0=LOG0();for(const k in l0)if(lg[k]==null||typeof lg[k]!==typeof l0[k])lg[k]=l0[k];
 if(!Number.isFinite(x.think))x.think=50;return x}
let saveT=0;const save=()=>{clearTimeout(saveT);saveT=setTimeout(()=>Cfg.save(),600)};
const opt=()=>ST().opt;

/* ---------- 2. 特質合併：基本特質 + 新特質庫 + 自訂 ---------- */
const TMAP=new Map(L29.TRAITS.map(t=>[t.id,t]));
function baseT(id){const t=TRAITS.find(x=>x.id===id);if(!t)return null;const b=L29.BASE[id]||{};return Object.assign({c:b.c||'pers',ai:b.ai||{},nd:b.nd||{},x:b.x||[]},t)}
function customT(x,id){const c=x.custom.find(t=>t.id===id);if(!c)return null;const fx={};(c.tend||[]).forEach(k=>{const t=TEND.find(q=>q.id===k);if(t)for(const s in t.fx)fx[s]=(fx[s]||0)+t.fx[s]});const ai={};(c.acts||[]).forEach(a=>ai[a]=1.9);
 return {id:c.id,em:c.em||'✨',t:c.name,d:c.d||'自訂特質',c:c.c||'spc',fx,ai,nd:{},w:{},idle:c.say||[],pet:[],x:[],custom:1}}
function traitInfo(id,x){return TMAP.get(id)||baseT(id)||(x?customT(x,id):null)}
const chOf=d=>Chars.list.find(c=>c.data===d);
{const oa=Persona.active.bind(Persona);Persona.active=function(d){const base=oa(d);try{const ch=chOf(d);if(!ch)return base;const x=X(ch.id),have=new Set(base.map(t=>t.id));
 for(const id of x.traits){if(have.has(id))continue;const t=TMAP.get(id)||customT(x,id)||baseT(id);if(t){base.push(t);have.add(id)}}}catch(e){}return base}}
{const oh=Life.has.bind(Life);Life.has=function(s,id){return oh(s,id)||!!(s&&s.ch&&X(s.ch.id).traits.includes(id))}}
function traitIds(ch){const x=X(ch.id);return [...new Set([...(ch.data?.pers?.traits||[]),...x.traits])]}
function traits(ch){const x=X(ch.id);return traitIds(ch).map(id=>traitInfo(id,x)).filter(Boolean)}
function has(ch,id){return traitIds(ch).includes(id)}
function aiMul(ch,k){let m=1;for(const t of traits(ch)){const v=t.ai&&t.ai[k];if(v)m*=v}return m}
function ndMul(ch,k){let m=1;for(const t of traits(ch)){const v=t.nd&&t.nd[k];if(v)m*=v}return m}
function tflag(ch,f){return traits(ch).some(t=>t[f])}
function conflicts(ch,id){const x=X(ch.id),t=traitInfo(id,x);if(!t)return [];const mine=traitIds(ch);const out=new Set();(t.x||[]).forEach(o=>{if(mine.includes(o))out.add(o)});mine.forEach(o=>{const q=traitInfo(o,x);if(q&&(q.x||[]).includes(id))out.add(o)});return [...out]}
function setTrait(ch,id,on){const x=X(ch.id),d=ch.data;
 if(on){if(traitIds(ch).includes(id))return;if(TRAITS.some(t=>t.id===id)&&d.pers.traits.length<8){d.pers.traits.push(id);Chars.patch(ch,{data:d})}else x.traits.push(id)}
 else{x.traits=x.traits.filter(t=>t!==id);delete x.acq[id];x.locked=x.locked.filter(t=>t!==id);if(d.pers.traits.includes(id)){d.pers.traits=d.pers.traits.filter(t=>t!==id);Chars.patch(ch,{data:d})}}
 Persona.refresh(ch);save()}
/* 性格類型 */
function ptype(ch){const e=(ch.mind&&ch.mind.e)||Persona.eff(ch.data),en=e.lively*.6+e.pace*.4,ou=e.social*.6+e.expr*.4,r=Math.min(3,Math.floor(en/25)),c=Math.min(3,Math.floor(ou/25)),[name,desc]=L29.TYPES[r*4+c],th=X(ch.id).think;
 return {name,desc,think:th<38?'直覺型':th>62?'理性型':'平衡型',en,ou,idx:r*4+c}}
/* 小怪癖 */
const Q=(id,k)=>X(id).quirks[k]||L29.QDEF[k];
const QP=(k,v)=>{const o=(L29.Q[k]?.o||[]).find(z=>z[0]===v);return (o&&o[2])||{}};
function dressActor(a,id){if(!a||!id)return;const set=(k,v)=>{if(a.dataset[k]!==v)a.dataset[k]=v};set('qwalk',Q(id,'walk'));set('qstance',Q(id,'stance'));set('qsit',Q(id,'sit'));set('qsleep',Q(id,'sleep'));set('qvol',Q(id,'volume'))}
{const os=Persona.style.bind(Persona);Persona.style=function(ch,t){let r=os(ch,t);try{if(typeof r==='string'&&ch&&ch.id&&r[0]!=='​'){const v=Q(ch.id,'volume');if(v==='loud')r=r.replace(/[。～]$/,'！');else if(v==='soft'&&Math.random()<.4)r=r.replace(/[！!。]$/,'…')}}catch(e){}return r}}

/* ---------- 3. 視覺特效（以舞台座標，適用島上與編輯預覽） ---------- */
const NOTE='<svg viewBox="0 0 16 18"><path d="M6 14V3L14 1V11" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="4" cy="14.5" r="2.8" fill="currentColor"/><circle cx="12" cy="11.5" r="2.8" fill="currentColor"/></svg>';
const SPARK='<svg viewBox="0 0 14 14"><path d="M7 0L8.6 5.4L14 7L8.6 8.6L7 14L5.4 8.6L0 7L5.4 5.4Z" fill="#FFE27A" stroke="#fff" stroke-width=".8"/></svg>';
const DROP='<svg viewBox="0 0 12 16"><path d="M6 0C8 5 12 8 12 11A6 6 0 0 1 0 11C0 8 4 5 6 0Z" fill="#9AD4F5" stroke="#fff" stroke-width="1"/></svg>';
function headOf(s){return {x:s.x+s.size*.5,y:s.feetY-(s.h||0)-(s.hitTop||s.size*.8)}}
function sfx(s,html,frames,dur,o={}){if(reduce()||!s||!s.fx)return null;const d=document.createElement('i');d.className='l29-fx '+(o.cls||'');d.innerHTML=html;const h=headOf(s);d.style.left=(h.x+(o.dx||0))+'px';d.style.top=(h.y+(o.dy||0))+'px';if(o.color)d.style.color=o.color;s.fx.append(d);
 const a=d.animate(frames,{duration:dur,delay:o.delay||0,easing:o.easing||'ease-out',fill:'both'});a.onfinish=()=>d.remove();setTimeout(()=>d.remove(),dur+(o.delay||0)+300);return d}
const notesFx=(s,k=2)=>{for(let i=0;i<k;i++)sfx(s,NOTE,[{opacity:0,transform:'translate(0,0) scale(.6)'},{opacity:1,offset:.2},{opacity:0,transform:`translate(${rnd(-30,30)}px,-44px) scale(1) rotate(12deg)`}],1300,{color:pick(['#9585DD','#E884AE','#5DB3E0','#F4A65B']),delay:i*220,dx:rnd(-10,10),dy:10})};
const sparkFx=(s,k=6,r=34)=>{for(let i=0;i<k;i++){const a=i/k*Math.PI*2;sfx(s,SPARK,[{opacity:0,transform:'translate(0,0) scale(.3)'},{opacity:1,offset:.25},{opacity:0,transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r*.8}px) scale(1) rotate(90deg)`}],700,{dy:s.size*.3,easing:'cubic-bezier(.2,.8,.3,1)'})}};
const sweatFx=s=>sfx(s,DROP,[{opacity:0,transform:'translate(0,0)'},{opacity:1,offset:.2},{opacity:0,transform:'translate(4px,22px)'}],1100,{dx:s.size*.22,dy:s.size*.18,cls:'drop'});
const textFx=(s,t,c='#9585DD')=>sfx(s,`<b style="color:${c}">${t}</b>`,[{opacity:0,transform:'translate(0,0) scale(.5)'},{opacity:1,offset:.3},{opacity:0,transform:'translate(14px,-30px) scale(1.1)'}],1800,{dx:12,dy:8,cls:'txt'});
function an(s,frames,dur,ease='ease-in-out',it=1){if(reduce()||!s?.art?.animate)return null;const a=s.art.animate(frames,{duration:dur,easing:ease,iterations:it});(s._l29a=s._l29a||[]).push(a);a.onfinish=()=>{s._l29a=(s._l29a||[]).filter(x=>x!==a)};return a}
const face=(s,f,ms=1400)=>{if(!s?.actor)return;s.actor.dataset.dollFace=f;clearTimeout(s._l29f);s._l29f=setTimeout(()=>{if(s.actor.dataset.dollFace===f)delete s.actor.dataset.dollFace},ms)};
const QA={
 hop:s=>{if(s.h>0)return;s.squash(.12);s.hop(380)},
 spin:s=>an(s,[{rotate:'0deg'},{rotate:'360deg'}],650,'cubic-bezier(.3,1.2,.5,1)'),
 sparkle:s=>{sparkFx(s,8,40);face(s,'joy')},
 dance:s=>{an(s,[{translate:'0 0',rotate:'0deg'},{translate:'0 -7px',rotate:'-8deg'},{translate:'0 0',rotate:'0deg'},{translate:'0 -7px',rotate:'8deg'},{translate:'0 0',rotate:'0deg'}],820,'ease-in-out',2);notesFx(s,2)},
 blush:s=>{try{Life.emote(s,'shy',1)}catch(_){}face(s,'soft',1800)},
 wave:s=>an(s,[{rotate:'0deg'},{rotate:'-9deg'},{rotate:'7deg'},{rotate:'-7deg'},{rotate:'5deg'},{rotate:'0deg'}],900),
 bow:s=>an(s,[{rotate:'0deg',translate:'0 0'},{rotate:'16deg',translate:'0 5px',offset:.35},{rotate:'16deg',translate:'0 5px',offset:.7},{rotate:'0deg',translate:'0 0'}],1100),
 nod:s=>an(s,[{translate:'0 0'},{translate:'0 5px'},{translate:'0 0'},{translate:'0 5px'},{translate:'0 0'}],700),
 hug:s=>{an(s,[{scale:'1'},{scale:'1.1 .94'},{scale:'1'}],600,'cubic-bezier(.3,1.5,.5,1)');s.hearts(2)},
 peek:s=>{an(s,[{rotate:'0deg',translate:'0 0'},{rotate:'-12deg',translate:'-6px 2px',offset:.3},{rotate:'-12deg',translate:'-6px 2px',offset:.75},{rotate:'0deg',translate:'0 0'}],1400);try{Life.emote(s,'shy',1)}catch(_){}},
 fidget:s=>an(s,[{rotate:'0deg'},{rotate:'-4deg'},{rotate:'4deg'},{rotate:'0deg'}],260,'ease-in-out',5),
 freeze:s=>{face(s,'surprise',1600);an(s,[{scale:'1'},{scale:'.96 1.04'},{scale:'.96 1.04',offset:.85},{scale:'1'}],1400)},
 sweat:s=>{sweatFx(s);setTimeout(()=>sweatFx(s),500);face(s,'surprise',1200)},
 hide:s=>{an(s,[{rotate:'0deg',scale:'1'},{rotate:'8deg',scale:'.93',offset:.25},{rotate:'8deg',scale:'.93',offset:.8},{rotate:'0deg',scale:'1'}],1500);try{Life.emote(s,'shy',1)}catch(_){}},
 stretch:s=>{try{s.go('stretch')}catch(_){}},look:s=>{try{s.go('look')}catch(_){}},hearts:s=>s.hearts(2),hum:s=>notesFx(s,3),
 say:()=>{},
 chew:(s,dur)=>an(s,[{scale:'1'},{scale:'1.05 .95'},{scale:'1'}],dur>8000?520:dur<5000?220:340,'ease-in-out',Math.max(2,Math.round(dur/(dur>8000?520:dur<5000?220:340))))
};
const W=()=>OCSCommunity.W,H=()=>OCSCommunity.H;

/* ---------- 4. 需求 ---------- */
const NK=['hunger','thirst','energy','sleep','fun','social','comfort'];
function needs(n){if(n.nd)return n.nd;const x=X(n.id),sv=x.needs,o={};NK.forEach(k=>{const v=sv&&Number(sv[k]);o[k]=Number.isFinite(v)?cl(v,.05,1):rnd(.65,.9)});
 if(sv&&sv.ts){const away=(Date.now()-sv.ts)/60000;if(away>20)NK.forEach(k=>{o[k]=cl(o[k]+(.75-o[k])*Math.min(1,away/240),.25,1)})}
 o.energy=cl(1-(n.s.fat||0),.05,1);n.nd=o;return o}
function circ(n){const ch=n.s.ch,now=new Date(),h=now.getHours()+now.getMinutes()/60;let chrono=0;traits(ch).forEach(t=>{if(t.chrono)chrono+=t.chrono});(ch.data.habits||[]).forEach(t=>{if(/熬夜|夜貓/.test(t))chrono+=1.2;if(/早起|早睡/.test(t))chrono-=1});
 const bed=22.4+chrono+(Life.hash(ch.id)-.5)*1.6,d=(h-bed+48)%24;let v=d<8.2?1:d>22.5?.5:.04;if(h>=13&&h<15&&(has(ch,'napper')||has(ch,'lazy')))v=Math.max(v,.45);return v}
function tickNeeds(n,dt){const nd=needs(n),ch=n.s.ch,task=n.task,arrived=task&&task.type==='activity'&&task.arrived,seated=n.seat||(arrived&&['sit','doze'].includes(task.pose)),c=IW.ctx();
 const ap=QP('appetite',Q(n.id,'appetite')).k||1;
 nd.hunger-=dt*.0009*ndMul(ch,'hunger')*ap;nd.thirst-=dt*.0012*ndMul(ch,'thirst')*(c.wx==='sunny'&&c.day?1.3:1);
 nd.fun-=dt*.001*ndMul(ch,'fun');nd.social-=dt*.0008*ndMul(ch,'social');
 nd.comfort-=dt*(seated?-.002:(c.rain&&!['shelter','home','read'].includes(task?.act)?.0016:.0006))*ndMul(ch,'comfort');
 nd.sleep-=dt*(.0003+circ(n)*.0017)*ndMul(ch,'sleep');
 const moving=n.path.length>0,fat0=n.s.fat||0;n.s.fat=cl(fat0+dt*(moving?(task?.run?.0016:.0007):.00012)*ndMul(ch,'fat'),0,1);
 for(const q of OCSCommunity.nodes.values())if(q!==n&&Math.hypot(q.x-n.x,(q.y-n.y)*2)<.22){nd.social+=dt*.004;break}
 if(arrived){const f=L29.FX[task.act];if(f)for(const k in f){if(k==='energy')n.s.fat=cl(n.s.fat-f[k]*dt,0,1);else nd[k]+=f[k]*dt}}
 if(n.task?.event)nd.social+=dt*.03;
 NK.forEach(k=>{if(k!=='energy')nd[k]=cl(nd[k],.05,1)});nd.energy=cl(1-n.s.fat,.05,1)}
function saveNeeds(){for(const n of OCSCommunity.nodes.values()){if(!n.nd)continue;const x=X(n.id);x.needs=Object.assign({},n.nd,{ts:Date.now()});NK.forEach(k=>x.needs[k]=+x.needs[k].toFixed(3))}save()}

/* ---------- 5. 情緒（強度 × 持續時間） ---------- */
const EMO_MAP={happy:'happy',excited:'excited',calm:'calm',sad:'sad',angry:'angry',shy:'shy',tired:'tired',bored:'bored'};
function feel(n,id,i=.6,dur=40,quiet){if(!n||!EMO_MAP[id])return;const ch=n.s.ch;let k=1;traits(ch).forEach(t=>{if(t.emo)k*=t.emo});const ex=(Persona.eff(ch.data).expr||50)/100;i=cl(i*k*(.7+ex*.6),.05,1);
 const e=n.emo;if(e&&e.id===id)e.i=Math.max(e.i,i),e.d=Math.max(e.d,dur);else n.emo={id,i,d:dur,t:0};try{Life.setMood(n.s,id,dur*(.6+i),quiet||i<.35)}catch(_){}}
function tickEmo(n,dt){const e=n.emo;if(!e)return;e.t+=dt;e.i-=dt/(e.d*1.6);if(e.i<=.05)n.emo=null}
function moodFromNeeds(n){const nd=needs(n),ch=n.s.ch;if(n.emo&&n.emo.i>.5)return;
 if(nd.sleep<.2||nd.energy<.18)feel(n,'tired',.5,50,true);else if(nd.fun<.18)feel(n,'bored',.45,40,true);else if(nd.social<.15&&!has(ch,'loner')&&!has(ch,'introvert'))feel(n,'sad',.35,40,true);
 else if(nd.hunger<.15&&has(ch,'foodie'))feel(n,'sad',.3,30,true)}

/* ---------- 6. 事件與小怪癖反應 ---------- */
const CD=new Map();const cd=(n,k,s)=>{const key=n.id+':'+k,t=OCSCommunity.clock;if((CD.get(key)||-1e9)>t)return false;CD.set(key,t+s);return true};
function react(n,k){const s=n.s;try{QA[k]&&QA[k](s)}catch(_){}}
function emit(n,ev,data={}){if(!n||!OCSCommunity.nodes.has(n.id))return;const x=X(n.id),s=n.s;
 if(ev==='happy'&&cd(n,'happy',5)){react(n,Q(n.id,'happy'));x.log.happy++}
 if(ev==='nervous'&&cd(n,'nerv',7)){react(n,Q(n.id,'nervous'))}
 if(ev==='greet'){react(n,Q(n.id,'greet'))}
 for(const q of x.cq){if(q.trig!==ev||!cd(n,'cq'+q.id,25))continue;if(q.act==='say'){if(q.line)IW.Act.say(n,q.line,3,true)}else{react(n,q.act);if(q.line&&Math.random()<.6)IW.Act.say(n,q.line,3,true)}}}
/* 撫摸：開心反應、愛吃醋 */
{const op=Stage.prototype.pet;Stage.prototype.pet=function(){const r=op.apply(this,arguments);try{const n=this._communityNode;if(n&&IW){const nd=needs(n);nd.social=cl(nd.social+.12,0,1);nd.fun=cl(nd.fun+.05,0,1);setTimeout(()=>{if(Math.random()<.6)emit(n,'happy')},350);wishDone(n,'pet');memo(n,'pet');
  for(const q of OCSCommunity.nodes.values())if(q!==n&&has(q.s.ch,'jealous')&&Math.hypot(q.x-n.x,q.y-n.y)<.45&&cd(q,'jeal',30)){setTimeout(()=>{q.s.dir=n.x>q.x?1:-1;IW.Act.say(q,pick(['…我也要摸摸。','為什麼只摸牠啦！','哼，我才不羨慕。']),2.6,true);feel(q,'angry',.3,20)},900)}}}catch(e){}return r}}
/* 餵食：回復飽足／解渴，記住吃過的東西 */
document.addEventListener('oc:fed',e=>{try{const d=e.detail||{},n=window.OCSCommunity?.nodes.get(d.charId);if(!n||!IW)return;const it=Items.get(d.itemId),x=X(n.id),nd=needs(n),ap=QP('appetite',Q(n.id,'appetite')).k||1;
 if(it?.cat==='drink')nd.thirst=cl(nd.thirst+.6,0,1);else nd.hunger=cl(nd.hunger+.55/ap,0,1);x.log.food[d.itemId]=(x.log.food[d.itemId]|0)+1;n.lastEat=OCSCommunity.clock;
 const love=['love','like','fav','best'].includes(d.level),bad=['dislike','hate','worst'].includes(d.level);
 const dur=(QP('eat',Q(n.id,'eat')).d||7)*1000;react(n,'chew');setTimeout(()=>{if(love)emit(n,'happy');emit(n,'eat')},Math.min(dur,4500));
 feel(n,bad?'sad':love?'happy':'calm',bad?.4:love?.7:.3,40,true);memo(n,bad?'badfood':'food',{item:it?.name});save()}catch(err){}});
/* 玩具／禮物 */
{const iu=Items.use;Items.use=function(id,st){const it=this.get(id),r=iu.apply(this,arguments);try{const n=st&&st._communityNode;if(r&&n&&it&&IW){const nd=needs(n);if(it.cat==='toy'){nd.fun=cl(nd.fun+.4,0,1);wishDone(n,'play')}if(it.cat==='gift'){nd.social=cl(nd.social+.25,0,1);feel(n,'happy',.7,60,true);memo(n,'gift',{item:it.name})}if(['toy','gift'].includes(it.cat))setTimeout(()=>emit(n,'happy'),500)}}catch(e){}return r}}

/* ---------- 7. 記憶 ---------- */
function memo(n,type,o={}){try{document.dispatchEvent(new CustomEvent('l29:memo',{detail:{n,type,o}}))}catch(_){}const x=X(n.id),c=IW.ctx(),place=o.place||L29.PLACE[n.task?.act]||'';const T={pet:'被摸摸了',food:`吃了${o.item||'點心'}`,badfood:`吃到不喜歡的${o.item||'東西'}`,gift:`收到禮物「${o.item||''}」`,wish:`願望實現：${o.text||''}`,chat:`和${o.with||'朋友'}聊天`,observe:`觀察了新的${o.item||'東西'}`,collect:'在海邊撿到漂亮的貝殼',shooting:'看到了流星',rain:'在雨中躲雨',tag:`和${o.with||'朋友'}玩鬼抓人`,stroll:`和${o.with||'朋友'}一起散步`,acquire:`養成了新的${o.item||'習慣'}`};
 const last=x.mem[0];if(last&&last.type===type&&Date.now()-last.t<120000)return;x.mem.unshift({t:Date.now(),type,text:T[type]||type,place,ph:c.ph,wx:c.wx,v:o.v??(['badfood','rain'].includes(type)?-1:1)});x.mem.length=Math.min(60,x.mem.length);
 if(place)x.log.place[place]=(x.log.place[place]||0)+(o.v??1)*.5;save()}
const affinity=(n,place)=>{const v=X(n.id).log.place[place]||0;return cl(1+v*.03,.7,1.7)};

/* ---------- 8. 新活動 ---------- */
let IW=null,C=null;
const LEAVES=[];
function addLeaf(x,y){if(LEAVES.length>=8||!C?.world)return;const el=document.createElement('i');el.className='l29-leaf';el.style.left=(x*100)+'%';el.style.top=(y*100)+'%';el.style.zIndex=String(Math.round(y*10000)*16-2);el.style.setProperty('--r',rnd(-60,60)+'deg');el.style.setProperty('--c',pick(['#9BC56A','#C9B14F','#7FB25C','#D99A4E']));C.world.append(el);LEAVES.push({x,y,el})}
function takeLeaf(l){const i=LEAVES.indexOf(l);if(i<0)return;LEAVES.splice(i,1);if(reduce()){l.el.remove();return}l.el.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-14px) scale(.4) rotate(120deg)'}],{duration:500,fill:'forwards'}).onfinish=()=>l.el.remove()}
function prop(n,html,cls,dx,dy){const d=document.createElement('i');d.className='l29-prop '+cls;d.innerHTML=html;C.world.append(d);const place=()=>{d.style.left=(n.x*W()+n.s.dir*n.s.size*dx)+'px';d.style.top=(n.y*H()-n.s.size*dy)+'px';d.style.zIndex=String(Math.round(n.y*10000)*16+n.order+1)};place();d._place=place;return d}
const BOOK='<svg viewBox="0 0 40 30"><path d="M20 6Q12 1 2 3V27Q12 25 20 29Z" fill="#F6E7CC" stroke="#B98D60" stroke-width="1.6"/><path d="M20 6Q28 1 38 3V27Q28 25 20 29Z" fill="#FFF6E2" stroke="#B98D60" stroke-width="1.6"/><path class="pg" d="M20 6Q28 1 38 3V27Q28 25 20 29Z" fill="#FFFDF6" stroke="#D7BD95" stroke-width="1"/><path d="M6 9H16M6 13H15M24 9H34M24 13H33" stroke="#C9B08A" stroke-width="1.4"/></svg>';
const CUP='<svg viewBox="0 0 24 24"><path d="M5 7H19L17 21H7Z" fill="#BFE6FF" stroke="#62B8E6" stroke-width="1.6"/><path d="M6 11H18" stroke="#62B8E6" stroke-width="1.2"/></svg>';
const CAN='<svg viewBox="0 0 34 26"><path d="M8 8H24V22H8Z" fill="#7EC8E3" stroke="#4A9BBE" stroke-width="1.6"/><path d="M24 12L33 6" stroke="#4A9BBE" stroke-width="3" stroke-linecap="round"/><path d="M10 8Q16 1 22 8" fill="none" stroke="#4A9BBE" stroke-width="2"/></svg>';
function favFood(n){const ch=n.s.ch,likes=[...(ch.data.likes||[]),...(ch.data.interests||[])];const foods=Items.d.items.filter(i=>i.cat==='food');let f=foods.find(i=>likes.some(l=>i.name.includes(l)||l.includes(i.name)||i.tags.some(t=>t===l)));
 const x=X(n.id),top=Object.entries(x.log.food).sort((a,b)=>b[1]-a[1])[0];if(!f&&top)f=Items.get(top[0]);return f||foods[Math.floor(Math.random()*foods.length)]||null}
function defineActs(){const A=IW.ACTS,P=IW.props,sn=IW.spotNear;
 A.eat={icon:'campfire',spot:n=>{const opts=[[P.campfire.x,P.campfire.y+.05],[P.picnic.x,P.picnic.y+.02],[P.bench.x,P.bench.y+.02]].sort((a,b)=>Math.hypot(a[0]-n.x,a[1]-n.y)-Math.hypot(b[0]-n.x,b[1]-n.y));return sn(opts[0][0],opts[0][1],.06,.015,n)},
  arrive(n,task){const f=favFood(n),ch=n.s.ch;task.pose='sit';n.s.go('sit',{forced:1});const d=(QP('eat',Q(n.id,'eat')).d||7);
   if(has(ch,'picky')&&f&&Math.random()<.3){IW.Act.say(n,pick(['今天的不太合胃口…','嗯…只吃一口就好。']),2.6,true);n.wait=3;needs(n).hunger+=.15;return}
   task.food=prop(n,f?Items.icon(f):'🍙','food',.16,.42);task.bite=d/4;n.wait=d+1.2;react(n,'chew');task.d=d;
   if(Math.random()<.6)IW.Act.say(n,pick(f?[`${f.name}好好吃～`,`今天吃${f.name}！`,'開動了！']:['開動了！']),2.6);n.lastEat=C.clock;x(n).log.food[f?.id||'snack']=(x(n).log.food[f?.id||'snack']|0)+1},
  tick(n,dt,task){if(!task.food)return;task.bite-=dt;if(task.bite<=0){task.bite=task.d/4;const sc=Math.max(.25,(parseFloat(task.food.style.scale)||1)-.22);task.food.style.scale=sc;IW.fx('isle-dust',n.x*W()+n.s.dir*n.s.size*.16,n.y*H()-n.s.size*.3,'',[{opacity:.9,transform:'scale(.4)'},{opacity:0,transform:'translate(0,16px) scale(.8)'}],500)}
   if(n.wait<1.2&&!task.done){task.done=1;task.food.remove();task.food=null;const ap=QP('appetite',Q(n.id,'appetite')).k||1;if(ap>1.2&&Math.random()<.5)IW.Act.say(n,'再來一份！',2,true);emit(n,'eat');if(Math.random()<.5)emit(n,'happy')}},
  cleanup(n){n.task?.food?.remove()}};
 A.drink={icon:'fish',spot:n=>sn(P.well.x+rnd(-.03,.03),P.well.y+.03,.02,.008,n),
  arrive(n,task){task.cup=prop(n,CUP,'cup',.15,.46);n.wait=rnd(3.5,5);an(n.s,[{rotate:'0deg'},{rotate:'-10deg',offset:.3},{rotate:'-10deg',offset:.8},{rotate:'0deg'}],2600);if(Math.random()<.4)IW.Act.say(n,pick(['咕嘟咕嘟～','好清涼！','喝口水休息一下。']),2.4)},
  cleanup(n){n.task?.cup?.remove()}};
 A.read={icon:'stargaze',spot:n=>{const c=IW.ctx();if(c.rain)return sn(P.bigtree.x,P.bigtree.y+.04,.07,.01,n)||sn(.15,.6,.05,.01,n);return pick([()=>sn(P.bigtree.x,P.bigtree.y+.04,.07,.012,n),()=>({x:P.bench.x+rnd(-.03,.03),y:P.bench.y+.004}),()=>sn(-.3,.66,.12,.03,n)])()},
  arrive(n,task){const b=P.bench;if(Math.abs(n.x-b.x)<.05&&Math.abs(n.y-b.y)<.02){n.seat={p:{u:'isle_bench',x:b.x,y:b.y,s:1},kind:'sit'};n.y=b.y+.004}task.pose='sit';n.s.go('sit',{forced:1});task.book=prop(n,BOOK,'book',.05,.36);n.wait=rnd(14,22)*(has(n.s.ch,'stubborn')?1.3:1);task.pT=3;
   if(Math.random()<.5)IW.Act.say(n,pick(traits(n.s.ch).find(t=>t.id==='bookworm')?['再讀一章就好。','這本書好好看！']:['看看書吧。','翻一翻這本書。']),2.6);if(IW.ctx().rain)x(n).log.rainRead++},
  tick(n,dt,task){task.pT-=dt;if(task.pT<=0&&task.book){task.pT=rnd(3,5);const pg=task.book.querySelector('.pg');if(pg&&!reduce())pg.animate([{transform:'scaleX(1)'},{transform:'scaleX(-1)'}],{duration:500,easing:'ease-in-out'});if(Math.random()<.15)IW.Act.say(n,pick(['哇…原來是這樣！','嘿嘿，好有趣。','（認真地讀著）']),2.4)}},
  cleanup(n){n.task?.book?.remove();if(n.seat?.p?.u==='isle_bench')n.seat=null}};
 A.tidy={icon:'flowers',spot:n=>{const l=LEAVES.slice().sort((a,b)=>Math.hypot(a.x-n.x,a.y-n.y)-Math.hypot(b.x-n.x,b.y-n.y))[0];if(!l)return null;return C.nearest(l.x+.02,l.y,n,undefined,true)},
  begin(n,task){task.leaf=LEAVES.slice().sort((a,b)=>Math.hypot(a.x-n.x,a.y-n.y)-Math.hypot(b.x-n.x,b.y-n.y))[0]},
  arrive(n,task){n.wait=2.6;an(n.s,[{rotate:'0deg'},{rotate:'14deg',translate:'0 4px'},{rotate:'0deg'},{rotate:'14deg',translate:'0 4px'},{rotate:'0deg'}],1400);setTimeout(()=>{if(task.leaf)takeLeaf(task.leaf);sparkFx(n.s,4,22)},700);
   if(Math.random()<.5)IW.Act.say(n,pick(has(n.s.ch,'tidy')||has(n.s.ch,'perfectionist')?['乾乾淨淨，心情真好！','落葉都掃好了～']:['順手撿起來。','嗯，這樣好多了。']),2.4);
   if(LEAVES.length&&has(n.s.ch,'tidy')){setTimeout(()=>{if(!n.task)IW.Act.start(n,'tidy',{quiet:1})},3200)}}};
 A.garden={icon:'flowers',spot:n=>{const fs=IW.furnList(n).filter(f=>OCS24D.Room.kind(Items.get(f.p.i))==='plant');if(fs.length&&Math.random()<.5){const p=fs[0].p;return C.nearest(p.x+.06,p.y+.02,n,p.u,true)}return sn(-.36,.72,.16,.06,n)},
  arrive(n,task){task.can=prop(n,CAN,'can',.2,.5);n.wait=rnd(5,7);task.dT=.3;IW.Act.say(n,pick(['今天也要好好長大喔。','喝水囉～','花開得真漂亮。']),2.6);try{const R=OCS24D.Room,p=R.list().find(p=>R.kind(Items.get(p.i))==='plant'&&Math.hypot(p.x-n.x,p.y-n.y)<.15);if(p){p.w=Date.now();R.save();R.els.get(p.u)?.classList.add('community-water');setTimeout(()=>R.els.get(p.u)?.classList.remove('community-water'),1800)}}catch(_){}},
  tick(n,dt,task){task.dT-=dt;if(task.dT<=0&&n.wait>1){task.dT=.18;IW.fx('isle-wripple',n.x*W()+n.s.dir*n.s.size*.42,n.y*H()-4,'',[{opacity:.8,transform:'scale(.3)'},{opacity:0,transform:'scale(1.2)'}],500)}if(n.wait<1&&!task.bl){task.bl=1;sparkFx(n.s,5,30)}},
  cleanup(n){n.task?.can?.remove()}};
 A.observe={icon:'explore',spot:(n,o)=>o.spot,arrive(n,task){n.s.go('look');n.wait=rnd(4,6);try{Life.emote(n.s,'excited',true)}catch(_){}const ch=n.s.ch,nm=task.data.name||'東西';
   const line=has(ch,'curious')||has(ch,'smart')?`這是新的${nm}耶！我來研究一下。`:has(ch,'perfectionist')||has(ch,'tidy')?`${nm}擺得剛剛好。`:has(ch,'picky')||has(ch,'sharp')?`嗯…${nm}還算可以啦。`:has(ch,'shy')?`那、那個${nm}是新的嗎…`:`哇，多了一個${nm}！`;
   IW.Act.say(n,line,3,true);memo(n,'observe',{item:nm});needs(n).fun+=.2}};
 A.daydream={icon:'stargaze',spot:n=>({x:n.x,y:n.y}),arrive(n,task){task.pose=Math.random()<.5?'sit':null;if(task.pose)n.s.go('sit',{forced:1});else n.s.go('look');n.wait=rnd(6,10);task.tT=1.5},
  tick(n,dt,task){task.tT-=dt;if(task.tT<=0){task.tT=rnd(4,6);IW.think(n,pick(['stargaze','fish','flowers','butterfly','friend']));if(Math.random()<.25)IW.Act.say(n,pick(['……','（望著天空發呆）','雲的形狀好像兔子。']),2.4)}}};
 A.sunbathe={icon:'sunset',spot:n=>sn(rnd(-.4,1.4),rnd(.66,.95),.05,.02,n),arrive(n,task){task.pose='sit';n.s.go('sit',{forced:1});n.wait=rnd(10,14);if(Math.random()<.5)IW.Act.say(n,pick(['太陽暖洋洋的～','曬太陽最舒服了。']),2.4)}};
 // 既有活動也加入記憶與需求（地點由 L29.PLACE 對應）
}
const x=n=>X(n.id);

/* ---------- 9. 願望 ---------- */
const WT={
 play:{icon:'tag',label:'想玩點什麼',act:['butterfly','tag','dance']},
 friend:{icon:'friend',label:w=>`想找${w.name}聊天`,act:['stroll']},
 alone:{icon:'stargaze',label:'想一個人靜一靜',act:['read','fish','sunset','daydream']},
 place:{icon:'explore',label:w=>`想去${L29.PLACEN[w.place]||'那裡'}看看`,act:[]},
 furn:{icon:'home',label:w=>`想用${w.name}`,act:['furniture']},
 pet:{icon:'friend',label:'想被摸摸頭',act:[]},
 snack:{icon:'campfire',label:'想吃點好吃的',act:['eat']}
};
const PACT={dock:'fish',meadow:'flowers',tree:'shade',campfire:'campfire',bench:'sunset',field:'stargaze'};
function wishLabel(w){const t=WT[w.type];return typeof t.label==='function'?t.label(w):t.label}
function makeWish(n){const xx=x(n);if(xx.wish&&Date.now()-xx.wish.t<20*60000)return;const nd=needs(n),ch=n.s.ch,c=IW.ctx(),opts=[];
 if(nd.fun<.5)opts.push(['play',2-nd.fun]);if(nd.hunger<.5)opts.push(['snack',1.6-nd.hunger]);
 if(nd.social<.55&&!has(ch,'loner')){const f=IW.friendOf(n,false);if(f)opts.push(['friend',1.4-nd.social+(has(ch,'clingy')?.8:0),{id:f.id,name:f.s.ch.name}])}
 if(has(ch,'introvert')||has(ch,'quiet')||has(ch,'shy'))opts.push(['alone',.8]);
 const pl=Object.entries(xx.log.place).sort((a,b)=>b[1]-a[1])[0];const place=pl&&Math.random()<.6?pl[0]:pick(Object.keys(PACT));if(PACT[place]&&!(c.night&&['meadow','dock'].includes(place))&&!(c.rain))opts.push(['place',.9,{place}]);
 const fav=Object.entries(xx.log.furn).sort((a,b)=>b[1]-a[1])[0];if(fav){const p=OCS24D.Room.list().find(p=>p.u===fav[0]);if(p)opts.push(['furn',.8,{u:p.u,name:Items.get(p.i)?.name||'家具'}])}
 if(has(ch,'clingy')||Persona.eff(ch.data).indep<40)opts.push(['pet',.9]);
 if(!opts.length)return;const tot=opts.reduce((s,o)=>s+o[1],0);let r=Math.random()*tot,ch2=opts[0];for(const o of opts){r-=o[1];if(r<=0){ch2=o;break}}
 xx.wish=Object.assign({type:ch2[0],t:Date.now(),id:'w'+Date.now().toString(36)},ch2[2]||{});save();IW.think(n,WT[xx.wish.type].icon);
 if(Math.random()<.6)IW.Act.say(n,wishLine(n,xx.wish),3)}
function wishLine(n,w){return {play:'好想玩點什麼喔～',friend:`好想找${w.name}聊聊天。`,alone:'有點想一個人安靜一下。',place:`好想去${L29.PLACEN[w.place]}看看。`,furn:`想去坐坐${w.name}。`,pet:'可以摸摸我的頭嗎？',snack:'肚子有點餓…想吃好吃的。'}[w.type]||'…'}
function wishDone(n,type,o={}){const xx=x(n),w=xx.wish;if(!w||w.type!==type)return false;if(type==='friend'&&o.id&&o.id!==w.id)return false;if(type==='place'&&o.place!==w.place)return false;if(type==='furn'&&o.u&&o.u!==w.u)return false;
 xx.wish=null;const helped=!!w.helped;feel(n,'happy',.8,70);setTimeout(()=>emit(n,'happy'),300);IW.Act.say(n,pick(helped?['謝謝你幫我！','你最懂我了～','好開心，謝謝！']:['願望實現了～','嘿嘿，心滿意足。']),3,true);memo(n,'wish',{text:wishLabel(w)});
 if(helped&&window.Econ){const d=day();if(xx.wn.d!==d){xx.wn.d=d;xx.wn.n=0}if(xx.wn.n<3){xx.wn.n++;try{Econ.pay('w29_'+n.id+'_'+w.id,'wish',12);setTimeout(()=>toast(`${n.s.ch.name} 的願望實現了 +12 星幣`,'sparkle'),600)}catch(_){}}}save();return true}
function helpWish(n){const w=x(n).wish;if(!w)return false;w.helped=true;C.interrupt(n);
 if(w.type==='friend'){const f=C.nodes.get(w.id);if(f&&!C.busy(f)){C.interrupt(f);if(IW.startStroll(n,f))return true}return C.encounter(n,f,'chat')}
 if(w.type==='place')return IW.Act.start(n,PACT[w.place]||'explore');if(w.type==='play')return IW.Act.start(n,'butterfly')||IW.Act.start(n,'explore');if(w.type==='alone')return IW.Act.start(n,'read');if(w.type==='snack')return IW.Act.start(n,'eat');
 if(w.type==='furn'){const p=OCS24D.Room.list().find(p=>p.u===w.u);return p?C.furnish(n,p,true):false}if(w.type==='pet'){toast('點一下牠就能摸摸頭喔','info');return true}return false}

/* ---------- 10. 決策：需求 × 個性 × 習慣 × 願望 × 記憶 × 情緒 ---------- */
const u=v=>Math.pow(1-cl(v,0,1),2);
function habitMul(n,k,c){let m=1;for(const h of x(n).habits){if(h.off)continue;if(h.id==='h_rainread'&&k==='read'&&c.rain)m*=3;if(h.id==='h_campfire'&&k==='campfire'&&(c.dusk||c.night))m*=1.8;if(h.id==='h_afterwalk'&&['wander','stroll','explore'].includes(k)&&n.lastEat&&C.clock-n.lastEat<150)m*=2.6;if(h.place&&L29.PLACE[k]===h.place)m*=1.6;if(h.furn&&k==='furniture')m*=1.5;if(h.id==='h_morningwalk'&&k==='wander'&&c.ph==='dawn')m*=2.4}return m}
function choose(n){const c=IW.ctx(),a=IW.ai(n),ch=n.s.ch,nd=needs(n),e=Persona.eff(ch.data),lively=e.lively/100,social=e.social/100,xx=x(n),emo=n.emo;
 const others=[...C.nodes.values()].filter(q=>q!==n),atFire=others.filter(q=>q.task?.act==='campfire').length;
 const S={
  eat:.15+3.4*u(nd.hunger),drink:.1+3*u(nd.thirst),
  nap:!c.night&&!c.rain?2.4*u(nd.energy)+1.6*u(nd.sleep):0,home:(c.night||c.late)?.3+3.4*u(nd.sleep)+(c.late?1:0):1.1*u(nd.sleep),
  shade:c.day&&!c.snow?.3+1.4*u(nd.energy)+(c.wx==='sunny'?.4:0):0,bench:!c.rain?.2+1.2*u(nd.comfort):0,sunbathe:c.day&&c.wx==='sunny'?.25+1.2*u(nd.comfort):0,
  fish:!c.rain&&!c.night?.3+1.2*u(nd.fun):0,flowers:!c.rain&&!c.night?.3+1.1*u(nd.fun):0,read:.25+1.1*u(nd.fun)+.6*u(nd.comfort)+(c.rain?.6:0),
  butterfly:c.day&&!c.rain&&!c.snow?.15+lively*1.2+2*u(nd.fun):0,explore:.3+a.cur*1.2+1.2*u(nd.fun),daydream:.3+.6*u(nd.comfort),
  campfire:(c.dusk||c.night)&&!c.rain?.8+social*.6+atFire*1.1+1.2*u(nd.comfort):0,stargaze:c.night&&!c.rain&&c.clear?.6+1*u(nd.fun):0,sunset:c.dusk&&!c.rain?1.4:0,
  shelter:c.rain?1.6+2*u(nd.comfort):0,tidy:LEAVES.length?.35+LEAVES.length*.12:0,garden:!c.night?.3:0,
  wander:.6+a.cur*.4,idle:.4+(1-lively)*.6,furniture:0,stroll:0,tag:0,chat:0
 };
 if(c.rain){S.wander*=.3;S.explore*=.25;S.fish=0;S.garden*=.3}if(c.late){S.explore*=.3;S.butterfly=0;S.tidy*=.3}
 const fs=IW.furnList(n);if(fs.length){const R=OCS24D.Room,fu=xx.log.furn;fs.forEach(f=>{const k=R.kind(Items.get(f.p.i));f.score=f.weight+(fu[f.p.u]||0)*.15+(k==='bed'?3*u(nd.sleep):k==='sit'?2*u(nd.energy)+1.5*u(nd.comfort):k==='toy'?2*u(nd.fun):0)});fs.sort((a,b)=>b.score-a.score);S.furniture=.5+fs[0].score*.35}
 const f=IW.friendOf(n);if(f){const p=C.pair(n.id,f.id),pl=Persona.eff(f.s.ch.data).lively/100,fam=Math.max(0,p.score)/60;
  S.stroll=!c.rain?.2+2.2*u(nd.social)+social*.4+fam:0;S.tag=c.day&&!c.rain&&lively>.45&&pl>.4?.2+lively*.8+1.4*u(nd.fun):0;S.chat=.2+2.4*u(nd.social)+social*.5+fam*.5;
  if(has(ch,'shy')&&p.score<20){S.chat*=.3;S.stroll*=.4}if(has(ch,'shy')&&p.score>=40){S.chat*=1.5;S.tag*=1.4}}
 try{window.L30Score&&L30Score(n,S,c,nd)}catch(_){}
 for(const k in S){S[k]*=aiMul(ch,k)*habitMul(n,k,c);const pl=L29.PLACE[k];if(pl)S[k]*=affinity(n,pl)}
 const w=xx.wish;if(w&&Date.now()-w.t>90000){const acts=w.type==='place'?[PACT[w.place]]:WT[w.type].act;acts.forEach(k=>{if(S[k])S[k]*=2.4})}
 if(emo){const i=emo.i;if(emo.id==='sad'){S.chat*=1+i;S.stroll*=1+i;S.campfire*=1+i*.6;S.butterfly*=1-i*.5}if(emo.id==='excited'){S.butterfly*=1+i;S.tag*=1+i;S.explore*=1+i*.5;S.nap*=1-i*.6}if(emo.id==='tired'){S.nap*=1+i;S.bench*=1+i;S.home*=1+i*.5}if(emo.id==='angry'){S.chat*=.4;S.explore*=1+i*.5}if(emo.id==='bored'){S.explore*=1+i;S.butterfly*=1+i}}
 const neg=xx.mem.slice(0,20).filter(m=>m.v<0);if(neg.some(m=>m.type==='rain')&&c.rain)S.shelter*=1.6;
 for(const k in S){const t=a.last[k];if(t!=null){const ago=C.clock-t;if(ago<80)S[k]*=.2;else if(ago<200)S[k]*=.6}}
 const list=Object.entries(S).filter(([,v])=>v>0).map(([k,v])=>[k,v*rnd(.8,1.2)]).sort((p,q)=>q[1]-p[1]).slice(0,4);
 const tot=list.reduce((s,[,v])=>s+v*v,0);let r=Math.random()*tot;for(const [k,v] of list){r-=v*v;if(r<=0)return {id:k,friend:f,fs,why:why(k,nd)}}return {id:list[0]?.[0]||'wander',friend:f,fs,why:why(list[0]?.[0],nd)}}
function why(k,nd){if(['eat'].includes(k)&&nd.hunger<.35)return pick(['肚子咕嚕咕嚕叫了…','好餓喔，去吃點東西。']);if(k==='drink'&&nd.thirst<.35)return pick(['口好渴…','去喝點水吧。']);
 if(['nap','home'].includes(k)&&(nd.sleep<.3||nd.energy<.3))return pick(['好睏…想睡一下。','眼皮好重…']);if(['butterfly','explore','tag'].includes(k)&&nd.fun<.3)return pick(['好無聊，找點事做！','有沒有好玩的？']);
 if(['chat','stroll'].includes(k)&&nd.social<.35)return pick(['好想找人聊天～','一個人有點寂寞。']);if(['bench','shelter','furniture'].includes(k)&&nd.comfort<.35)return pick(['找個舒服的地方坐坐。','想放鬆一下。']);return null}
function plan(n){if(n.task||C.busy(n)||C.clock<n.next)return;if(Cfg.v.auto===false){n.next=C.clock+3;return}
 let ok=false,r;try{r=choose(n);const id=r.id;
  if(id==='furniture')ok=r.fs.length&&C.furnish(n,r.fs[0].p);
  else if(id==='stroll'&&r.friend)ok=IW.startStroll(n,r.friend);
  else if(id==='tag'&&r.friend)ok=IW.startTag(n,r.friend);
  else if(id==='chat'&&r.friend){ok=C.encounter(n,r.friend,needs(n).social<.4?'chat':undefined)}
  else ok=IW.Act.start(n,id,{quiet:!!r.why});
  if(ok&&r.why&&Math.random()<.7)IW.Act.say(n,r.why,2.8)}catch(e){console.warn('[life29 ai]',e)}
 if(!ok)IW.Act.start(n,'wander',{quiet:1});n.next=C.clock+rnd(4,9)*(has(n.s.ch,'stubborn')?1.3:1)}

/* ---------- 11. 對話：依雙方個性、關係、情緒、天氣、回憶產生 ---------- */
const ACTL=k=>L29.ACTN2[k]||'';
function voiceOf(ch){const T=traitIds(ch);for(const k of ['tsun','shy','sharp','chatty','gentle','cheerful','childish','mature','polite','quiet','mysterious','extrovert','introvert'])if(T.includes(k))return k;return 'n'}
const REP={
 tsun:{ok:['哼，也、也不是不行。','才不是因為想跟你去喔！'],no:['今天沒心情啦。'],yes:['…還算有趣啦。','哼，我早就知道了。'],care:['我、我才不累！…謝謝。']},
 shy:{ok:['好、好啊…'],no:['那個…下次可以嗎…'],yes:['嗯…我也這麼覺得。','是、是嗎…'],care:['…謝謝你注意到。']},
 sharp:{ok:['行吧，反正我也閒。'],no:['不要，太麻煩了。'],yes:['這還用說。','嗯，你難得說對一次。'],care:['你管好自己就好。…不過謝了。']},
 chatty:{ok:['好耶好耶！我們邊走邊聊！'],no:['今天不行～但我們可以先聊一下！'],yes:['對對對！而且我跟你說喔——','哇我也是！還有還有！'],care:['被你這麼一說，好像真的有點累耶～']},
 gentle:{ok:['好呀，一起去吧～'],no:['今天想休息一下，下次一定陪你。'],yes:['嗯嗯，真的呢。','聽起來很棒～'],care:['謝謝你，我會好好休息的。']},
 cheerful:{ok:['走走走！'],no:['啊，今天有別的事啦～'],yes:['真的嗎！好棒！','哈哈，太好笑了！'],care:['我很好喔！精神百倍！']},
 childish:{ok:['耶！出發！'],no:['不要～我要玩別的！'],yes:['真的假的！','好厲害喔！'],care:['才沒有累！…好吧一點點。']},
 mature:{ok:['好啊，難得一起走走。'],no:['今天先不了，改天吧。'],yes:['確實如此。','說得有道理。'],care:['我沒事，倒是你也別太勉強。']},
 polite:{ok:['好的，很榮幸。'],no:['不好意思，今天可能不太方便。'],yes:['您說得對。','原來如此，謝謝分享。'],care:['謝謝您的關心。']},
 quiet:{ok:['…嗯。'],no:['…今天不了。'],yes:['…嗯。','（點點頭）'],care:['…沒事。']},
 mysterious:{ok:['命運叫我跟你走。'],no:['今天的星象不適合出門。'],yes:['一切都是注定的。','果然如我所料。'],care:['疲憊是靈魂的低語…我沒事。']},
 extrovert:{ok:['當然好！多找幾個人吧！'],no:['今天已經約滿啦～下次！'],yes:['超同意！','哈哈，你太有趣了！'],care:['我超好的！倒是你呢？']},
 introvert:{ok:['…好，就我們兩個的話。'],no:['今天想自己待著，抱歉。'],yes:['嗯，我懂。','我也是這樣想。'],care:['嗯…有點累，謝謝你。']},
 n:{ok:['好啊！'],no:['今天先不了，下次吧。'],yes:['真的耶！','對呀對呀。'],care:['謝謝你，我還好。']}
};
const rep=(ch,k)=>pick((REP[voiceOf(ch)]||REP.n)[k]||REP.n[k]);
const GREET={wave:a=>`嗨～我是${a}！`,bow:a=>`初次見面，我是${a}，請多指教。`,hop:a=>`哇！是新朋友！我是${a}！`,hug:a=>`你好你好！我是${a}，抱一個！`,nod:a=>`嗯，我是${a}。`,peek:a=>`那、那個…我是${a}…`};
const JOKES=['你知道為什麼魚不會說話嗎？因為嘴巴裡都是水！','我昨天跟雲比賽發呆，結果雲先飄走了。','如果把月亮切一半，是不是就有兩個半月？','我剛剛跟我的影子猜拳，平手了。'];
function script(e){if(e._s)return e._s;const [A,B]=e.nodes,a=A.s.ch,b=B.s.ch,an_=a.name.split(' ')[0],bn=b.name.split(' ')[0],p=C.pair(A.id,B.id),m=C.matching(A,B),t=m.topic,c=IW.ctx(),nb=needs(B),xa=x(A);
 const wx={rain:'下雨了呢，雨聲好好聽。',storm:'外面風好大…你會怕嗎？',snow:'下雪了！要不要堆雪人？',sunny:'今天天氣好好喔！',cloudy:'雲好多，像棉花糖一樣。',fog:'霧濛濛的，好像在夢裡。'}[c.wx]||'今天天氣不錯呢。';
 let L,title,text,kind=e.kind;
 if(kind==='meet'){const g=Q(A.id,'greet');L=[(GREET[g]||GREET.wave)(an_),voiceOf(b)==='shy'?`我、我是${bn}…`:voiceOf(b)==='tsun'?`哼，我是${bn}，記住了。`:voiceOf(b)==='extrovert'||voiceOf(b)==='cheerful'?`我是${bn}！以後一起玩吧！`:`我是${bn}，請多指教～`,m.common?`聽說你也喜歡${t}？下次一起吧！`:'以後也請多指教囉！'];title='第一次打招呼';text=`${an_}和${bn}第一次交換了名字。`}
 else if((kind==='chat'||kind==='shared')&&window.L30Topic&&Math.random()<.35&&(e._s=L30Topic(A,B,e))){return e._s}
 else if(kind==='chat'||kind==='shared'){const tops=[];
  if(m.common||kind==='shared')tops.push(['share',3]);tops.push(['weather',1]);if(xa.mem[0]&&Date.now()-xa.mem[0].t<10*60000)tops.push(['recent',2]);
  if((has(a,'caring')||has(a,'gentle'))&&(nb.energy<.4||nb.sleep<.4||B.emo?.id==='sad'))tops.push(['care',4]);
  if(has(a,'prank')||has(a,'chatty')||has(a,'childish'))tops.push(['joke',2]);if(has(a,'foodie')||has(a,'gourmet'))tops.push(['food',1.5]);
  if(has(a,'leader')||has(a,'extrovert')||has(a,'friendlyhost')||needs(A).social<.45)tops.push(['invite',2]);
  const shared=C.state().memories.find(mm=>mm.ids.includes(A.id)&&mm.ids.includes(B.id)&&mm.type!=='meet');if(shared)tops.push(['remember',1.5]);
  let tot=tops.reduce((s,q)=>s+q[1],0),r=Math.random()*tot,tp=tops[0][0];for(const q of tops){r-=q[1];if(r<=0){tp=q[0];break}}
  if(tp==='share'){L=[`你也喜歡${t}嗎？`,rep(b,'yes'),`下次找到跟${t}有關的東西，一定分給你！`];title=`原來我們都喜歡${t}`;text='聊到共同的喜好，越聊越開心。';kind='shared'}
  else if(tp==='weather'){L=[wx,rep(b,'yes'),has(a,'optimist')?'不管什麼天氣，跟你聊天都很開心！':has(a,'pessimist')?'不過等一下說不定會變天…':'待會要不要一起去走走？'];title='聊聊天氣';text=`${an_}和${bn}聊著今天的天氣。`}
  else if(tp==='recent'){const mm=xa.mem[0];L=[`我剛剛${mm.text}${mm.place?'（在'+(L29.PLACEN[mm.place]||'')+'）':''}！`,rep(b,'yes'),mm.v<0?'下次希望會更好…':'下次也帶你一起去！'];title='分享剛才的小事';text=`${an_}跟${bn}分享了剛才發生的事。`}
  else if(tp==='care'){L=[nb.sleep<.4?'你看起來好睏，要不要去休息一下？':B.emo?.id==='sad'?'你今天好像有點沒精神，還好嗎？':'你走好久了，坐一下吧？',rep(b,'care'),'有需要隨時叫我喔。'];title='有人在關心我';text=`${an_}注意到${bn}累了，關心了一下。`;kind='comfort'}
  else if(tp==='joke'){L=[pick(JOKES),voiceOf(b)==='sharp'?'…好冷。':voiceOf(b)==='tsun'?'噗…才、才沒有笑！':'哈哈哈哈！',has(a,'prank')?'嘿嘿，被我逗笑了吧！':'我還有更多喔！'];title='一個冷笑話';text=`${an_}講了一個笑話給${bn}聽。`;kind='play'}
  else if(tp==='food'){const fo=favFood(A);L=[`好想吃${fo?fo.name:'點心'}喔…你呢？`,has(b,'foodie')||has(b,'bigeater')?'我也是！現在就好餓！':rep(b,'yes'),'下次一起去野餐吧！'];title='聊到好吃的';text='說著說著，兩個人都餓了。'}
  else if(tp==='remember'){L=[`還記得上次「${shared.title}」嗎？`,rep(b,'yes'),'那時候真的好開心。'];title='一起回憶';text=`想起了「${shared.title}」那時候的事。`}
  else{const pl=pick(['dock','meadow','bench','campfire'].filter(q=>!(c.night&&q==='meadow')&&!(c.rain&&q!=='campfire'))),nbo=needs(B),acc=!c.rain&&(nbo.social<.75||has(b,'extrovert')||has(b,'clingy')||p.score>30)&&!(has(b,'introvert')&&nbo.social>.6)&&!has(b,'loner');
   L=[`等一下要不要一起去${L29.PLACEN[pl]}？`,rep(b,acc?'ok':'no'),acc?'太好了，走吧！':has(a,'sensitive')?'…這樣啊，好吧。':'好吧，那下次喔～'];title=acc?'約好一起出去走走':'下次再約';text=acc?`${an_}邀${bn}去${L29.PLACEN[pl]}，${bn}答應了。`:`${an_}邀${bn}出去，不過${bn}今天想休息。`;if(acc)e.inv=pl;else e.declined=1}}
 else if(kind==='squabble'){const str=has(b,'sharp')?'這種東西有什麼好的？':'嗯…這個我真的不太喜歡。';L=[`我覺得${t}很好啊。`,str,has(a,'stubborn')?'我還是覺得很好！':has(a,'sensitive')||has(a,'crybaby')?'…你這樣說我有點難過。':has(a,'calm')||has(a,'mature')?'好吧，各有所好。':'那…我們先各自散個步？'];title='一點小分歧';text=`對「${t}」的看法不同。`}
 else if(kind==='reconcile'){L=[has(a,'polite')?'剛剛真的很抱歉，我想好好道歉。':has(a,'tsun')?'剛、剛剛的事…算我不對啦。':'剛剛的事，我想再好好說一次。',has(b,'tsun')?'哼…我也有一點點不對。':'我也有點太急了，對不起。','我們還是好朋友！'];title='和好了';text='把話說開，重新和好。'}
 else if(kind==='comfort'){L=[has(a,'caring')?'我陪你待一會兒，好嗎？':'你今天看起來有點沒精神。',rep(b,'care'),'不急著開心，慢慢來就好。'];title='有人在身邊';text=`${an_}安靜地陪著${bn}。`}
 else if(kind==='stargaze'){L=['你看，那顆星星在眨眼。',has(b,'mysterious')?'那是命運之星喔。':'也許它想加入我們。','那今天的秘密，就交給它保管囉。'];title='把秘密交給星星';text='一起仰望夜空。'}
 else{e._s=null;return null}
 if(e.kind!==kind)e.kind2=kind;e._s=[L,title,text];return e._s}
function patchSocial(){
 const os=C.script.bind(C);C.script=function(e){try{const r=script(e);if(r)return r}catch(err){console.warn(err)}return os(e)};
 const ob=C.beat.bind(C);C.beat=function(e,i){const r=ob(e,i);try{const n=i===1?e.nodes[1]:e.nodes[0];if(i===0){emit(n,'greet');emit(e.nodes[0],'meet');emit(e.nodes[1],'meet')}if(i===1&&e.kind==='meet'&&has(n.s.ch,'shy'))emit(n,'nervous');if(i===2&&['play','shared'].includes(e.kind2||e.kind))emit(n,'happy')}catch(_){}return r};
 const of=C.finishEvent.bind(C);C.finishEvent=function(e){const done=e.done;const r=of(e);if(done)return r;try{const [A,B]=e.nodes;[A,B].forEach((n,k)=>{const o=k?A:B,xx=x(n);xx.log.chats++;needs(n).social=cl(needs(n).social+.35,0,1);memo(n,'chat',{with:o.s.ch.name.split(' ')[0]});wishDone(n,'friend',{id:o.id});
   if(e.kind==='squabble')feel(n,has(n.s.ch,'sensitive')?'sad':'angry',.5,50);else feel(n,'happy',.5,40,true)});
  if(e.inv){const pl=e.inv,act=PACT[pl]||'stroll';setTimeout(()=>{if(C.busy(A)||C.busy(B)||A.task||B.task)return;if(act==='campfire'||act==='sunset'){IW.Act.start(A,act,{quiet:1});setTimeout(()=>IW.Act.start(B,act,{quiet:1}),700)}else IW.startStroll(A,B)},1400)}
  if(e.declined&&has(A.s.ch,'sensitive'))feel(A,'sad',.35,30,true)}catch(err){}return r};
 C.candidates=function(){const a=[...this.nodes.values()].filter(n=>!n.task&&!this.busy(n)),pairs=[];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const A=a[i],B=a[j],p=this.pair(A.id,B.id);if(Date.now()-p.last<55000)continue;
   const ca=A.s.ch,cb=B.s.ch,ea=Persona.eff(ca.data),eb=Persona.eff(cb.data),novelty=p.count===0?60:Math.max(0,20-p.count*2);let w=novelty+(ea.social+eb.social)*.18+this.matching(A,B).common*8+rnd(0,25)+(2-needs(A).social-needs(B).social)*20;
   for(const ch of [ca,cb]){if(has(ch,'shy'))w*=p.score<20?.35:p.score>=40?1.3:.8;if(has(ch,'loner'))w*=.4;if(has(ch,'introvert'))w*=.65;if(has(ch,'extrovert')||has(ch,'friendlyhost'))w*=1.35}
   if(p.tension>=2&&(has(ca,'sensitive')||has(cb,'sensitive')))w*=.6;pairs.push({nodes:[A,B],weight:w})}return pairs.sort((x,y)=>y.weight-x.weight)};
}

/* ---------- 12. 世界反應：同一件事，不同個性有不同反應 ---------- */
function reactWorld(kind,X0,Y0){if(!C.active())return;let k=0;for(const n of C.nodes.values()){if(k>=3||C.busy(n)||n.task?.event)continue;const d=Math.hypot((n.x-X0)*1.2,(n.y-Y0)*2);if(d>.6)continue;k++;const ch=n.s.ch,xx=x(n);
  setTimeout(()=>{if(C.busy(n)||n.task?.event)return;n.s.dir=X0>n.x?1:-1;
   if(kind==='tree'){const gotApple=xx.mem.some(m=>m.type==='food'&&/蘋果/.test(m.text));
    if(has(ch,'timid')||has(ch,'sensitive')){emit(n,'nervous');IW.Act.say(n,pick(['哇！嚇我一跳…','樹、樹在動！']),2.2,true)}
    else if(has(ch,'foodie')||has(ch,'bigeater')||gotApple){IW.Act.say(n,gotApple?'上次掉了蘋果耶！這次呢？':'有水果掉下來嗎？',2.4,true);const p=C.nearest(X0+(n.x<X0?-.06:.06),cl(Y0+.01,.56,C.bounds().max),n,undefined,true);if(p&&!n.task)C.move(n,p.x,p.y,{type:'manual',run:1})}
    else if(has(ch,'tidy')||has(ch,'perfectionist')){IW.Act.say(n,'落葉掉了一地…等一下來掃。',2.4,true)}
    else if(has(ch,'prank')||has(ch,'childish')){IW.Act.say(n,'哈哈，樹在跳舞！',2.2,true);emit(n,'happy')}
    else if(has(ch,'curious')){IW.Act.say(n,'咦？樹上有什麼？',2.2,true);const p=C.nearest(X0+(n.x<X0?-.07:.07),cl(Y0+.01,.56,C.bounds().max),n,undefined,true);if(p&&!n.task)C.move(n,p.x,p.y,{type:'manual'})}
    else{try{Life.emote(n.s,'excited',true)}catch(_){}if(Math.random()<.5)IW.Act.say(n,'哇，樹在搖！',2,true)}}
   else if(kind==='splash'){if(has(ch,'sealover')||has(ch,'curious'))IW.Act.say(n,'有魚嗎？我也要看！',2.2,true);else if(has(ch,'timid'))emit(n,'nervous');else if(Math.random()<.6)IW.Act.say(n,pick(['咦，水花？','好清涼的聲音～']),2,true)}
  },200+k*300)}}
let lastWx='',lastPh='';
function weatherWatch(){const c=IW.ctx();if(lastWx&&c.wx!==lastWx&&c.rain&&!/rain|storm/.test(lastWx)){for(const n of C.nodes.values()){if(C.busy(n)||n.task?.event)continue;const ch=n.s.ch;
  setTimeout(()=>{if(C.busy(n))return;if(has(ch,'optimist')||has(ch,'nature'))IW.Act.say(n,has(ch,'nature')?'下雨了，植物們在喝水呢。':'下雨了！可以聽雨聲～',2.6,true);else if(has(ch,'childish'))IW.Act.say(n,'去踩水窪！',2,true);else if(has(ch,'timid')||has(ch,'sensitive')){emit(n,'nervous');C.interrupt(n);IW.Act.start(n,'shelter');memo(n,'rain')}else if(Math.random()<.5){C.interrupt(n);IW.Act.start(n,'shelter')}emit(n,'rain')},rnd(200,1800))}}
 if(lastPh&&c.ph!==lastPh){for(const n of C.nodes.values()){if(c.ph==='night'){emit(n,'night');if(has(n.s.ch,'nightowl')&&Math.random()<.5)IW.Act.say(n,'夜晚才剛開始呢！',2.4);if(has(n.s.ch,'scaredark')&&!C.busy(n)&&!n.task?.event){C.interrupt(n);IW.Act.start(n,'campfire')}}if(c.ph==='dawn'){emit(n,'morning');if(has(n.s.ch,'earlybird')&&Math.random()<.6)IW.Act.say(n,'早安！清晨的空氣最棒了！',2.4)}}}
 lastWx=c.wx;lastPh=c.ph}
/* 新家具：好奇的角色會去看看 */
function watchFurniture(){const R=OCS24D.Room;let known=new Set(R.list().map(p=>p.u));const oc=R.commit.bind(R);R.commit=function(){const r=oc.apply(this,arguments);try{const now=R.list(),fresh=now.filter(p=>!known.has(p.u));known=new Set(now.map(p=>p.u));
  if(fresh.length)setTimeout(()=>{const p=fresh[0],nm=Items.get(p.i)?.name||'家具';const ns=[...C.nodes.values()].sort((a,b)=>aiMul(b.s.ch,'observe')-aiMul(a.s.ch,'observe')).slice(0,2);ns.forEach((n,i)=>{if(C.busy(n)||n.task?.event)return;if(i===1&&aiMul(n.s.ch,'observe')<1.2)return;C.interrupt(n);const s=C.nearest(p.x+(i?-.07:.07),p.y+.03,n,p.u,true);if(s)setTimeout(()=>IW.Act.start(n,'observe',{spot:s,data:{name:nm}}),i*700)})},900)}catch(e){}return r}}

/* ---------- 13. 後天特質與習慣：依實際紀錄判定，必須玩家同意 ---------- */
const DISC=[
 {id:'t_nightowl',kind:'trait',trait:'nightowl',p:l=>[l.night,20],why:'最近常常在夜裡活動，越晚越有精神'},
 {id:'t_earlybird',kind:'trait',trait:'earlybird',p:l=>[l.tod.dawn||0,12],why:'最近總是在清晨就開始活動'},
 {id:'t_bookworm',kind:'trait',trait:'bookworm',p:l=>[l.act.read||0,12],why:'最近常常捧著書看得入迷'},
 {id:'h_rainread',kind:'habit',name:'雨天閱讀',p:l=>[l.rainRead,4],why:'最近經常在雨天閱讀，似乎逐漸喜歡上這種安靜的時光',eff:'下雨時更常看書'},
 {id:'t_nature',kind:'trait',trait:'nature',p:l=>[(l.act.garden||0)+(l.act.flowers||0),16],why:'經常照顧花草、在花海裡流連'},
 {id:'t_stargazer',kind:'trait',trait:'stargazer',p:l=>[l.act.stargaze||0,8],why:'常常在夜裡抬頭看星星'},
 {id:'t_sealover',kind:'trait',trait:'sealover',p:l=>[l.act.fish||0,10],why:'總是跑去碼頭看海'},
 {id:'t_tidy',kind:'trait',trait:'tidy',p:l=>[l.act.tidy||0,10],why:'看到落葉就會主動掃乾淨'},
 {id:'t_friendlyhost',kind:'trait',trait:'friendlyhost',p:l=>[l.chats,18],why:'持續和大家聊天交流，變得更擅長社交'},
 {id:'h_afterwalk',kind:'habit',name:'飯後散步',p:l=>[l.afterEat,5],why:'吃完東西後總會去散散步',eff:'吃飽後更常散步'},
 {id:'h_campfire',kind:'habit',name:'營火時光',p:l=>[l.act.campfire||0,8],why:'傍晚和夜裡常常坐在營火邊',eff:'傍晚與夜晚更常去營火'},
 {id:'t_collector',kind:'trait',trait:'collector',p:l=>[l.collect,8],why:'一直在海邊撿漂亮的貝殼'}
];
function dynDisc(n){const xx=x(n),l=xx.log,out=[];const pl=Object.entries(l.place).sort((a,b)=>b[1]-a[1])[0];if(pl&&L29.PLACEN[pl[0]])out.push({id:'h_place_'+pl[0],kind:'habit',name:`喜歡待在${L29.PLACEN[pl[0]]}`,place:pl[0],p:()=>[Math.floor(pl[1]),14],why:`最常待在${L29.PLACEN[pl[0]]}，那裡好像成了專屬的小天地`,eff:`更常去${L29.PLACEN[pl[0]]}`});
 const fu=Object.entries(l.furn).sort((a,b)=>b[1]-a[1])[0];if(fu){const p=OCS24D.Room.list().find(q=>q.u===fu[0]),nm=p&&Items.get(p.i)?.name;if(nm)out.push({id:'h_furn_'+fu[0],kind:'habit',name:`最愛的${nm}`,furn:fu[0],p:()=>[fu[1],8],why:`總是跑去使用${nm}`,eff:`更常使用${nm}`})}
 const fo=Object.entries(l.food).sort((a,b)=>b[1]-a[1])[0];if(fo){const it=Items.get(fo[0]);if(it&&!(n.s.ch.data.likes||[]).includes(it.name))out.push({id:'l_food_'+fo[0],kind:'like',name:`喜歡吃${it.name}`,item:it.name,p:()=>[fo[1],5],why:`已經吃了好多次${it.name}，好像真的很喜歡`,eff:'加入喜好清單'})}
 return out}
function discList(n){let ex=[];try{ex=window.L30Disc?L30Disc(n):[]}catch(_){}return [...DISC,...dynDisc(n),...ex]}
function state(n,d){const xx=x(n),ch=n.s.ch;if(d.kind==='trait'&&has(ch,d.trait))return 'have';if(d.kind!=='trait'&&xx.habits.some(h=>h.id===d.id))return 'have';if(d.kind==='like'&&(ch.data.likes||[]).includes(d.item))return 'have';
 if(xx.declined[d.id])return 'declined';const [cur,max]=d.p(xx.log);if(cur<max)return 'grow';if(d.kind==='trait'){const cf=conflicts(ch,d.trait);if(cf.some(c=>xx.locked.includes(c)))return 'blocked'}if((xx.snooze[d.id]||0)>Date.now())return 'snooze';return 'ready'}
function accept(n,d){const xx=x(n),ch=n.s.ch;if(d.kind==='trait'){conflicts(ch,d.trait).forEach(c=>{if(!xx.locked.includes(c))setTrait(ch,c,false)});setTrait(ch,d.trait,true);xx.acq[d.trait]=Date.now()}
 else if(d.kind==='habit')xx.habits.push({id:d.id,name:d.name,since:Date.now(),place:d.place,furn:d.furn,eff:d.eff});
 else if(d.kind==='like'){ch.data.likes=[...(ch.data.likes||[]),d.item].slice(0,24);Chars.patch(ch,{data:ch.data});Persona.refresh(ch)}
 delete xx.snooze[d.id];memo(n,'acquire',{item:d.kind==='trait'?(traitInfo(d.trait)?.t+'特質'):d.name});emit(n,'happy');feel(n,'happy',.7,60);save()}
function decline(n,d){x(n).declined[d.id]=Date.now();save()}
function later(n,d){x(n).snooze[d.id]=Date.now()+6*3600e3;save()}
let lastProp=0,propOpen=false;
function checkDisc(){if(!opt().suggest||propOpen||Date.now()-lastProp<4*60e3)return;if(!C.active()||document.getElementById('isleRing')||document.body.classList.contains('dragging'))return;
 for(const n of C.nodes.values()){for(const d of discList(n)){if(state(n,d)==='ready'){lastProp=Date.now();window.IsleLifeUI?.propose(n,d);return}}}}

/* ---------- 14. 每幀：需求、情緒、怪癖、習慣、日誌 ---------- */
let acc=0,acc2=0,acc3=0,saveAcc=0;const prevState=new Map();
function post(dt){
 for(const n of C.nodes.values())dressActor(n.s.actor,n.id);
 if(!C.active())return;
 for(const n of C.nodes.values()){tickNeeds(n,dt);tickEmo(n,dt);const s=n.s,st=s.state;if(st==='held'&&prevState.get(n)!=='held')emit(n,'nervous');prevState.set(n,st);
  const t=n.task,pose=t&&t.type==='activity'&&t.arrived?t.pose:null,ip=n.seat?'sit':pose||'';if((s.actor.dataset.ipose||'')!==ip){if(ip)s.actor.dataset.ipose=ip;else delete s.actor.dataset.ipose}}
 acc+=dt;if(acc>1){acc=0;for(const n of C.nodes.values())moodFromNeeds(n);weatherWatch()}
 acc2+=dt;if(acc2>6){acc2=0;for(const n of C.nodes.values()){if(C.busy(n)||n.task?.event||n.path.length)continue;habitsTick(n);if(Math.random()<.04)makeWish(n);const w=x(n).wish;if(w&&Math.random()<.12)IW.think(n,WT[w.type].icon)}
  if(Math.random()<.18){const P=IW.props;addLeaf(P.bigtree.x+rnd(-.14,.14),P.bigtree.y+rnd(.03,.12))}}
 acc3+=dt;if(acc3>20){acc3=0;checkDisc()}
 saveAcc+=dt;if(saveAcc>15){saveAcc=0;saveNeeds()}}
function habitsTick(n){const ch=n.s.ch,qs=x(n),s=n.s,c=IW.ctx(),nd=needs(n);
 const hb=(ch.data.habits||[]).join(' ');
 if(has(ch,'music')||/唱歌|哼歌|音樂/.test(hb)){if(Math.random()<.35){notesFx(s,2)}}
 for(const h of (qs.quirks.hab||[])){if(Math.random()>.18)continue;
  if(h==='hum')notesFx(s,2);else if(h==='skygaze'){s.go('look');n.facing='back'}else if(h==='stretch')s.go('stretch');else if(h==='selftalk'){const pl=Persona.pool(ch,'idle');if(pl.length)IW.Act.say(n,pick(pl),2.4)}
  else if(h==='snack'&&nd.hunger<.8){textFx(s,'🍪','#F4A65B');nd.hunger=cl(nd.hunger+.08,0,1)}else if(h==='collect'&&n.y>.98){sparkFx(s,4,20);qs.log.collect++;memo(n,'collect');IW.Act.say(n,'撿到一顆漂亮的貝殼！',2.2)}
  else if(h==='tidyup'&&LEAVES.length){const l=LEAVES.find(l=>Math.hypot(l.x-n.x,l.y-n.y)<.12);if(l){takeLeaf(l);qs.log.act.tidy=(qs.log.act.tidy||0)+1}}else if(h==='nap'&&nd.energy<.35){IW.Act.start(n,'nap',{spot:{x:n.x,y:n.y},quiet:1})}}
 if(tflag(ch,'collect')&&n.y>.98&&Math.random()<.2){sparkFx(s,4,20);qs.log.collect++;memo(n,'collect')}
 if(tflag(ch,'clumsy')&&Math.random()<.05){an(s,[{rotate:'0deg'},{rotate:'-14deg',translate:'-3px 4px',offset:.3},{rotate:'0deg'}],700);IW.Act.say(n,pick(['哎呀！','差點跌倒…']),2,true)}
 if(nd.fun<.3&&cd(n,'bored',40))emit(n,'bored');else if(cd(n,'idleq',30))emit(n,'idle')}
/* 抵達活動時：記錄、地點、願望 */
function patchAct(){const A=IW.Act;const oa=A.arrive.bind(A);A.arrive=function(n,task){const r=oa(n,task);try{const xx=x(n),c=IW.ctx(),k=task.act;xx.log.act[k]=(xx.log.act[k]||0)+1;xx.log.tod[c.ph]=(xx.log.tod[c.ph]||0)+1;if(c.night&&!['home','nap'].includes(k))xx.log.night++;
  if(['wander','stroll','explore'].includes(k)&&n.lastEat&&C.clock-n.lastEat<150)xx.log.afterEat++;const pl=L29.PLACE[k];if(pl){xx.log.place[pl]=(xx.log.place[pl]||0)+1;wishDone(n,'place',{place:pl})}
  if(WT.play.act.includes(k))wishDone(n,'play');if(['read','fish','sunset','daydream'].includes(k)&&![...C.nodes.values()].some(q=>q!==n&&Math.hypot(q.x-n.x,q.y-n.y)<.3))wishDone(n,'alone');if(k==='eat')wishDone(n,'snack');
  if(k==='stroll'&&task.data?.mate){wishDone(n,'friend',{id:task.data.mate.id});memo(n,'stroll',{with:task.data.mate.s.ch.name.split(' ')[0]})}if(k==='tag'&&task.data?.mate)memo(n,'tag',{with:task.data.mate.s.ch.name.split(' ')[0]});
  if(task.wait0==null&&has(n.s.ch,'stubborn'))n.wait*=1.25;save()}catch(e){}return r};
 const ot=A.tick.bind(A);A.tick=function(n,dt,task){return ot(n,dt,task)};
 const uf=C.useFurniture.bind(C);C.useFurniture=function(n){const u=n.task?.furn;const r=uf(n);try{if(u){const xx=x(n);xx.log.furn[u]=(xx.log.furn[u]||0)+1;wishDone(n,'furn',{u});save()}}catch(e){}return r};
 const oi=C.interrupt.bind(C);C.interrupt=function(n){if(n?.s?.actor)delete n.s.actor.dataset.ipose;return oi(n)}}

/* ---------- 15. 世界物件：飲水台、野餐墊 ---------- */
const WELL='<svg viewBox="0 0 60 70" aria-hidden="true"><ellipse cx="30" cy="66" rx="24" ry="4" fill="rgba(40,50,40,.16)"/><path d="M10 40H50V62Q30 68 10 62Z" fill="#B8B3A6"/><path d="M30 40H50V62Q40 66 30 66Z" fill="#9C978B"/><ellipse cx="30" cy="40" rx="20" ry="6" fill="#CFCABD"/><ellipse cx="30" cy="40" rx="15" ry="4" fill="#5DB3E0"/><path d="M26 39Q30 37 34 39" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/><path d="M14 40V12M46 40V12" stroke="#8A6648" stroke-width="4"/><path d="M8 14L30 2L52 14Z" fill="#C0504F"/><path d="M30 2L52 14H30Z" fill="#A84243"/><path d="M30 14V30" stroke="#7A5A3F" stroke-width="1.5"/><path d="M26 30H34V36H26Z" fill="#C49A6C"/></svg>';
const PICNIC='<svg viewBox="0 0 100 50" aria-hidden="true"><path d="M4 30L50 12L96 30L50 48Z" fill="#F27D7D"/><path d="M4 30L50 12L96 30L50 48Z" fill="url(#pc29)"/><defs><pattern id="pc29" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><rect width="6" height="12" fill="#FFF7EA" opacity=".8"/></pattern></defs><path d="M58 14H78L76 28H60Z" fill="#C49A6C"/><path d="M60 14Q68 4 76 14" stroke="#8A6648" stroke-width="2" fill="none"/><path d="M58 18H78" stroke="#8A6648" stroke-width="1.5"/><circle cx="34" cy="30" r="5" fill="#E8505B"/><path d="M34 25Q36 21 39 22" stroke="#5E8C4E" stroke-width="1.5" fill="none"/></svg>';
function addProps(){const PR=IW.PROPS,P=IW.props;if(P.well)return;
 PR.push({id:'well',x:-.06,y:.625,w:.13,h:.152,obs:[.03,.01],html:()=>WELL},{id:'picnic',x:.42,y:.9,w:.22,h:.11,obs:null,flat:1,html:()=>PICNIC});PR.slice(-2).forEach(p=>P[p.id]=p);IW.buildProps()}

/* ---------- 16. 啟動 ---------- */
const wait=setInterval(()=>{try{if(!(window.IsleWorld?.Act&&window.OCSCommunity?.ready&&window.OCSCommunity.world&&window.IsleWorld.props?.bigtree))return;clearInterval(wait);IW=window.IsleWorld;C=OCSCommunity;
 addProps();defineActs();patchAct();patchSocial();watchFurniture();C.plan=plan;
 const up=C.update;C.update=function(dt){const r=up.apply(this,arguments);try{post(Math.min(.05,dt||.016))}catch(e){console.warn('[life29]',e)}return r};
 document.addEventListener('isle:poke',e=>{const d=e.detail||{};if(d.kind==='tree'){for(let i=0;i<3;i++)addLeaf(d.x+rnd(-.1,.1),cl(d.y+rnd(.01,.06),.56,1))}reactWorld(d.kind,d.x,d.y)});
 for(const ch of Chars.list)X(ch.id);for(const c of Chars.list)Persona.refresh(c);
 addEventListener('pagehide',saveNeeds);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNeeds()});
}catch(e){console.error('[life29]',e);clearInterval(wait)}},200);

window.IsleLife={choose,X,ST,opt,save,traitInfo,traits,traitIds,has,setTrait,conflicts,ptype,Q,QP,QA,react,emit,needs,feel,makeWish,wishLabel,helpWish,WT,discList,state,accept,decline,later,dressActor,memo,LEAVES,
 speed(n){let m=QP('walk',Q(n.id,'walk')).sp||1;for(const t of traits(n.s.ch))if(t.speed)m*=t.speed;const e=n.emo;if(e){if(e.id==='sad'||e.id==='tired')m*=1-.18*e.i;if(e.id==='excited')m*=1+.15*e.i}return m},
 vol(id){const v=Q(id,'volume');return v==='loud'?1.7:v==='soft'?.45:1},
 ringItems(n){return [['profile','檔案',ic('book'),'#86BC4E',nn=>window.IsleLifeUI?.profile(nn.id)]]},
 node:id=>OCSCommunity.nodes.get(id),propOpen:v=>{propOpen=v},sparkFx,notesFx,an};
})();
/* ===== 2.9 深度生活：介面（性格編輯、特質庫、小怪癖預覽、生活檔案、成長提議） ===== */
(()=>{'use strict';
const LX=()=>window.IsleLife,reduce=()=>document.documentElement.dataset.motion==='reduce';
const pick=a=>a[Math.floor(Math.random()*a.length)];
const NEEDIC={hunger:'🍙',thirst:'💧',energy:'⚡',sleep:'🌙',fun:'🎈',social:'💬',comfort:'🛋️'};
const EMN={happy:'開心',excited:'興奮',calm:'平靜',sad:'難過',angry:'生氣',shy:'害羞',tired:'疲倦',bored:'無聊'};
const ACTLIST=['read','garden','flowers','fish','explore','stargaze','sunset','campfire','eat','tidy','butterfly','tag','dance','daydream','nap','chat','stroll'];
const CN=Object.fromEntries(L29.CATS);
const tags=t=>`<span class="l29-tc" data-c="${t.c||'spc'}">${CN[t.c]||'特殊'}</span>`;

/* ---------- 共用元件 ---------- */
function typeCard(ch){const L=LX(),t=L.ptype(ch);return `<div class="l29-type"><div class="ty-grid">${Array.from({length:16},(_,i)=>`<i class="${i===t.idx?'on':''}"></i>`).join('')}</div><div class="ty-b"><small>性格類型・${t.think}</small><b>${t.name}</b><p>${t.desc}</p></div></div>`}
function effectSummary(ch){const L=LX(),up=[],down=[];for(const k of ACTLIST){let m=1;for(const t of L.traits(ch))if(t.ai&&t.ai[k])m*=t.ai[k];if(m>=1.3)up.push([k,m]);else if(m<=.75)down.push([k,m])}up.sort((a,b)=>b[1]-a[1]);down.sort((a,b)=>a[1]-b[1]);
 const n=k=>L29.ACTN2[k]||{chat:'找人聊天'}[k]||k;return `<div class="l29-eff">${up.length?`<p><b class="up">更常</b>${up.slice(0,6).map(([k])=>`<span>${n(k)}</span>`).join('')}</p>`:''}${down.length?`<p><b class="dn">較少</b>${down.slice(0,5).map(([k])=>`<span>${n(k)}</span>`).join('')}</p>`:''}${!up.length&&!down.length?'<p class="muted">目前沒有明顯偏好，加入特質後會改變牠的日常選擇。</p>':''}</div>`}
function needBars(n){if(!n)return '<p class="l29-muted">這位夥伴目前不在島上。把牠加入「共同生活」後就能看到即時狀態。</p>';const L=LX(),nd=L.needs(n);
 return `<div class="l29-needs">${L29.NEEDS.map(([k,t,c])=>{const v=Math.round(nd[k]*100);return `<div class="nb ${v<25?'low':''}" style="--c:${c}"><span>${NEEDIC[k]}</span><b>${t}</b><i><em style="width:${v}%"></em></i><small>${v}</small></div>`}).join('')}</div>`}
function rhythm(ch){const L=LX(),x=L.X(ch.id),l=x.log,tod=l.tod,tot=Object.values(tod).reduce((s,v)=>s+v,0);const out=[];
 if(tot>=6){const dawn=(tod.dawn||0)/tot,night=(tod.night||0)/tot;out.push(['作息',dawn>.25?'早起型・清晨最有精神':night>.3?'夜貓型・晚上特別活躍':'規律型・白天活動為主'])}
 const pl=Object.entries(l.place).sort((a,b)=>b[1]-a[1])[0];if(pl&&pl[1]>=2)out.push(['常去的地方',L29.PLACEN[pl[0]]||pl[0]]);
 const ac=Object.entries(l.act).filter(([k])=>!['wander','idle'].includes(k)).sort((a,b)=>b[1]-a[1])[0];if(ac&&ac[1]>=2)out.push(['最常做的事',L29.ACTN2[ac[0]]||ac[0]]);
 const fu=Object.entries(l.furn).sort((a,b)=>b[1]-a[1])[0];if(fu){const p=OCS24D.Room.list().find(q=>q.u===fu[0]);if(p)out.push(['愛用的家具',Items.get(p.i)?.name||'家具'])}
 const fo=Object.entries(l.food).sort((a,b)=>b[1]-a[1])[0];if(fo&&Items.get(fo[0]))out.push(['常吃的食物',Items.get(fo[0]).name]);
 let bf=null,bs=-1;for(const c of Chars.list){if(c.id===ch.id)continue;const p=OCSCommunity.state().pairs[OCSCommunity.key(ch.id,c.id)];if(p&&p.score>bs){bs=p.score;bf=c}}if(bf&&bs>0)out.push(['最要好',bf.name+'・'+OCSCommunity.level(OCSCommunity.pair(ch.id,bf.id))]);
 if(l.collect)out.push(['收藏的貝殼',l.collect+' 個']);
 return out.length?`<div class="l29-rh">${out.map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>`:'<p class="l29-muted">在島上多生活一段時間，就會慢慢看出牠的生活節奏。</p>'}
function growth(ch,box,onChange){const L=LX(),n=L.node(ch.id),x=L.X(ch.id),o=L.opt();const paint=()=>{let h='';
  h+=`<div class="l29-sw"><span><b>自動建議養成</b><small>發現新的習慣或特質時，先詢問你</small></span><button role="switch" class="nx-sw ${o.suggest?'on':''}" aria-checked="${o.suggest}" data-sug></button></div>`;
  const acq=Object.keys(x.acq).filter(id=>L.has(ch,id)),habits=x.habits;
  h+='<div class="l29-h">已養成</div>';
  h+=acq.length||habits.length?`<div class="l29-acq">${acq.map(id=>{const t=L.traitInfo(id,x);return `<div class="aq"><span>${t?.em||'✨'}</span><div><b>${t?.t||id}</b><small>後天特質・${new Date(x.acq[id]).toLocaleDateString('zh-TW')}</small></div><button class="l29-ib ${x.locked.includes(id)?'on':''}" data-lock="${id}" aria-label="鎖定">${x.locked.includes(id)?'🔒':'🔓'}</button><button class="l29-ib" data-rmt="${id}" aria-label="移除">✕</button></div>`}).join('')}${habits.map(hb=>`<div class="aq ${hb.off?'off':''}"><span>🌱</span><div><b>${hb.name}</b><small>${hb.eff||'生活習慣'}</small></div><button class="l29-ib ${hb.off?'':'on'}" data-hoff="${hb.id}" aria-label="啟用">${hb.off?'⏸':'▶'}</button><button class="l29-ib" data-rmh="${hb.id}" aria-label="移除">✕</button></div>`).join('')}</div>`:'<p class="l29-muted">還沒有養成新的習慣。</p>';
  if(n){const list=L.discList(n).map(d=>({d,s:L.state(n,d)})).filter(z=>z.s!=='have');
   h+='<div class="l29-h">正在形成</div>';
   h+=list.length?`<div class="l29-disc">${list.map(({d,s})=>{const [c,m]=d.p(x.log),lbl=d.kind==='trait'?(L.traitInfo(d.trait)?.t||'')+'（特質）':d.name;return `<div class="dc ${s}"><div class="dc-t"><b>${lbl}</b><small>${s==='ready'?'條件達成':s==='declined'?'你選擇了不要':s==='blocked'?'與鎖定的特質衝突':s==='snooze'?'稍後再提醒':d.why}</small></div><i><em style="width:${Math.min(100,c/m*100)}%"></em></i><span class="dc-n">${Math.min(c,m)}/${m}</span>${s==='ready'||s==='snooze'?`<button class="btn primary sm" data-acc="${d.id}">養成</button><button class="btn sm" data-dec="${d.id}">不要</button>`:''}${s==='declined'?`<button class="btn sm" data-undo="${d.id}">重新考慮</button>`:''}</div>`}).join('')}</div>`:''}
  else h+='<p class="l29-muted">加入共同生活後，系統會依照牠的實際生活紀錄判斷可能養成的習慣。</p>';
  box.innerHTML=h};
 box.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset,find=id=>n&&L.discList(n).find(z=>z.id===id);buzz(6);
  if(d.sug!==undefined){o.suggest=!o.suggest;L.save()}
  else if(d.lock){const i=x.locked.indexOf(d.lock);i>=0?x.locked.splice(i,1):x.locked.push(d.lock);L.save()}
  else if(d.rmt){L.setTrait(ch,d.rmt,false)}
  else if(d.hoff){const hb=x.habits.find(z=>z.id===d.hoff);if(hb)hb.off=!hb.off;L.save()}
  else if(d.rmh){x.habits=x.habits.filter(z=>z.id!==d.rmh);L.save()}
  else if(d.acc){const z=find(d.acc);if(z)L.accept(n,z)}else if(d.dec){const z=find(d.dec);if(z)L.decline(n,z)}else if(d.undo){delete x.declined[d.undo];L.save()}
  paint();onChange&&onChange()};paint();return box}
function memories(ch){const x=LX().X(ch.id),pairs=OCSCommunity.state().memories.filter(m=>m.ids.includes(ch.id)).slice(0,10);const mine=x.mem.slice(0,20);
 const all=[...mine.map(m=>({t:m.t,b:m.text,s:m.place?L29.PLACEN[m.place]||'':'',v:m.v})),...pairs.map(m=>({t:m.t,b:m.title,s:m.ids.filter(i=>i!==ch.id).map(i=>Chars.byId(i)?.name||'').join('、'),v:1}))].sort((a,b)=>b.t-a.t).slice(0,24);
 return all.length?`<div class="l29-mem">${all.map(m=>`<div class="${m.v<0?'neg':''}"><small>${new Date(m.t).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}${m.s?'・'+m.s:''}</small><b>${m.b}</b></div>`).join('')}</div>`:'<p class="l29-muted">回憶冊還是空白的。</p>'}

/* ---------- 生活檔案 ---------- */
function profile(id,tab='now'){const ch=Chars.byId(id);if(!ch)return;const L=LX();let tick=0;
 const s=openSheet(`<div class="sh-body l29-prof" id="l29P"></div>`,{cls:'l29-psheet',onClose:()=>clearInterval(tick)}),B=s.el.querySelector('#l29P');s.el.setAttribute('aria-label',ch.name+' 的生活檔案');
 const TABS=[['now','狀態'],['pers','個性'],...((window.L30Tabs||[]).map(t=>[t[0],t[1]])),['life','生活'],['grow','成長'],['mem','回憶']];
 const draw=()=>{const n=L.node(ch.id),x=L.X(ch.id),t=L.ptype(ch);let h=`<div class="pf-head"><span class="pf-av">${artHTML(ch)}</span><div><b>${esc(ch.name)}</b><small>${t.name}・${t.think}</small></div><button class="btn sm" data-edit>${ic('sliders')}編輯</button></div><div class="pf-tabs">${TABS.map(([k,v])=>`<button class="${k===tab?'on':''}" data-tab="${k}">${v}</button>`).join('')}</div><div class="pf-body">`;
  if(tab==='now'){const e=n&&n.emo,act=n&&(n.task?.act?L29.ACTN2[n.task.act]:n.task?.type==='social'?'和朋友聊天':n.task?.type==='furniture'?'使用家具':n.path.length?'散步中':'休息中');
   h+=`<div class="pf-now"><div><small>正在</small><b>${act||'—'}</b></div><div><small>心情</small><b>${e?EMN[e.id]||e.id:EMN[n?.s.mood?.id]||'平靜'}</b>${e?`<i class="emi"><em style="width:${Math.round(e.i*100)}%"></em></i>`:''}</div></div>`;
   h+=`<div class="l29-h">生活需求</div>${needBars(n)}<p class="l29-note">需求只會影響牠想做的事與心情，不會懲罰。牠會自己吃東西、睡覺、找朋友。</p>`;
   const w=x.wish;h+='<div class="l29-h">小小心願</div>';
   const ew=window.Econ&&Econ.s.life[ch.id]?.w,ewi=ew&&Items.get(ew.item);
   h+=w?`<div class="pf-wish"><span>💭</span><div><b>${L.wishLabel(w)}</b><small>${w.type==='pet'?'點一下牠就能摸摸頭':'可以幫牠一把，也可以讓牠自己想辦法'}</small></div>${w.type!=='pet'&&n?'<button class="btn primary sm" data-help>幫忙</button>':''}</div>`:'';
   h+=ewi?`<div class="pf-wish"><span>🍽️</span><div><b>想吃「${esc(ewi.name)}」</b><small>從背包餵牠就能實現（可在商店購買）</small></div></div>`:'';if(!w&&!ewi)h+='<p class="l29-muted">現在沒有特別的心願。</p>'}
  if(tab==='pers'){h+=typeCard(ch)+`<p class="pf-desc">${esc(ch.desc||'')}</p><div class="l29-h">特質</div><div class="pf-chips">${L.traits(ch).map(tr=>`<span>${tr.em||'✨'} ${esc(tr.t)}${x.acq[tr.id]?'<i>後天</i>':''}</span>`).join('')||'<em>尚未設定特質</em>'}</div>`;
   h+=`<div class="l29-h">對日常的影響</div>${effectSummary(ch)}<div class="l29-h">小怪癖</div><div class="pf-chips q">${Object.keys(L29.Q).map(k=>{const v=L.Q(ch.id,k),o=L29.Q[k].o.find(z=>z[0]===v);return `<span><small>${L29.Q[k].t}</small>${o?o[1]:v}</span>`}).join('')}${(x.quirks.hab||[]).map(hid=>`<span><small>習慣</small>${L29.HABITS.find(z=>z[0]===hid)?.[1]||hid}</span>`).join('')}${x.cq.map(q=>`<span><small>自訂</small>${esc(q.name)}</span>`).join('')}</div>`}
  if(tab==='life')h+=`<div class="l29-h">生活節奏</div>${rhythm(ch)}<div class="l29-h">興趣與喜好</div><div class="pf-chips">${[...(ch.data.interests||[]),...(ch.data.likes||[])].map(v=>`<span>${esc(v)}</span>`).join('')||'<em>尚未設定</em>'}</div>${(ch.data.habits||[]).length?`<div class="l29-h">生活習慣（自訂）</div><div class="pf-chips">${ch.data.habits.map(v=>`<span>${esc(v)}</span>`).join('')}</div>`:''}`;
  if(tab==='grow')h+='<div data-grow></div>';
  if(tab==='mem')h+=memories(ch);
  {const ext=(window.L30Tabs||[]).find(t=>t[0]===tab);if(ext)h+=ext[2](ch)}
  h+='</div>';B.innerHTML=h;if(tab==='grow')growth(ch,B.querySelector('[data-grow]'))};
 B.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tab){tab=b.dataset.tab;buzz(5);draw();return}
  if(window.L30TabClick&&L30TabClick(b,ch,draw,s))return;
  if(b.dataset.edit!==undefined){s.close();setTimeout(()=>Ed.open(ch.id,'pers'),260);return}
  if(b.dataset.help!==undefined){const n=L.node(ch.id);if(n&&L.helpWish(n)){toast('出發去實現心願！','sparkle');s.close()}else toast('牠現在正在忙，等一下再試試','info')}});
 draw();tick=setInterval(()=>{if(!s.closed&&tab==='now'&&!s.el.querySelector(':active'))draw()},2500)}

/* ---------- 成長提議小卡 ---------- */
function propose(n,d){const L=LX(),ch=n.s.ch,x=L.X(ch.id);const nm=ch.name.split(' ')[0];let label,note='';
 if(d.kind==='trait'){const t=L.traitInfo(d.trait);label=`「${t?.t}」的特質`;const cf=L.conflicts(ch,d.trait).filter(c=>!x.locked.includes(c));if(cf.length)note=`這會取代原本的「${cf.map(c=>L.traitInfo(c,x)?.t).join('、')}」。`}
 else if(d.kind==='habit'){label=`「${d.name}」的習慣`;note=d.eff?`養成後：${d.eff}。`:''}else{label=`「${d.item}」加入喜好`;note=''}
 const el_=document.createElement('div');el_.className='l29-propc';el_.setAttribute('role','dialog');el_.setAttribute('aria-label','成長提議');
 el_.innerHTML=`<span class="pp-av">${artHTML(ch)}</span><div class="pp-b"><small>🌱 ${esc(nm)} 的小變化</small><p><b>${esc(nm)}</b>${esc(d.why)}。</p><p>要讓牠${d.kind==='like'?'把':'養成'}${label}${d.kind==='like'?'嗎？':'嗎？'}${note?`<em>${note}</em>`:''}</p><div class="pp-btns"><button class="btn primary" data-a="yes">好呀</button><button class="btn" data-a="later">之後再說</button><button class="btn" data-a="no">不要</button></div></div>`;
 document.getElementById('p-home').append(el_);L.propOpen(true);IsleWorld.think(n,'friend');
 if(!reduce())el_.animate([{opacity:0,transform:'translateY(-30px) scale(.9)'},{opacity:1,transform:'none'}],{duration:520,easing:'cubic-bezier(.2,1.3,.35,1)'});
 const close=()=>{L.propOpen(false);if(reduce()){el_.remove();return}el_.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-20px) scale(.95)'}],{duration:220,easing:'ease-in',fill:'forwards'}).onfinish=()=>el_.remove()};
 el_.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;buzz(8);const a=b.dataset.a;if(a==='yes'){L.accept(n,d);toast(`${nm} 養成了${label}`,'sparkle')}else if(a==='no'){L.decline(n,d);toast('好的，不會再提起這件事','check')}else L.later(n,d);close()});
 setTimeout(()=>{if(el_.isConnected){L.later(n,d);close()}},45000)}

/* ---------- 角色編輯器：個性（升級）／小怪癖／成長 ---------- */
function persTab(){const ed=Ed,ch=ed.ch,L=LX(),x=L.X(ch.id),b=el('<div class="l29-ed"></div>');let cat='all',q='';
 const head=el(`<div data-type></div>`),eff=el('<div data-eff></div>');
 const paintHead=()=>{head.innerHTML=typeCard(ch)+`<p class="pf-desc">${esc(ch.desc||'')}</p>`;eff.innerHTML=effectSummary(ch)};
 b.append(head);
 const sl=el('<div class="ed-card"></div>'),sls={};
 const dims=[...SLIDERS.filter(s=>['lively','pace','expr','social'].includes(s.k)),...SLIDERS.filter(s=>!['lively','pace','expr','social'].includes(s.k))];
 const lab={lively:'活力',pace:'行動節奏',expr:'情緒表達',social:'社交傾向'};
 dims.forEach(s=>{const r=UI.ends(Object.assign({},s,{t:lab[s.k]||s.t}),ch.data.pers.sl[s.k],v=>{ed.set(d=>{d.pers.sl[s.k]=v});paintHead()});sls[s.k]=r;sl.append(r)});
 sl.append(UI.ends({k:'think',t:'思考方式',a:'直覺感性',b:'理性分析'},x.think,v=>{x.think=v;L.save();paintHead()}));
 sl.append(UI.ends({k:'freq',t:'說話風格',a:'安靜寡言',b:'健談多話'},ch.data.speech.freq,v=>{ed.set(d=>{d.speech.freq=v});paintHead()}));
 b.append(UI.h('性格滑桿'),sl);
 const tp=UI.chips(TEMPLATES.map(t=>({v:t.id,t:t.t,em:ocsPersonaIcon(t.id)})),'',v=>{const t=TEMPLATES.find(z=>z.id===v);if(!t)return;buzz(10);ed.set(d=>{d.pers.sl=Object.assign({},t.sl);d.pers.traits=[...new Set([...d.pers.traits.filter(id=>!TRAITS.some(z=>z.id===id)),...t.traits])]});SLIDERS.forEach(s=>sls[s.k]?.set(t.sl[s.k]));paintHead();paintSel();paintLib()});
 b.append(el('<div class="ed-h">快速套用範本</div>'),tp);
 b.append(UI.h('已選擇的特質'));const sel=el('<div class="l29-sel"></div>');b.append(sel);
 b.append(UI.h('特質庫'));const tools=el(`<div class="l29-libt"><div class="l29-srch"><input class="inp" type="search" placeholder="搜尋特質，例如：害羞、閱讀、早起" aria-label="搜尋特質"></div><div class="chips l29-cats"></div></div>`);b.append(tools);
 const lib=el('<div class="l29-lib"></div>');b.append(lib);
 b.append(UI.h('對日常的影響'),eff,el(`<div class="ed-note">${ic('sparkle')}<span>特質代表傾向，不是絕對限制。牠會依照特質、當下的需求、心情、天氣和過去的經驗，做出不一樣的選擇與反應。</span></div>`));
 const all=()=>{const base=TRAITS.map(t=>L.traitInfo(t.id,x)),cus=x.custom.map(c=>L.traitInfo(c.id,x));return [...base,...L29.TRAITS,...cus].filter(Boolean)};
 const paintSel=()=>{const T=L.traits(ch);sel.innerHTML=T.length?T.map(t=>`<button class="l29-chip" data-off="${t.id}"><span>${t.em||'✨'}</span>${esc(t.t)}${x.acq[t.id]?'<i>後天</i>':''}${x.locked.includes(t.id)?'<i>🔒</i>':''}<b>×</b></button>`).join(''):'<span class="l29-muted">還沒有特質，從下方特質庫挑選吧（數量不限）。</span>'};
 const paintCats=()=>{const c=tools.querySelector('.l29-cats');c.innerHTML=[['all','全部'],...L29.CATS,['mine','自訂']].map(([k,v])=>`<button class="chip ${cat===k?'on':''}" data-cat="${k}">${v}</button>`).join('')};
 const paintLib=()=>{const on=new Set(L.traitIds(ch)),qq=q.trim();const list=all().filter(t=>(cat==='all'||(cat==='mine'?t.custom:t.c===cat))&&(!qq||(t.t+t.d+(CN[t.c]||'')).includes(qq)));
  lib.innerHTML=list.map(t=>{const cf=on.has(t.id)?[]:L.conflicts(ch,t.id);return `<button class="l29-tr ${on.has(t.id)?'on':''} ${cf.length?'cf':''}" data-t="${t.id}"><span class="em">${t.em||'✨'}</span><span class="tx"><b>${esc(t.t)}</b><small>${esc(t.d||'')}</small>${cf.length?`<small class="cfm">與「${cf.map(c=>L.traitInfo(c,x)?.t).join('、')}」衝突</small>`:''}</span>${tags(t)}</button>`}).join('')+`<button class="l29-tr add" data-new><span class="em">＋</span><span class="tx"><b>自訂特質</b><small>設定名稱、傾向與喜歡的活動</small></span></button>`};
 const toggle=async id=>{const on=L.traitIds(ch).includes(id);if(on){if(x.locked.includes(id)){toast('這個特質已鎖定，先在「成長」解除鎖定','info');return}L.setTrait(ch,id,false);done();return}
  const cf=L.conflicts(ch,id);if(cf.length){const nm=cf.map(c=>L.traitInfo(c,x)?.t).join('、');const r=await choice(`「${L.traitInfo(id,x)?.t}」與「${nm}」的傾向相反`,'可以替換掉原本的特質，或兩個都保留（傾向會互相抵銷一些）。',[['replace','替換'],['both','都保留'],['cancel','取消']]);
   if(r==='cancel'||!r)return;if(r==='replace')cf.forEach(c=>{if(!x.locked.includes(c))L.setTrait(ch,c,false)})}
  L.setTrait(ch,id,true);done()};
 const done=()=>{Persona.refresh(ch);refreshViews(ch);ed.saved();paintSel();paintLib();paintHead()};
 sel.onclick=e=>{const t=e.target.closest('[data-off]');if(t){buzz(6);toggle(t.dataset.off)}};
 lib.onclick=e=>{const t=e.target.closest('[data-t]');if(t){buzz(6);toggle(t.dataset.t);return}if(e.target.closest('[data-new]'))customTrait(ch,null,done)};
 tools.addEventListener('click',e=>{const c=e.target.closest('[data-cat]');if(c){cat=c.dataset.cat;buzz(5);paintCats();paintLib()}});
 tools.querySelector('input').addEventListener('input',e=>{q=e.target.value;paintLib()});
 lib.addEventListener('contextmenu',e=>{const t=e.target.closest('[data-t]');if(t&&x.custom.some(c=>c.id===t.dataset.t)){e.preventDefault();customTrait(ch,t.dataset.t,done)}});
 let lp=0;lib.addEventListener('pointerdown',e=>{const t=e.target.closest('[data-t]');if(!t||!x.custom.some(c=>c.id===t.dataset.t))return;lp=setTimeout(()=>{lp=-1;customTrait(ch,t.dataset.t,done)},520)});lib.addEventListener('pointerup',()=>{if(lp>0)clearTimeout(lp)});lib.addEventListener('click',e=>{if(lp===-1){e.stopImmediatePropagation();lp=0}},true);
 paintHead();paintSel();paintCats();paintLib();return b}
function choice(title,msg,opts){return new Promise(res=>{const s=openSheet(`<div class="sh-body"><div class="sh-title">${esc(title)}</div><p class="l29-note">${esc(msg)}</p><div class="l29-choice">${opts.map(([k,v],i)=>`<button class="btn ${i===0?'primary':''}" data-k="${k}">${v}</button>`).join('')}</div></div>`,{onClose:()=>res(null)});s.el.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b){res(b.dataset.k);s.close()}})})}
function customTrait(ch,id,done){const L=LX(),x=L.X(ch.id),ex=id&&x.custom.find(c=>c.id===id),st=ex?JSON.parse(JSON.stringify(ex)):{id:'ct_'+Date.now().toString(36),name:'',em:'✨',c:'spc',d:'',tend:[],acts:[],say:[]};
 const EM=['✨','🌟','🍀','🎵','🐾','🌈','💭','🧸','🎀','⚡','🍓','🔮','📷','🧶','🍰','🌊'];
 const s=openSheet(`<div class="sh-body l29-ct"><div class="sh-title">${ex?'編輯':'自訂'}特質</div>
  <div class="fld"><span>名稱</span><input class="inp" data-n maxlength="10" placeholder="例：愛收集閃亮物"></div>
  <div class="fld"><span>一句描述</span><input class="inp" data-d maxlength="24" placeholder="例：看到亮晶晶的東西就停不下來"></div>
  <div class="fld"><span>圖示</span><div class="chips wrap" data-em>${EM.map(e=>`<button class="chip ${e===st.em?'on':''}" data-e="${e}">${e}</button>`).join('')}</div></div>
  <div class="fld"><span>分類</span><div class="chips wrap" data-c>${L29.CATS.map(([k,v])=>`<button class="chip ${k===st.c?'on':''}" data-cc="${k}">${v}</button>`).join('')}</div></div>
  <div class="fld"><span>性格傾向（最多 3 項）</span><div class="chips wrap" data-tend>${TEND.map(t=>`<button class="chip ${st.tend.includes(t.id)?'on':''}" data-td="${t.id}">${t.t}</button>`).join('')}</div></div>
  <div class="fld"><span>更常做的事（會真的影響自主行為）</span><div class="chips wrap" data-acts>${ACTLIST.map(k=>`<button class="chip ${st.acts.includes(k)?'on':''}" data-ac="${k}">${L29.ACTN2[k]||'找人聊天'}</button>`).join('')}</div></div>
  <div class="fld"><span>特質台詞（一行一句，選填）</span><textarea class="inp ta" data-s rows="3" maxlength="240"></textarea></div>
  <div class="pv-cta">${ex?'<button class="btn danger" data-del>刪除</button>':''}<button class="btn primary grow" data-ok>完成</button></div></div>`,{cls:'tall'});
 const E=s.el;E.querySelector('[data-n]').value=st.name;E.querySelector('[data-d]').value=st.d||'';E.querySelector('[data-s]').value=(st.say||[]).join('\n');
 E.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;buzz(5);
  if(d.e){st.em=d.e;E.querySelectorAll('[data-e]').forEach(z=>z.classList.toggle('on',z.dataset.e===d.e))}
  else if(d.cc){st.c=d.cc;E.querySelectorAll('[data-cc]').forEach(z=>z.classList.toggle('on',z.dataset.cc===d.cc))}
  else if(d.td){const i=st.tend.indexOf(d.td);if(i>=0)st.tend.splice(i,1);else if(st.tend.length<3)st.tend.push(d.td);else{toast('最多 3 項','info');return}b.classList.toggle('on',st.tend.includes(d.td))}
  else if(d.ac){const i=st.acts.indexOf(d.ac);i>=0?st.acts.splice(i,1):st.acts.push(d.ac);b.classList.toggle('on',st.acts.includes(d.ac))}
  else if(d.del!==undefined){x.custom=x.custom.filter(c=>c.id!==st.id);L.setTrait(ch,st.id,false);s.close();done()}
  else if(d.ok!==undefined){st.name=E.querySelector('[data-n]').value.trim();if(!st.name){toast('請輸入名稱','info');return}st.d=E.querySelector('[data-d]').value.trim();st.say=E.querySelector('[data-s]').value.split('\n').map(z=>z.trim()).filter(Boolean).slice(0,8);
   const i=x.custom.findIndex(c=>c.id===st.id);if(i>=0)x.custom[i]=st;else x.custom.push(st);if(!L.traitIds(ch).includes(st.id))L.setTrait(ch,st.id,true);L.save();s.close();done()}})}
/* 小怪癖 */
function preview(kind){const ed=Ed,s=ed.stage,ch=ed.ch,L=LX();if(!s)return;L.dressActor(s.actor,ch.id);delete s.actor.dataset.ipose;
 if(kind==='walk'){try{s.go('stroll')}catch(_){}}else if(kind==='greet'||kind==='happy'||kind==='nervous')L.react({s},L.Q(ch.id,kind));
 else if(kind==='sleep'){s.actor.dataset.ipose='doze';try{s.go('doze',{forced:1})}catch(_){}setTimeout(()=>{delete s.actor.dataset.ipose;try{s.go('rise')}catch(_){}},4200);const v=L.Q(ch.id,'sleep');if(v==='talk')setTimeout(()=>s.say('嗯…棉花糖…',2200),900);if(v==='snore')setTimeout(()=>s.say('呼嚕…呼嚕…',2200),900)}
 else if(kind==='sit'||kind==='stance'){if(kind==='sit'){s.actor.dataset.ipose='sit';try{s.go('sit',{forced:1})}catch(_){}setTimeout(()=>{delete s.actor.dataset.ipose},4200)}else{try{s.go('stand',{forced:1})}catch(_){}}}
 else if(kind==='eat'||kind==='appetite'){const d=(L.QP('eat',L.Q(ch.id,'eat')).d||7)*1000;L.QA.chew(s,Math.min(d,6000));s.say(L.Q(ch.id,'eat')==='fast'?'（狼吞虎嚥）':L.Q(ch.id,'eat')==='slow'?'（慢慢地嚼…）':'好吃～',1800)}
 else if(kind==='volume')s.say(Persona.style(ch,'你好呀，今天過得好嗎？'),2400);
 else if(L.QA[kind])L.QA[kind](s)}
function quirkTab(){const ed=Ed,ch=ed.ch,L=LX(),x=L.X(ch.id),b=el('<div class="l29-ed"></div>');
 const pv=el(`<div class="l29-pv"><span>預覽：</span>${[['walk','走路'],['greet','打招呼'],['happy','開心'],['nervous','緊張'],['sit','坐下'],['sleep','睡覺'],['eat','吃東西'],['volume','說話']].map(([k,v])=>`<button class="chip" data-pv="${k}">${v}</button>`).join('')}</div>`);
 pv.onclick=e=>{const c=e.target.closest('[data-pv]');if(c){buzz(5);preview(c.dataset.pv)}};b.append(pv);
 const card=el('<div class="ed-card l29-qs"></div>');
 Object.entries(L29.Q).forEach(([k,g])=>{const row=el(`<div class="l29-q"><b>${g.t}</b><div class="chips wrap">${g.o.map(([v,t])=>`<button class="chip ${L.Q(ch.id,k)===v?'on':''}" data-q="${k}" data-v="${v}">${t}</button>`).join('')}</div></div>`);card.append(row)});
 card.onclick=e=>{const c=e.target.closest('[data-q]');if(!c)return;buzz(6);x.quirks[c.dataset.q]=c.dataset.v;L.save();card.querySelectorAll(`[data-q="${c.dataset.q}"]`).forEach(z=>z.classList.toggle('on',z===c));preview(c.dataset.q==='stance'?'stance':c.dataset.q)};
 b.append(UI.h('小怪癖'),card);
 const sp=ch.data.speech;b.append(UI.h('口癖與說話'),UI.card(UI.field('自稱',UI.input(sp.self,v=>ed.set(d=>{d.speech.self=v.trim()}),{max:8,ph:'例：本喵、人家'})),UI.field('句尾口癖',UI.input(sp.tic,v=>ed.set(d=>{d.speech.tic=v.trim()}),{max:8,ph:'例：喵、的說、der'})),UI.field('口頭禪（用逗號分隔）',UI.input(sp.catch,v=>ed.set(d=>{d.speech.catch=v}),{max:60,ph:'例：天啊、好耶'}))));
 const hb=el(`<div class="chips wrap l29-hab">${L29.HABITS.map(([k,t,d])=>`<button class="chip ${(x.quirks.hab||[]).includes(k)?'on':''}" data-h="${k}" title="${d}">${t}</button>`).join('')}</div>`);
 hb.onclick=e=>{const c=e.target.closest('[data-h]');if(!c)return;buzz(6);const a=x.quirks.hab=x.quirks.hab||[],i=a.indexOf(c.dataset.h);i>=0?a.splice(i,1):a.push(c.dataset.h);c.classList.toggle('on',a.includes(c.dataset.h));L.save();if(a.includes(c.dataset.h))preview(c.dataset.h==='skygaze'?'look':c.dataset.h==='selftalk'?'volume':c.dataset.h)};
 b.append(UI.h('特殊習慣（可多選）'),hb);
 const cq=el('<div class="l29-cq"></div>');const paintCq=()=>{cq.innerHTML=x.cq.map(q=>`<div class="cq"><div><b>${esc(q.name)}</b><small>${L29.TRIG.find(z=>z[0]===q.trig)?.[1]}・${L29.ACTN.find(z=>z[0]===q.act)?.[1]}${q.line?'・「'+esc(q.line)+'」':''}</small></div><button class="l29-ib" data-play="${q.id}" aria-label="預覽">▶</button><button class="l29-ib" data-del="${q.id}" aria-label="刪除">✕</button></div>`).join('')+'<button class="btn wide" data-add>＋ 新增自訂小怪癖</button>'};
 cq.onclick=e=>{const b2=e.target.closest('button');if(!b2)return;buzz(5);const d=b2.dataset;if(d.play){const q=x.cq.find(z=>z.id===d.play);if(q){if(q.act!=='say')L.react({s:ed.stage},q.act);if(q.line)ed.stage.say(Persona.style(ch,q.line),2400)}}else if(d.del){x.cq=x.cq.filter(z=>z.id!==d.del);L.save();paintCq()}else if(d.add!==undefined)addCq(ch,()=>paintCq())};paintCq();
 b.append(UI.h('自訂小怪癖'),el('<p class="l29-note">設定「什麼時候」做「什麼事」，牠在島上就會真的這樣做。</p>'),cq);return b}
function addCq(ch,done){const L=LX(),x=L.X(ch.id),st={id:'cq'+Date.now().toString(36),name:'',trig:'morning',act:'hop',line:''};
 const s=openSheet(`<div class="sh-body"><div class="sh-title">自訂小怪癖</div><div class="fld"><span>名稱</span><input class="inp" data-n maxlength="12" placeholder="例：早上對大海說早安"></div><div class="fld"><span>什麼時候</span><div class="chips wrap">${L29.TRIG.map(([k,v])=>`<button class="chip ${k===st.trig?'on':''}" data-tr="${k}">${v}</button>`).join('')}</div></div><div class="fld"><span>做什麼</span><div class="chips wrap">${L29.ACTN.map(([k,v])=>`<button class="chip ${k===st.act?'on':''}" data-ac="${k}">${v}</button>`).join('')}</div></div><div class="fld"><span>說的話（選填）</span><input class="inp" data-l maxlength="40" placeholder="例：大海早安！"></div><div class="pv-cta"><button class="btn primary grow" data-ok>新增</button></div></div>`);
 s.el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.tr){st.trig=d.tr;s.el.querySelectorAll('[data-tr]').forEach(z=>z.classList.toggle('on',z===b))}else if(d.ac){st.act=d.ac;s.el.querySelectorAll('[data-ac]').forEach(z=>z.classList.toggle('on',z===b))}
  else if(d.ok!==undefined){st.name=s.el.querySelector('[data-n]').value.trim();st.line=s.el.querySelector('[data-l]').value.trim();if(!st.name){toast('請輸入名稱','info');return}if(st.act==='say'&&!st.line){toast('請輸入要說的話','info');return}x.cq.push(st);L.save();s.close();done()}})}
function lifeTab(){const ch=Ed.ch,b=el('<div class="l29-ed"></div>'),n=LX().node(ch.id);
 b.append(UI.h('生活需求'),el(`<div>${needBars(n)}</div>`),UI.h('生活節奏'),el(`<div>${rhythm(ch)}</div>`),UI.h('習慣與成長'));const g=el('<div></div>');growth(ch,g);b.append(g,UI.h('回憶'),el(`<div>${memories(ch)}</div>`));return b}
function patchEd(){const T=Ed.TABS;if(!T.some(t=>t[0]==='quirk')){const i=T.findIndex(t=>t[0]==='pers');T.splice(i+1,0,['quirk','小怪癖'],['life','生活'])}
 Ed.t_pers=persTab;Ed.t_quirk=quirkTab;Ed.t_life=lifeTab;
 const oo=Ed.open.bind(Ed);Ed.open=function(id,tab){const r=oo(id,tab);try{if(this.stage)LX().dressActor(this.stage.actor,id)}catch(_){}return r}}

/* ---------- 啟動 ---------- */
const wait=setInterval(()=>{if(!(window.IsleLife&&window.IsleWorld&&typeof Ed!=='undefined'&&Ed.TABS))return;clearInterval(wait);patchEd()},200);
window.IsleLifeUI={profile,propose,customTrait,parts:{typeCard,effectSummary,needBars,rhythm,growth,memories}};
})();
