async function loadJSON(path) {
  const r = await fetch(path);
  return r.json();
}

async function updateTitles(pinyin, translation) {
                                    document.getElementById('pinyin').textContent = pinyin;
                                    document.getElementById('translation').textContent = translation;
                }

async function init() {
  const [
    rads_traditional,
    rads_simplified,
    translations,
  ] = await Promise.all([
    loadJSON("./rads_traditional.json"),
    loadJSON("./rads_simplified.json"),
    loadJSON("./translations.json"),
  ]);

  const tg = window.Telegram.WebApp;
  const theme = tg.themeParams;

  const HanziWriter = window.HanziWriter;

  const win_width = window.innerWidth;
  const win_height = window.innerHeight;
  const size = win_width/100*90;
  const padding = win_width/100*10;
  const drawingWidth = size /100*30;

  let i = 0;
  let writer = null;

  let subtitle_text_color = '#181b3c';
  let second_subtitle_text_color = '#7dbc7f';


if (theme && theme.bg_color) {


        function hexToRgb(hex) {
              hex = hex.replace(/^#/, "");
              const bigint = parseInt(hex, 16);
              return [
                (bigint >> 16) & 255, // R
                (bigint >> 8) & 255,  // G
                bigint & 255           // B
              ];
          }

        function rgbToHex([r, g, b]) {
            return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
          }

          // вычисление промежуточного цвета
          function mixColor(hex1, hex2, t) {
            const c1 = hexToRgb(hex1);
            const c2 = hexToRgb(hex2);
            const mixed = c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
            return rgbToHex(mixed);
          }
                              // 20% от subtitle к text
  second_subtitle_text_color = mixColor(theme.subtitle_text_color, theme.text_color, 0.4);
  subtitle_text_color = theme.subtitle_text_color;

  document.documentElement.style.setProperty("--body-bg", theme.secondary_bg_color);
  document.documentElement.style.setProperty("--upper-bg", theme.bg_color);
  document.documentElement.style.setProperty("--lower-bg", theme.bg_color);
  document.documentElement.style.setProperty("--border", theme.section_separator_color);
  document.documentElement.style.setProperty("--text-color", second_subtitle_text_color);
  document.documentElement.style.setProperty("--translation-color", theme.subtitle_text_color);
  document.documentElement.style.setProperty("--box-shadow", theme.section_bg_color);

}


const select = document.getElementById("radicalSelect");


for (const el of rads_traditional) {
  const option = document.createElement("option");
  option.value = el.id;
  option.textContent = el.text;
  select.appendChild(option);
}

select.addEventListener("change", () => {
  i=select.value-1;
  loadChar();
  console.log(i);
});

  
  function loadChar() {
          if (writer) {
              writer.cancelQuiz();
              document.getElementById('character-target-div').innerHTML = "";
          }
              


                    // i = (i + 1) % radicals.length;
                    updateTitles(rads_simplified[i]["pinyin"], translations[i+1]);

                    writer = HanziWriter.create('character-target-div', rads_traditional[i]["text"], {
                        width: size,
                        height: size,
                        leniency: 1.2,
                        strokeAnimationSpeed: 15,
                        strokeFadeDuration: 40,
                        strokeColor: second_subtitle_text_color,
                        drawingColor: subtitle_text_color,
                        outlineColor: subtitle_text_color,
                        drawingWidth: drawingWidth,


                    });

                    writer.quiz({   
                                    onComplete() {
                                        nextCard();
                                        i=i+1
                                    }
                                });
                }

  function nextCard() { 
                    // i = (i + 1) % radicals.length;
                    loadChar();
                    //updateTitles(rads_simplified[i]["pinyin"], translations[i+1]);

                      }

  // ВСЯ логика здесь

  console.log(theme)

  tg.expand();

  loadChar();
}

init();
