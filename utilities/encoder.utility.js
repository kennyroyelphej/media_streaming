const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const Content = require("../models/content.model")

function encode(fn) {
    // height, bitrate
    const sizes = [[240, 426], [480, 854], [720, 1280]];
    const fallback = [480, 400];

    let name = path.basename(fn, path.extname(fn));
    const targetdir = path.resolve('public', 'storage', name);
    const sourcefn = path.resolve('public', 'storage', name, fn);

    console.log('source: ', sourcefn);
    console.log('sizes: ', sizes);
    console.log('target: ', targetdir);

    var proc = ffmpeg({
        source: sourcefn,
        cwd: targetdir
    });

    var targetfn = path.join(targetdir, `${name}.mpd`);

    //Main version
    proc
        .output(targetfn)
        .format('dash')
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioChannels(2)
        .audioFrequency(44100)
        .outputOptions([
            '-preset veryfast',
            '-keyint_min 60',
            '-g 60',
            '-sc_threshold 0',
            '-profile:v main',
            '-use_template 1',
            '-use_timeline 1',
            '-b_strategy 0',
            '-bf 1',
            '-map 0:a',
            '-b:a 96k'
        ]);


    for (var size of sizes) {
        let index = sizes.indexOf(size);
        proc.outputOptions([
            `-filter_complex [0]format=pix_fmts=yuv420p[temp${index}];[temp${index}]scale=-2:${size[0]}[A${index}]`,
            `-map [A${index}]:v`,
            `-b:v:${index} ${size[1]}k`,
        ]);
    }

    //Fallback version
    proc
        .output(path.join(targetdir, `${name}_fb.mp4`))
        .format('mp4')
        .videoCodec('libx264')
        .videoBitrate(fallback[1])
        .size(`?x${fallback[0]}`)
        .audioCodec('aac')
        .audioChannels(2)
        .audioFrequency(44100)
        .audioBitrate(128)
        .outputOptions([
            '-preset veryfast',
            '-movflags +faststart',
            '-keyint_min 60',
            '-refs 5',
            '-g 60',
            '-pix_fmt yuv420p',
            '-sc_threshold 0',
            '-profile:v main',
        ]);

    proc.on('start', (command) => {
        console.log('progress', 'Spawned Ffmpeg with command: ' + command);
        IO.to(name).emit('progress', 0);
    });

    proc.on('progress', (status) => {
        console.log('progress', status);
        IO.to(name).emit('progress', status);
    });

    proc.on('end', () => {
        console.log('complete');
        IO.to(name).emit('complete');
        unlinkAsync(path.join('public', 'storage', name, fn));
    });

    proc.on('error', (error) => {
        console.log('error', error);
        IO.to(name).emit('error');
    });

    proc.run();

}

module.exports = encode;