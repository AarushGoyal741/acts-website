import FAQ from "../components/sections/FAQ";
import AskQuestion from "../components/sections/AskQuestion";
import Contact from "../components/sections/Contact";

export default function FAQPage({ revealKey }) {
  return (
    <>
      <FAQ revealKey={revealKey} />
      <AskQuestion revealKey={revealKey} />
      <Contact revealKey={revealKey} />
    </>
  );
}