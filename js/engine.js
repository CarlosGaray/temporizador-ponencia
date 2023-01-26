
const ancho_inicial = 300
const alto_inicial = 170

let botón_de_grabación
let encoder
let recording = false

function preload() {
  HME.createH264MP4Encoder().then(enc => {
    encoder = enc
    encoder.outputFilename = (random() + "").replace("0.", "jeffAporta")
    encoder.width = ancho_inicial
    encoder.height = alto_inicial
    encoder.frameRate = 60
    encoder.kbps = 50000
    encoder.groupOfPictures = 10
    encoder.initialize()
  })
}

let sel;
let colPic1;
let colPic2;

function setup() {
  createCanvas(ancho_inicial, alto_inicial);
  sel = createSelect();

  for (let i = 0; i < 11; i++) {
    sel.option(`${i}`);
  }

  sel.changed(changeBg);

  colPic1 = createColorPicker("green");
  colPic2 = createColorPicker("red");
  botón_de_grabación = createButton('Grabar')
  botón_de_grabación.mousePressed(() => {
    recording = botón_de_grabación.html() == "Grabar"
    if (recording) {
      botón_de_grabación.html("Detener")
    } else {
      botón_de_grabación.html("Grabar")
      finalizarGrabación()
    }

  })

  textSize(128)
  textAlign(CENTER, CENTER)
  pixelDensity(1)
  smooth()
  setInterval(timeIt, 1000)
}
var mins;
var timerValue;

function changeBg() {
  mins = sel.value();
  timerValue = 59;
}



function draw() {

  background(colPic2.color())
  stroke(colPic1.color());
  fill(colPic1.color());

  if (timerValue == 0) {
    timerValue = 59;
    mins--;
  }

  if (mins - 1 < 0) {
    text(`0:00`, width / 2, height / 2 + 15);
  } else {
    if (timerValue >= 10) {
      text(`${mins - 1}:${timerValue}`, width / 2, height / 2);
    }
    if (timerValue < 10) {
      text(`${mins - 1}:0${timerValue}`, width / 2, height / 2);
    }
  }

  grabarFotograma()
}

function timeIt() {
  if (timerValue > 0) {
    timerValue--;
  }
}

function grabarFotograma() {
  if (recording) {
    encoder.addFrameRgba(drawingContext.getImageData(0, 0, encoder.width, encoder.height).data);
  }
}

function finalizarGrabación() {
  recording = false
  console.log('recording stopped')

  encoder.finalize()
  const uint8Array = encoder.FS.readFile(encoder.outputFilename);
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(new Blob([uint8Array], { type: 'video/mp4' }))
  anchor.download = encoder.outputFilename
  anchor.click()
  encoder.delete()

  preload()
}