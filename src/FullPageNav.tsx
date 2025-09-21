// FullPageNav.tsx
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3_fp";
import Section4 from "./section4";
import Section5 from "./section5";
import Footer from "./footer";

export default function FullPageNav() {
  return (
    <div className="fp-root">
      <section className="fp-section" id="section1"><Section1 /></section>
      <section className="fp-section" id="section2"><Section2 /></section>
      <section className="fp-section" id="section3">
        {/* Section3 내부에서 wheel 처리 */}
        <Section3 />
      </section>
      <section className="fp-section" id="section4"><Section4 /></section>
      <section className="fp-section" id="section5"><Section5 /></section>
      <section className="fp-last" id="footer"><Footer /></section>
    </div>
  );
}
