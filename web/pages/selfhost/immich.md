<Banner
  text="Immich"
  image="/pages/selfhost/immich.png"
  blur="5px"
/>

::: tip
Демо-версія Immich доступна по [посиланню](https://demo.immich.app/)
:::



# Immich - Рішення для керування фото та відео на власному сервері

Легко створюй резервні копії, впорядковуй та керуй своїми фотографіями на власному сервері. Immich допоможе легко переглядати, шукати та впорядковувати фотографії та відео, не порушуючи при цьому вашу конфіденційність.

## Встановлення

### Штучний інтелект
Т.я Immich має вбудований ШІ(локальний) для сканування фото на обличчя та пошук по словам то сервіс потребує нормальне залізо, буде плюсом якщо налаштувати на відеокарту

### Вимоги

- ОПЕРАЦІЙНА СИСТЕМА: Рекомендована операційна система Linux або *nix (Ubuntu, Debian тощо).
::: info 
Операційні системи, відмінні від Linux, мають тенденцію до поганої роботи з Docker і не рекомендуються до використання. Наша здатність допомогти з налаштуванням або усуненням несправностей в ОС, відмінних від Linux, буде суттєво обмежена.
:::

- ОПЕРАТИВНА ПАМ'ЯТЬ: Мінімум 4 ГБ, рекомендовано 6 ГБ.
- ПРОЦЕСОР: Мінімум 2 ядра, рекомендовано 4 ядра.
- Сховище: Рекомендована Unix-сумісна файлова система (EXT4, ZFS, APFS тощо) з підтримкою прав доступу та дозволів користувача/групи.
::: warning
Генерація мініатюр і перекодованого відео може збільшити розмір фототеки в середньому на 10-20%.
:::

### Docker Compose

1. Створимо директорію де будуть docker compose файли
``` bash
mkdir immich && cd immich
```

1. Завантажуємо конфіг файли
``` bash
wget -O docker-compose.yml https://github.com/immich-app/immich/releases/latest/download/docker-compose.yml && wget -O .env https://github.com/immich-app/immich/releases/latest/download/example.env
```

1. Відредагуємо `.env` файл
``` bash
# You can find documentation for all the supported env variables at https://immich.app/docs/install/environment-variables

# The location where your uploaded files are stored
UPLOAD_LOCATION=./library

# The location where your database files are stored. Network shares are not supported for the database
DB_DATA_LOCATION=./postgres

# To set a timezone, uncomment the next line and change Etc/UTC to a TZ identifier from this list: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List
# TZ=Etc/UTC

# The Immich version to use. You can pin this to a specific version like "v1.71.0"
IMMICH_VERSION=release

# Connection secret for postgres. You should change it to a random password
# Please use only the characters `A-Za-z0-9`, without special characters or spaces
DB_PASSWORD=postgres

# The values below this line do not need to be changed
###################################################################################
DB_USERNAME=postgres
DB_DATABASE_NAME=immich
```

З цього нам треба поміняти шлях UPLOAD_LOCATION де будуть зберігатися фотографії (наприклад в мене `/media/HDD4/Photos`)

::: warning
Раджу також поміняти пароль до БД Postgres `DB_PASSWORD`
:::

1. Стартуємо Docker контейнер!

Певеріряємо, що ми находимося там, де є docker-compose.yml та налаштований під нас .env файл, якщо усе ок то...
``` bash
docker compose up -d
```

## Після встановлення

Після того, як ми запустили Immich та налаштували, ми можемо користуватися як звичайний користувач.

::: info
Більш підробно про налаштування можна дізнатися на [оф документації Immich](https://immich.app/docs/install/post-install)
:::