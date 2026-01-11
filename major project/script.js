const input = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");


input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = input.value.trim();

    if (word === "") {
        alert("Please enter a word");
        return;
    }

    resultDiv.innerHTML = "Loading...";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => displayResult(data))
        .catch(() => {
            resultDiv.innerHTML =
                "<p style='color:red;'>Word not found. Please try another word.</p>";
        });
}

function displayResult(data) {
    const wordData = data[0];
    const meaning = wordData.meanings[0];
    const definition = meaning.definitions[0];

    const phonetic = wordData.phonetic || "Not available";
    const example = definition.example || "Example not available";

    let audioHTML = "";
    if (wordData.phonetics[0] && wordData.phonetics[0].audio) {
        audioHTML = `
            <button class="audio-btn" onclick="playAudio('${wordData.phonetics[0].audio}')">
                🔊 Play Pronunciation
            </button>`;
    }

    resultDiv.innerHTML = `
        <h3>${wordData.word}</h3>
        <p class="phonetic">${phonetic}</p>
        <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
        <p><strong>Meaning:</strong> ${definition.definition}</p>
        <p><strong>Example:</strong> ${example}</p>
        ${audioHTML}
    `;
}

function playAudio(audioURL) {
    const audio = new Audio(audioURL);
    audio.play();
}