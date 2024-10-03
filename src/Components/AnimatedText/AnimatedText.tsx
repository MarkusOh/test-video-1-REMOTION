import { Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import css from "./AnimatedText.module.css";

export const AnimatedTextProps = z.object({
  text: z.string(),
  sec: z.number(),
});

export const AnimatedText: React.FC<z.infer<typeof AnimatedTextProps>> = ({
  text,
  sec,
}) => {
  const curr = useCurrentFrame();
  const splitted = text.split(" ");
  const anim = 30 * sec;

  const interpolated = splitted.map((_, index) => {
    const overlappingIndex = index * 0.3;

    return interpolate(
      curr,
      [overlappingIndex * anim, (overlappingIndex + 1) * anim],
      [130, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.ease),
      },
    );
  });

  const done = interpolate(
    curr,
    [
      splitted.length * 0.3 * anim + 30 * 5,
      splitted.length * 0.3 * anim + 30 * 6,
    ],
    [100, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      className={css.backdrop}
      style={{
        opacity: `${done}%`,
      }}
    >
      <div className={css.h_stack}>
        {splitted.map((each, index) => (
          <div style={{ transform: `translateY(${interpolated[index]}px)` }}>
            <span className={`${css.font}`}>{each}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
