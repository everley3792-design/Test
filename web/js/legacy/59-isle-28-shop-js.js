/* 2.8 商店新商品插畫（原創低多邊形風） */
const TL_ART={
onigiri:`<ellipse cx="50" cy="88" rx="32" ry="5" fill="#5C4838" opacity=".1"/><path d="M50 14C60 14 88 60 88 72C88 84 76 86 50 86C24 86 12 84 12 72C12 60 40 14 50 14Z" fill="#FFFDF6"/><path d="M50 14C60 14 88 60 88 72C88 84 76 86 50 86Z" fill="#F1EBDD"/><path d="M30 58H70V86C62 87 38 87 30 86Z" fill="#35574A"/><path d="M50 58H70V86C64 86.6 56 87 50 87Z" fill="#2A473C"/><circle cx="40" cy="36" r="2" fill="#E9E1CE"/><circle cx="56" cy="30" r="2" fill="#E9E1CE"/><circle cx="47" cy="46" r="2" fill="#E9E1CE"/>`,
pancake:`<ellipse cx="50" cy="86" rx="38" ry="7" fill="#5C4838" opacity=".1"/><ellipse cx="50" cy="78" rx="36" ry="9" fill="#F4F1EA"/><ellipse cx="50" cy="70" rx="30" ry="9" fill="#C98A4F"/><ellipse cx="50" cy="66" rx="30" ry="9" fill="#E4AC6A"/><ellipse cx="50" cy="58" rx="30" ry="9" fill="#C98A4F"/><ellipse cx="50" cy="54" rx="30" ry="9" fill="#EDBB78"/><ellipse cx="50" cy="46" rx="30" ry="9" fill="#C98A4F"/><ellipse cx="50" cy="42" rx="30" ry="9" fill="#F2C887"/><path d="M30 42Q40 36 50 40Q62 44 70 40L68 50Q60 48 58 54Q54 46 44 50Q38 46 32 50Z" fill="#B8642E" opacity=".85"/><rect x="43" y="32" width="14" height="9" rx="2" fill="#FFF2B0"/><rect x="43" y="32" width="14" height="3" rx="1.5" fill="#FFFBE0"/>`,
pudding:`<ellipse cx="50" cy="86" rx="34" ry="6" fill="#5C4838" opacity=".1"/><ellipse cx="50" cy="82" rx="34" ry="7" fill="#F6F1E6"/><path d="M28 78L34 36H66L72 78Q50 86 28 78Z" fill="#F7D27A"/><path d="M50 36H66L72 78Q62 82 50 82Z" fill="#E9BC5C"/><path d="M34 36Q50 30 66 36L64 46Q57 50 52 45Q46 52 40 46Q36 50 35 44Z" fill="#9B5A2E"/><ellipse cx="50" cy="35" rx="16" ry="4" fill="#B06C38"/><circle cx="50" cy="26" r="6" fill="#E8505B"/><path d="M50 20Q53 12 58 10" stroke="#5E8C4E" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="48" cy="24" r="1.6" fill="#fff" opacity=".7"/>`,
donut:`<ellipse cx="50" cy="84" rx="34" ry="6" fill="#5C4838" opacity=".1"/><ellipse cx="50" cy="56" rx="36" ry="27" fill="#D69A5E"/><ellipse cx="50" cy="52" rx="33" ry="23" fill="#F4A9C0"/><path d="M20 56Q24 46 30 58Q34 66 40 58Q46 70 52 60Q58 70 64 58Q70 66 74 56Q78 48 80 54" stroke="#F4A9C0" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="52" rx="11" ry="7" fill="#D69A5E"/><ellipse cx="50" cy="50" rx="9" ry="5" fill="#FBF4E2"/><g stroke-width="3" stroke-linecap="round"><path d="M32 42L36 40" stroke="#FFE27A"/><path d="M62 38L66 41" stroke="#7EC8E3"/><path d="M68 54L71 51" stroke="#fff"/><path d="M28 56L31 59" stroke="#9C8CE2"/><path d="M44 36L47 34" stroke="#93C65B"/><path d="M56 64L60 64" stroke="#FFE27A"/></g>`,
sandwich:`<ellipse cx="50" cy="86" rx="34" ry="6" fill="#5C4838" opacity=".1"/><path d="M14 74L50 30L86 74Z" fill="#E9C48A"/><path d="M18 70L50 34L82 70Z" fill="#FFF3D9"/><path d="M14 74L86 74L84 80L16 80Z" fill="#C99A5E"/><path d="M18 66L82 66L80 72Q50 78 20 72Z" fill="#7CC56A"/><path d="M22 60L78 60L74 66L26 66Z" fill="#F07C7C"/><path d="M26 56L74 56L72 60L28 60Z" fill="#FFE27A"/><path d="M50 34L82 70H50Z" fill="#F3E5C6" opacity=".7"/>`,
milk:`<ellipse cx="50" cy="88" rx="26" ry="5" fill="#5C4838" opacity=".1"/><path d="M30 34L50 22L70 34V84Q50 90 30 84Z" fill="#FFFFFF"/><path d="M50 22L70 34V84Q60 87 50 87Z" fill="#E8EEF2"/><path d="M30 34L50 22L70 34L50 44Z" fill="#7EC8E3"/><path d="M38 16H62V26L50 22L38 26Z" fill="#62B8E6"/><path d="M30 50Q50 58 70 50V68Q50 76 30 68Z" fill="#62B8E6"/><circle cx="44" cy="61" r="5" fill="#fff"/><circle cx="56" cy="62" r="3" fill="#fff"/>`,
boba:`<ellipse cx="50" cy="90" rx="24" ry="4" fill="#5C4838" opacity=".1"/><path d="M58 8L52 40" stroke="#EF7F7F" stroke-width="5" stroke-linecap="round"/><path d="M28 30H72L66 86Q50 92 34 86Z" fill="#E9D2B8" opacity=".9"/><path d="M30 44H70L66 86Q50 92 34 86Z" fill="#D8AE86"/><path d="M50 44H70L66 86Q58 89 50 89Z" fill="#C9996D"/><ellipse cx="50" cy="30" rx="23" ry="6" fill="#F6EEE6"/><g fill="#4A3426"><circle cx="40" cy="80" r="4"/><circle cx="50" cy="83" r="4"/><circle cx="60" cy="80" r="4"/><circle cx="45" cy="74" r="4"/><circle cx="56" cy="74" r="4"/></g><g fill="#fff" opacity=".35"><circle cx="39" cy="79" r="1.2"/><circle cx="49" cy="82" r="1.2"/><circle cx="59" cy="79" r="1.2"/></g>`,
juice:`<ellipse cx="50" cy="88" rx="24" ry="4" fill="#5C4838" opacity=".1"/><path d="M30 28H70L64 84Q50 90 36 84Z" fill="#FFE9C2" opacity=".6"/><path d="M32 40H68L64 84Q50 90 36 84Z" fill="#FFA845"/><path d="M50 40H68L64 84Q57 87 50 87Z" fill="#F59331"/><ellipse cx="50" cy="40" rx="18" ry="4" fill="#FFC26B"/><circle cx="68" cy="28" r="12" fill="#FFB347"/><circle cx="68" cy="28" r="9" fill="#FFD38A"/><path d="M68 19V37M59 28H77M62 22L74 34M74 22L62 34" stroke="#FFB347" stroke-width="1.4"/><path d="M40 12L46 44" stroke="#7CC56A" stroke-width="4" stroke-linecap="round"/>`,
matcha:`<ellipse cx="50" cy="88" rx="30" ry="5" fill="#5C4838" opacity=".1"/><path d="M70 42Q88 40 84 58Q80 68 68 64" fill="none" stroke="#E3D7C4" stroke-width="8"/><path d="M22 36L28 80Q50 92 72 80L78 36Z" fill="#FFFDF6"/><path d="M50 36H78L72 80Q62 86 50 86Z" fill="#EFE7D7"/><ellipse cx="50" cy="36" rx="28" ry="7" fill="#9CC77A"/><path d="M38 34Q50 28 62 34Q56 40 50 36Q44 40 38 34Z" fill="#F8F5E8"/><path d="M50 34V38" stroke="#9CC77A" stroke-width="2"/><path d="M40 22Q44 14 40 8M54 22Q58 14 54 8" stroke="#E3D7C4" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`,
sailor:`<ellipse cx="50" cy="92" rx="34" ry="4" fill="#5C4838" opacity=".1"/><path d="M32 18L14 28L4 50L22 58L28 48V88H72V48L78 58L96 50L86 28L68 18Q50 26 32 18Z" fill="#FFFFFF"/><path d="M50 26Q60 24 68 18L86 28L96 50L78 58L72 48V88H50Z" fill="#EEF2F6"/><path d="M32 18L50 46L68 18L84 26L60 54H40L16 26Z" fill="#3E6FA8"/><path d="M36 22L50 42L64 22" stroke="#fff" stroke-width="2.5" fill="none"/><path d="M44 52L50 62L56 52Z" fill="#EF7F7F"/><path d="M28 72H72M28 80H72" stroke="#B8CFE6" stroke-width="3"/>`,
hoodie:`<ellipse cx="50" cy="92" rx="34" ry="4" fill="#5C4838" opacity=".1"/><path d="M34 22Q50 4 66 22L84 30L96 54L78 60L72 50V88H28V50L22 60L4 54L16 30Z" fill="#F7A9B8"/><path d="M50 12Q60 12 66 22L84 30L96 54L78 60L72 50V88H50Z" fill="#EE93A6"/><path d="M36 24Q50 40 64 24Q60 14 50 14Q40 14 36 24Z" fill="#E77F96"/><path d="M38 64H62V80H38Z" fill="#EE93A6"/><path d="M45 34V48M55 34V48" stroke="#FFF" stroke-width="2.4" stroke-linecap="round"/><path d="M46 60Q50 52 54 60Q58 54 60 60L50 72L40 60Q42 54 46 60Z" fill="#E8505B"/><g fill="#FFE27A"><circle cx="45" cy="63" r="1"/><circle cx="53" cy="64" r="1"/><circle cx="50" cy="67" r="1"/></g><path d="M48 54Q50 50 53 52" stroke="#5E8C4E" stroke-width="2" fill="none"/>`,
pajama:`<ellipse cx="50" cy="92" rx="34" ry="4" fill="#5C4838" opacity=".1"/><path d="M32 18L14 28L4 50L22 58L28 48V88H72V48L78 58L96 50L86 28L68 18Q50 28 32 18Z" fill="#8C9EDF"/><path d="M50 26Q60 24 68 18L86 28L96 50L78 58L72 48V88H50Z" fill="#7B8DD1"/><path d="M38 18L50 34L62 18" fill="#B8C4F0"/><g fill="#FFE27A"><path d="M36 50l2 4 4 .5-3 2.6 1 4-4-2-4 2 1-4-3-2.6 4-.5Z"/><path d="M62 66l1.6 3 3 .4-2.3 2 .7 3-3-1.6-3 1.6.7-3-2.3-2 3-.4Z"/><circle cx="60" cy="42" r="2"/><circle cx="40" cy="76" r="2"/></g><g fill="#fff"><circle cx="50" cy="44" r="2"/><circle cx="50" cy="58" r="2"/><circle cx="50" cy="72" r="2"/></g>`,
glasses:`<ellipse cx="50" cy="78" rx="38" ry="5" fill="#5C4838" opacity=".1"/><circle cx="30" cy="52" r="16" fill="#DDF1F8" opacity=".7" stroke="#8A6648" stroke-width="5"/><circle cx="70" cy="52" r="16" fill="#DDF1F8" opacity=".7" stroke="#8A6648" stroke-width="5"/><path d="M46 50Q50 44 54 50" stroke="#8A6648" stroke-width="5" fill="none"/><path d="M14 48L4 42M86 48L96 42" stroke="#8A6648" stroke-width="5" stroke-linecap="round"/><path d="M22 46L28 42M62 46L68 42" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
flowerclip:`<ellipse cx="50" cy="84" rx="30" ry="5" fill="#5C4838" opacity=".1"/><rect x="16" y="56" width="68" height="10" rx="5" fill="#C9A77C"/><rect x="16" y="56" width="68" height="4" rx="2" fill="#E3C79E"/><g fill="#FFB7C9"><circle cx="50" cy="30" r="12"/><circle cx="67" cy="42" r="12"/><circle cx="61" cy="61" r="12"/><circle cx="39" cy="61" r="12"/><circle cx="33" cy="42" r="12"/></g><g fill="#F59AB0"><circle cx="61" cy="61" r="12"/><circle cx="67" cy="42" r="6"/></g><circle cx="50" cy="48" r="9" fill="#FFE27A"/><circle cx="47" cy="45" r="2.4" fill="#FFF6C9"/>`,
scarf:`<ellipse cx="50" cy="90" rx="32" ry="4" fill="#5C4838" opacity=".1"/><path d="M14 30Q50 50 86 30L84 46Q50 66 16 46Z" fill="#EF7F7F"/><path d="M50 40Q70 38 86 30L84 46Q66 56 50 56Z" fill="#E06A6E"/><path d="M58 48L70 86L56 88L48 52Z" fill="#EF7F7F"/><path d="M62 60L72 58M65 70L75 68" stroke="#FFF3E0" stroke-width="4"/><path d="M22 36Q50 54 80 36M20 42Q50 60 82 42" stroke="#FFF3E0" stroke-width="3" fill="none"/><path d="M58 88L56 94M62 88L61 95M66 87L66 94" stroke="#E06A6E" stroke-width="2.4" stroke-linecap="round"/>`,
beret:`<ellipse cx="50" cy="82" rx="38" ry="6" fill="#5C4838" opacity=".1"/><path d="M10 56Q10 24 50 22Q92 22 90 52Q90 64 70 68Q50 72 30 68Q10 66 10 56Z" fill="#C0504F"/><path d="M50 22Q92 22 90 52Q90 64 70 68Q60 70 50 70Z" fill="#A84243"/><path d="M24 66Q50 76 76 66L74 74Q50 82 26 74Z" fill="#7A2E33"/><path d="M50 22V14" stroke="#7A2E33" stroke-width="5" stroke-linecap="round"/><path d="M26 40Q40 30 56 32" stroke="#E07B79" stroke-width="3" fill="none" stroke-linecap="round"/>`,
mushroom:`<ellipse cx="50" cy="90" rx="30" ry="5" fill="#5C4838" opacity=".12"/><path d="M36 52H64L68 88Q50 94 32 88Z" fill="#FFF1DC"/><path d="M50 52H64L68 88Q60 91 50 91Z" fill="#EBD9BE"/><path d="M8 54Q12 14 50 12Q88 14 92 54Q72 62 50 60Q28 62 8 54Z" fill="#EF6F6C"/><path d="M50 12Q88 14 92 54Q72 62 50 60Z" fill="#DB5A5A"/><g fill="#FFF8EC"><ellipse cx="32" cy="32" rx="8" ry="6"/><ellipse cx="58" cy="24" rx="6" ry="4.5"/><ellipse cx="72" cy="42" rx="7" ry="5"/><ellipse cx="46" cy="46" rx="5" ry="3.6"/><ellipse cx="20" cy="48" rx="4" ry="3"/></g>`,
sofa:`<ellipse cx="50" cy="90" rx="44" ry="5" fill="#5C4838" opacity=".12"/><path d="M14 40Q14 22 32 22Q42 12 54 20Q66 12 76 22Q90 22 88 40V62H14Z" fill="#DCEBF7"/><path d="M54 20Q66 12 76 22Q90 22 88 40V62H54Z" fill="#C8DCEE"/><path d="M6 52Q6 42 16 44Q22 40 26 48V78H8Q4 66 6 52Z" fill="#E9F3FB"/><path d="M94 52Q96 42 86 44Q80 40 76 48V78H94Q98 66 94 52Z" fill="#C8DCEE"/><path d="M22 58H80V78H22Z" fill="#E9F3FB"/><path d="M51 58H80V78H51Z" fill="#D7E6F3"/><rect x="14" y="78" width="6" height="8" rx="2" fill="#C9A77C"/><rect x="80" y="78" width="6" height="8" rx="2" fill="#A98760"/>`,
starlamp:`<ellipse cx="50" cy="90" rx="26" ry="5" fill="#5C4838" opacity=".12"/><circle cx="50" cy="40" r="34" fill="#FFE27A" opacity=".18"/><path d="M50 10L59 30L81 32L64 47L69 69L50 57L31 69L36 47L19 32L41 30Z" fill="#FFE27A"/><path d="M50 10L59 30L81 32L64 47L69 69L50 57Z" fill="#F6C945"/><path d="M50 22L54 32L44 34Z" fill="#FFF7C9"/><path d="M47 68H53V84H47Z" fill="#B29A7C"/><path d="M34 84H66Q66 90 50 90Q34 90 34 84Z" fill="#8A6648"/>`,
cactus:`<ellipse cx="50" cy="90" rx="26" ry="5" fill="#5C4838" opacity=".12"/><path d="M30 62H70L66 88Q50 94 34 88Z" fill="#E3A07A"/><path d="M50 62H70L66 88Q58 91 50 91Z" fill="#CC8762"/><rect x="28" y="58" width="44" height="8" rx="3" fill="#F4BE8E"/><path d="M40 58V30Q40 18 50 18Q60 18 60 30V58Z" fill="#7CC56A"/><path d="M50 18Q60 18 60 30V58H50Z" fill="#5FAE52"/><path d="M40 44H32Q26 44 26 36V30Q26 26 30 26Q34 26 34 30V36H40Z" fill="#7CC56A"/><path d="M60 38H68Q74 38 74 30V26Q74 22 70 22Q66 22 66 26V30H60Z" fill="#5FAE52"/><circle cx="50" cy="16" r="5" fill="#F59AB0"/><circle cx="50" cy="16" r="2" fill="#FFE27A"/><g stroke="#E8F5D9" stroke-width="1.4"><path d="M45 28L43 27M45 40L43 39M55 34L57 33M55 48L57 47"/></g>`,
berryrug:`<path d="M6 60L50 34L94 58L50 86Z" fill="#F7B3C2"/><path d="M6 60V65L50 91L94 63V58L50 86Z" fill="#E28EA2"/><path d="M18 60L50 42L82 58L50 76Z" fill="#FFF3F5"/><path d="M30 60L50 49L70 58L50 69Z" fill="#F7B3C2"/><g fill="#E8505B"><circle cx="50" cy="58" r="4"/><circle cx="34" cy="52" r="2.4"/><circle cx="66" cy="52" r="2.4"/><circle cx="34" cy="66" r="2.4"/><circle cx="66" cy="66" r="2.4"/></g><path d="M48 54Q50 51 53 53" stroke="#5E8C4E" stroke-width="1.6" fill="none"/>`,
ball:`<ellipse cx="50" cy="88" rx="28" ry="5" fill="#5C4838" opacity=".12"/><circle cx="50" cy="52" r="32" fill="#FFF8EC"/><path d="M50 20A32 32 0 0 1 82 52H50Z" fill="#EF7F7F"/><path d="M82 52A32 32 0 0 1 50 84V52Z" fill="#62B8E6"/><path d="M50 84A32 32 0 0 1 18 52H50Z" fill="#FFE27A"/><path d="M18 52A32 32 0 0 1 50 20V52Z" fill="#93C65B"/><circle cx="50" cy="52" r="7" fill="#FFF8EC"/><ellipse cx="38" cy="34" rx="8" ry="4" fill="#fff" opacity=".55" transform="rotate(-30 38 34)"/>`,
pinwheel:`<ellipse cx="50" cy="92" rx="18" ry="3.5" fill="#5C4838" opacity=".12"/><path d="M48 44H52V92H48Z" fill="#C9A77C"/><path d="M50 42L50 8Q72 10 72 30Z" fill="#EF7F7F"/><path d="M50 42L84 42Q82 64 62 64Z" fill="#62B8E6"/><path d="M50 42L50 76Q28 74 28 54Z" fill="#FFE27A"/><path d="M50 42L16 42Q18 20 38 20Z" fill="#93C65B"/><path d="M50 42L72 30L50 26Z" fill="#000" opacity=".08"/><path d="M50 42L62 64L66 46Z" fill="#000" opacity=".08"/><circle cx="50" cy="42" r="4" fill="#FFF8EC" stroke="#C9A77C" stroke-width="1.5"/>`,
teddy:`<ellipse cx="50" cy="90" rx="30" ry="5" fill="#5C4838" opacity=".12"/><circle cx="28" cy="22" r="10" fill="#C99063"/><circle cx="72" cy="22" r="10" fill="#B37E54"/><circle cx="28" cy="22" r="5" fill="#F0C9A4"/><circle cx="72" cy="22" r="5" fill="#E3B48C"/><ellipse cx="50" cy="68" rx="26" ry="22" fill="#C99063"/><path d="M50 46A26 22 0 0 1 76 68A26 22 0 0 1 50 90Z" fill="#B37E54"/><circle cx="50" cy="36" r="22" fill="#D59D6E"/><path d="M50 14A22 22 0 0 1 72 36A22 22 0 0 1 50 58Z" fill="#C99063"/><ellipse cx="50" cy="44" rx="10" ry="7" fill="#F4D7B8"/><ellipse cx="50" cy="41" rx="3.4" ry="2.4" fill="#5C4838"/><circle cx="41" cy="33" r="2.6" fill="#5C4838"/><circle cx="59" cy="33" r="2.6" fill="#5C4838"/><ellipse cx="50" cy="72" rx="12" ry="10" fill="#F0C9A4"/><path d="M40 56L50 62L60 56L58 64L50 60L42 64Z" fill="#EF7F7F"/>`,
bubbles:`<ellipse cx="40" cy="90" rx="18" ry="4" fill="#5C4838" opacity=".12"/><path d="M30 46H50V86Q40 92 30 86Z" fill="#BFE6FF" opacity=".85"/><path d="M40 46H50V86Q45 89 40 89Z" fill="#9AD4F5"/><rect x="31" y="40" width="18" height="8" rx="2" fill="#9C8CE2"/><path d="M40 40V22" stroke="#9C8CE2" stroke-width="2.4"/><circle cx="40" cy="16" r="7" fill="none" stroke="#9C8CE2" stroke-width="2.4"/><g fill="#E8F6FF" stroke="#9AD4F5" stroke-width="1.6"><circle cx="66" cy="30" r="12" opacity=".8"/><circle cx="78" cy="56" r="8" opacity=".8"/><circle cx="62" cy="64" r="5" opacity=".8"/></g><path d="M60 24Q63 21 67 22" stroke="#fff" stroke-width="2" fill="none"/>`,
cookies:`<ellipse cx="50" cy="88" rx="38" ry="5" fill="#5C4838" opacity=".12"/><path d="M12 44L50 30L88 44V80L50 92L12 80Z" fill="#F7E3C4"/><path d="M50 56L88 44V80L50 92Z" fill="#EBCFA6"/><path d="M12 44L50 56L88 44L50 30Z" fill="#FFF3DE"/><g fill="#D59D6E"><ellipse cx="34" cy="44" rx="9" ry="5"/><ellipse cx="52" cy="40" rx="9" ry="5"/><ellipse cx="68" cy="46" rx="9" ry="5"/><ellipse cx="48" cy="50" rx="9" ry="5"/></g><g fill="#6E4A33"><circle cx="32" cy="43" r="1.4"/><circle cx="54" cy="39" r="1.4"/><circle cx="66" cy="45" r="1.4"/><circle cx="47" cy="49" r="1.4"/></g><path d="M50 56V92" stroke="#EF7F7F" stroke-width="5"/><path d="M12 62L50 74L88 62" stroke="#EF7F7F" stroke-width="5" fill="none"/><path d="M50 30Q40 18 34 24Q32 30 50 30Q68 30 66 24Q60 18 50 30Z" fill="#EF7F7F"/>`,
clover:`<ellipse cx="50" cy="90" rx="20" ry="4" fill="#5C4838" opacity=".12"/><path d="M50 52Q54 72 46 90" stroke="#5FAE52" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#7CC56A"><path d="M50 50Q30 50 30 34Q30 22 40 24Q48 26 50 36Q52 26 60 24Q70 22 70 34Q70 50 50 50Z"/><path d="M50 50Q50 70 34 70Q22 70 24 60Q26 52 36 50Q26 48 24 40Q22 30 34 30Q50 30 50 50Z" transform="rotate(90 50 50)"/></g><g fill="#93D27B"><path d="M50 50Q30 50 30 34Q30 22 40 24Q48 26 50 36Z"/><path d="M50 50Q70 50 70 66Q70 78 60 76Q52 74 50 64Z"/></g><circle cx="50" cy="50" r="3.4" fill="#FFE27A"/><g fill="#FFE27A"><circle cx="20" cy="20" r="2"/><circle cx="80" cy="18" r="2.4"/><circle cx="84" cy="70" r="1.6"/></g>`,
candyjar:`<ellipse cx="50" cy="90" rx="28" ry="5" fill="#5C4838" opacity=".12"/><path d="M26 34H74V80Q74 90 50 90Q26 90 26 80Z" fill="#E8F6FF" opacity=".75"/><path d="M50 34H74V80Q74 90 50 90Z" fill="#D2ECFA" opacity=".8"/><g><path d="M38 62l3 6 6 .8-4.4 4 1.2 6-5.8-3-5.8 3 1.2-6-4.4-4 6-.8Z" fill="#FFE27A"/><path d="M60 54l2.6 5 5.4.7-3.9 3.6 1 5.3-5.1-2.6-5.1 2.6 1-5.3-3.9-3.6 5.4-.7Z" fill="#F59AB0"/><path d="M56 74l2 4 4.4.6-3.2 2.9.8 4.3-4-2.1-4 2.1.8-4.3-3.2-2.9 4.4-.6Z" fill="#9C8CE2"/><path d="M42 44l2 4 4.4.6-3.2 2.9.8 4.3-4-2.1-4 2.1.8-4.3-3.2-2.9 4.4-.6Z" fill="#7EC8E3"/></g><rect x="24" y="26" width="52" height="10" rx="4" fill="#EF7F7F"/><rect x="34" y="18" width="32" height="10" rx="4" fill="#F59AB0"/><path d="M32 42V76" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,
musicbox:`<ellipse cx="50" cy="90" rx="38" ry="5" fill="#5C4838" opacity=".12"/><path d="M14 50L50 38L86 50V80L50 92L14 80Z" fill="#C49A6C"/><path d="M50 62L86 50V80L50 92Z" fill="#A87E54"/><path d="M14 50L50 62L86 50L50 38Z" fill="#E0BB8A"/><path d="M14 50L50 38L50 18L14 30Z" fill="#B98D60"/><path d="M18 33L46 23V37L18 47Z" fill="#F7D9E4"/><path d="M24 36L30 34L32 40L26 42Z" fill="#EC8DB6"/><path d="M36 30L42 28V34L36 36Z" fill="#9C8CE2"/><path d="M50 62V92" stroke="#8A6648" stroke-width="2"/><circle cx="68" cy="66" r="3" fill="#FFE27A"/><path d="M86 64H94" stroke="#8A6648" stroke-width="4" stroke-linecap="round"/><path d="M94 58V70" stroke="#8A6648" stroke-width="4" stroke-linecap="round"/><path d="M66 18V34M66 18L76 16V30" stroke="#9C8CE2" stroke-width="2.4" fill="none"/><circle cx="63" cy="35" r="3.4" fill="#9C8CE2"/><circle cx="73" cy="31" r="3.4" fill="#9C8CE2"/>`
};
/* ===== 2.8 島嶼百貨：分類店舖、每日精選、限時特賣、每日進貨、數量購買 =====
   沿用既有 Cat（商品目錄）、Items（物品）、Econ（交易日誌）、Wallet（星幣）、Inv（發貨）。
   不另建庫存：所有增加數量都經過 Econ 交易日誌 → Inv.grant。 */
(()=>{'use strict';
const I=n=>Math.max(0,Math.floor(+n)||0),reduce=()=>document.documentElement.dataset.motion==='reduce';
const hash=s=>{s=String(s);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967295};
const dn=()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)};
const CATS=[['food','食物','美味市集','#F4A65B'],['drink','飲料','飲料吧','#5DB3E0'],['wear','服裝','服飾店','#45B596'],['acc','飾品','飾品屋','#E884AE'],['furn','家具','家具店','#86BC4E'],['toy','玩具','玩具屋','#9585DD'],['gift','禮物','禮品店','#EC7878']];
const CC=Object.fromEntries(CATS.map(c=>[c[0],c[3]]));CC.custom='#E0AD35';
const CN=Object.fromEntries(CATS.map(c=>[c[0],c[1]]));CN.custom='自訂';
const CICON={food:'apple',drink:'cocoa',wear:'shirt',acc:'bow',furn:'chair',toy:'yarn',gift:'gift'};
const MOOD={happy:'開心',calm:'平靜',excited:'興奮',shy:'害羞',tired:'放鬆',bored:'無聊',sad:'感動',angry:'激動'};

/* ---------- 新商品（沿用 builtin 物品格式，數量一律從 0 開始） ---------- */
const NEW=[
 ['onigiri','鮭魚飯糰','food',40,'外層海苔酥脆，裡面包著鹹香鮭魚。',['飯糰','鹹','米'],{hearts:2,mood:'happy'},0],
 ['pudding','焦糖布丁','food',70,'搖一搖會晃動的滑嫩布丁，頂端有一顆小櫻桃。',['甜點','甜','布丁'],{hearts:3,mood:'happy'},0],
 ['pancake','奶油鬆餅塔','food',90,'三層鬆餅淋上楓糖，奶油慢慢融化。',['甜點','早餐','甜'],{hearts:3,mood:'excited'},1],
 ['donut','草莓糖霜甜甜圈','food',65,'粉紅糖霜撒滿彩色糖粒。',['甜點','甜','草莓'],{hearts:2,mood:'excited'},1],
 ['sandwich','野餐三明治','food',75,'夾著番茄、蛋與生菜，適合帶去海邊。',['輕食','野餐'],{hearts:2,mood:'calm'},1],
 ['milk','鮮奶小瓶','drink',35,'冰冰涼涼的鮮奶，喝完會長高喔。',['冷飲','牛奶'],{hearts:2,mood:'calm'},0],
 ['boba','黑糖珍珠奶茶','drink',85,'Q彈珍珠配上濃濃奶香。',['冷飲','甜','奶茶'],{hearts:3,mood:'excited'},1],
 ['juice','現榨柳橙汁','drink',55,'滿滿維他命，一口就有精神。',['冷飲','水果'],{hearts:2,mood:'excited'},1],
 ['matcha','抹茶拿鐵','drink',70,'微苦回甘的抹茶，配上綿密奶泡。',['熱飲','抹茶'],{hearts:2,mood:'calm'},1],
 ['hoodie','草莓連帽衣','wear',280,'粉嫩的草莓圖案連帽衣，暖呼呼的。',['服裝','草莓','休閒'],{hearts:2,mood:'happy'},0],
 ['sailor','條紋水手服','wear',320,'清爽的藍白配色，最適合海風。',['服裝','水手','夏天'],{hearts:2,mood:'excited'},1],
 ['pajama','星星睡衣','wear',300,'柔軟的星空睡衣，穿上就想睡覺。',['服裝','睡衣','星星'],{hearts:2,mood:'calm'},1],
 ['glasses','圓框眼鏡','acc',160,'看起來聰明了三倍的圓眼鏡。',['飾品','眼鏡'],{hearts:2,mood:'shy'},0],
 ['flowerclip','小花髮夾','acc',120,'別在頭上，整天都香香的。',['飾品','花','髮夾'],{hearts:2,mood:'happy'},1],
 ['scarf','毛線圍巾','acc',180,'手織的紅色圍巾，冬天的好夥伴。',['飾品','圍巾','冬天'],{hearts:2,mood:'calm'},1],
 ['beret','紅色貝雷帽','acc',190,'戴上就變成小畫家。',['飾品','帽子'],{hearts:2,mood:'excited'},1],
 ['sofa','雲朵沙發','furn',520,'像雲一樣柔軟的沙發，一坐下就不想起來。',['家具','沙發','柔軟'],{hearts:2,mood:'calm'},0],
 ['mushroom','蘑菇小凳','furn',220,'紅色蘑菇造型的小凳子，森林風必備。',['家具','凳子','森林'],{hearts:2,mood:'happy'},1],
 ['starlamp','星星夜燈','furn',280,'點亮後會散發柔和星光的夜燈。',['家具','燈','星星'],{hearts:2,mood:'calm'},1],
 ['cactus','開花仙人掌','furn',150,'頭上開著小粉花的仙人掌盆栽。',['家具','植物','盆栽'],{hearts:2,mood:'calm'},1],
 ['berryrug','草莓圓地毯','furn',200,'草莓圖案的可愛地毯。',['家具','地毯','草莓'],{hearts:2,mood:'happy'},1],
 ['ball','彩虹皮球','toy',110,'四種顏色的軟皮球，可以重複玩。',['玩具','球','彩虹'],{hearts:2,mood:'excited'},0],
 ['pinwheel','紙風車','toy',90,'一吹就轉的四色風車。',['玩具','風車'],{hearts:2,mood:'happy'},1],
 ['teddy','小熊玩偶','toy',230,'軟綿綿的小熊，抱著睡最安心。',['玩具','玩偶','熊'],{hearts:3,mood:'calm'},1],
 ['bubbles','泡泡水','toy',70,'吹出好多閃閃發亮的泡泡。',['玩具','泡泡'],{hearts:2,mood:'excited'},1],
 ['cookies','手作餅乾禮盒','gift',130,'綁著紅緞帶的餅乾禮盒，送給重要的人。',['禮物','餅乾','手作'],{hearts:4,mood:'happy'},0],
 ['clover','幸運四葉草','gift',110,'找了好久才找到的幸運草。',['禮物','幸運','植物'],{hearts:4,mood:'shy'},1],
 ['candyjar','星星糖罐','gift',140,'裝滿彩色星星糖的玻璃罐。',['禮物','糖果','星星'],{hearts:4,mood:'excited'},1],
 ['musicbox','木頭音樂盒','gift',260,'打開會響起溫柔的旋律。',['禮物','音樂','木頭'],{hearts:5,mood:'shy'},1]
];
const PFX='builtin_tl_',ROT=new Set(NEW.filter(x=>x[7]).map(x=>PFX+x[0]));
const svgUrl=(()=>{const c={};return k=>c[k]||(c[k]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${TL_ART[k]}</svg>`))})();
{const oi=Items.icon;Items.icon=function(i){if(i&&typeof i.id==='string'&&i.id.startsWith(PFX)&&!i.img){const k=i.id.slice(PFX.length);if(TL_ART[k])return `<img class="mini-art" src="${svgUrl(k)}" alt="" draggable="false">`}return oi.apply(this,arguments)}}
function install(){let ch=0;const del=Cat.d.delisted||[];
 for(const [k,name,cat,price,desc,tags,fx] of NEW){const id=PFX+k;if(del.includes(id))continue;let it=Items.get(id);
  if(!it){it=Items.norm({id,name,cat,qty:0,builtin:1,tags,desc,consume:['food','drink','gift'].includes(cat),target:cat==='furn'?'scene':['wear','acc'].includes(cat)?'char':'both',uses:[{type:cat,fx}]});it.qty=0;Items.d.items.push(it);ch=1}
  if(!Cat.d.products.some(p=>p.itemId===id)){const p=Cat.fromItem(it);p.price=price;p.at=Date.now()-864e5*30;Cat.d.products.push(p);ch=1}}
 if(ch){Items.save(true);Cat.save();Items.emit()}}
