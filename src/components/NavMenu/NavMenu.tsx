/* A component used to fade out animate components just before being removed from the DOM */

import React, {useState} from "react";

const NavMenu = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-4">      
      <nav>
        <section className="MOBILE-MENU flex">
          <div className="HAMBURGER-ICON space-y-2 grid cursor-pointer" onClick={() => setIsNavOpen((prev) => !prev)}>
            <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
            <span className="block h-0.5 w-5 justify-self-end animate-pulse bg-white"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
          </div>

          <div id="navMenu" className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <div className="absolute top-0 right-0 pl-4 pt-8 pr-8" onClick={() => setIsNavOpen(false)}>
              <svg className="h-8 w-8 text-white cursor-pointer animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/about">About</a>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/portfolio">Portfolio</a>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
        </section>
      </nav>
      <style>{`
      #navMenu{
        position: fixed;
        top: 0;
        bottom: 0;
        transition: all 500ms ease-in;
        background: #000;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
      .hideMenuNav {
        width:0px;
        right:-300px;
        opacity: 0;
      }
      .showMenuNav {
        width: 40%;
        min-width:40vh;
        height: 100vh;
        right:0;
        opacity:1;
      }
    `}</style>
    </div>
  );

}

export default NavMenu;