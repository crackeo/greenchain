import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, Leaf, MapPin, Sprout, TestTube2 } from "lucide-react";
import { activeModel, activeProvider, hasApiKey } from "@/lib/claude";

const MODULES = [
  { href: "/crops", Icon: Sprout, number: "01", title: "Plan what to grow", body: "Compare crops for your elevation, water, soil, farm size, and market goal.", cta: "Plan my crops" },
  { href: "/disease", Icon: Camera, number: "02", title: "Check a sick plant", body: "Photograph a leaf, fruit, or stem and get clear next steps with confidence and referral flags.", cta: "Take a photo" },
  { href: "/soil", Icon: TestTube2, number: "03", title: "Improve your soil", body: "Turn lab or sensor readings into an acre-based, timed soil improvement plan.", cta: "Check soil health" },
];

export default function Home() {
  const provider = activeProvider();
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><MapPin size={15} /> Agricultural advice for Bhutan</span>
          <h1>Better farm decisions, <em>from soil to harvest.</em></h1>
          <p>GreenChain AI turns your farm details and plant photos into practical guidance for household and commercial farming.</p>
          <div className="hero-actions">
            <Link className="btn" href="/crops">Start with my farm <ArrowRight size={18} /></Link>
            <Link className="text-link" href="/disease"><Camera size={18} /> Diagnose a plant</Link>
          </div>
          <div className="trust-row">
            <span><CheckCircle2 /> Acre-based plans</span><span><CheckCircle2 /> Mixed cropping</span><span><CheckCircle2 /> Expert referral</span>
          </div>
        </div>
        <div className="hero-field" aria-hidden="true">
          <div className="field-ring ring-one" /><div className="field-ring ring-two" />
          <div className="hero-mark"><Leaf /><span>Field-ready advice</span><b>Made for Bhutan</b></div>
        </div>
      </section>

      {!hasApiKey() ? (
        <div className="feedback urgent"><Leaf /><div><b>AI setup is required</b><br />Add an API key to <code>.env.local</code> on the server, then restart the app.</div></div>
      ) : (
        <div className="service-strip"><span className="status-dot" /><b>AI service online</b><span>{provider} · {activeModel()}</span></div>
      )}

      <section className="section-head"><div><span className="eyebrow">Choose a task</span><h2>What do you need help with today?</h2></div><p>Each tool gives a clear explanation, next actions, risks, and sources when available.</p></section>
      <div className="module-grid">
        {MODULES.map(({ href, Icon, number, title, body, cta }) => (
          <Link key={href} href={href} className="module-card">
            <div className="module-top"><span>{number}</span><Icon aria-hidden="true" /></div>
            <h3>{title}</h3><p>{body}</p><div className="go">{cta} <ArrowRight size={18} /></div>
          </Link>
        ))}
      </div>
      <section className="principle-card"><Sprout aria-hidden="true" /><div><span className="eyebrow">Our approach</span><h2>Advice that explains itself.</h2><p>We show why a crop fits, what information is missing, and when you should ask an extension officer. AI supports your decision—it does not replace local experience or laboratory confirmation.</p><Link className="go story-link" href="/about">Why GreenChain started <ArrowRight size={18} /></Link></div></section>
    </>
  );
}