/* 工坊作品與任何新物品：自動登錄商店（數量不變） */
function autoRegister(){let ch=0;const del=Cat.d.delisted||[];for(const i of Items.d.items){if(del.includes(i.id))continue;if(!Cat.d.products.some(p=>p.itemId===i.id)){const p=Cat.fromItem(i);p.at=Date.now();Cat.d.products.push(p);ch=1}}if(ch)Cat.save()}

/* ---------- 每日進貨與特價（以日期為種子：重開、重整都不會刷新） ---------- */
let cache={k:''};
function today(){const n=dn(),blk=Math.floor(new Date().getHours()/6),k=n+':'+blk;if(cache.k===k)return cache;
 const pool=[...ROT].filter(id=>Items.get(id)),byCat={};pool.forEach(id=>{const c=Items.get(id).cat;(byCat[c]=byCat[c]||[]).push(id)});
 const stock=new Set();Object.values(byCat).forEach(a=>{a.sort((x,y)=>hash(n+'r'+x)-hash(n+'r'+y));a.slice(0,Math.max(1,Math.ceil(a.length/2))).forEach(id=>stock.add(id))});
 const ok=p=>{const it=Items.get(p.itemId);return it&&!(p.cond&&!p.cond.ok)&&p.price>0&&(!ROT.has(p.itemId)||stock.has(p.itemId))};
 const list=Cat.d.products.filter(ok),pick=(salt,ex)=>list.filter(p=>!ex.has(p.id)).sort((a,b)=>hash(salt+a.id)-hash(salt+b.id));
 const ex=new Set(),feat=pick(n+'f',ex)[0];if(feat)ex.add(feat.id);
 const flash=pick(k+'s',ex).filter(p=>Items.get(p.itemId).cat!==(feat&&Items.get(feat.itemId).cat)).slice(0,3);
 const end=new Date();end.setHours((blk+1)*6,0,0,0);
 cache={k,day:n,stock,feat:feat?feat.id:null,flash:flash.map(p=>p.id),until:end.getTime()};return cache}
