import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Row from './Row';
import Tile from './Tile';
import TopList from './TopList';

const TopWordsAndEmotes = (props) => {
  const {
    topWords, topEmotes, shareable,
  } = props;

  const [emotesOpen, setEmotesOpen] = useState(shareable);
  const [wordsOpen, setWordsOpen] = useState(shareable);

  const getTopWords = () => {
    const words = topWords.map(
      ({ name, count }, index) => ({
        name, value: `${count}`, id: name, index: index + 1,
      }),
    );
    if (shareable) {
      return words.slice(0, 5);
    }
    return words;
  };

  const getTopEmotes = () => {
    const emotes = topEmotes.map(
      ({ name, count, id }, index) => ({
      // default emoji don't have an id - but "id" maps to the key attribute
        name, value: `${count}`, id: name, emoteID: id, icon: true, index: index + 1,
      }),
    );
    if (shareable) {
      return emotes.slice(0, 5);
    }
    return emotes;
  };

  return (
    <Row>
      <Tile flex={3}>
        <TopList
          items={getTopWords().slice(0, 3)}
          title={`Top ${getTopWords().length} Words`}
          tooltip="Excluding emotes and words that are five characters or shorter"
          open
        />
        <TopList
          items={getTopWords().slice(3)}
          title=""
          open={wordsOpen}
          onToggle={() => {
            setWordsOpen(!wordsOpen);
            setEmotesOpen(!wordsOpen);
          }}
        />
      </Tile>
      <Tile flex={3}>
        <TopList
          items={getTopEmotes().slice(0, 3)}
          title={`Top ${getTopEmotes().length} Emotes`}
          open
          ignoreEmoji
        />
        <TopList
          items={getTopEmotes().slice(3)}
          title=""
          open={emotesOpen}
          onToggle={() => {
            setEmotesOpen(!emotesOpen);
            setWordsOpen(!emotesOpen);
          }}
          ignoreEmoji
        />
      </Tile>
    </Row>
  );
};

TopWordsAndEmotes.propTypes = {
  topWords: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
  topEmotes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    id: PropTypes.string,
  })).isRequired,
  shareable: PropTypes.bool,
};

export default TopWordsAndEmotes;
