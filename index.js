document.addEventListener("DOMContentLoaded", function () {
    var translate = document.getElementById("translate");
    var translatedTextArea = document.getElementById("translatedTextArea");
    var textToTranslateArea = document.getElementById("textToTranslateArea");
    var howto = document.getElementById("howto");
    var downloadTranslate = document.getElementById("downloadTranslate");
    var copyTranslate = document.getElementById("copyTranslate");
    var bookmark_container = document.getElementById("bookmark-container");
    var bookmarkTranslate = document.getElementById("bookmarkTranslate");
    var speak = document.getElementById("text-to-speech");
    var read = document.getElementById('file-upload');
    var token_inp = document.getElementById("token_input");

    var to_spanish = document.getElementById("to_spanish");
    var to_english = document.getElementById("to_english");
    var to_swedish = document.getElementById("to_swedish");
    var to_other = document.getElementById("to_other");
    var to_lang = document.getElementById("to_lang_text");

    var from_spanish = document.getElementById("from_spanish");
    var from_english = document.getElementById("from_english");
    var from_swedish = document.getElementById("from_swedish");
    var from_detect = document.getElementById("from_detect");
    var from_other = document.getElementById("from_other");
    var from_lang = document.getElementById("from_lang_text");

    var originLanguage = "spanish";
    var transLanguage = "english";
    var bookmarks = [];
    var index = 0;

    window.onclick = function (event) {
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

    speak.addEventListener("click", function () {
        var token = token_inp.value;
        if (translatedTextArea.value) {
            fetch("https://api.openai.com/v1/audio/speech", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    "model": "tts-1",
                    "input": translatedTextArea.value,
                    "voice": "onyx",
                })
            }).then(response => response.blob())
                .then(blob => {
                    var blobUrl = URL.createObjectURL(blob);
                    var audio = new Audio(blobUrl);
                    audio.play();
                })
                .catch(error => {
                    console.error('Error fetching audio:', error);
                });
        }
    });

    translate.addEventListener("click", function () {
        var text = textToTranslateArea.value;
        var token = token_inp.value;

        if (to_other.value) {
            transLanguage = to_other.value;
        }
        if (from_other.value) {
            originLanguage = from_other.value;
        }
        if (originLanguage = "detect") {
            originLanguage = "this language I do not know"
        }
        fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": `translate this text in ${originLanguage}: "${text}" to ${transLanguage}. Do not include anything else in your reply that is not the translated text ${howto.value}` }]
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            translatedTextArea.value = data.choices[0].message.content;
        }).catch(error => {
            alert("please enter a valid api token")
        })
    });

    to_spanish.addEventListener("click", function () { transLanguage = "spanish"; to_lang.textContent = transLanguage });
    to_english.addEventListener("click", function () { transLanguage = "english"; to_lang.textContent = transLanguage });
    to_swedish.addEventListener("click", function () { transLanguage = "swedish"; to_lang.textContent = transLanguage });

    from_spanish.addEventListener("click", function () { originLanguage = "spanish"; from_lang.textContent = originLanguage });
    from_english.addEventListener("click", function () { originLanguage = "english"; from_lang.textContent = originLanguage });
    from_swedish.addEventListener("click", function () { originLanguage = "swedish"; from_lang.textContent = originLanguage });
    from_detect.addEventListener("click", function () { originLanguage = "detect"; from_lang.textContent = originLanguage });

    downloadTranslate.addEventListener("click", function () {
        var blob = new Blob([translatedTextArea.value], { type: 'text/plain' });
        var a = document.createElement('a');

        a.href = window.URL.createObjectURL(blob);
        a.download = 'translation.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    copyTranslate.addEventListener("click", function () {
        translatedTextArea.select();
        document.execCommand('copy');
        translatedTextArea.setSelectionRange(0, 0);
        alert('Text copied to clipboard!');
    });

    bookmarkTranslate.addEventListener("click", function () {
        var p = document.createElement("p");
        p.id = index;
        index++;
        p.style.backgroundColor = "white";
        p.style.color = "black";
        p.style.padding = "1em"
        p.style.borderRadius = "5px";
        p.style.width = "20%";
        p.style.cursor = "pointer";
        var now = new Date();
        var day = now.getDate();
        var month = now.getMonth() + 1;
        var hour = now.getHours();
        var minute = now.getMinutes();

        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;
        hour = (hour < 10) ? '0' + hour : hour;
        minute = (minute < 10) ? '0' + minute : minute;

        var displayDate = day + '/' + month + ' ' + hour + ':' + minute + '     |     ';

        p.textContent = displayDate + textToTranslateArea.value.substring(0, 10) + '...';
        bookmark_container.appendChild(p);

        bookmarks.push({ 'date': displayDate, 'from': textToTranslateArea.value, 'to': translatedTextArea.value });

        p.addEventListener("click", function () {
            var i = this.id;
            textToTranslateArea.value = bookmarks[i].from;
            translatedTextArea.value = bookmarks[i].to;
        });
    });

    read.addEventListener('change', function(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result;
            textToTranslateArea.value = content;
        };
        reader.readAsText(file);
    });

});