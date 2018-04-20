import React from 'react';
import Link from 'gatsby-link';
import Typography from 'material-ui/Typography';

import { Page, PageSection } from './page';
import Markdown from './markdown';
import Twitter from '../assets/svg/twitter.svg';
import Facebook from '../assets/svg/facebook.svg';
import GooglePlus from '../assets/svg/google-plus.svg';

const ArticleHeader = ({ article }) => (
  <section className="page__meta">
    <div className="page__info">
      <img
        className="page__author-avatar"
        src={`https://www.gravatar.com/avatar/${
          article.author.emailHash
        }?s=120`}
        alt={`${article.author.name} avatar`}
      />
      <div className="page__author">
        <Link
          className="page__author-name"
          to={`/authors/${article.author.slug}`}
        >
          {article.author.name}
        </Link>
        <span className="page__date">{article.date}</span>
      </div>
    </div>
    <div className="page__share">
      <a
        className="button button--icon button--twitter"
        href={`https://twitter.com/intent/tweet?url=${article.permalink}&text=${
          article.title
        }`}
      >
        <Twitter />
      </a>
      <a
        className="button button--icon button--facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${
          article.permalink
        }`}
      >
        <Facebook />
      </a>
      <a
        className="button button--icon button--google-plus"
        href={`https://plus.google.com/share?url=${article.permalink}`}
      >
        <GooglePlus />
      </a>
    </div>
  </section>
);

const ArticleFooter = ({ article }) => (
  <section className="page__meta">
    <div className="page__tags">
      {article.tags.map((tag) => (
        <Link className="tag" key={tag.slug} to={`/tags/${tag.slug}`}>
          {tag.name}
        </Link>
      ))}
    </div>
    <div className="page__share">
      <a
        className="button button--icon button--twitter"
        href={`https://twitter.com/intent/tweet?url=${article.permalink}&text=${
          article.title
        }`}
      >
        <Twitter />
      </a>
      <a
        className="button button--icon button--facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${
          article.permalink
        }`}
      >
        <Facebook />
      </a>
      <a
        className="button button--icon button--google-plus"
        href={`https://plus.google.com/share?url=${article.permalink}`}
      >
        <GooglePlus />
      </a>
    </div>
  </section>
);

const Related = ({ related }) => (
  <section className="page__section">
    <h1 className="page__section__title">Related</h1>
    <ul className="page__related">
      {related.map((a) => (
        <li key={a.slug}>
          <Link to={a.slug}>{a.title}</Link>
        </li>
      ))}
    </ul>
  </section>
);

const ArticlePage = ({ article }) => {
  return (
    <Page narrow>
      <PageSection component="article">
        {/*
    <Typography variant="display4" gutterBottom>
        {article.title}
      </Typography>
    */}

        <Markdown source={article.markdown} />

        <hr />

        <div dangerouslySetInnerHTML={{ __html: article.html }} />

        {/*
    <div className="page page--narrow">
    <article>
      <h1 className="page__title">{article.title}</h1>
      <ArticleHeader article={article} />
      <ArticleFooter article={article} />
      </article>
      <Related related={article.related} />
    </div>
    */}
      </PageSection>
    </Page>
  );
};

export default ArticlePage;
