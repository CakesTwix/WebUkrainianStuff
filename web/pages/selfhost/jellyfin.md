<Banner
  text="Jellyfin"
  image="/pages/selfhost/jellyfin.png"
  blur="5px"
/>

# Jellyfin - Власний медіа сервер

Jellyfin це серверне ПЗ, котре встановлюється на сервер (Windows версія є, але той во, навіть не думай) й використовує медіа на дисках, тобто контент Вам треба завантажувати окремо, це не готовий варіант щоб дивитися медіа та тем паче він не парсить з сайтів контент, максимум метадані.

::: warning
Тут не буде інструкції як налаштовувати Jellyfin-stack софт, я розкажу тільки про те, що вони є й для чого воні існують, можливо, колись, напишу більш детально.
:::

## Потужності для стрімінгу

Не усі браузери та пристрої вміють у кодеки. наприклад HEVC, тому Jellyfin буде транскодувати контент у той кодек, котрий вміє пристрій. Можете сказати у чому проблема, а я вас скажу - конвертування медіа на лету дуже жре ресурси процесору, тому ми можемо перекласти цей процес на бік відеокарти. Це можна налаштувати у самому Jellyfin у Dashboard.

## Як встановлювати

Для встановлення на систему раджу на Docker.

:::tabs

== docker-compose.yml
``` docker
services:
  # REVERSE PROXY IS IN OTHER DOCKER COMPOSE STACK

  #Jellyfin - used to display the media
  #This can also be replaced by Emby/Plex
  jellyfin:
    image: ghcr.io/linuxserver/jellyfin:latest
    container_name: jellyfin
    environment:
      - DOCKER_MODS=linuxserver/mods:jellyfin-amd
      - JELLYFIN_PublishedServerUrl=${JELLYFIN_URL}
      - PUID=${PUID}
      - PGID=${PGID}
    ports:
      - 8096:8096
      - 8920:8920
    devices:
     - /dev/dri:/dev/dri #Required for jellyfin HW transcoding / QuickSync
    volumes:
      - ${BASE_PATH}/jellyfin/config:/config:z
      - ${MEDIA_SHARE}:/media:z
      # - ${BASE_PATH}/jellyfin/frontend:/usr/share/jellyfin/web:z
    restart: unless-stopped
```
== .env
``` env
BASE_PATH=/home/cakestwix/docker/jellyfin <--- Поміняти на свій шлях
JELLYFIN_URL= <--- Поміняти на свій юрл
PUID=1000
PGID=1000
MEDIA_SHARE=/media/Jellyfin <--- Поміняти на свій шлях
TZ=Europe/Kiyv 
```
:::

## Перше налаштування

Jellyfin працює на порті `8096`, заходимо та проходимо перше налаштування, вказуємо `/media/Shows`, `/media/Movies`, `/media/Anime/Series`, `/media/Anime/Movies` та тд.

