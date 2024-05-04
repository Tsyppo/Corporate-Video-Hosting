@echo off

REM Получаем путь к директории, в которой находится этот скрипт
for %%A in ("%~dp0.") do set "script_dir=%%~fA"

REM Проверяем, было ли передано имя файла в аргументах командной строки
IF "%~1"=="" (
    echo Не указано имя файла.
    exit /b
)

REM Извлекаем имя файла из аргумента командной строки (без расширения)
set "filename=%~n1"

REM Создаем папку для выходных файлов HLS в директории скрипта
mkdir "%script_dir%\%filename%"

REM Создаем файл плейлиста
echo #EXTM3U > "%script_dir%\%filename%\playlist.m3u8"
echo #EXT-X-VERSION:3 >> "%script_dir%\%filename%\playlist.m3u8"
echo #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360 >> "%script_dir%\%filename%\playlist.m3u8"
echo 360p.m3u8 >> "%script_dir%\%filename%\playlist.m3u8"
echo #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480 >> "%script_dir%\%filename%\playlist.m3u8"
echo 480p.m3u8 >> "%script_dir%\%filename%\playlist.m3u8"
echo #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720 >> "%script_dir%\%filename%\playlist.m3u8"
echo 720p.m3u8 >> "%script_dir%\%filename%\playlist.m3u8"
echo #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080 >> "%script_dir%\%filename%\playlist.m3u8"
echo 1080p.m3u8 >> "%script_dir%\%filename%\playlist.m3u8"

REM Проверяем все файлы с заданным именем в текущем каталоге с различными расширениями
for %%i in ("%~dpn1.*") do (
    ffmpeg -hide_banner -y -i "%%i" ^
      -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -ac 2 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod  -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -hls_segment_filename "%script_dir%\%filename%/360p_%%03d.ts" "%script_dir%\%filename%/360p.m3u8" ^
      -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -ac 2 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename "%script_dir%\%filename%/480p_%%03d.ts" "%script_dir%\%filename%/480p.m3u8" ^
      -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -ac 2 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename "%script_dir%\%filename%/720p_%%03d.ts" "%script_dir%\%filename%/720p.m3u8" ^
      -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -ac 2 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename "%script_dir%\%filename%/1080p_%%03d.ts" "%script_dir%\%filename%/1080p.m3u8"
)
