import Reveal from "./Reveal";

type SectionHeadingProps = {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
};

export default function SectionHeading({ kicker, title, sub }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="kicker">{kicker}</p>
      <h2 className="h-section">{title}</h2>
      {sub ? <p className="section-sub">{sub}</p> : null}
    </Reveal>
  );
}
