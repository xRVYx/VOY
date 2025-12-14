export default function shuffleText(value) {
  const characters = [...value];
  for (let i = characters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  return characters.join('');
}
