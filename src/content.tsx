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
    top: 49px;
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
