# !/bin/bash
echo "Encoder Begined..."

VIDEO_IN=./public/storage/${1}/${1}.mp4
VIDEO_OUT=./public/storage/${1}/${1}

ffmpeg -y -re -i $VIDEO_IN \
  -c:v libx264 -x264opts "keyint=24:min-keyint=24:no-scenecut" -r 24 \
  -c:a aac -b:a 128k \
  -bf 1 -b_strategy 0 -sc_threshold 0 -pix_fmt yuv420p \
  -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
  -b:v:0 250k  -filter:v:0 "scale=-2:240" -profile:v:0 baseline \
  -b:v:1 750k  -filter:v:1 "scale=-2:480" -profile:v:1 main \
  -b:v:2 1500k -filter:v:2 "scale=-2:720" -profile:v:2 high \
  -use_timeline 1 -use_template 1 -window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a" \
  -f dash $VIDEO_OUT.mpd

echo "Encoder ended..."

# rm -r $VIDEO_IN

# HLS_TIME=4
# FPS=25
# GOP_SIZE=100
# PRESET_P=veryslow
# V_SIZE_1=960x540
# V_SIZE_2=416x234
# V_SIZE_3=640x360
# V_SIZE_4=768x432
# V_SIZE_5=1280x720
# V_SIZE_6=1920x1080

# DASH
# ffmpeg -i $VIDEO_IN -y \
#     -preset $PRESET_P -keyint_min $GOP_SIZE -g $GOP_SIZE -sc_threshold 0 -r $FPS -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k -ac 1 -ar 44100 \
#     -map v:0 -s:0 $V_SIZE_1 -b:v:0 2M -maxrate:0 2.14M -bufsize:0 3.5M \
#     -map v:0 -s:1 $V_SIZE_2 -b:v:1 145k -maxrate:1 155k -bufsize:1 220k \
#     -map v:0 -s:2 $V_SIZE_3 -b:v:2 365k -maxrate:2 390k -bufsize:2 640k \
#     -map v:0 -s:3 $V_SIZE_4 -b:v:3 730k -maxrate:3 781k -bufsize:3 1278k \
#     -map v:0 -s:4 $V_SIZE_4 -b:v:4 1.1M -maxrate:4 1.17M -bufsize:4 2M \
#     -map v:0 -s:5 $V_SIZE_5 -b:v:5 3M -maxrate:5 3.21M -bufsize:5 5.5M \
#     -map v:0 -s:6 $V_SIZE_5 -b:v:6 4.5M -maxrate:6 4.8M -bufsize:6 8M \
#     -map v:0 -s:7 $V_SIZE_6 -b:v:7 6M -maxrate:7 6.42M -bufsize:7 11M \
#     -map v:0 -s:8 $V_SIZE_6 -b:v:8 7.8M -maxrate:8 8.3M -bufsize:8 14M \
#     -map 0:a \
#     -init_seg_name init\$RepresentationID\$.\$ext\$ -media_seg_name chunk\$RepresentationID\$-\$Number%05d\$.\$ext\$ \
#     -use_template 1 -use_timeline 1  \
#     -seg_duration 4 -adaptation_sets "id=0,streams=v id=1,streams=a" \
#     -f dash Dash/dash.mpd

# Fallback video file
# ffmpeg -i $VIDEO_IN -y -c:v libx264 -pix_fmt yuv420p -r $FPS -s $V_SIZE_1 -b:v 1.8M -c:a aac -b:a 128k -ac 1 -ar 44100 fallback-video-$V_SIZE_1.mp4