::: tip Чому стільки директорий, чому не одна?
Jellyfin бере метадані з сайтів по типу TheMovieDB, AniList та йому потрібна структура файлів, котру можна почитати у [оф документації](https://jellyfin.org/docs/general/server/media/shows). Це важливо, якщо ви хочете без проблем додавати новий контент й не редагувати його власноруч.
:::

## Торрент-клієнт

Авжеж, ми будемо завантажувати тільки той контент, котрий купили, але прикро, що нам такої можливості не дають, тому торрент форева.

Я сам використовую Transmission 4.0.5 т.я має зручні застосунки Tremotesf під [PC](https://github.com/equeim/tremotesf2) та під [Android](https://f-droid.org/en/packages/org.equeim.tremotesf/)

::: tip Чому саме цю версію?
Коли я оновився на 4.0.6 то він почав спаміти у трекери інфою й були помилки. У master гілці це було пофікшено.
:::

Ще є qBitTorrent, там більш потужний веб-інтерфейс, більше функцій та тд. 

:::tabs

== Transmission
``` docker
transmission:
    image: linuxserver/transmission:4.0.5
    container_name: transmission
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Kiyv
      - USER=UserTransmission
      - PASS=PassWord
    ports:
      - 9091:9091    # Web
      - 51413:51413  # Torrent port
    volumes:
      - ${BASE_PATH}/transmission/config:/config:z
      - ${MEDIA_SHARE}:/media:z
    restart: unless-stopped
```
== qBitTorrent
``` docker
qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - WEBUI_PORT=8080
      - TORRENTING_PORT=6881
    volumes:
      # - /path/to/qbittorrent/appdata:/config
      - ${MEDIA_SHARE}:/media:z
    ports:
      - 8080:8080 # Web
      - 6881:6881 # Torrent ports
      - 6881:6881/udp
    restart: unless-stopped
```
:::

## Парсер торрент трекерів

Це буде корисно для *arr застосунків, котрі будуть шукати коентет у трекерах, але імплементувати під усі сайти буде складно, тому цей функціонал перенесли на інший сервіс.

Раніше використовував Jackett, була Toloka та Utopia, було зручно самому шукати там щось цікаве, але краще мати більш інтегрований сервіс під *arr, котрий сам є *arr - Prowlarr 
![Prowlarr](https://prowlarr.com/img/indexer-index.png)

::: warning
Якщо у вас буде саме Prowlarr, а не Jackett то не треба налаштовувати індексери у Sonarr/Radarr, Prowlarr зробить це за вас, вам потрібно буде додати тільки клієнт для завантаження контенту.
:::

:::tabs

== Prowlarr
``` docker
prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Kiyv
    volumes:
      - ./prowlarr:/config
    ports:
      - 9696:9696 # Web
    restart: unless-stopped
```
== Jackett
``` docker
jackett:
    image: lscr.io/linuxserver/jackett:latest
    container_name: jackett
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Kiyv
      - AUTO_UPDATE=true #optional
      - RUN_OPTS= #optional
    volumes:
      - ./config:/config
      # - ./blackhole:/downloads
    ports:
      - 9117:9117
    restart: unless-stopped
```
:::


## Застосунки *arr

Власноруч завантажувати контент напевно буде не зручно, особливо іншим користувачам без доступу до диску, наприклад

Для цього створили веб-застосунки Sonarr та Radarr для серіалів та фільмів відповідно. Інтерфейс *arr майже однаковий, тому почну з Sonarr

### Sonarr

Sonarr - шукає у індексерах шоу, серіали але не фільми! Фільми буде шукати вже Radarr. Дає торрент-файл у завантажувач файлів, наприклад Transmission та сам Transmission завантажує у директорію, котру зможе прочитати сам Jellyfin для програвання у плеєрі. Так само працюють й інші *arr додатки

![Sonarr](https://docs.theme-park.dev/themes/addons/sonarr/sonarr-darker/screenshot1.png)

``` docker
#Sonarr - used to find shows automatically
sonarr:
  image: lscr.io/linuxserver/sonarr:latest
  container_name: sonarr
  environment:
    - PUID=${PUID}
    - PGID=${PGID}
    - TZ=${TZ}
  volumes:
    - ${BASE_PATH}/sonarr/config:/config:z
    - ${MEDIA_SHARE}:/data:z #Access to the entire /media
  ports:
    - 8989:8989
  restart: unless-stopped
```

### Radarr

Radarr - шукає у індексерах фільми.

![Radarr](https://radarr.video/img/features/blacklist.png)

``` docker
#Radarr - used to find movies automatically
radarr:
  image: lscr.io/linuxserver/radarr:latest
  container_name: radarr
  environment:
    - PUID=${PUID}
    - PGID=${PGID}
    - TZ=${TZ}
  volumes:
    - ${BASE_PATH}/radarr/config:/config:z
    - ${MEDIA_SHARE}:/data:z #Access to the entire /media
  ports:
    - 7878:7878
  restart: unless-stopped
```

### Jellyseerr

Зручний додаток щоб дати можливість користувачам без адмін-прав на сервері завантажувати контент по запитам.

![Jellyseerr](https://discourse.linuxserver.io/uploads/default/ad6fba8f5760460a69aa44df0bbeda020b9db8f7)

``` docker
#jellyseer - allows users to request media on their own
jellyseerr:
  image: fallenbagel/jellyseerr:latest
  container_name: jellyseerr
  environment:
    - PUID=${PUID}
    - PGID=${PGID}
    - TZ=${TZ}
  volumes:
    - ${BASE_PATH}/jellyseerr/config:/app/config:z
    - ${MEDIA_SHARE}:/data:z #Access to the entire ${BASE_PATH}
  ports:
    - 5055:5055
  restart: unless-stopped
```
