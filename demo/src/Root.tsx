import { Composition, Folder } from "remotion";
import "./index.css";
import { DemoVideo, TOTAL } from "./DemoVideo";
import { GraphScene } from "./scenes/GraphScene";
import { Intro } from "./scenes/Intro";
import { JsonScene } from "./scenes/JsonScene";
import { Outro } from "./scenes/Outro";
import { RunLogScene } from "./scenes/RunLogScene";
import { SkillScene } from "./scenes/SkillScene";
import { ViewerScene } from "./scenes/ViewerScene";

const base = { width: 1920, height: 1080, fps: 30 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ConceptGraphDemo" component={DemoVideo} durationInFrames={TOTAL} {...base} />
    <Folder name="Scenes">
      <Composition id="Intro" component={Intro} durationInFrames={110} {...base} />
      <Composition id="Skill" component={SkillScene} durationInFrames={170} {...base} />
      <Composition id="RunLog" component={RunLogScene} durationInFrames={230} {...base} />
      <Composition id="Json" component={JsonScene} durationInFrames={230} {...base} />
      <Composition id="Viewer" component={ViewerScene} durationInFrames={150} {...base} />
      <Composition id="Graph" component={GraphScene} durationInFrames={690} {...base} />
      <Composition id="Outro" component={Outro} durationInFrames={170} {...base} />
    </Folder>
  </>
);
