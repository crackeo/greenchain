import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  Camera,
  CheckCircle2,
  CloudSun,
  Database,
  Languages,
  Leaf,
  MapPinned,
  RadioTower,
  ShieldCheck,
  Smartphone,
  Sprout,
  TestTube2,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story — GreenChain AI",
  description: "Why GreenChain AI began, what has been built, and the roadmap for better agricultural support in Bhutan.",
};

const JOURNEY = [
  {
    step: "01",
    label: "The need",
    title: "Agricultural knowledge should not depend on who lives nearby.",
    body: "GreenChain began with a practical problem: many farming communities do not have easy, timely access to agricultural experts. Farmers still need to decide what to plant, understand a sick crop, and improve their soil—often while the season is already moving.",
  },
  {
    step: "02",
    label: "The first idea",
    title: "Bring three important decisions into one simple tool.",
    body: "The original idea joined crop selection, image-based plant health checks, and soil management. Farmers could describe their land or enter a soil report; later, sensors could send the same information automatically.",
  },
  {
    step: "03",
    label: "The prototype",
    title: "DrukAgri proved the core experience could work.",
    body: "The first working prototype used a lightweight Python backend. It tested ranked crop recommendations, plant-photo diagnosis with confidence and referral rules, practical soil amendments, and an early IoT intake route.",
  },
  {
    step: "04",
    label: "GreenChain AI",
    title: "The prototype became a mobile-first product for Bhutan.",
    body: "The application was renamed GreenChain AI and rebuilt with React and Next.js. It gained a real brand, installable phone experience, structured AI outputs, multiple AI-provider support, and a clearer separation between household and commercial farming.",
  },
];

const CAPABILITIES = [
  { Icon: Sprout, title: "Crop planning", body: "Compares crops using location, elevation, irrigation, terrain, soil, farm size, goals, labor, budget, and market. Every recommendation explains why it fits." },
  { Icon: Camera, title: "Plant doctor", body: "Examines a close plant photo, shows confidence and severity, suggests immediate and preventive action, and flags cases that need NPPC or extension support." },
  { Icon: TestTube2, title: "Soil health", body: "Turns pH, N, P, K, organic matter, drainage, texture, and field history into a timed amendment plan with farmer-friendly quantities." },
  { Icon: UsersRound, title: "Two farming modes", body: "Household mode emphasizes food, mixed cropping, and affordable steps. Commercial mode adds acres, production scale, labor, budget, buyers, and market risk." },
  { Icon: RadioTower, title: "IoT-ready", body: "A live intake route already accepts future soil-sensor readings, so devices can be added without rebuilding the advisory system." },
  { Icon: ShieldCheck, title: "Safety by design", body: "Uncertainty stays visible. Serious or unclear disease cases are referred. Chemical advice includes protective equipment and local confirmation safeguards." },
];

const ROADMAP = [
  { phase: "Next", Icon: MapPinned, title: "Validate in real farms", body: "Work with farmers and dzongkhag extension teams to compare recommendations with field experience, correct local gaps, and measure usefulness." },
  { phase: "Next", Icon: CloudSun, title: "Add live farm context", body: "Connect weather and climate information, planting calendars, elevation, and soil-map estimates for farms without a recent laboratory test." },
  { phase: "Build", Icon: Database, title: "Create a Bhutan disease library", body: "Collect consented, locally labelled photos of cardamom, citrus, apple, vegetables, and other priority crops to improve field accuracy over time." },
  { phase: "Build", Icon: Languages, title: "Dzongkha and voice guidance", body: "Translate the interface and advice with native-speaker review, then add spoken guidance for farmers who prefer listening to reading." },
  { phase: "Pilot", Icon: RadioTower, title: "Test practical sensors", body: "Pilot calibrated moisture, pH, temperature, and selected nutrient sensors where they genuinely improve decisions—not simply because the hardware exists." },
  { phase: "Grow", Icon: Smartphone, title: "Deploy for wider access", body: "Host GreenChain securely, support offline-friendly field use, build farmer profiles and history, and prepare Android distribution when the pilot is ready." },
];

