// Copyright Tom Collins, 27.4.2021
// Generating drum excerpts for AI Song Contest 2020 project.

// Requires
const fs = require("fs")
const path = require("path")
const sr = require('seed-random')
const { Midi } = require('@tonejs/midi')
const mm = require("maia-markov")
const gn = new mm.Generator()

// Individual user paths
const mainPaths = {
  "tom": {
    "stm": path.join(
      "/Users", "tomthecollins", "Shizz", "York", "Projects", "AI\ Eurovision",
      "2021", "io", "stm", "aisc2021_drums.js"
    ),
    "initial": path.join(
      "/Users", "tomthecollins", "Shizz", "York", "Projects", "AI\ Eurovision",
      "2021", "io", "stm", "aisc2021_drums_initial.js"
    ),
    "outputDir": path.join(
      "/Users", "tomthecollins", "Shizz", "York", "Projects", "AI\ Eurovision",
      "2021", "io", "out", "aisc2021_drums"
    )
  },
  "anotherUser": {
    "stm": "",
    "initial": "",
    "outputDir": ""
  }
}

// Set up parameters.
let seeds = [
  "Henagon", "Digon", "Triangle", "Acute", "Equilateral",
  "Heptagonal", "Isosceles", "Obtuse", "Right", "Isosceles",
  "Kepler", "Scalene", "Quadrilateral", "Kite", "Parallelogram",
  "Rhombus", "Lozenge", "Rhomboid", "Rectangle", "Square",
  "Trapezoid", "Pentagon", "Hexagon", "Heptagon", "Octagon",
  "Nonagon", "Decagon", "Hendecagon", "Dodecagon", "Icosagon"
]
let param = {
  "stateType": "beat_MNN_state",
  "pointReconstruction": "MNN",
  "timeSignatures": [ {"barNo": 1, "topNo": 4, "bottomNo": 4, "ontime": 0} ],
  "stm": null,
  "initial": null,
  "nosConsecutives": 4,
  "ontimeUpperLimit": 16,
  "indices": {
    "ontime": 0, "MNN": 1, "MPN": 2, "duration": 3, "channel": 4, "velocity": 5
  },
  "randCount": 0
}

// Grab user name from command line to set path to data.
let nextU = false
let pathsEtc;
process.argv.forEach(function(arg, ind){
  if (arg === "-u"){
    nextU = true
  }
  else if (nextU){
    pathsEtc = mainPaths[arg]
    nextU = false
  }
})
// fs.mkdir(outdir);

const stmStr = fs.readFileSync(pathsEtc.stm);
param.stm = JSON.parse(stmStr);
const initialStr = fs.readFileSync(pathsEtc.initial);
param.initial = JSON.parse(initialStr);
// console.log("stm:", stm)

// Seed random number generation.
// sr('christianeriksen', {global: true}); // Overrides global Math.random.
// var numA = Math.random();
// console.log(numA);
// sr.resetGlobal();// Reset to default Math.random.

seeds.map(function(seed){
  // Seed random number generation.
  sr(seed, {global: true})
  // Reset randCount, then generate states and points.
  param.randCount = 0
  console.log("randCount before get_abs_suggestion:", param.randCount)
  var gendOutput = gn.get_suggestion(param)
  console.log("randCount after get_abs_suggestion:", gendOutput.randCount)
  // console.log("gendOutput.points:", gendOutput.points)

  // Export to MIDI and text files.
  const me = new mm.MidiExport(
    gendOutput.points,
    path.join(pathsEtc["outputDir"], "drums_" + seed + ".mid"),
    0.5
  )
  fs.writeFileSync(
    path.join(path.join(pathsEtc["outputDir"], "drums_" + seed + ".txt")),
    JSON.stringify(gendOutput.stateContextPairs, null, 2)
  )
})
