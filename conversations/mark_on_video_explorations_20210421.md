update 23/04/21:

I assume Lynette is taking care of the video side? If you wanted me to contribute then probably the quickest would be if I set up a SuperCollider patch that takes in an audio file (preferably containing the song! but just a drum track would do so long as it was the full length of the song) and have it send OSC message to Python to trigger visuals in time with the music. I've been working a lot on this recently so it would be straightforward to set up. 

17/04/21:

Videos-wise, I've been using a GAN to generate GIFs, both using SinGAN's animation function (which generates smooth animation of a single image) and also by simply concatenating output images. SinGAN is really useful and practical for both tasks as it generates multiple outputs from a single image and can also perform super-resolution. The results are then rendered interactively (taking trigger messages via OSC from SuperCollider in response to audio inputs) using the Pyglet game engine, which is built on top of OpenGL.

Lynette obviously has more experience in the video domain than me but if you wanted me to try out this approach with some suggested images for the song contest vid then I'd be up for trying some ideas out.


