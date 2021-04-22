# Following up from last meeting

* Updates from Jem, Liam, Alex, and Lynette
  * Alex located hit songs from [Spotify Charts](https://spotifycharts.com/regional/gb/daily/latest) resulting 6464 unique songs, and also crawled paired lyrics in [LRC format](https://en.wikipedia.org/wiki/LRC_(file_format)) from [here](https://www.rentanadviser.com/en/subtitles/subtitles4songs.aspx) and corresponding YouTube music videos in audio format for around 2611 songs. The instrumental version of songs can be obtained by a source separation model, and for each song, we can get multiple ~4s clips of paird audio and lyrics by the timestamp provided by LRC files. With these data, the next step is to pre-traine a language model and fine-tune it with the paird lyrics and instrumental audio clips. Thus the desired function is to generate lyrics for the given audio.

  * Lynette has investigated a number of different avenues
    * https://experiments.runwayml.com/generative_engine/
    * https://tokkingheads.com/
    * https://share.synthesia.io/b533eca2-6d3b-4467-99a1-2939059b5dac 
  
  * Lynette to look at album art from a couple of sources for next time, becayse we have to but also helps give team impression of what vid may look like
  * Useful to wait until lyrics available, and keep at least one method in play that is driven by lyrics
  * Somehow connetion to audio signla (level or FFT) would be great too
  
  * Mark taking a bit more time to record the dataset
    * Making progress with train and generate with Google collab.
  * Mark and Liam experimenting with some output from GAN and noise reduction.
  * Mark says realistic to provide GAN output ahead of next week's meeting.
 
* Jem working on vocal material generated from old MAIA (last year) and Bach Doodle. Then some vocoder stuff.

* Looked at a couple of samplers too. elastik plug-in. We'll work with Liam to find best forward here.

* Plan to dedicate the next meeting (29th) to ideation in Ableton with Liam screen sharing.

* Jem to bring some theselyricsdonotexist.com along, so that we have something to play with.

* Expecting some new models from Tom -- will provide similar date to Mark.

# Interest from One Tribe TV (for a 4-minute piece for BBC One's ONE Show)

* Discuss what was proposed by the production company
* If people feel comfortable having a film crew come and shadow some of this work in York
* Potentially be interviewed by an associated ONE Show presenter (although might just be Tom)
