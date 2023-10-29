export const menu = [
	{ url: '/', title: 'Home' },
	{ url: '/about', title: 'About' },
	{ url: '/services', title: 'Services' },
	{ url: '/projects', title: 'Projects' },
	{ url: '/pricing', title: 'Pricing' },
	{ url: '/contact', title: 'Contact' },
	{ url: '/blog', title: 'Blog' },
];

export const titleCSS = `
  #title{
    position: fixed;
    top: 0px;
    right: 100px;
  }    
  #title h1{
    position: fixed;
    top: 41px;
    left: 18px;
    font-size: 90px;
  }
  
  @media only screen and (max-width: 639px) {
    #title h1{
      font-size: 63px;
      top: 40px;
      left: 14px;
    }
  }

  #logo{
    transition: all; 
    transition-duration: 500ms;
    transition-delay: 500ms;
    opacity: 0;
  }
`;

export const hideScroll = `
.hide-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scroll-bar::-webkit-scrollbar {
  display: none;
}
`;

export const pageContent = `
  #ctas{
    width: 100%;
    margin: 2rem auto 4rem auto;
    text-align: center;
    z-index: 35;
    position: relative;
    display: inline-block !important;
  }
  .cta{ 
    margin-left: 1rem;
  }
  @media (min-width: 768px) { #ctas{ margin-bottom: 1.5rem} }
  #content{
    position: absolute;
    top: 0;
    bottom: 50px;
    left: 0;
    right: 0;
    margin: 8rem 0 6rem 0;
    padding: 2rem;
    z-index: 30;
  }
  @media (max-width: 769px) { #content{ margin: 6rem 0 6rem 0;} }
  #social{
    display: flex !important;
  }
`;
