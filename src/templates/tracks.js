import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import ItemsPage from '../components/ItemsPage';
import Spacer from '../components/Spacer';
import TrackCard from '../components/tracks/Card';

// import * as css from './tracks.module.css';

const TracksPage = ({ data, pageContext, location }) => {
  const tracks = data.tracks.nodes;
  const languages = data.languages.nodes.map(({ value }) => value);
  const topics = data.topics.nodes.map(({ value }) => value);

  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.nodes[0].childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.nodes[0].childImageSharp.gatsbyImageData;

  return (
    <ItemsPage
      title="Tracks"
      location={location}
      itemsPath="tracks"
      variant="red"
      languages={languages}
      topics={topics}
      showPagination={tracks.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      {(filters) =>
        tracks.map((track) => (
          <Fragment key={track.slug}>
            <TrackCard
              {...track}
              image={
                track.cover?.file.childImageSharp.gatsbyImageData ??
                (track.type === 'main'
                  ? placeholderMainTrackImage
                  : placeholderSideTrackImage)
              }
              path={`/tracks/${track.slug}`}
              variant="red"
              filters={filters}
            />
            <Spacer />
          </Fragment>
        ))
      }
    </ItemsPage>
  );
};

export const query = graphql`
  query ($skip: Int!, $limit: Int!, $topic: String!, $language: String!) {
    tracks: allTrack(
      filter: {
        languagesFlat: { regex: $language }
        topicsFlat: { regex: $topic }
      }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        title
        slug
        description
        numVideos
        type
        languages
        topics
        videos {
          slug
          languages
          topics
          title
        }
        chapters {
          title
          videos {
            slug
            languages
            topics
            title
          }
        }
        cover {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
    placeholderMainTrackImage: allFile(
      filter: {
        name: { eq: "placeholder" }
        sourceInstanceName: { eq: "main-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    placeholderSideTrackImage: allFile(
      filter: {
        name: { eq: "placeholder" }
        sourceInstanceName: { eq: "side-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    languages: allTag(filter: { type: { eq: "language" } }) {
      nodes {
        value
      }
    }
    topics: allTag(filter: { type: { eq: "topic" } }) {
      nodes {
        value
      }
    }
  }
`;

export default TracksPage;