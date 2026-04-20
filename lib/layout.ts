// Single source of truth for layout dimensions.
// Every page and component imports from here — never hardcode widths.

export const LAYOUT = {
  // Outer container — matches Tailwind max-w-7xl (1280px) minus comfortable margin
  containerMaxWidth: 1200,

  // Horizontal page padding (applied inside the container)
  // 40px gives 1120px usable on a 1200px screen
  containerPadding: "0 40px",

  // Lesson page two-column grid
  // At 1200px container: 1120px usable
  //   right col 360 + gap 48 = 408px taken
  //   left col = 1120 - 408 = 712px  ← comfortable reading width
  lessonRightCol: 360,
  lessonGap: 48,

  // Sticky sidebar top offset (nav height + breathing room)
  stickyTop: 68,
} as const;
