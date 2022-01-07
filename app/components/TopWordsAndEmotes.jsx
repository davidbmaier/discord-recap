import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Row from './Row';
import Tile from './Tile';
import TopList from './TopList';

const TopWordsAndEmotes = (props) => {
  const {
    topWords, topEmotes,
  } = props;

  const [emotesOpen, setEmotesOpen] = useState(false);
  const [wordsOpen, setWordsOpen] = useState(false);

  const getTopWords = () => topWords.map(
    ({ name, count }, index) => ({
      name, value: `${count}`, id: name, index: index + 1,
    }),
  );

  const getTopEmotes = () => topEmotes.map(
    ({ name, count, id }, index) => ({
      // default emoji don't have an id - but "id" maps to the key attribute
      name, value: `${count}`, id: name, emoteID: id, icon: true, index: index + 1,
    }),
  );

  return (
    <Row>
      <Tile flex={3}>
        <TopList
          items={getTopWords().slice(0, 3)}
          title={`Top ${topWords.length} Words`}
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
          title={`Top ${topEmotes.length} Emotes`}
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
};

export default TopWordsAndEmotes;