const inStock=p=>!p||!ROT.has(p.itemId)||today().stock.has(p.itemId);
const offOf=p=>{if(!p)return 0;const t=today();return p.id===t.feat?.2:t.flash.includes(p.id)?.3:0};
{const op=Cat.price.bind(Cat);Cat.price=function(p){const base=op(p);const off=offOf(p);if(!off||!(p.price>0))return base;return Math.min(base,Math.max(1,Math.round(p.price*(1-off))))}}

/* ---------- 交易：一次購買多個，仍走同一份交易日誌 ---------- */
Econ.buyN=function(pid,n,from){n=I(n);const p=Cat.prod(pid),it=p&&Items.get(p.itemId);
 if(!p||!it)return {ok:false,why:'gone'};if(Shop.busy)return {ok:false,why:'busy'};
 if(n<1||n>99)return {ok:false,why:'qty'};if(!inStock(p))return {ok:false,why:'stock'};
 const unit=I(Cat.price(p)),room=999-I(it.qty);if(n>room)return {ok:false,why:'cap'};
 const total=unit*n;if(Wallet.bal()<total)return {ok:false,why:'coins',need:total-Wallet.bal()};
 Shop.busy=true;setTimeout(()=>{Shop.busy=false},450);
 const e=this.s,rid='b_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
 Eco.v.coins=Wallet.bal()-total;e.pend.push({id:rid,items:[{id:it.id,n}]});this.log('shop',-total,rid);
 Cat.d.tx.unshift({t:Date.now(),id:it.id,price:total,n,bal:Wallet.bal()});Cat.d.tx.length=Math.min(Cat.d.tx.length,60);
 Cat.d.bought=Cat.d.bought||{};Cat.d.bought[it.id]=I(Cat.d.bought[it.id])+n;Cat.save();
 Eco.save();this.flush();HUD.refresh();return {ok:true,total,unit,n,qty:I(Items.get(it.id)?.qty)}};
{const ob=Econ.buy.bind(Econ);Econ.buy=function(pid,from){const p=Cat.prod(pid);if(p&&!inStock(p)){toast('這件商品今天沒有進貨，明天再來看看吧','info');return false}return ob(pid,from)}}

