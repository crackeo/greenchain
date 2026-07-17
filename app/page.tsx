import Link from "next/link";
import { hasApiKey } from "@/lib/claude";

const MODULES = [
  {
    href: "/crops", ico: "🌱", title: "Crop Selection",
    body: "Tell us your elevation, water, and soil — get ranked crop recommendations tuned to Bhutan's agro-ecological zones.",
  },
  {
    href: "/disease", ico: "🔍", title: "Disease Check",
    body: "Photograph a sick plant and get a diagnosis with organic-first treatment and a clear flag when NPPC should look at it.",
  },
  {
    href: "/soil", ico: "🧪", title: "Soil Health",
    body: "Enter soil test values (IoT sensors plug in later) and receive a practical amendment plan in farmer-sized quantities.",
  },
];

export default function Home() {
  return (
    <>
      <div className="hero">
        <h1>Grow the right crop, on <em>your</em> land.</h1>
        <p>
          GreenChain AI brings agronomy expertise to every farmer in Bhutan — crop
          selection, plant disease diagnosis, and soil health management, built for
          cardamom, citrus, and apple growers first.
        </p>
      </div>

      {!hasApiKey() && (
        <div className="info-box">
          ⚙️ Setup needed: create <b>.env.local</b> in the project folder containing{" "}
          <b>ANTHROPIC_API_KEY=sk-ant-…</b> and restart the dev server to enable AI advice.
        </div>
      )}

      <div className="module-grid">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href} className="module-card">
            <div className="ico">{m.ico}</div>
            <h3>{m.title}</h3>
            <p>{m.body}</p>
            <div className="go">Open →</div>
          </Link>
        ))}
      </div>
    </>
  );
}
