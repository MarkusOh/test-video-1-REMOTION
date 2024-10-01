import "./tailwind.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { CatFact } from "./HelloWorld";
import { z } from "zod";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const defaultProps = {
    titleText: "Welcome to Remotion",
    titleColor: "#0433ff",
    logoColor1: "#ff40ff",
    logoColor2: "#86A8E7",
    items: [
      {
        title: "Something in the air 1",
        from: new Date("2024-09-30T17:02:54.682Z"),
        enabled: true,
      },
      {
        title: "New wave",
        from: new Date("2024-09-17T17:04:28.600Z"),
        enabled: false,
      },
    ],
    catFact: [],
    howMany: 1,
  } as z.infer<typeof myCompSchema>;

  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          ...defaultProps,
        }}
        calculateMetadata={async ({ props }) => {
          const fetchables: z.infer<typeof CatFact>[] = [];
          for (let i = 0; i < props.howMany; i++) {
            const data = await fetch("https://catfact.ninja/fact");
            const result = CatFact.parse(await data.json());
            fetchables.push(result);
          }

          return {
            props: {
              ...props,
              catFact: fetchables,
            },
          };
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