/* ---------- 共用 ---------- */
const coinSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#F2C25B"/><circle cx="12" cy="12" r="7" fill="#FFDD8A" stroke="#D39A35" stroke-width="1.2"/><path d="M12 7l1.4 3.4L17 12l-3.6 1.5L12 17l-1.5-3.5L7 12l3.5-1.6Z" fill="#D39A35"/></svg>';
const coin=()=>'<i class="tls-coin">'+coinSvg+'</i>';
const isMine=(p,it)=>!it.builtin&&['draw','img','pack','import','migrated'].includes(p.src);
const isNew=(p,it)=>(isMine(p,it)&&Date.now()-(p.at||0)<3*864e5)||(ROT.has(p.itemId)&&today().stock.has(p.itemId)&&!I(it.qty));
const fmtT=ms=>{ms=Math.max(0,ms);const h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};
const KEEPER=`<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="#FFFDF7" stroke="#EADFCB" stroke-width="1.2"><circle cx="20" cy="20" r="9"/><circle cx="32" cy="14" r="10"/><circle cx="44" cy="20" r="9"/><circle cx="14" cy="32" r="8"/><circle cx="50" cy="32" r="8"/></g><ellipse cx="13" cy="36" rx="5" ry="8" fill="#C9A27E" transform="rotate(30 13 36)"/><ellipse cx="51" cy="36" rx="5" ry="8" fill="#B98F6A" transform="rotate(-30 51 36)"/><ellipse cx="32" cy="38" rx="15" ry="14" fill="#F4DFC7"/><path d="M32 24A15 14 0 0 1 47 38A15 14 0 0 1 32 52Z" fill="#EBD2B6"/><ellipse cx="26" cy="37" rx="2.1" ry="2.8" fill="#5C4838"/><ellipse cx="38" cy="37" rx="2.1" ry="2.8" fill="#5C4838"/><circle cx="26.7" cy="36" r=".8" fill="#fff"/><circle cx="38.7" cy="36" r=".8" fill="#fff"/><ellipse cx="22" cy="43" rx="3" ry="2" fill="#F5A3B5" opacity=".7"/><ellipse cx="42" cy="43" rx="3" ry="2" fill="#F5A3B5" opacity=".7"/><path d="M29 44Q32 47 35 44" stroke="#5C4838" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M18 52Q32 46 46 52L48 64H16Z" fill="#45B596"/><path d="M26 54H38V64H26Z" fill="#5FC6A6"/><circle cx="32" cy="57" r="2.2" fill="#FFE27A"/><circle cx="32" cy="16" r="3" fill="#FFE27A" stroke="#E3AC23" stroke-width="1"/></svg>`;
const BAG=`<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M14 28H66L62 74H18Z" fill="#E7C48F"/><path d="M40 28H66L62 74H40Z" fill="#D6AF78"/><path d="M14 28L22 20H58L66 28Z" fill="#F3D9AA"/><path d="M28 32Q28 14 40 14Q52 14 52 32" stroke="#B98D60" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 46H50M30 54H44" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/><circle cx="40" cy="62" r="6" fill="#EC7878"/><path d="M37.5 62l1.8 1.8 3.4-3.6" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
const SEARCH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
function lineFor(){const ph=Home?.stage?.root?.dataset.phase||'day',t=today(),f=t.feat&&Cat.prod(t.feat),fn=f&&Items.get(f.itemId)?.name;
 const L={dawn:['早安～剛進了一批新鮮的貨喔！','一早就來逛，真是好習慣～'],day:[fn?`歡迎光臨！今天的精選是「${fn}」喔～`:'歡迎光臨！慢慢逛～','限時特賣每 6 小時換一次喔！','有喜歡的就帶回家吧～'],dusk:['傍晚好～特賣快要換檔囉！','逛完記得去看夕陽喔～'],night:['夜深了，慢慢逛沒關係～','晚上也有營業，辛苦啦！']};
 const a=L[ph]||L.day;return a[Math.floor(Math.random()*a.length)]}

/* ---------- 商店主畫面 ---------- */
const F=Shop.F;F.c=F.c&&F.c!=='all'?F.c:'pick';F.sort=F.sort||'rec';F.af=!!F.af;F.un=!!F.un;F.sale=!!F.sale;
Shop.open=function(tab){const existing=document.querySelector('.sheet:not([data-closing]) #spB');if(existing)return;
 F.q='';if(tab)F.c=tab;let off=null,tick=0;
 const s=openSheet(`<div class="sh-body tl-shop" id="spB">
  <div class="tls-awning" aria-hidden="true"></div>
  <div class="tls-head"><button class="tls-keeper" type="button" aria-label="店長">${KEEPER}</button><div class="tls-talk"><b>棉棉店長</b><span data-line></span></div><div class="tls-wallet" aria-label="星幣">${coin()}<b data-bal>0</b></div></div>
  <div class="tls-search"><span class="tls-si">${SEARCH}</span><input id="spQ" type="search" enterkeyhint="search" autocomplete="off" aria-label="搜尋商品" placeholder="搜尋商品、標籤…"><button class="tls-clear" type="button" data-clear aria-label="清除搜尋" hidden>×</button><button class="tls-fbtn" type="button" data-fbtn aria-expanded="false" aria-label="排序與篩選">${ic('sliders')}<i data-fdot hidden></i></button></div>
  <div class="tls-filter" data-fp hidden><div class="tls-frow"><span>排序</span>${[['rec','推薦'],['low','價格低'],['high','價格高'],['new','新上架']].map(([k,v])=>`<button class="tls-fc" data-sort="${k}">${v}</button>`).join('')}</div><div class="tls-frow"><span>只看</span><button class="tls-fc" data-tg="af">買得起</button><button class="tls-fc" data-tg="un">未持有</button><button class="tls-fc" data-tg="sale">特價中</button></div></div>
  <div class="tls-tabs" role="tablist" data-tabs></div>
  <div class="tls-scroll" id="spG" data-scroll></div></div>`,{cls:'tls-sheet',onClose:()=>{off&&off();clearInterval(tick)}});
 const B=s.el.querySelector('#spB'),G=B.querySelector('[data-scroll]'),Q=B.querySelector('#spQ');s.el.setAttribute('aria-label','島嶼百貨');
 const say=t=>{const l=B.querySelector('[data-line]');l.textContent=t||lineFor();if(!reduce())l.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'})};say();
 const bal=animBal(B.querySelector('[data-bal]'));bal(Wallet.bal(),true);
 const mineAny=()=>Cat.d.products.some(p=>{const it=Items.get(p.itemId);return it&&isMine(p,it)});
 const drawTabs=()=>{const tabs=[['pick','今日','sparkle',null],['all','全部','grid',null],...CATS.map(c=>[c[0],c[1],null,c[0]])];if(mineAny())tabs.push(['mine','工坊','palette',null]);
  const T=B.querySelector('[data-tabs]');const sig=tabs.map(t=>t[0]).join()+F.c;if(T._sig===sig)return;T._sig=sig;
  T.innerHTML=tabs.map(([k,l,g,c])=>`<button class="tls-tab ${F.c===k?'on':''}" role="tab" aria-selected="${F.c===k}" data-tab="${k}" style="--c:${CC[c]||(k==='mine'?CC.custom:'var(--accent)')}"><span class="tls-ti">${c?MiniArt.img(CICON[c]):ic(g)}</span><b>${l}</b></button>`).join('');
  const on=T.querySelector('.on');if(on)on.scrollIntoView({inline:'center',block:'nearest',behavior:'instant'})};
 const drawFilters=()=>{B.querySelectorAll('[data-sort]').forEach(b=>b.classList.toggle('on',b.dataset.sort===F.sort));B.querySelectorAll('[data-tg]').forEach(b=>b.classList.toggle('on',!!F[b.dataset.tg]));B.querySelector('[data-fdot]').hidden=!(F.sort!=='rec'||F.af||F.un||F.sale)};
 const visible=p=>{const it=Items.get(p.itemId);return it&&!(p.cond&&!p.cond.ok)};
 const filt=L=>{const q=F.q.trim().toLowerCase();let r=L.filter(visible);
  if(q)r=r.filter(p=>{const it=Items.get(p.itemId);return (it.name+' '+it.tags.join(' ')+' '+(it.desc||'')+' '+(CN[it.cat]||'')).toLowerCase().includes(q)});
  if(F.af)r=r.filter(p=>inStock(p)&&Cat.price(p)<=Wallet.bal());if(F.un)r=r.filter(p=>!I(Items.get(p.itemId).qty));if(F.sale)r=r.filter(p=>Cat.price(p)<p.price);
  const order=CATS.map(c=>c[0]).concat('custom'),rank=p=>{const it=Items.get(p.itemId);return (inStock(p)?0:1e6)+(Cat.price(p)<p.price?0:1e5)+(isNew(p,it)?0:5e4)+order.indexOf(it.cat)*1e3+Cat.price(p)/1e3};
  const by={rec:(a,b)=>rank(a)-rank(b),low:(a,b)=>(inStock(a)?0:1e7)+Cat.price(a)-(inStock(b)?0:1e7)-Cat.price(b),high:(a,b)=>(inStock(a)?0:-1e7)+Cat.price(b)-Cat.price(a)-(inStock(b)?0:-1e7),new:(a,b)=>(b.at||0)-(a.at||0)};
  return r.sort(by[F.sort]||by.rec)};
 const draw=()=>{drawTabs();drawFilters();const q=F.q.trim();let h='';
  if(q||F.c!=='pick'){let L=Cat.d.products;if(!q){if(F.c==='mine')L=L.filter(p=>{const it=Items.get(p.itemId);return it&&isMine(p,it)});else if(F.c!=='all')L=L.filter(p=>Items.get(p.itemId)?.cat===F.c)}
   L=filt(L);const cat=CATS.find(c=>c[0]===F.c);
   h+=q?`<div class="tls-sec"><h4>搜尋「${esc(q)}」</h4><small>${L.length} 件商品</small></div>`:cat?`<div class="tls-store" style="--c:${cat[3]}"><span>${MiniArt.img(CICON[cat[0]])}</span><div><b>${cat[2]}</b><small>${L.filter(inStock).length} 件商品上架中${L.some(p=>!inStock(p))?'・部分商品今日未進貨':''}</small></div></div>`:F.c==='mine'?`<div class="tls-store" style="--c:${CC.custom}"><span>${ic('palette')}</span><div><b>工坊作品專櫃</b><small>工坊創作的物品會自動上架，購買後才會放進背包</small></div></div>`:'';
   h+=L.length?`<div class="tls-grid">${L.map((p,i)=>card(p,i)).join('')}</div>`:`<div class="tls-empty">${KEEPER}<b>${q?'找不到符合的商品':'這裡暫時空空的'}</b><small>${q?'換個關鍵字，或清除篩選條件試試看。':'改變篩選條件，或明天再來看看新貨吧。'}</small>${(F.af||F.un||F.sale)?'<button class="btn" data-reset>清除篩選</button>':''}</div>`}
  else h+=pickPage();
  /* 3.2：重新整理時沿用已解碼的商品卡（圖片不會空白一格），且只有切換分類時才播放進場動畫 */
  const key=F.c+'|'+F.q.trim();if(G._h===h)return;G._h=h;const old=new Map();G.querySelectorAll('.tls-card,.tls-hero').forEach(n=>{const k=n.outerHTML;if(!old.has(k))old.set(k,n)});
  const sw=G._key!==key;G._key=key;G.innerHTML=h;G.querySelectorAll('.tls-card,.tls-hero').forEach(n=>{const o=old.get(n.outerHTML);if(o){old.delete(n.outerHTML);n.replaceWith(o)}});
  if(sw&&!/\|./.test(key.slice(key.indexOf('|')))){G.scrollTop=0;G.classList.remove('enter');void G.offsetWidth;G.classList.add('enter')}else if(sw)G.scrollTop=0;else G.classList.remove('enter')};
 const pickPage=()=>{const t=today(),f=t.feat&&Cat.prod(t.feat),fi=f&&Items.get(f.itemId);let h='';
  if(fi)h+=`<button class="tls-hero" data-p="${esc(f.id)}" style="--c:${CC[fi.cat]||CC.custom}"><span class="tls-rib">今日精選</span><span class="tls-hart">${Items.icon(fi)}<i class="tls-shine"></i></span><span class="tls-hinfo"><small>${CN[fi.cat]||'商品'}</small><b>${esc(fi.name)}</b><em>${esc(fi.desc||'')}</em><span class="tls-hp">${priceHTML(f)}<i class="tls-off">-20%</i></span></span></button>`;
  const fl=t.flash.map(id=>Cat.prod(id)).filter(p=>p&&visible(p));
  if(fl.length)h+=`<div class="tls-sec"><h4><i class="tls-dot hot"></i>限時特賣</h4><span class="tls-cd" data-cd>${fmtT(t.until-Date.now())}</span></div><div class="tls-row">${fl.map((p,i)=>card(p,i,'-30%')).join('')}</div>`;
  const st=[...t.stock].map(id=>Cat.d.products.find(p=>p.itemId===id)).filter(p=>p&&visible(p));
  if(st.length)h+=`<div class="tls-sec"><h4><i class="tls-dot"></i>今日進貨</h4><small>每天換一批・明天再來看看</small></div><div class="tls-grid">${st.map((p,i)=>card(p,i)).join('')}</div>`;
  const mine=Cat.d.products.filter(p=>{const it=Items.get(p.itemId);return it&&visible(p)&&isMine(p,it)}).sort((a,b)=>(b.at||0)-(a.at||0)).slice(0,6);
  if(mine.length)h+=`<div class="tls-sec"><h4><i class="tls-dot mine"></i>工坊新作</h4><button class="tls-more" data-tab="mine">全部 ›</button></div><div class="tls-row">${mine.map((p,i)=>card(p,i)).join('')}</div>`;
  const fav=Object.entries(Cat.d.bought||{}).sort((a,b)=>b[1]-a[1]).map(([id])=>Cat.d.products.find(p=>p.itemId===id)).filter(p=>p&&visible(p)&&inStock(p)).slice(0,4);
  if(fav.length)h+=`<div class="tls-sec"><h4><i class="tls-dot fav"></i>常買的商品</h4></div><div class="tls-grid">${fav.map((p,i)=>card(p,i)).join('')}</div>`;
  h+=`<div class="tls-cats">${CATS.map(c=>`<button class="tls-catb" data-tab="${c[0]}" style="--c:${c[3]}">${MiniArt.img(CICON[c[0]])}<b>${c[2]}</b></button>`).join('')}</div>`;
  return h};
 const card=(p,i,tag)=>{const it=Items.get(p.itemId),pr=Cat.price(p),sale=pr<p.price,stock=inStock(p),q=I(it.qty);
  const off=offOf(p),badges=[!stock?'<i class="b-out">今日未進貨</i>':'',stock&&sale?`<i class="b-sale">${tag||('-'+Math.round((off||(1-pr/p.price))*100)+'%')}</i>`:'',stock&&isNew(p,it)?'<i class="b-new">NEW</i>':'',ROT.has(p.itemId)&&stock?'<i class="b-lim">限定</i>':''].filter(Boolean).slice(0,2).join('');
  return `<button class="tls-card ${stock?'':'out'} ${pr>Wallet.bal()&&stock?'poor':''}" data-p="${esc(p.id)}" style="--c:${CC[it.cat]||CC.custom};--i:${Math.min(i,14)}" aria-label="${esc(it.name)}，${pr} 星幣${q?'，持有 '+q:''}"><span class="tls-art">${Items.icon(it)}</span><span class="tls-badges">${badges}</span>${q?`<span class="tls-own" data-own>×${q}</span>`:'<span class="tls-own" data-own hidden></span>'}<b class="tls-name">${esc(it.name)}</b><span class="tls-price" data-price>${priceHTML(p)}</span></button>`};
 const refresh=()=>{if(s.closed)return;bal(Wallet.bal());G.querySelectorAll('[data-p]').forEach(n=>{const p=Cat.prod(n.dataset.p),it=p&&Items.get(p.itemId);if(!it)return;const o=n.querySelector('[data-own]');if(o){const q=I(it.qty);if(o.textContent!=='×'+q&&q){o.hidden=false;o.textContent='×'+q;if(!reduce())o.animate([{transform:'scale(1.6)'},{transform:'none'}],{duration:380,easing:'cubic-bezier(.3,1.6,.5,1)'})}else if(!q)o.hidden=true}
   n.classList.toggle('poor',inStock(p)&&Cat.price(p)>Wallet.bal())})};
 off=Items.on(()=>{autoRegister();refresh()});
 tick=setInterval(()=>{if(s.closed)return;const cd=G.querySelector('[data-cd]'),t=today();if(cd)cd.textContent=fmtT(t.until-Date.now());if(Date.now()>t.until+500){cache.k='';draw()}},1000);
 let qt=0;Q.addEventListener('input',()=>{B.querySelector('[data-clear]').hidden=!Q.value;clearTimeout(qt);qt=setTimeout(()=>{F.q=Q.value;draw()},140)});
 Q.addEventListener('keydown',e=>{if(e.key==='Enter')Q.blur()});
 B.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(b.matches('.tls-keeper')){buzz(6);say();if(!reduce())b.animate([{transform:'none'},{transform:'translateY(-6px) rotate(-6deg)'},{transform:'none'}],{duration:420,easing:'cubic-bezier(.3,1.6,.5,1)'});return}
  if(d.tab){F.c=d.tab;F.q='';Q.value='';B.querySelector('[data-clear]').hidden=true;buzz(5);draw();return}
  if(d.clear!==undefined){Q.value='';F.q='';b.hidden=true;draw();Q.focus();return}
  if(d.fbtn!==undefined){const fp=B.querySelector('[data-fp]'),open=fp.hidden;fp.hidden=!open;b.setAttribute('aria-expanded',String(open));if(open&&!reduce())fp.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'none'}],{duration:240,easing:'ease-out'});return}
  if(d.sort){F.sort=d.sort;buzz(4);if(F.c==='pick')F.c='all';draw();return}
  if(d.tg){F[d.tg]=!F[d.tg];buzz(4);if(F.c==='pick')F.c='all';draw();return}
  if(d.reset!==undefined){F.af=F.un=F.sale=false;F.sort='rec';draw();return}
  if(d.p){buzz(6);Shop.detail(d.p,b)}});
 draw()};

function priceHTML(p){const pr=Cat.price(p);return pr<p.price?`${coin()}<b>${pr}</b><s>${p.price}</s>`:`${coin()}<b>${pr}</b>`}
function animBal(node){let cur=null,raf=0;return (v,snap)=>{if(cur===null||snap||reduce()){cur=v;node.textContent=v;return}const from=cur,t0=performance.now();cur=v;cancelAnimationFrame(raf);
 const step=t=>{const k=Math.min(1,(t-t0)/600),e=1-Math.pow(1-k,3);node.textContent=Math.round(from+(v-from)*e);if(k<1)raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step);
 node.parentElement.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.3,1.6,.5,1)'})}}

/* ---------- 商品詳情與購買流程 ---------- */
Shop.detail=function(pid,from){const p0=Cat.prod(pid),it0=p0&&Items.get(p0.itemId);if(!it0)return;let q=1,off=null,rep=0,stage='pick';
 const mine=isMine(p0,it0),col=CC[it0.cat]||CC.custom,fx=(it0.uses&&it0.uses[0]&&it0.uses[0].fx)||{};
 const how=({food:'從背包拖給夥伴就能餵食',drink:'從背包拖給夥伴就能喝',toy:'拖給夥伴一起玩，可以重複使用',gift:'送給夥伴，會讓牠很開心',wear:'在換裝模式穿到角色身上',acc:'在換裝模式自由調整位置與大小',furn:'從背包拖到場景裡擺放'})[it0.cat]||'從背包拖到角色或場景使用';
 const s=openSheet(`<div class="sh-body tls-detail" style="--c:${col}">
  <div class="tld-stage"><i class="tld-ray"></i><span class="tld-art" data-art>${Items.icon(it0)}</span><i class="tld-ped"></i><span class="tld-rib" data-rib hidden></span><span class="tld-bag" data-bag hidden>${BAG}</span><span class="tld-stamp" data-stamp hidden>謝謝惠顧！</span></div>
  <div class="tld-meta"><span class="tld-cat">${esc(CN[it0.cat]||'商品')}</span><span class="tld-own" data-own></span>${ROT.has(it0.id)?'<span class="tld-lim">每日限定</span>':''}${mine?'<span class="tld-lim mine">工坊作品</span>':''}</div>
  <h3 class="tld-name">${esc(it0.name)}</h3>
  <p class="tld-desc">${esc(it0.desc||'沒有說明')}</p>
  ${it0.tags.length?`<div class="tld-tags">${it0.tags.map(t=>`<span>#${esc(t)}</span>`).join('')}</div>`:''}
  <div class="tld-fx"><span><i class="h">❤</i> 親密度 +${I(fx.hearts)}</span><span>心情：${MOOD[fx.mood]||'開心'}</span><span>${it0.consume===false?'可重複使用':'使用後會消耗'}</span></div>
  <p class="tld-how">${how}</p>
  <div class="tld-buy"><div class="tld-qty" role="group" aria-label="購買數量"><button type="button" data-q="-1" aria-label="減少">−</button><output data-qv>1</output><button type="button" data-q="1" aria-label="增加">＋</button></div>
   <div class="tld-total"><small>合計</small><b data-total></b><small data-after></small></div></div>
  <button class="tld-go" type="button" data-buy></button>
  ${mine?'<div class="tld-mine"><button class="btn grow" data-e>編輯作品</button><button class="btn danger grow" data-x>下架</button></div>':''}
  <div class="tld-receipt" data-rc hidden></div></div>`,{cls:'tls-dsheet',onClose:()=>{off&&off();clearInterval(rep)}});
 const B=s.el.querySelector('.tls-detail'),$q=x=>B.querySelector(x),go=$q('[data-buy]');
 const st=()=>{const p=Cat.prod(pid),it=p&&Items.get(p.itemId);return {p,it,unit:p?I(Cat.price(p)):0,max:it?Math.max(0,Math.min(99,999-I(it.qty))):0,stock:inStock(p)}};
 const paint=()=>{const {p,it,unit,max,stock}=st();if(!it){s.close();return}q=Math.max(1,Math.min(q,Math.max(1,max)));const total=unit*q,b=Wallet.bal(),short=total>b;
  $q('[data-own]').textContent='持有 '+I(it.qty);$q('[data-qv]').textContent=q;$q('[data-total]').innerHTML=coin()+total+(unit<p.price?`<s>${p.price*q}</s>`:'');
  $q('[data-after]').textContent=short?`還差 ${total-b} 星幣`:`購買後餘額 ${b-total}`;$q('[data-after]').classList.toggle('bad',short);
  const off=offOf(p),rib=$q('[data-rib]');rib.hidden=!off&&!(unit<p.price);if(!rib.hidden)rib.textContent=off===.2?'今日精選 -20%':off===.3?'限時特賣 -30%':'特價中';
  $q('[data-q="-1"]').disabled=q<=1;$q('[data-q="1"]').disabled=q>=max;
  go.className='tld-go';go.disabled=false;
  if(!stock){go.disabled=true;go.innerHTML='今天沒有進貨・明天再來看看';go.classList.add('off')}
  else if(max<=0){go.disabled=true;go.innerHTML='已達持有上限';go.classList.add('off')}
  else if(short){go.innerHTML=`${ic('info')}星幣不足`;go.classList.add('short')}
  else go.innerHTML=`${BAG}<span>購買 ${q} 個</span>`};
 off=Items.on(()=>{if(stage==='pick')paint()});paint();
 const step=d=>{const {max}=st();const n=Math.max(1,Math.min(max||1,q+d));if(n!==q){q=n;buzz(3);paint();const o=$q('[data-qv]');if(!reduce())o.animate([{transform:`translateY(${d>0?-6:6}px)`,opacity:.3},{transform:'none',opacity:1}],{duration:200,easing:'ease-out'})}};
 B.querySelectorAll('[data-q]').forEach(b=>{let t=0;const d=+b.dataset.q,stop=()=>{clearTimeout(t);clearInterval(rep)};
  b.addEventListener('pointerdown',e=>{e.preventDefault();step(d);t=setTimeout(()=>{rep=setInterval(()=>step(d),70)},380)});['pointerup','pointercancel','pointerleave'].forEach(k=>b.addEventListener(k,stop))});
 const shake=n=>{if(reduce())return;n.animate([{transform:'translateX(0)'},{transform:'translateX(-7px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:360,easing:'ease-out'})};
 const receipt=()=>{const {p,it,unit}=st();const total=unit*q,b=Wallet.bal(),rc=$q('[data-rc]');stage='confirm';
  rc.innerHTML=`<div class="rc-paper"><div class="rc-h">${KEEPER}<div><b>購物確認</b><small>島嶼百貨・${new Date().toLocaleDateString('zh-TW')}</small></div></div>
   <div class="rc-line"><span class="rc-ic">${Items.icon(it)}</span><span>${esc(it.name)}<small>${coin()}${unit} × ${q}</small></span><b>${total}</b></div>
   ${unit<p.price?`<div class="rc-sub"><span>原價</span><s>${p.price*q}</s></div><div class="rc-sub save"><span>省下</span><b>-${(p.price-unit)*q}</b></div>`:''}
   <div class="rc-sum"><span>合計</span><b>${coin()}${total}</b></div><div class="rc-sub"><span>目前星幣</span><b>${b}</b></div><div class="rc-sub"><span>購買後</span><b>${b-total}</b></div>
   <div class="rc-btns"><button class="btn" type="button" data-cancel>再想想</button><button class="btn primary" type="button" data-ok>確定購買</button></div></div>`;
  rc.hidden=false;if(!reduce()){rc.animate([{opacity:0},{opacity:1}],{duration:200});rc.firstChild.animate([{transform:'translateY(60px) rotate(-2deg)',opacity:0},{transform:'none',opacity:1}],{duration:460,easing:'cubic-bezier(.2,1.3,.35,1)'})}
  rc.querySelector('[data-ok]').focus({preventScroll:true})};
 const closeRc=()=>{const rc=$q('[data-rc]');stage='pick';if(reduce()){rc.hidden=true;return}rc.firstChild.animate([{transform:'none',opacity:1},{transform:'translateY(50px)',opacity:0}],{duration:180,easing:'ease-in',fill:'forwards'});rc.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'}).onfinish=()=>{rc.hidden=true;rc.getAnimations().forEach(a=>a.cancel())}};
 const celebrate=r=>{const art=$q('[data-art]'),bag=$q('[data-bag]'),stamp=$q('[data-stamp]'),stg=$q('.tld-stage');buzz([12,30,12]);
  if(!reduce()){bag.hidden=false;stamp.hidden=false;
   bag.animate([{transform:'translate(-50%,40px) scale(.6)',opacity:0},{transform:'translate(-50%,0) scale(1.05)',opacity:1,offset:.35},{transform:'translate(-50%,0) scale(1)',opacity:1,offset:.8},{transform:'translate(-50%,-10px) scale(.9)',opacity:0}],{duration:1500,easing:'cubic-bezier(.3,1.3,.5,1)',fill:'both'});
   art.animate([{transform:'none'},{transform:'translateY(-24px) scale(1.08) rotate(-6deg)',offset:.25},{transform:'translateY(34px) scale(.35)',opacity:.2,offset:.55},{transform:'translateY(34px) scale(.35)',opacity:0,offset:.7},{transform:'scale(.6)',opacity:0,offset:.8},{transform:'none',opacity:1}],{duration:1500,easing:'ease-in-out'});
   stamp.animate([{transform:'translate(-50%,-50%) scale(2.2) rotate(-14deg)',opacity:0},{transform:'translate(-50%,-50%) scale(.95) rotate(-8deg)',opacity:1,offset:.3},{transform:'translate(-50%,-50%) scale(1) rotate(-8deg)',opacity:1,offset:.8},{transform:'translate(-50%,-50%) scale(1) rotate(-8deg)',opacity:0}],{duration:1600,delay:420,easing:'cubic-bezier(.2,1.4,.4,1)',fill:'both'});
   for(let i=0;i<10;i++){const c=document.createElement('i');c.className='tld-cfx';c.innerHTML=i%3?'<b></b>':coinSvg;c.style.setProperty('--h',['#FFE27A','#F5A3B5','#7EC8E3','#93C65B'][i%4]);stg.append(c);const a=i/10*Math.PI*2;c.animate([{transform:'translate(-50%,-50%) scale(.2)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*90}px),calc(-50% + ${Math.sin(a)*60-10}px)) scale(1) rotate(${i*40}deg)`,opacity:0}],{duration:900,delay:300,easing:'cubic-bezier(.2,.8,.3,1)',fill:'both'}).onfinish=()=>c.remove()}
   setTimeout(()=>{bag.hidden=true;stamp.hidden=true},2100);setTimeout(()=>flyToBag(it0,stg),900)}
  setTimeout(()=>toast(`已購買「${it0.name}」× ${r.n}（持有 ${r.qty}）`,'sparkle'),reduce()?0:1300)};
 s.el.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.e!==undefined){s.close();setTimeout(()=>Studio4.editProduct(pid),260);return}
  if(b.dataset.x!==undefined){if(await confirmSheet({title:'下架商品',msg:`將「${it0.name}」從商店下架？已持有的數量會保留在背包。`,ok:'下架'})){Cat.delist(pid);s.close()}return}
  if(b.dataset.cancel!==undefined){buzz(4);closeRc();return}
  if(b.dataset.ok!==undefined){const r=Econ.buyN(pid,q,b);closeRc();
   if(r.ok){celebrate(r);q=1;setTimeout(paint,40)}
   else if(r.why==='coins'){shake(go);toast(`星幣不足（還差 ${r.need}）`,'info')}else if(r.why==='stock')toast('這件商品今天沒有進貨','info');else if(r.why==='cap')toast('超過持有上限 999','info');else if(r.why==='busy')toast('結帳中，請稍候','info');paint();return}
  if(b===go){const {unit,stock,max}=st();if(!stock||max<=0)return;if(unit*q>Wallet.bal()){buzz(20);shake(go);shake($q('.tld-total'));toast(`星幣不足（還差 ${unit*q-Wallet.bal()}），完成委託可以賺星幣喔`,'info');return}buzz(8);receipt()}});
};
function flyToBag(it,from){try{const r=from.getBoundingClientRect(),t=(document.querySelector('#qbFab')||document.querySelector('[data-r=coin]'))?.getBoundingClientRect()||{left:innerWidth-40,top:innerHeight-120,width:0,height:0};
 const f=document.createElement('div');f.className='tls-fly';f.innerHTML=Items.icon(it);document.body.append(f);const x0=r.left+r.width/2-24,y0=r.top+r.height*.4-24,x1=t.left+t.width/2-24,y1=t.top+t.height/2-24;
 f.animate([{transform:`translate(${x0}px,${y0}px) scale(1)`,opacity:1},{transform:`translate(${(x0+x1)/2}px,${Math.min(y0,y1)-80}px) scale(.8)`,opacity:1,offset:.5},{transform:`translate(${x1}px,${y1}px) scale(.3)`,opacity:.3}],{duration:820,easing:'cubic-bezier(.45,0,.3,1)',fill:'forwards'}).onfinish=()=>f.remove();setTimeout(()=>f.remove(),1200)}catch(e){}}

/* ---------- 啟動 ---------- */
const wait=setInterval(()=>{try{if(!(Items.d?.ui?.seeded&&Cat.d&&window.Econ&&window.OCS24D?.Room?.d?.atelierCatalog&&typeof TL_ART==='object'))return;clearInterval(wait);install();autoRegister();Items.on(()=>{clearTimeout(wait._t);wait._t=setTimeout(autoRegister,300)})}catch(e){clearInterval(wait);console.error('[shop 2.8]',e)}},200);
window.OCSShop={today,inStock,offOf,NEW,ROT};
})();
