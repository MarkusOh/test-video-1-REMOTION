import { Easing, spring, Video } from "remotion";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Logo } from "./HelloWorld/Logo";
import { Subtitle } from "./HelloWorld/Subtitle";
import { Title } from "./HelloWorld/Title";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import css from "./HelloWorld.module.css";
import { AnimatedText } from "./Components/AnimatedText/AnimatedText";

// {"fact":"The life expectancy of cats has nearly doubled since 1930 - from 8 to 16 years.","length":79}
export const CatFact = z.object({
  fact: z.string(),
});

export const myCompSchema = z.object({
  titleText: z.string(),
  titleColor: zColor(),
  logoColor1: zColor(),
  logoColor2: zColor(),
  items: z.array(
    z.object({
      title: z.string(),
      from: z.date().optional(),
      enabled: z.boolean(),
    }),
  ),
  catFact: z.array(CatFact),
  howMany: z.number().min(1).max(5),
  sourceWidth: z.number(),
  sourceHeight: z.number(),
  sourceDurationInFrames: z.number(),
  videoSource: z.string(),
});

export const HelloWorld: React.FC<z.infer<typeof myCompSchema>> = ({
  titleText: propOne,
  titleColor: propTwo,
  logoColor1,
  logoColor2,
  items,
  catFact,
  sourceWidth,
  sourceHeight,
  videoSource,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Animate from 0 to 1 after 25 frames
  const logoTranslationProgress = spring({
    frame: frame - 25,
    fps,
    config: {
      damping: 100,
    },
  });

  // Move the logo up by 150 pixels once the transition starts
  const logoTranslation = interpolate(
    logoTranslationProgress,
    [0, 1],
    [0, -150],
  );

  // Fade out the animation at the end
  const opacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(to bottom, #7affad, #3be374",
        padding: "54px",
      }}
    >
      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <AbsoluteFill style={{ opacity }}>
          <AbsoluteFill>
            <Video
              src={videoSource}
              width={sourceWidth / 2}
              height={sourceHeight / 2}
            />
          </AbsoluteFill>
          <AbsoluteFill
            style={{ transform: `translateY(${logoTranslation}px)` }}
          >
            <Logo logoColor1={logoColor1} logoColor2={logoColor2} />
          </AbsoluteFill>
          <Sequence from={35}>
            <Title titleText={propOne} titleColor={propTwo} />
          </Sequence>
          <Sequence from={75}>
            <Subtitle />
          </Sequence>
        </AbsoluteFill>
        <AbsoluteFill>
          <div className={css.anchored_to_top_leading}>
            <div className={css.v_stack}>
              {catFact.map((fact) => (
                <AnimatedText sec={0.5} text={fact.fact} />
              ))}
              {items.map((item) => (
                <span
                  className={item.enabled ? css.enabled : css.disabled}
                >{`${item.title} (${(item.from ?? new Date()).toDateString()})`}</span>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

const TextDisplay = (text: string, delay: number = 0) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0 + delay, 50 + delay], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const offset = interpolate(frame, [0 + delay, 50 + delay], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bounce,
  });

  return (
    <div
      className={css.padding}
      style={{ opacity, transform: `translateY(${offset}px)` }}
    >
      <div className={css.shadowed_box}>
        <div className={css.padding_20}>
          <span className={css.enabled}>{text}</span>
        </div>
      </div>
    </div>
  );
};
