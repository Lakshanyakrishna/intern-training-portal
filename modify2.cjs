const fs = require('fs');
const file = 'src/pages/public/Opportunities.tsx';
let content = fs.readFileSync(file, 'utf8');
let lines = content.split(/\r?\n/);

function wrapLines(startStr, endStr) {
  let startIdx = lines.findIndex(l => l.includes(startStr));
  if (startIdx === -1) throw new Error("not found: " + startStr);
  
  let endIdx = -1;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].includes(endStr)) {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) throw new Error("not found end: " + endStr);

  lines.splice(endIdx + 1, 0, '        </AnimatedContent>');
  lines.splice(startIdx + 1, 0, '        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>');
}

// 1. Hero
wrapLines('{/* HERO SECTION */}', '</section>');
// 2. Stats
wrapLines('{/* STATS BAR */}', '</section>');
// 3. Search & Filters
wrapLines('{/* SEARCH & FILTERS */}', '</section>');
// 4. Featured Opp
wrapLines('{/* FEATURED OPPORTUNITY */}', '</section>');
// 5. Recommended
wrapLines('{/* RECOMMENDED */}', '</section>');
// 6. Browse by forte
wrapLines('{/* BROWSE BY FORTE */}', '</section>');
// 7. Progress
wrapLines('{/* PROGRESS & WHAT WE LOOK FOR */}', '</section>');
// 10. FAQ
wrapLines('{/* FAQ */}', '</section>');
// 11. Banner
wrapLines('{/* BANNER */}', '</section>');
// 12. How it works
wrapLines('{/* HOW IT WORKS */}', '</section>');

// 8 and 9. Mentors and Testimonial
let mentorsIdx = lines.findIndex(l => l.includes('{/* MENTORS */}'));
lines.splice(mentorsIdx + 2, 0, '          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2} className="flex-1 h-full">');

let testimoIdx = lines.findIndex((l, i) => i > mentorsIdx && l.includes('w-full lg:w-72 bg-[#111114]'));
lines.splice(testimoIdx, 0, '          </AnimatedContent>');

let newTestimoIdx = testimoIdx + 1;
lines.splice(newTestimoIdx, 0, '          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2} delay={0.1} className="w-full lg:w-72 shrink-0 h-full">');

let mentorsEndIdx = -1;
for (let i = newTestimoIdx + 1; i < lines.length; i++) {
  if (lines[i].includes('</section>')) {
    mentorsEndIdx = i;
    break;
  }
}
lines.splice(mentorsEndIdx, 0, '          </AnimatedContent>');


// 13. Footer
let footerIdx = lines.findIndex(l => l.includes('{/* FOOTER */}'));
let footerEndIdx = lines.findIndex((l, i) => i > footerIdx && l.includes('</FadeContent>'));
lines.splice(footerEndIdx + 1, 0, '      </AnimatedContent>');
lines.splice(footerIdx + 1, 0, '      <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>');

fs.writeFileSync(file, lines.join('\n'));
console.log('done');
