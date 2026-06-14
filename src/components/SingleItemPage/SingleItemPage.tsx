import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer, NotFound, Testimonials } from '../ContentIndex';
import { WPPost, WPProject, WPService, WPTestimonial } from '../../types';

const COVER_TAG = 'cover';

interface SingleItemPageProps {
  type: 'blog' | 'project' | 'service';
  posts: WPPost[];
  projects: WPProject[];
  services: WPService[];
  testimonials: WPTestimonial[];
}

const SingleItemPage = ({ type, posts, projects, services, testimonials }: SingleItemPageProps) => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    document.body.classList.add('inner-page');
    return () => document.body.classList.remove('inner-page');
  }, []);

  let item: WPPost | WPProject | WPService | null = null;
  let backPath: string;
  let backLabel: string;

  if (type === 'blog') {
    item = posts.find(p => p.slug === slug) ?? null;
    backPath = '/blog/';
    backLabel = 'Back to Blog';
  } else if (type === 'project') {
    item = projects.find(p => p.slug === slug) ?? null;
    backPath = '/projects/';
    backLabel = 'Back to Projects';
  } else {
    item = services.find(s => s.slug === slug) ?? null;
    backPath = '/services/';
    backLabel = 'Back to Services';
  }

  useEffect(() => {
    document.title = item
      ? `${item.title} | Your Digital Partner`
      : 'Not Found | Your Digital Partner';
  }, [item]);

  if (!item) {
    return <NotFound />;
  }

  const isService = type === 'service';
  const post = type === 'blog' ? (item as WPPost) : null;
  const isCover = post?.tags?.nodes?.some(t => t.name === COVER_TAG) ?? false;
  const tags = post?.tags?.nodes?.filter(t => t.name !== COVER_TAG) ?? [];
  const date = post?.date ? new Date(post.date).toLocaleDateString() : null;
  const image = item.featuredImage?.node ?? null;

  const imageClass =
    type === 'blog'
      ? isCover
        ? 'w-full h-full object-cover'
        : 'max-w-full max-h-full object-contain'
      : 'w-full h-full object-cover';

  return (
    <div id='content' className='mt-48 mb-24 mx-8 relative z-0 single-item-page'>
      <Link
        to={backPath}
        className='inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors duration-200 group'
      >
        <svg
          className='h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='19' y1='12' x2='5' y2='12' />
          <polyline points='12 19 5 12 12 5' />
        </svg>
        {backLabel}
      </Link>

      {isService ? (
        <div className='flex items-center gap-4 mb-2'>
          {image?.sourceUrl && (
            <img
              src={image.sourceUrl}
              alt={image.altText || item.title}
              className='w-10 h-10 object-contain content-icon-tint flex-shrink-0'
            />
          )}
          <h2 className='m-0'>{item.title}</h2>
        </div>
      ) : (
        <>
          {image?.sourceUrl && (
            <div className='w-full h-64 md:h-80 overflow-hidden rounded-xl mb-8 flex items-center justify-center'>
              <img
                src={image.sourceUrl}
                alt={image.altText || item.title}
                className={imageClass}
              />
            </div>
          )}
          {date && (
            <span className='text-white/40 text-xs block mb-2'>{date}</span>
          )}
          <h2>{item.title}</h2>
          {tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className='text-[#4bafeb] text-xs bg-[#4b6ceb]/10 px-2.5 py-1 rounded-full'
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {item.content && (
        <div
          className='project-panel__content'
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}

      {isService && (
        <Link to='/contact/'>
          <div className='mt-8 px-8 py-5 bg-gradient-to-r from-[#4b6ceb] to-[#4bafeb] flex items-center justify-between rounded-xl group cursor-pointer'>
            <div>
              <p className='text-white font-semibold uppercase tracking-widest text-sm m-0'>
                Interested in this service?
              </p>
              <p className='text-white/70 text-xs m-0 mt-1'>
                Get in touch and let's talk.
              </p>
            </div>
            <svg
              className='h-6 w-6 text-white transition-transform duration-300 group-hover:translate-x-1'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='5' y1='12' x2='19' y2='12' />
              <polyline points='12 5 19 12 12 19' />
            </svg>
          </div>
        </Link>
      )}

      <Testimonials data={testimonials} />
      <Footer />
    </div>
  );
};

export default SingleItemPage;
