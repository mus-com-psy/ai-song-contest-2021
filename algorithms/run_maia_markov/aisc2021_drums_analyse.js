// Copyright Tom Collins, 25.4.2021
// Analysing MIDI files to create state-transition matrix and initial
// distribution for drum representations for AI Song Contest 2021 project.

// Requires.
const fs = require("fs")
const path = require("path")
// const uu = require("uuid/v4")
const { Midi } = require('@tonejs/midi')
const mu = require("maia-util")
const mm = require("maia-markov")
const an = new mm.Analyzer()
const ch = require("./dexplore/cv_and_hist.js")
const tx = require("./dexplore/track_extract_util.js")

// Individual user paths.
const mainPaths = {
  "tom": {
    "midi": path.join(
      "/Users", "tomthecollins", "Shizz", "York", "Projects", "AI\ Eurovision",
      "2021", "io", "midi"
    ),
    "midiDirs": ["midi_1"],
    "outputDir": path.join(
      "/Users", "tomthecollins", "Shizz", "York", "Projects", "AI\ Eurovision",
      "2021", "io", "stm"
    ),
    "outputFileName": "aisc2021_drums_range_limited"
  },
  "anotherUser": {
    // ...
  }
}

// Parameters
const param = {
  "stateType": "beat_MNN_state",
  "onAndOff": false,
  "nosConsecutives": 4,
  "downbeat": {
    "histType": "drumsTrueVelocityTrue",
    "drumsOnly": true,
    "rounding": true,
    "granularity": 4,
    "beatsInMeasure": 4,
    "velocityIndex": 4,
    "ontimeIndex": 0
  }
}

// Grab user name from command line to set path to data.
let nextU = false
let mainPath;
process.argv.forEach(function(arg, ind){
  if (arg === "-u"){
    nextU = true
  }
  else if (nextU){
    mainPath = mainPaths[arg]
    nextU = false
  }
})
// fs.mkdir(outdir)

