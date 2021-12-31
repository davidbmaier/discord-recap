# Discord Recap

## Investigation

- go through each of the activity files and see if there's any interesting event types
- maybe go through attachments (for a "amount of MB uploaded" stat)


## Data fields

- Accordions
  - events (pick three to highlight)
    - exclude:
      - reactionAdded
      - messageEdited
      - messageDeleted
      - voiceChannelJoined
      - voiceDMJoined

  - topWords (highlight top 3)
  - topEmotes (highlight top 3)
  - payments (highlight total and number of items)
- Data Fields (numbers)
  - messageCount
  - wordCount
  - characterCount

  - mentionCount
  - emoteCount
  - reactionAdded
  - messageEdited
  - messageDeleted

  - voiceChannelJoined
  - voiceDMJoined

  - sub-values
    - serverCount
    - channelCount
    - mutedCount

    - userCount
    - blockedCount
    - friendCount
- Metadata
  - userID
  - userTag
  - darkMode
  - connections (not sure how to display this yet)
  - firstMessage
- graphs
  - messageCountPerHour
  - messageCountPerDay
  - messageCountPerYear
