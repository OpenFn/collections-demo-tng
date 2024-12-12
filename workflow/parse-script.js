fn((state) => {
  const { text, episode, title } = state.data;
  console.log(`Parsing lines for ${episode} - ${title}`);

  const characters = {};

  // pull out each line
  const lines = text
    .split("\n")
    .filter((line) => line.length)
    .filter((line) => /[A-Z]+\:/.test(line))
    .map((line, index) => {
      const [name, ...rest] = line.split(":");
      const character = name.trim().toLowerCase();
      characters[character] = true;
      return {
        id: `${character}-${episode}-${index}`,
        character,
        episode,
        title,
        quote: rest.join("").trim(),
      };
    });

  console.log(`Parsed ${lines.length} lines!`);
  console.log("First line:");
  console.log(lines[0]);

  return {
    lines,
    characters,
    ...state,
  };
});

// Now upload all the values
collections.set("tng-lines", (item) => item.id, $.lines);

// Now update the character map
collections.get("tng-char-map", "characters");

// Add new characters to the map
fn((state) => {
  console.log("Updating character map");

  const map = state.data;

  for (const id in state.characters) {
    // Add new characters but don't override existing strings
    if (!map[id]) {
      console.log("Adding character", id);
      map[id] = false;
    }
  }

  return {
    characters: map,
    ...state,
  };
});

collections.set("tng-char-map", "characters", $.characters);
