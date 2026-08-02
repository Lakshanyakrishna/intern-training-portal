const fs = require('fs');
const file = 'src/pages/public/Opportunities.tsx';
let content = fs.readFileSync(file, 'utf8');

const applyAnimatedContent = (regex, replacement) => {
  content = content.replace(regex, replacement);
};

// 1. Hero
applyAnimatedContent(
  /(\{\/\* HERO SECTION \*\/}\r?\n\s*)(<section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 2. Stats
applyAnimatedContent(
  /(\{\/\* STATS BAR \*\/}\r?\n\s*)(<section className="grid grid-cols-2 md:grid-cols-5 gap-4">[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 3. Search & filters
applyAnimatedContent(
  /(\{\/\* SEARCH & FILTERS \*\/}\r?\n\s*)(<section className="space-y-4">[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 4. Featured opportunity
applyAnimatedContent(
  /(\{\/\* FEATURED OPPORTUNITY \*\/}\r?\n\s*)(<section className="flex flex-col lg:flex-row gap-8">[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 5. Recommended
applyAnimatedContent(
  /(\{\/\* RECOMMENDED \*\/}\r?\n\s*)(<section>[\s\S]*?View all recommendations[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 6. Browse by forte
applyAnimatedContent(
  /(\{\/\* BROWSE BY FORTE \*\/}\r?\n\s*)(<section>[\s\S]*?View all tracks[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 7. Progress
applyAnimatedContent(
  /(\{\/\* PROGRESS & WHAT WE LOOK FOR \*\/}\r?\n\s*)(<section className="grid lg:grid-cols-\[1fr_2\.5fr\] gap-12 lg:gap-20 bg-\[#111114\] p-8 lg:p-12 rounded-3xl border border-white\/10">[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 8 and 9. Mentors and Testimonial
// Replace the internal divs of the section independently
applyAnimatedContent(
  /(<section className="flex flex-col lg:flex-row gap-4">\r?\n\s*)<div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">([\s\S]*?\r?\n\s*<\/div>)\r?\n\s*<div className="w-full lg:w-72 bg-\[#111114\] p-6 rounded-2xl border border-white\/10 flex flex-col justify-between shrink-0">([\s\S]*?\r?\n\s*<\/div>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2} className="flex-1">\n            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 h-full">$2\n          </AnimatedContent>\n          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2} delay={0.1} className="w-full lg:w-72 shrink-0">\n            <div className="bg-[#111114] p-6 rounded-2xl border border-white/10 flex flex-col justify-between h-full">$3\n          </AnimatedContent>'
);

// 10. FAQ
applyAnimatedContent(
  /(\{\/\* FAQ \*\/}\r?\n\s*)(<section>[\s\S]*?Frequently Asked Questions[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 11. Banner
applyAnimatedContent(
  /(\{\/\* BANNER \*\/}\r?\n\s*)(<section className="bg-gradient-to-r from-purple-900\/40 to-\[#111114\] border border-purple-500\/20 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 12. How it works
applyAnimatedContent(
  /(\{\/\* HOW IT WORKS \*\/}\r?\n\s*)(<section className="flex flex-col lg:flex-row justify-between items-center gap-12 border-t border-white\/10 pt-16">[\s\S]*?\r?\n\s*<\/section>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n        $2\n        </AnimatedContent>'
);

// 13. Footer
applyAnimatedContent(
  /(\{\/\* FOOTER \*\/}\r?\n\s*)(<FadeContent blur=\{true\} duration=\{1\} easing="ease-out" initialOpacity=\{0\}>[\s\S]*?\r?\n\s*<\/FadeContent>)/,
  '$1<AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>\n      $2\n      </AnimatedContent>'
);

fs.writeFileSync(file, content);
console.log('Modified ' + file);
