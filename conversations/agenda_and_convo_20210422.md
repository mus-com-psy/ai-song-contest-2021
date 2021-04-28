# Following up from last meeting

Updates from Jem, Liam, Alex, and Lynette

## Alex

Located hit songs from [Spotify Charts](https://spotifycharts.com/regional/gb/daily/latest) resulting in 6464 unique songs, and also crawled paired lyrics in [LRC format](https://en.wikipedia.org/wiki/LRC_(file_format)) from [here](https://www.rentanadviser.com/en/subtitles/subtitles4songs.aspx). Corresponding music videos available for 2611 songs. The instrumental version of songs can be obtained by a source separation model, and for each song, we can get multiple ~4s clips of paired audio and lyrics by the timestamp provided by LRC files. With these data, the next step is to pre-train a language model and fine-tune it with the paired lyrics and instrumental audio clips. The desired function of the network should be clear.

## Lynette

Has investigated a number of different avenues

* https://experiments.runwayml.com/generative_engine/
* https://tokkingheads.com/
* https://share.synthesia.io/b533eca2-6d3b-4467-99a1-2939059b5dac 
  
Will look at album art from a couple of sources for next time, because we have to for the competition but also to help give the team an impression of what a corresponding video may look like.

* Useful to wait until lyrics available, and keep at least one method in play that is driven by lyrics
* Tom remarks that a connection to audio signal (local level or FFT) would be great.
  
## Mark

* Taking a bit more time to record the dataset than anticipated.
* Making progress with train and generate with Google collab.
* Mark and Liam experimenting with some output from GAN and noise reduction. All flavours of this sounded pretty cool (to Tom).
* Mark says realistic to provide GAN output ahead of next week's meeting. Mark shared these in advance. Thanks, Mark!
 
 ## Jem

* Working on vocal material generated from MAIA Markov trained on last year's dataset and Bach Doodle. Then some vocoder stuff.
* Looked at a couple of samplers too, elastik plug-in. We'll work with Liam to find best way forward here.
* Plan to dedicate the next meeting (29th) to ideation in DAW with Liam driving/screen sharing.
* Jem to bring some theselyricsdonotexist.com along, so that we have something to play with. Jem shared these in advance. Thanks, Jem!

## Tom

* Expecting to build and run (and has now done so) some new Markov models and associated output. Similar to last year, produced 30 melodies, 30 chord sequences, 30 basslines, and 30 drum tracks, all about four bars long. Different to last year, trained on a set of MIDI files comprising 1/3 gospel music and 2/3 pop/europop.

# Interest from One Tribe TV (for a 4-minute piece for BBC One's ONE Show)

* Discuss what was proposed by the production company.
* Do people feel comfortable having a film crew come and shadow some of this work in York? Answer was "Yes"!
* Potentially be interviewed by an associated ONE Show presenter (although might just be Tom).