export default function AboutPage() {
  return (
    <article className="story-page">
      <section className="story-hero">
        <div className="story-hero-copy">
          <span className="eyebrow"><BookOpenText size={15} /> The GreenChain story</span>
          <h1>Technology that helps a farmer make the <em>next good decision.</em></h1>
          <p className="story-lede">GreenChain AI is being built to make practical agricultural guidance easier to reach in Bhutan—from choosing a crop to understanding a damaged leaf and caring for the soil beneath it.</p>
          <div className="story-actions">
            <Link className="btn" href="/crops">Try the crop planner <ArrowRight size={18} /></Link>
            <a className="text-link" href="#journey">Read our journey</a>
          </div>
        </div>
        <div className="official-logo-panel" role="img" aria-label="Official GreenChain logo">
          <div className="official-logo-crop" />
          <span>From a local need to a field-ready platform</span>
        </div>
      </section>

      <nav className="story-index" aria-label="On this page">
        <span>On this page</span>
        <a href="#purpose">Purpose</a><a href="#journey">Journey</a><a href="#today">What exists</a><a href="#how">How it works</a><a href="#future">Future</a>
      </nav>

      <section className="story-purpose" id="purpose">
        <div className="story-section-heading"><span className="story-number">01</span><div><span className="eyebrow">Why it started</span><h2>A shortage of experts should not become a shortage of answers.</h2></div></div>
        <div className="purpose-grid">
          <p className="purpose-lead">A farmer’s questions are often urgent: <em>Will this crop suit my land? What is happening to this leaf? What should I add to this soil—and how much?</em></p>
          <div><p>GreenChain started because these questions can be difficult to answer when agricultural specialists are far away or responsible for many communities. The goal is not to replace extension officers. It is to help farmers prepare better information, take safer first steps, and know when expert help is necessary.</p><p>The project began with Bhutan in mind: steep changes in elevation, monsoon-driven seasons, limited laboratory access, and important crops such as large cardamom, citrus, and apple. Its design now supports both household farms and acre-based commercial planning.</p></div>
        </div>
        <blockquote>“A trusted extension officer in the farmer’s pocket”—useful enough for the field, honest enough to show uncertainty.</blockquote>
      </section>

      <section className="journey-section" id="journey">
        <div className="story-section-heading"><span className="story-number">02</span><div><span className="eyebrow">How it is going</span><h2>Built in stages, with each stage answering a real question.</h2></div></div>
        <div className="journey-list">{JOURNEY.map((item) => <div className="journey-item" key={item.step}><div className="journey-step"><span>{item.step}</span><i /></div><div><span className="eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></div></div>)}</div>
      </section>

      <section id="today">
        <div className="story-section-heading"><span className="story-number">03</span><div><span className="eyebrow">What we have developed</span><h2>One application, six connected capabilities.</h2><p>The current platform is a working, responsive web application that can be installed on a phone and also expands into a desktop dashboard.</p></div></div>
        <div className="capability-grid">{CAPABILITIES.map(({ Icon, title, body }, index) => <article className="capability-card" key={title}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon /></div><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="build-section" id="how">
        <div className="story-section-heading light"><span className="story-number">04</span><div><span className="eyebrow">How it was developed</span><h2>Simple on the outside, carefully structured underneath.</h2></div></div>
        <div className="build-grid">
          <div className="build-copy"><p>Farmers see clear questions, explanation cards, and next actions. Behind that experience, the system turns each request into a structured set of farm conditions, asks an AI model to reason within Bhutan-specific safety rules, and returns information in a predictable format the interface can explain.</p><ul><li><CheckCircle2 /> React and Next.js provide the phone and desktop application.</li><li><CheckCircle2 /> Server-only API routes protect AI keys and farm requests.</li><li><CheckCircle2 /> OpenAI, Claude, and Gemini can be used through a fallback chain.</li><li><CheckCircle2 /> Structured outputs keep recommendations consistent.</li><li><CheckCircle2 /> A PWA manifest makes the web app installable on a phone.</li></ul></div>
          <div className="architecture" aria-label="How GreenChain processes a request"><div><Smartphone /><span><b>Farmer</b>Shares land details or a plant photo</span></div><ArrowRight /><div><BrainCircuit /><span><b>GreenChain intelligence</b>Applies agronomy context, safety, and available sources</span></div><ArrowRight /><div><Leaf /><span><b>Practical plan</b>Explains why, what to do, risks, and when to ask an expert</span></div></div>
        </div>
      </section>

      <section id="future">
        <div className="story-section-heading"><span className="story-number">05</span><div><span className="eyebrow">The future plan</span><h2>Move from a strong prototype to trusted agricultural infrastructure.</h2><p>The next stage is not about adding AI for its own sake. It is about improving local evidence, access, reliability, and farmer outcomes.</p></div></div>
        <div className="roadmap-grid">{ROADMAP.map(({ phase, Icon, title, body }) => <article className="roadmap-card" key={title}><span>{phase}</span><Icon /><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="story-principles">
        <div><span className="eyebrow">What will not change</span><h2>Farmer usefulness comes before technological novelty.</h2></div>
        <ol><li><span>01</span><p><b>Explain, do not merely predict.</b> Every answer should make the reasoning and next action understandable.</p></li><li><span>02</span><p><b>Show uncertainty.</b> A careful referral is better than a confident but unsafe diagnosis.</p></li><li><span>03</span><p><b>Build with local knowledge.</b> Bhutanese farmers and extension teams must shape the product and validate its advice.</p></li><li><span>04</span><p><b>Keep access practical.</b> Mobile use, language, connectivity, cost, and literacy are product requirements—not later additions.</p></li></ol>
      </section>

      <section className="story-cta"><div><span className="eyebrow">GreenChain AI</span><h2>The work has started. The next chapter happens in the field.</h2><p>Explore the current tools, test them with real farm conditions, and help shape the platform around what farmers genuinely need.</p></div><Link className="btn" href="/">Explore GreenChain <ArrowRight size={18} /></Link></section>
    </article>
  );
}
