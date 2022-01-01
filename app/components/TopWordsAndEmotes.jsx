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
    ({ name, count }) => ({ name, value: `${count}`, id: name }),
  );

  const getTopEmotes = () => topEmotes.map(
    ({ name, count, id }) => ({
      // default emoji don't have an id - but "id" maps to the key attribute
      name, value: `${count}`, id: name, emoteID: id,
    }),
  );

  return (
    <Row>
      <Tile flex={3}>
        <TopList
          items={getTopWords()}
          title="Top 20 Words"
          open={wordsOpen}
          onToggle={() => {
            setWordsOpen(!wordsOpen);
            setEmotesOpen(!wordsOpen);
          }}
        />
      </Tile>
      <Tile flex={3}>
        <TopList
          items={getTopEmotes()}
          title="Top 20 Emotes"
          open={emotesOpen}
          onToggle={() => {
            setEmotesOpen(!emotesOpen);
            setWordsOpen(!emotesOpen);
          }}
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
