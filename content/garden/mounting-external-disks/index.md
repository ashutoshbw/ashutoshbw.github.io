+++
title = "How to mount/unmount external disks?"
date = 2024-03-05
[taxonomies]
tags = ["linux"]
[extra]
description= "A guide on how to mount/unmout external disks on Linux."
status = "in progress"
importance = 2
certainty = "highly likely"
+++

Add the following in your `.xinitrc` if not present:

```
udiskie &
```

Remember to unmount your disk before unplugging:

```
udiskie-umount <device>
```

<aside class="admonition">
<header>
<b>Note</b>

The command name is `udiskie-umount`(not `udiskie-unmount`).

</aside>

We can also use the option `-a` to unmount everything we've plugged manually:

```
udiskie-umount -a
```

<aside class="admonition">
<header>
<b>Note</b>

`udiskie-info -a` can be used view all handlable devices.

</aside>

## Further study links

- Why you need to unmount before unplugging?: <https://superuser.com/questions/180722/should-i-unmount-a-usb-drive-before-unplugging-it>
- Udiskie usage: <https://github.com/coldfix/udiskie/wiki/Usage>
- A tutorial: <https://linuxhint.com/mount-usb-drive-centos/>
- The `/mnt` dir: <http://www.linfo.org/mnt.html>
- `/dev/sda`: <https://www.tec4tric.com/linux/dev-sda-in-linux>
- Unmounting: <http://www.linfo.org/umount.html>
- Device names: <https://tldp.org/HOWTO/Partition/devices.html>
- See `lsblk` man page
- `lsblk -p` or `lsblk -o PATH,LABEL,SIZE` is helpful.
- Device files: <https://opensource.com/article/16/11/managing-devices-linux>