// Import and analyse the MIDI files.
let midiDirs = fs.readdirSync(mainPath["midi"])
midiDirs = midiDirs.filter(function(midiDir){
  return mainPath["midiDirs"].indexOf(midiDir) >= 0
})
console.log("midiDirs:", midiDirs)
midiDirs.forEach(function(midiDir, jDir){
  console.log("Working on midiDir:", midiDir, "jDir:", jDir)
  let comps = []
  let files = fs.readdirSync(path.join(mainPath["midi"], midiDir))
  files = files.filter(function(file){
    return file.split(".")[3] == "mid"
  })
  console.log("files.length:", files.length)

  files.forEach(function(file, iFile){
    console.log("file:", file)
    if (iFile % 10 === 0){
      console.log("FILE " + (iFile + 1) + " OF " + files.length + ".")
    }
    try {
      const midiData = fs.readFileSync(
        path.join(mainPath["midi"], midiDir, file)
      )
      const midi = new Midi(midiData)
      let dtracks = tx.find_drum_track(midi, false)
      console.log("dtracks:", dtracks)
      if (dtracks !== undefined){
        dtracks = dtracks.map(function(d){ return d[0] })
        const timeSigs = [midi.header.timeSignatures.map(function(ts){
          return {
            "barNo": ts.measures + 1,
            "topNo": ts.timeSignature[0],
            "bottomNo": ts.timeSignature[1],
            "ontime": ts.ticks/midi.header.ppq
          }
        })[0]] // SUPER HACKY. REVISE LATER!
        if (timeSigs[0].topNo !== 4){
          console.log("timeSigs:", timeSigs)
        }
        let allPoints = [], dbPoints = [], tonalPoints = [], trgPoints = []
        midi.tracks.forEach(function(track, idx){
          // console.log("track.instrument.family:", track.instrument.family)
          // console.log("track.instrument.name:", track.instrument.name)
          track.notes.forEach(function(n){
            if (n.midi >= 36 && n.midi <= 56){
              let pt = [
                n.ticks/midi.header.ppq,
                n.midi,
                n.durationTicks/midi.header.ppq,
                track.channel,
                Math.round(1000*n.velocity)/1000
              ]
              allPoints.push(pt)
              if (
                !param.downbeat.drumsOnly ||
                param.downbeat.drumsOnly && track.instrument.family === "drums"
              ){
                dbPoints.push(pt)
              }
              if (track.instrument.family !== "drums"){
                tonalPoints.push(pt)
              }
              if (dtracks.indexOf(idx) >= 0){
                trgPoints.push(pt)
              }
            } // if (n.midi >= 36 && n.midi <= 56){
          })
        })
        if (dbPoints.length === 0) {
          console.log("No downbeat detection points. Reverting to full dataset!")
          dbPoints = allPoints
        }
        dbPoints = mu.copy_array_object(mu.sort_rows(dbPoints)[0])
        tonalPoints = mu.copy_array_object(mu.sort_rows(tonalPoints)[0])
        trgPoints = mu.copy_array_object(mu.sort_rows(trgPoints)[0])
        // console.log("trgPoints.slice(0, 5):", trgPoints.slice(0, 5))

        // Downbeat estimation and correction
        const dbCorrect = ch.correct_downbeat(dbPoints, param.downbeat)
        // console.log("dbCorrect.confidence:", dbCorrect.confidence)
        // console.log("dbCorrect.startsOnBeatEst:", dbCorrect.startsOnBeatEst)
        // console.log(dbCorrect.pointSet.slice(0, 3))
        tonalPoints.forEach(function(p){
          p[param.downbeat.ontimeIndex] += param.downbeat.beatsInMeasure
          - dbCorrect.startsOnBeatEst + 1
        })
        trgPoints.forEach(function(p){
          p[param.downbeat.ontimeIndex] += param.downbeat.beatsInMeasure
          - dbCorrect.startsOnBeatEst + 1
        })

        // Key detection
        const fsm = mu.fifth_steps_mode(tonalPoints, mu.krumhansl_and_kessler_key_profiles)
        // console.log("fsm:", fsm)
        trgPoints.forEach(function(p){
          p.splice(2, 0, mu.guess_morphetic(p[1], fsm[2], fsm[3]))
        })
        let comp = an.note_point_set2comp_obj(
          trgPoints, timeSigs, false, [0, 1/4, 1/3, 1/2, 2/3, 3/4, 1]//, [0, 1/6, 1/4, 1/3, 1/2, 2/3, 3/4, 5/6, 1]
        );
        // console.log("comp.notes.length:", comp.notes.length)
        // console.log("comp.notes.slice(0, 3):", comp.notes.slice(0, 3))
        comp["id"] = "" + iFile
        comp["name"] = "" + iFile
        comp["composers"] = [{"id": "default_composer", "name": "none", "displayName": "None"}]
        comps.push(comp)
        console.log("")
      } // if (dtrack !== undefined){
    }
    catch (e) {
      console.log(e)
    }
  })

  // Construct stm and initial distribution.
  let stm = an.construct_stm(comps, param)
  // console.log("pStm.length:", pStm.length);
  stm = an.prune_stm(stm, param)
  // console.log("pStm[0].beat_mnn_state:", pStm[0].beat_mnn_state);
  // console.log("pStm.slice(0, 1):", pStm.slice(0, 1));
  fs.writeFileSync(
    path.join(mainPath["outputDir"], mainPath["outputFileName"] + ".js"),
    JSON.stringify(stm)//, null, 2)
  )

  let initialDistbn = an.construct_initial(comps, param)
  initialDistbn = an.prune_initial(initialDistbn, stm, param)
  fs.writeFileSync(
    path.join(mainPath["outputDir"], mainPath["outputFileName"] + "_initial.js"),
    JSON.stringify(initialDistbn)//, null, 2)
  )
})
