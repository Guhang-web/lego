// FullPageNav.tsx
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3"; // 내부에서 <section id="section3"> 렌더함
import Section4 from "./section4";
import Section5 from "./section5";
import Footer from "./footer";

export default function FullPageNav() {
  return (
    <div className="page">
      <section id="section1"><Section1 /></section>
      <section id="section2"><Section2 /></section>
      <Section3 />

      <section id="section4"><Section4 /></section>
      <section id="section5"><Section5 /></section>
      <footer id="footer"><Footer /></footer>
    </div>
  );
}
