export const breakpointColumnsObj = {
	default: 4,
	1100: 3,
	700: 2,
	500: 1,
};

export const tableContent = [
	{
		title: 'Design',
		price: 'Get in touch!',
		content: `Whether you already have a creative vision or you need some creative suggestions, we're here to help transform your ideas into reality. Our process starts by sitting down with you to get to know you and understand your needs and requirements. <br><br>From logo designs, websites, or print media such as flyers, catalogs or banners, we can help.`,
	},
	{
		title: 'Websites',
		price: 'Base: $2,500',
		content: `Revamp or launch your website with our comprehensive package. This includes a strategic consultation where we focus on you and your goals, design guidance, website development, with a couple of reviews before taking the site live. We ensure security, speed, SEO optimization, and prioritize user experience. Our aim is to establish a robust online presence for your business, laying the groundwork for growth. Custom features or eCommerce solutions can be discussed separately.<br><br>We favor WordPress for content management but are flexible with your preferred platform. We also assist with email and user management, domain registration, and hosting setup. Hosting with us? Enjoy the first year free (up to $450 in value). <strong>We also offer payment plans if necessary</strong>. Get in touch with us, and let us help get you up and running!`,
	},
	{
		title: 'Web Hosting	',
		price: '$45 monthly',
		content: `Simplify your website hosting with our reliable, dedicated, and secure managed cloud solutions. Choose between a convenient monthly subscription at $45 or an <strong>annual plan at $450 (both GST exclusive) with a two-month discount for annual payments</strong>. This flexible pricing model adapts to your needs, offering automated backups, dedicated firewalls, and SSH & SFTP access if required. For high-traffic websites with specific bandwidth or storage needs, let us know for tailored monitoring and charges.<br><br>All hosting plans include 1 hour of free monthly website support, even for content management assistance, and a staging website for pre-change testing. Additional hours are billed at $110 per hour (GST exclusive), with notification before any work begins. For ongoing development, maintenance or regular content updates, we're also open to discussing a retainer arrangement tailored to your requirements.`,
	},
	{
		title: 'Automation',
		price: 'Get in touch!',
		content: `Unlock valuable time for more meaningful tasks in your day by embracing automation. Whether we guide you in creating automation workflows or develop custom solutions, our focus is to streamline and enhance your business efficiency. From CRM setup to email marketing automation, we handle processes like data transfer and document generation, saving you time and effort.<br><br>It's an effective way to optimize your operations and, in turn, save costs. Keep in mind that ongoing automation may incur monthly software charges, which we'll discuss with you before moving forward.`,
	},
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
    left: 48px;
    font-size: 90px;
  }
  
  @media only screen and (max-width: 639px) {
    #title h1{
      font-size: 63px;
      top: 32px;
      left: 43px;
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
