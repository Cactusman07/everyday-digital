import CTAS from "./CTAS";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-8 mt-12 pb-10 text-center md:text-right left-0 right-0 bottom-0 relative">
      <CTAS />
      <div className="flex align-middle items-center flex-auto">
        <SocialIcons />
        <div className="flex flex-auto flex-row-reverse">
          &copy;{` Copyright ${year} Every Day Digital Limited`}
        </div>
      </div>
    </footer>
  );
}
