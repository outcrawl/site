import React from 'react';
import Helmet from 'react-helmet';

const Meta = ({ post, meta }) => (
  <Helmet>
    <title>{post.title} - {meta.title}</title>

    <meta name="title" content={post.title} />
    <meta name="description" content={post.description} />
    <meta property="author" content={post.authorData.name} />

    {/* Article */}
    <meta property="article:published_time" content={new Date(Date.parse(post.date)).toISOString()} />
    <meta property="article:modified_time" content={new Date(Date.parse(post.date)).toISOString()} />
    <meta property="article:publisher" content={meta.facebookPublisherUrl} />
    {post.keywords ? <meta name="keywords" content={post.keywords.join(',')} /> : ''}
    {post.tags.map(tag => <meta key={tag} property="article:tag" content={tag.toLowerCase()} />)}

    {/* General */}
    <meta name="robots" content="index, follow" />
    <meta property="al:web:url" content={post.permalink} />
    <meta name="google" content="notranslate" />

    {/* Facebook */}
    <meta property="og:title" content={post.title} />
    {post.authorData.social.facebook ? <meta property="article:author" content={post.authorData.social.facebook} /> : ''}
    <meta property="og:url" content={post.permalink} />
    <meta property="og:image" content={post.coverSrc} />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
    <meta property="og:description" content={post.description} />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content={meta.title} />

    {/* Twitter */}
    <meta name="twitter:description" content={post.description} />
    <meta name="twitter:image:src" content={post.coverSrc} />
    <meta name="twitter:site" content="@tinrab" />
    <meta name="twitter:card" content="summary_large_image" />
    {post.authorData.social.twitter ? <meta name="twitter:creator" content={`@${post.authorData.social.twitter}`} /> : ''}

  </Helmet>
);

export default Meta;
