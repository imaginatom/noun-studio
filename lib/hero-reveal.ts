import { gsap, SplitText } from "@/lib/gsap-register";

export const HERO_SPLIT = {
  type: "lines",
  mask: "lines",
} as const;

export const HERO_WORD_SPLIT = {
  type: "words",
  mask: "words",
} as const;

export const HERO_REVEAL = {
  duration: 0.3,
  stagger: 0.1,
  imageDuration: 0.6,
  titleLineFillDuration: 0.45,
  ease: "circ.out",
} as const;

const TITLE_FILL_COLOR = "#0a0a0a";
const TITLE_FILL_TEXT_COLOR = "#ffffff";

export type RevealSplitVars = Partial<{
  type: "lines" | "words";
  mask: "lines" | "words";
  ignore: string;
  lineIndent?: Record<number, string>;
}>;

const applyLineIndents = (
  lines: Element[],
  lineIndent?: Record<number, string>,
) => {
  if (!lineIndent) return;

  Object.entries(lineIndent).forEach(([index, value]) => {
    const line = lines[Number(index)] as HTMLElement | undefined;
    if (line) {
      gsap.set(line, { paddingLeft: value });
    }
  });
};

const LINE_MASK_PAD = "0.14em";

const relaxLineMasks = (split: ReturnType<typeof SplitText.create>) => {
  if (!split.masks?.length) return;

  // Pad masks so serif ascenders/descenders aren't clipped by overflow:clip.
  gsap.set(split.masks, {
    paddingTop: LINE_MASK_PAD,
    paddingBottom: LINE_MASK_PAD,
    marginTop: `calc(${LINE_MASK_PAD} * -0.65)`,
    marginBottom: `calc(${LINE_MASK_PAD} * -0.65)`,
  });
};

export const prepareWordSplit = (element: HTMLElement | null) => {
  if (!element) return null;

  const split = SplitText.create(element, {
    type: "words",
    mask: "words",
  });
  gsap.set(split.words, { yPercent: 105 });
  return split;
};

export const revealWordsOnTimeline = (
  split: ReturnType<typeof SplitText.create> | null,
  timeline: gsap.core.Timeline,
  position: string | number,
  duration: number = HERO_REVEAL.duration,
) => {
  if (!split?.words?.length) return;

  timeline.fromTo(
    split.words,
    { yPercent: 105 },
    {
      yPercent: 0,
      duration,
      stagger: HERO_REVEAL.stagger,
      ease: HERO_REVEAL.ease,
    },
    position,
  );
};

export const prepareLineSplit = (
  element: HTMLElement | null,
  splitVars: RevealSplitVars = {},
) => {
  if (!element) return null;

  const type = splitVars.type ?? HERO_SPLIT.type;
  const mask = splitVars.mask ?? HERO_SPLIT.mask;
  const split = SplitText.create(element, { type, mask, ...splitVars });
  applyLineIndents(split.lines, splitVars.lineIndent);
  if (mask === "lines") {
    relaxLineMasks(split);
    gsap.set(element, { overflow: "visible" });
  }
  return split;
};

export const revealSplit = (
  element: HTMLElement | null,
  timeline: gsap.core.Timeline,
  position: string | number,
  splitVars: RevealSplitVars = {},
) => {
  if (!element) return;

  const type = splitVars.type ?? HERO_SPLIT.type;
  const mask = splitVars.mask ?? HERO_SPLIT.mask;
  const split = SplitText.create(element, { type, mask, ...splitVars });
  applyLineIndents(split.lines, splitVars.lineIndent);
  const units = type === "words" ? split.words : split.lines;

  timeline.from(
    units,
    {
      yPercent: 105,
      duration: HERO_REVEAL.duration,
      stagger: HERO_REVEAL.stagger,
      ease: HERO_REVEAL.ease,
    },
    position,
  );
};

export type TitleLineFillTargets = {
  textWrap: HTMLElement;
  fill: HTMLElement;
  whiteOverlay: HTMLElement;
};

const copyTextStyles = (source: HTMLElement, target: HTMLElement) => {
  const styles = getComputedStyle(source);
  target.style.font = styles.font;
  target.style.letterSpacing = styles.letterSpacing;
  target.style.textTransform = styles.textTransform;
};

export const setupTitleLineFill = (
  split: ReturnType<typeof SplitText.create> | null,
  lineIndex = 1,
): TitleLineFillTargets | null => {
  const line = split?.lines[lineIndex] as HTMLElement | undefined;
  if (!line) return null;

  const indent = gsap.getProperty(line, "paddingLeft") as string | number;
  gsap.set(line, { paddingLeft: 0, display: "block" });

  const textWrap = document.createElement("span");
  textWrap.dataset.titleLineText = "true";
  gsap.set(textWrap, {
    display: "inline-block",
    position: "relative",
    marginLeft: indent || 0,
    paddingTop: "0.06em",
    paddingBottom: "0.1em",
    verticalAlign: "top",
  });
  gsap.set(line, { overflow: "visible" });

  const textLayer = document.createElement("span");
  textLayer.dataset.titleLineLayer = "true";
  gsap.set(textLayer, {
    position: "relative",
    display: "inline",
    zIndex: 1,
    color: TITLE_FILL_COLOR,
  });

  while (line.firstChild) {
    textLayer.appendChild(line.firstChild);
  }

  const fill = document.createElement("span");
  fill.setAttribute("aria-hidden", "true");
  fill.dataset.titleLineFill = "true";
  gsap.set(fill, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: TITLE_FILL_COLOR,
    transformOrigin: "left center",
    scaleX: 0,
    zIndex: 0,
    pointerEvents: "none",
  });

  const whiteOverlay = document.createElement("span");
  whiteOverlay.setAttribute("aria-hidden", "true");
  whiteOverlay.dataset.titleLineWhite = "true";
  whiteOverlay.innerHTML = textLayer.innerHTML;
  copyTextStyles(textLayer, whiteOverlay);
  gsap.set(whiteOverlay, {
    position: "absolute",
    top: 0,
    left: 0,
    color: TITLE_FILL_TEXT_COLOR,
    zIndex: 2,
    pointerEvents: "none",
    clipPath: "inset(0 100% 0 0)",
  });

  textWrap.append(fill, textLayer, whiteOverlay);
  line.appendChild(textWrap);

  return { textWrap, fill, whiteOverlay };
};

export const revealTitleSecondLineFill = (
  timeline: gsap.core.Timeline,
  targets: TitleLineFillTargets | null,
  position: string | number,
) => {
  if (!targets) return;

  const { fill, whiteOverlay } = targets;
  const duration = HERO_REVEAL.titleLineFillDuration;
  const ease = "power2.out";

  timeline.to(
    fill,
    {
      scaleX: 1,
      duration,
      ease,
    },
    position,
  );

  timeline.to(
    whiteOverlay,
    {
      clipPath: "inset(0 0% 0 0)",
      duration,
      ease,
    },
    position,
  );
};

export const setTitleSecondLineFillComplete = (
  targets: TitleLineFillTargets | null,
) => {
  if (!targets) return;

  gsap.set(targets.fill, { scaleX: 1 });
  gsap.set(targets.whiteOverlay, { clipPath: "inset(0 0% 0 0)" });
};

export const revealBlock = (
  element: HTMLElement | null,
  timeline: gsap.core.Timeline,
  position: string | number,
) => {
  if (!element) return;

  timeline.from(
    element,
    {
      yPercent: 105,
      duration: HERO_REVEAL.duration,
      ease: HERO_REVEAL.ease,
    },
    position,
  );
};
