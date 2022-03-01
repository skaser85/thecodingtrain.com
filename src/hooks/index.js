import { useMemo, useRef, useEffect } from 'react';
import { passiveEventArg } from '../utils';
/**
 * Takes an array of images nodes and makes a hashed object based on their names
 */
export const useImages = (nodes, property = 'name') => {
  return useMemo(() => {
    const images = {};
    for (let i = 0; i < nodes.length; i++) {
      images[nodes[i][property]] = nodes[i].childImageSharp.gatsbyImageData;
    }
    return images;
  }, [nodes, property]);
};

export const filterVideos = (videos, filters) => {
  const { isFiltered, language, topic } = filters;
  if (!isFiltered) return videos;
  return videos.filter(
    (v) =>
      (language === 'all' || v.languages.includes(language)) &&
      (topic === 'all' || v.topics.includes(topic))
  );
};

export const useSelectedTags = (pathname) => {
  const splittedString = pathname.replace('%20', ' ').split('/');
  const filterString =
    splittedString[2] && splittedString[2].includes('+')
      ? splittedString[2]
      : 'lang:all+topic:all';
  const [languageFilter, topicFilter] = filterString.split('+');
  return [languageFilter.split(':')[1], topicFilter.split(':')[1]];
};

const scrollPositions = {};
let lastKey;

// persists scroll position of an element across page refreshes
export const usePersistScrollPosition = (key, _namespace) => {
  const namespace = _namespace || key;

  const ref = useRef(); // the ref
  const frame = useRef(); // internal timer

  // if set, override scrollTop of element on initial load
  useEffect(() => {
    const current = ref.current;

    // save the current scroll position, debounced with requestAnimationFrame
    const onScroll = (e) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        // console.log('setting scroll to', scrollPositions[namespace]);
        scrollPositions[namespace] = e.target.scrollTop;
      });
    };

    if (lastKey !== key) {
      // console.log('resetting scroll');
      scrollPositions[namespace] = 0;
    } else if (scrollPositions[namespace]) {
      // console.log('restoring scroll to', scrollPositions[namespace]);
      current.scrollTop = scrollPositions[namespace];
    }

    lastKey = key;
    current.addEventListener('scroll', onScroll, passiveEventArg);

    return () => {
      current.removeEventListener('scroll', onScroll, passiveEventArg);
    };
  }, [key, namespace]);

  return ref;
};
