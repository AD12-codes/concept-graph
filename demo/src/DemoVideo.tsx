import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { zoomBlur } from "@/components/remocn/zoom-blur";
import { GraphScene } from "./scenes/GraphScene";
import { Intro } from "./scenes/Intro";
import { JsonScene } from "./scenes/JsonScene";
import { Outro } from "./scenes/Outro";
import { RunLogScene } from "./scenes/RunLogScene";
import { SkillScene } from "./scenes/SkillScene";
import { ViewerScene } from "./scenes/ViewerScene";

export const SCENES = { intro: 110, skill: 170, runlog: 230, json: 230, viewer: 150, graph: 690, outro: 170 };
export const TRANSITION = 18;
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0) - TRANSITION * 6;

const cut = () => <TransitionSeries.Transition presentation={zoomBlur({ blur: 14 })} timing={linearTiming({ durationInFrames: TRANSITION })} />;

export const DemoVideo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={110}><Intro /></TransitionSeries.Sequence>
    {cut()}
    <TransitionSeries.Sequence name="Skill" durationInFrames={170}><SkillScene /></TransitionSeries.Sequence>
    {cut()}
    <TransitionSeries.Sequence name="Run log" durationInFrames={230}><RunLogScene /></TransitionSeries.Sequence>
    {cut()}
    <TransitionSeries.Sequence name="JSON" durationInFrames={230}><JsonScene /></TransitionSeries.Sequence>
    {cut()}
    <TransitionSeries.Sequence name="Viewer" durationInFrames={150}><ViewerScene /></TransitionSeries.Sequence>
    {cut()}
    <TransitionSeries.Sequence name="Graph" durationInFrames={690}><GraphScene /></TransitionSeries.Sequence>
    {cut()}
    <TransitionSeries.Sequence name="Outro" durationInFrames={170}><Outro /></TransitionSeries.Sequence>
  </TransitionSeries>
);
