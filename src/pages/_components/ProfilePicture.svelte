<script>
  export let name;

  $: bgColor = stringToColour(name);
  $: fgColor = pickTextColorBasedOnBgColorAdvanced(
    bgColor,
    "#FFFFFF",
    "#000000"
  );

  function stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  }

  function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
    var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return L > 0.179 ? darkColor : lightColor;
  }
</script>

<div
  style="background:{bgColor}; flex-shrink: 0; width: 48px; height: 48px; display: inline-block;
              border-radius: 48px; display: flex; align-items: center; justify-content: center;"
>
  <span style="font-size: 24px; color: {fgColor}"
    >{name != null ? name.charAt(0) : "h"}</span
  >
</div>
