const randInt = (max) => Math.floor(Math.random() * max)

collections.get("tng-lines", `*${$.data.character}*`).then((state) => {
  return {
    ...state,
    lines: state.data,
  };
});

collections.get("tng-char-map", "characters").then((state) => {
  return {
    ...state,
    characters: state.data,
  };
});

fn((state) => {
  console.log(`Fetched ${Object.keys(state.lines).length} lines`);

  const { value: quote } = state.lines[randInt(state.lines.length)];
  const name = state.characters[quote.character] || quote.character;

  console.log (`
"${quote.quote}"
 -- ${name} - ${quote.title}
`);

  return state.data;
});

// TODO post our quote somewhere!
