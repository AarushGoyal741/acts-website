import Mentors from "../components/sections/Mentors";
import Leadership from "../components/sections/Leadership";
import Founders from "../components/sections/Founders";
import Teams from "../components/sections/Teams";

export default function TeamPage({ revealKey }) {
  return (
    <>
      <Mentors revealKey={revealKey} />
      <Leadership revealKey={revealKey} />
      <Founders revealKey={revealKey} />
      <Teams revealKey={revealKey} />
    </>
  );
}