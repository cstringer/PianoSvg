var PianoSvg = (function($) {
  /*
   * Namespace
   */
  var Piano = {};

  /*
   * Config
   */
  Piano.config = {

    pianoId: "piano",

    octaves: 2,

    key: {
      elemType: "rect",
      elemNS: 'http://www.w3.org/2000/svg',
      class: "key"
    },

    keysWhite: {
      names: ["C","D","E","F","G","A","B"],
      class: "key-white",
      height: 120,
      width: 23,
      spacing: 23
    },

    keysBlack: {
      names: ["Db","Eb","Gb","Ab","Bb"],
      class: "key-black",
      height: 80,
      width: 13,
      spacing: [14.33333,41.66666,82.25,108.25,134.75]
    }
  };

  /*
   * Data
   */
  // Array of clicked piano keys {id: element ID, color: rgb value}
  var clickedKeys = [];

  /*
   * Init
   */
  Piano.init = function(config) {
		config = config  || Piano.config;
    var pContainer = document.getElementById("pianoContainer"),
        pElem,
        octNdx,
        octWidth,
        kwi,
        kbi,
        kElem;

    $(pContainer).empty();
    resetClickedKeys();
    $("#output").empty();

    // calculate width of an octave
    octWidth = config.keysWhite.names.length * config.keysWhite.width;

    // create SVG element
    pElem = document.createElementNS(config.key.elemNS, 'svg');
    pElem.setAttribute('id',			config.pianoId);
    pElem.setAttribute('width',		'100%');
    pElem.setAttribute('height',	config.keysWhite.height);

    for (octNdx = 0; octNdx < config.octaves; octNdx++) {
      // add white keys
      for (kwi = 0; kwi < config.keysWhite.names.length; kwi++) {
        kElem = createKey({
          id:			config.keysWhite.names[kwi] + octNdx,
          class:	config.key.class + " " + config.keysWhite.class,
          width:	config.keysWhite.width,
          height:	config.keysWhite.height,
          spacing:(config.keysWhite.spacing * kwi) + (octNdx * octWidth)
        });
        pElem.appendChild(kElem);
      }

      // add black keys
      for (kbi = 0; kbi < config.keysBlack.names.length; kbi++) {
        kElem = createKey({
          id:			config.keysBlack.names[kbi] + octNdx,
          class:	config.key.class + " " + config.keysBlack.class,
          width:	config.keysBlack.width,
          height:	config.keysBlack.height,
          spacing:config.keysBlack.spacing[kbi] + (octNdx * octWidth)
        });
        pElem.appendChild(kElem);
      }
    }

    // append SVG to container
    pContainer.appendChild(pElem);

    // bind/handle events
    handleEvents();

    return Piano;
  }

	/*
	 * Create a piano key with the given properties
	 */
  function createKey(key) {
    var kElem = document.createElementNS(Piano.config.key.elemNS, Piano.config.key.elemType);
    kElem.setAttribute('id', 			key.id);
    kElem.setAttribute('class', 	key.class);
    kElem.setAttribute('x',				key.spacing);
    kElem.setAttribute('y', 			0);
    kElem.setAttribute('height',	key.height);
    kElem.setAttribute('width', 	key.width);
    return kElem;
  }

  /*
   * Event handlers
   */
  function handleEvents() {
    var pId = "#" + Piano.config.pianoId,
        keySel = pId + " ." + Piano.config.key.class;

    // render clicked keys on clicks
    $("body").on('click', function(e) {
      renderOutput();
    });

    $("body").on('click', keySel, function(e) {
      clickedKeys.push({
        'id': e.currentTarget.id,
        'color': randomColor()
      });
    });

    $("#undo").on('click', popLastClickedKey);

    $("#reset").on('click', resetClickedKeys);
  }

  function popLastClickedKey() {
    clickedKeys.pop();
  }

  function resetClickedKeys() {
    clickedKeys = [];
  }

  /*
   * Render clicked keys
   */
  function renderOutput() {
    var outDiv, ckNdx, ckMax, ckSpan, ckId;

    // reset piano keys and output
    $("#piano .key").css('fill', '');
    $("#output").empty();

    outDiv = $('<div>');

    ckNdx = 0;
    ckMax = clickedKeys.length;

    for (ckNdx; ckNdx < ckMax; ckNdx++) {
      // set convenience var to key ID
      ckId = clickedKeys[ckNdx].id;

      // color the note on the keyboard
      $("#" + ckId).css('fill', clickedKeys[ckNdx].color);

      // add a colored text span of note ID to output area
      ckSpan = $('<span>');
      $(ckSpan).addClass("op-item");
      $(ckSpan).css('color', clickedKeys[ckNdx].color);
      $(ckSpan).html(ckId);
      $(outDiv).append(ckSpan);
    }

    $("#output").append(outDiv);
  }

  /*
   * Generate a random RGB value string
   */
  function randomColor() {
    return "rgb(" + parseInt(Math.random() * 255) + "," +
                    parseInt(Math.random() * 255) + "," +
                    parseInt(Math.random() * 255) + ")";
  }

  return Piano;

})(window.jQuery,window);
