+++
title = "What are wildcards and globbing?"
date = 2022-03-20
updated = 2024-03-01
[taxonomies]
tags = ["linux"]
[extra]
status = "finished"
importance = 5
certainty = "certain"
description= "An introduction to wildcards and globbing in Linux."
+++

The two features of Linux shells — wildcards and globbing — can sometimes save us a lot of time by matching filenames quickly so that you can perfrom some kind of operation on them like displaying, copying, moving, removing etc.

A _wildcard_[_notes:wildcard_] is a character or a set of characters that acts as a placeholder for other characters. A _wildcard character_(aka _metacharacter_) is a wildcard containing a single character. Wildcards looks like this: `*`, `?`, `[a-z0-4]`. We will learn the meaning of these symbols in a minute.

_Wildcard pattern_(aka _glob pattern_, _glob_ or just _pattern_) is a string that contains wildcard in it. Shell can use them to match filenames. They looks somewhat like this: `*ing.pdf`, `photo-??.jpg`, `photo-[0-9][0-9].jpg` etc.

_Globbing_[_notes:glob_] is the operation of macthing items from a list of strings using wildcard pattern and returning the list of matched items.

Globbing is frequently used for matching filenames in Linux. In this context it is also sometimes referred to as _filename expansion_, _filename substitution_, _filename generation_(in zsh specially) or _pathname expansion_.

## Common wildcards

Below are the explanation of some wildcards[_refs:commonwildcards_] which are present in all good shells out there like bash and zsh:

- `*`: Matches zero or more character.
- `?`: Matches any one character.
- `[string]`: Matches exactly one character that is a member of the string `string`. This is called a character class. As a shorthand, string may contain ranges, which consist of two characters with a dash between them. For example, the class `[a-z0-9_]` matches a lowercase letter, a number, or an underscore. You can negate a class by placing a `!` or `^` immediately after the opening bracket. Thus, `[^A-Z@]` matches any character except an uppercase letter or an at sign.
- `\`: Removes the special meaning of the character that follows it. This works even in character classes.

<aside class="admonition">
<header>
<b>Info</b>
</header>

Most shells have their own way of extending the above wildcards. These are known as _extended globbing_ and are usually not enabled by default. We will not discuss about them in this article.

</aside>

### Examples

Below are some glob patterns and their explanation:

- `*.jpg` will match strings ending with `.jpg`.
- `???.png` will match strings starting with any 3 characters and then ending with `.png`.
- `[cb]at.gif` will match either `cat.gif` or `bat.gif`.
- `[a-z]*[0-9]` will match all strings that starts with a lowercase letter and ends with a digit with any number of any characters in between.

Such patterns can be used with any shell commands like `ls`, `cp`, `mv` etc. There is a important point to tell you right now: _The command can't see these patterns. Shell expands these patterns and gives the outputs to the command in the place of respective patterns._

For example the following command will show all files in `/usr/bin` that has `ff` somewhere in the filename:

```zsh
ls /usr/bin/*ff*
```

On my system, the output is:

```
/usr/bin/btfdiff    /usr/bin/fftwf-wisdom         /usr/bin/lzdiff          /usr/bin/ppm2tiff    /usr/bin/swapoff     /usr/bin/tiffinfo
/usr/bin/bzdiff     /usr/bin/fftwl-wisdom         /usr/bin/mmroff          /usr/bin/raw2tiff    /usr/bin/tiff2bw     /usr/bin/tiffmedian
/usr/bin/clockdiff  /usr/bin/fftwq-wisdom         /usr/bin/nroff           /usr/bin/roff2dvi    /usr/bin/tiff2pdf    /usr/bin/tiffset
/usr/bin/codiff     /usr/bin/fftw-wisdom          /usr/bin/obs-ffmpeg-mux  /usr/bin/roff2html   /usr/bin/tiff2ps     /usr/bin/tiffsplit
/usr/bin/diff       /usr/bin/fftw-wisdom-to-conf  /usr/bin/pamtohdiff      /usr/bin/roff2pdf    /usr/bin/tiff2rgba   /usr/bin/tifftopnm
/usr/bin/diff3      /usr/bin/gdiffmk              /usr/bin/pamtotiff       /usr/bin/roff2ps     /usr/bin/tiffcmp     /usr/bin/troff
/usr/bin/diffimg    /usr/bin/giffix               /usr/bin/pdffonts        /usr/bin/roff2text   /usr/bin/tiffcp      /usr/bin/xtotroff
/usr/bin/fax2tiff   /usr/bin/groff                /usr/bin/pdfroff         /usr/bin/roff2x      /usr/bin/tiffcrop    /usr/bin/xzdiff
/usr/bin/ffmpeg     /usr/bin/groffer              /usr/bin/pnmtotiff       /usr/bin/sdiff       /usr/bin/tiffdither  /usr/bin/zdiff
/usr/bin/ffplay     /usr/bin/hdifftopam           /usr/bin/pnmtotiffcmyk   /usr/bin/sqldiff     /usr/bin/tiffdump
/usr/bin/ffprobe    /usr/bin/hwloc-diff           /usr/bin/poweroff        /usr/bin/srt-ffplay  /usr/bin/tiffgt
```

If you want the pattern literally, you have two options:

- Surround the pattern with single quotes(`'`) or double quotes(`"`):

  ```bash
  touch 'crazy*24'
  ```

  <aside class="admonition">
  <header>
  <b>Info</b>
  </header>

  `touch` updates the timestamps of existing file. If the argument contains non-existent filename then an empty file is created by that name.

  </aside>

- Use the `\` wildcard to escape wildcards:
  ```bash
  touch crazy\*42
  ```

## Further study

For a more in depth study of the wildcards and globbing(including extended ones) in bash and zsh see:

- Enter `man 7 glob` in your terminal.
- [GNU bash manual](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html)
- [zsh doc](https://zsh.sourceforge.io/Doc/Release/Expansion.html#Filename-Generation)

## Notes {#notes}

- [glob] Originally `glob` was the program to do what today we mean by globbing in a smaller scale. The name glob came from global.
- [wildcard] In card games wildcard is used describe a card which can have any value as it's holder desires. This is where the term came from.

## References {#refs}

- [commonwildcards] [GNU Findutils](https://www.gnu.org/software/findutils/manual/html_node/find_html/Shell-Pattern-Matching.html)
