document.addEventListener("DOMContentLoaded", function() {
    var translate = document.getElementById("translate");
    var translatedTextArea = document.getElementById("translatedTextArea");
    var textToTranslateArea = document.getElementById("textToTranslateArea");
    var howto = document.getElementById("howto");

    var to_spanish = document.getElementById("to_spanish");
    var to_english = document.getElementById("to_english");
    var to_swedish = document.getElementById("to_swedish");
    var to_lang = document.getElementById("to_lang_text");

    var from_spanish = document.getElementById("from_spanish");
    var from_english = document.getElementById("from_english");
    var from_swedish = document.getElementById("from_swedish");
    var from_lang = document.getElementById("from_lang_text");

    var originLanguage = "spanish";
    var transLanguage = "english";
    const token = "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";

    window.onclick = function(event) {
        if (!event.target.matches('.languageSection .translateToLanguage')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.style.display === "block") {
                    openDropdown.style.display = "none";
                }
            }
        }
    }

    translate.addEventListener("click", function() {
        var text = textToTranslateArea.value;
        if (howto.value) {
            howto.value = "and " + howto.value;
        }
        fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": `translate this text in ${originLanguage}: "${text}" to ${transLanguage}. Do not include anything else in your reply that is not the translated text ${howto.value}`}]
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            translatedTextArea.value = data.choices[0].message.content;
        })
    });

    to_spanish.addEventListener("click", function() {transLanguage = "spanish"; to_lang.textContent = transLanguage});
    to_english.addEventListener("click", function() {transLanguage = "english"; to_lang.textContent = transLanguage});
    to_swedish.addEventListener("click", function() {transLanguage = "swedish"; to_lang.textContent = transLanguage});

    from_spanish.addEventListener("click", function() {originLanguage = "spanish"; from_lang.textContent = originLanguage});
    from_english.addEventListener("click", function() {originLanguage = "english"; from_lang.textContent = originLanguage});
    from_swedish.addEventListener("click", function() {originLanguage = "swedish"; from_lang.textContent = originLanguage});
});