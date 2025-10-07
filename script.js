document.getElementById("searchBtn").addEventListener("click", getMeaning);

async function getMeaning() {
  const word = document.getElementById("wordInput").value.trim();
  const resultBox = document.getElementById("result");
  resultBox.innerHTML = ""; // clear old results

  if (!word) {
    resultBox.innerHTML = "<p>⚠️ Please enter a word.</p>";
    return;
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error("Word not found");
    const data = await response.json();

    // Word + phonetics
    const phonetic = data[0].phonetics.find(p => p.text)?.text || "";
    const audio = data[0].phonetics.find(p => p.audio)?.audio || "";

    const wordCard = document.createElement("div");
    wordCard.className = "word-card";
    wordCard.innerHTML = `
      <h2>${data[0].word} <span>${phonetic}</span></h2>
      ${audio ? `<audio controls src="${audio}"></audio>` : ""}
    `;
    resultBox.appendChild(wordCard);

    // Meanings
    data[0].meanings.forEach(meaning => {
      const meaningCard = document.createElement("div");
      meaningCard.className = "meaning-card";

      let defs = "";
      meaning.definitions.forEach((def, i) => {
        defs += `
          <p><strong>${i + 1}.</strong> ${def.definition}</p>
          ${def.example ? `<p><em>Example: ${def.example}</em></p>` : ""}
          ${def.synonyms && def.synonyms.length > 0 ? 
            `<p><strong>Synonyms:</strong> ${def.synonyms.join(", ")}</p>` : ""}
        `;
      });

      meaningCard.innerHTML = `
        <h3>Part of Speech: ${meaning.partOfSpeech}</h3>
        ${defs}
      `;
      resultBox.appendChild(meaningCard);
    });

  } catch (error) {
    resultBox.innerHTML = "<p>❌ Word not found. Try another.</p>";
  }
}

