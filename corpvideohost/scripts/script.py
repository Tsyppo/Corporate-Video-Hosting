import os
import subprocess


def main(input_file):
    # Получаем путь к директории, содержащей этот скрипт
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Получаем имя файла без расширения
    filename = os.path.splitext(os.path.basename(input_file))[0]

    # Создаем папку для выходных файлов HLS в директории скрипта
    output_dir = os.path.join(script_dir, filename)
    os.makedirs(output_dir, exist_ok=True)

    # Создаем файл плейлиста
    playlist_path = os.path.join(output_dir, "playlist.m3u8")
    with open(playlist_path, "w") as playlist_file:
        playlist_file.write("#EXTM3U\n")
        playlist_file.write("#EXT-X-VERSION:3\n")
        playlist_file.write("#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n")
        playlist_file.write("360p.m3u8\n")
        playlist_file.write("#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480\n")
        playlist_file.write("480p.m3u8\n")
        playlist_file.write("#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\n")
        playlist_file.write("720p.m3u8\n")
        playlist_file.write(
            "#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080\n"
        )
        playlist_file.write("1080p.m3u8\n")

    # Словарь с параметрами для разных разрешений
    resolutions = {
        "360p": {
            "scale": "640x360",
            "b:v": "800k",
            "maxrate": "856k",
            "bufsize": "1200k",
        },
        "480p": {
            "scale": "842x480",
            "b:v": "1400k",
            "maxrate": "1498k",
            "bufsize": "2100k",
        },
        "720p": {
            "scale": "1280x720",
            "b:v": "2800k",
            "maxrate": "2996k",
            "bufsize": "4200k",
        },
        "1080p": {
            "scale": "1920x1080",
            "b:v": "5000k",
            "maxrate": "5350k",
            "bufsize": "7500k",
        },
    }

    # Выполняем команду FFmpeg для каждого разрешения
    for resolution, params in resolutions.items():
        output_file = os.path.join(output_dir, f"{resolution}.m3u8")
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-y",
                "-i",
                input_file,
                "-vf",
                f"scale={params['scale']}:force_original_aspect_ratio=decrease",
                "-c:a",
                "aac",
                "-ar",
                "48000",
                "-ac",
                "2",
                "-c:v",
                "h264",
                "-profile:v",
                "main",
                "-crf",
                "20",
                "-sc_threshold",
                "0",
                "-g",
                "48",
                "-keyint_min",
                "48",
                "-hls_time",
                "4",
                "-hls_playlist_type",
                "vod",
                "-b:v",
                params["b:v"],
                "-maxrate",
                params["maxrate"],
                "-bufsize",
                params["bufsize"],
                "-b:a",
                "96k",
                "-hls_segment_filename",
                os.path.join(output_dir, f"{resolution}_%03d.ts"),
                output_file,
            ],
            check=True,
        )


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Не указан путь к файлу.")
        sys.exit(1)
    main(sys.argv[1])
