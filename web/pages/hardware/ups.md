# Network UPS Tools aka NUT

Конфіг-конфіг-конфіг - старий Linux lore. Це про цю утиліту для управління UPS та отримання стану самого пристрою через CLI.

## Встановлення

### Arch Linux

```bash
sudo pacman -S nut
```

### Debian

```bash
sudo apt install nut-client nut-server
```

Після встановлення у нас буде:

1. Користувач nut, чия домашня директорія знаходиться в /var/lib/nut.
1. Конфігурація в основному виконується в /etc/nut.
1. Служби вимагають попередньої конфігурації: `nut-(client,driver,server,monitor)`

## Конфігурація конфігів!

### Визначаємо чи бачить NUT ваш UPS

```bash
sudo nut-scanner
```

```bash
cakestwix@tvbox:~$ sudo nut-scanner
Cannot load SNMP library (libnetsnmp.so.40) : file not found. SNMP search disabled.
Cannot load XML library (libneon.so.27) : file not found. XML search disabled.
Cannot load AVAHI library (libavahi-client.so.3) : file not found. AVAHI search disabled.
Cannot load IPMI library (libfreeipmi.so.17) : file not found. IPMI search disabled.
Scanning USB bus.
No start IP, skipping NUT bus (old connect method)
[nutdev1]
        driver = "nutdrv_qx"
        port = "auto"
        vendorid = "0665"
        productid = "5161"
        product = "USB to Serial"
        vendor = "Cypress Semiconductor"
        bus = "001"
        device = "008"
        busport = "002"
        ###NOTMATCHED-YET###bcdDevice = "0002"
```

::: info
`nutdev1` є назвою UPS за якою можна до нього звертатися
:::

Якщо усе добре то копіюємо цей конфіг до `/etc/nut/ups.conf`

### Додаємо udev-правило

```bash
sudo nano /etc/udev/rules.d/99_nut-serialups.rules
```

```
KERNEL=="ttyS0", GROUP="nut"
```

Ребутаємо щоб точно, або рестартимо udev

```bash
sudo udevadm control --reload
sudo udevadm trigger
```

#### Тестуємо конфіг

```bash
upsdrvctl start
```

### Вмикаємо upsd

Міняємо режим з `none` на `netserver`

```bash
/etc/nut/nut.conf
```

```bash
##############################################################################
# The MODE determines which part of the NUT is to be started, and which
# configuration files must be modified.
#
# This file try to standardize the various files being found in the field, like
# /etc/default/nut on Debian based systems, /etc/sysconfig/ups on RedHat based
# systems, ... Distribution's init script should source this file to see which
# component(s) has to be started.
#
# The values of MODE can be:
# - none: NUT is not configured, or use the Integrated Power Management, or use
#   some external system to startup NUT components. So nothing is to be started.
# - standalone: This mode address a local only configuration, with 1 UPS
#   protecting the local system. This implies to start the 3 NUT layers (driver,
#   upsd and upsmon) and the matching configuration files. This mode can also
#   address UPS redundancy.
# - netserver: same as for the standalone configuration, but also need
#   some more network access controls (firewall, tcp-wrappers) and possibly a
#   specific LISTEN directive in upsd.conf.
#   Since this MODE is opened to the network, a special care should be applied
#   to security concerns.
# - netclient: this mode only requires upsmon.
#
# IMPORTANT NOTE:
#  This file is intended to be sourced by shell scripts.
#  You MUST NOT use spaces around the equal sign!

MODE=none
```

### Робимо юзерів для зв'язку поза upsc

Основний конфіг-файл лежить у `/etc/nut/upsd.users`, його треба відредагувати

```yaml
[upsuser]
     password = password
     upsmon primary
     actions = SET
     instcmds = ALL
```

### Тестуємо клієнтом зв'язок

Нарешті запускаємо сервіс `nut-server`

```bash
sudo systemctl enable --now nut-server
```

```bash
upsc nutdev1
```

```
cakestwix@tvbox:~$ upsc ups
Init SSL without certificate database
battery.charge: 100
battery.voltage: 13.50
battery.voltage.high: 13.50
battery.voltage.low: 8.0
battery.voltage.nominal: 12.0
device.type: ups
driver.debug: 0
driver.flag.allow_killpower: 0
driver.name: blazer_usb
driver.parameter.default.battery.voltage.high: 13.50
driver.parameter.default.battery.voltage.low: 8.0
driver.parameter.pollinterval: 2
driver.parameter.port: auto
driver.parameter.product: USB to Serial
driver.parameter.productid: 5161
driver.parameter.synchronous: auto
driver.parameter.vendor: Cypress Semiconductor
driver.parameter.vendorid: 0665
driver.state: quiet
driver.version: 2.8.1
driver.version.internal: 0.17
driver.version.usb: libusb-1.0.28 (API: 0x100010a)
input.current.nominal: 2.0
input.frequency: 49.9
input.frequency.nominal: 50
input.voltage: 233.3
input.voltage.fault: 232.8
input.voltage.nominal: 220
output.voltage: 232.8
ups.beeper.status: disabled
ups.delay.shutdown: 30
ups.delay.start: 180
ups.load: 5
ups.productid: 5161
ups.status: OL
ups.temperature: 25.0
ups.type: offline / line interactive
ups.vendorid: 0665
```

## Підключення UPS до Home Assistant

Home Assistant має [офіційну інтеграцію](https://www.home-assistant.io/integrations/nut) з NUT, налаштовується через GUI.

З того, що нам треба це

1. Хост, тобто іп адреса, скоріше за всього localhost
1. Порт, за умовчанням це 3493
1. Юзернейм, [ви його робили](#робимо-юзерів-для-зв-язку-поза-upsc)
1. Пароль, [ви його робили](#робимо-юзерів-для-зв-язку-поза-upsc)

## Що не зробив, але треба б це на сервері

Нещодавно хотів налаштувати UPS/NUT щоб коли нема світла то сервер вимикався, але другий UPS згорів, хнек, а перший працює тільки як "повербанк" під роутер. Знаю, що це не дуже розумно робити 12 -> 220 -> 12, але що поробиш, зробив базове налаштування для себе.