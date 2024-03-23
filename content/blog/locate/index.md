+++
title = "Searching files with `locate`"
date = 2022-03-27
updated = 2024-03-01
[taxonomies]
tags = ["linux"]
+++

If you are feeling lazy and need to search for some file or directory in your _whole system_, then `locate` might be your best friend. It can find things super fast from thousands of items with the help of a database created earlier and usually updated automatically once a day.

`locate` almost works like the librarian in a library. When you ask the librarian for a book, he/she can find it for you in the entire library very efficiently because the books are sorted by some order.

`locate` does not locate the file/directories on your system directly but on a database of absolute pathnames which are gathered beforehand. This database has an index, which makes finding things very fast.

Using `locate` is very simple. Let's get started by first installing it.

## Installing

In most modern Linux distributions the `locate` command is available via the `plocate` and `mlocate` packages. Both packages gives us two commands: `locate` and `updatedb`.

I recommend installing the `plocate` package because it's faster than `mlocate` and almost a drop-in-replacement for `mlocate`. While all variants of `locate`s are more or less the same, in this article I will discuss about `plocate` particularly.

`plocate` is available in the official repositores of the following distros and can be installed there like below:

```sh
# Arch
sudo pacman -S plocate

# Debian / Ubuntu
sudo apt install plocate

# Fedora
sudo dnf install plocate
```

## Creating the database with `updatedb`

Before using it you will need to create it's database by running `updatedb` like below, if you don't want to wait for the system to do it for you:

```
sudo updatedb
```

It will take some time. Usually `updatedb` is run once a day automatically by your system to keep the database updated.

Since the database is not guaranteed to hold the most recent info about your syestem, you will may notice that very recent files/directories do not show up when using `locate`. To overcome this, you can run the `updatedb` command manually like above.

## How to use the `locate` command

The general syntax of `locate` command is:

```
locate [OPTION]... PATTERN...
```

Based on the given patterns and options, `locate` performs a quick database search of absolute pathnames of files and directories that are accessible to the user in the entire system.

It can be used with or without options. First let's see it's usage without any options.

### Without options

To find out all the pathnames containing the substring `bin` we can enter `bin` as pattern:

```zsh
locate bin
```

It will display a long list of absolute pathnames containing the pattern `bin` in them:

```
/bin
/sbin
/etc/bindresvport.blacklist
/etc/binfmt.d
/etc/libinput
/etc/ca-certificates/extracted/edk2-cacerts.bin
/etc/profile.d/perlbin.csh
/etc/profile.d/perlbin.sh
.
.
.
```

Now if we want only the pathnames that contains both `bin` and `zip` we can enter both as patterns:

```zsh
locate bin zip
```

This time the output will be significantly less somewhat like below:

```
/usr/bin/bunzip2
/usr/bin/bzip2
/usr/bin/bzip2recover
/usr/bin/funzip
/usr/bin/gunzip
/usr/bin/gzip
/usr/bin/unzip
/usr/bin/unzipsfx
/usr/bin/zipgrep
/usr/bin/zipinfo
```

We can also use glob patterns(aka wildcard patterns).[_refs:glob_] In this case it's important to quote the pattern to prevent the shell from expanding them. For example:

```zsh
locate '*.md'
```

It lists only the pathnames that ends with `.md`. These are the first few items from my system:

```
/home/ashutosh/.cache/tldr/pages/common/bg.md
/home/ashutosh/.cache/tldr/pages/common/cat.md
/home/ashutosh/.cache/tldr/pages/common/exec.md
/home/ashutosh/.cache/tldr/pages/common/fg.md
/home/ashutosh/.cache/tldr/pages/common/git.md
/home/ashutosh/.cache/tldr/pages/common/neofetch.md
/home/ashutosh/.cache/tldr/pages/common/tldr.md
/home/ashutosh/.cache/tldr/pages/common/ts-node.md
/home/ashutosh/.cache/tldr/pages/common/vim.md
/home/ashutosh/.cache/tldr/pages/linux/pacman.md
```

<aside class="admonition">
<header>
<b>Tip</b>
</header>

If the output of `locate` is long you can pipe it to `less` for better viewing:

```zsh
locate '*.md' | less
```

</aside>

Other wildcards that can be used like this are `?` for matching any single character and `[]` for character classes.

### With options

Here we will see the most commonly used options:

#### `-c` or `--count`

Adding `-c` or `--count` option displays the number of matched items. For example:

```zsh
locate -c '*.js'
```

#### `-l` or `--limit`

With the `-l` or `--limit` option you can set the upper limit for searching items. For example:

```zsh
locate -l 10 '*.css'
```

This will only display at most 10 pathnames.

#### `-i` or `--ignore-case`

By default `locate` performs case-sensitive search. To do a case-insensitive search add the `-i` or `--ignore-case` flag:

```zsh
locate -i An-Old-Post.md
```

#### `-e` or `--existing`

After the most recent database update, if some file/directory deleted, it will still show up, if searched for. To not include such items add the `-e` or `--existing` flag.

Note that newly added files after the most recent database update will not show up. To show them, the database must be updated.

#### Options for regular expressions

If you want to search using a POSIX basic regular expression, `-r` or `--regexp` are the options. For example to count for all JavaScript and JSON files, the command will be:

```zsh
locate --regexp -c '\.\(js\|json\)$'
```

If you want to search using a POSIX extended regular expression, then use the option `--regex`. So the above command can be written much more cleanly like below with `--regex`:

```zsh
locate --regex -c '\.(js|json)$'
```

Note that these options will treat _all_ given patterns to be the corresponding type of regular expressions.

## Summary

```zsh
# for updating the database
sudo updatedb

# finding by matching a pattern string as substring in the pathnames
locate cat.jpg

# all pathnames will be displayed that satisfy both patterns
locate bin python

# finding using wildcard patterns
locate '*.jpg'

# count all jpg files
locate -c '*.jpg'

# display only first 10 jpg files
locate -l 10 '*.jpg'

# Case-insensitive search
locate -i 'cat.jpg'

# For not including deleted files after most recent database update
locate -e 'cat.jpg'

# POSIX basic regular expression
locate -r '\.\(js\|json\)$'

# POSIX extended regular expression
locate --regex '\.(js|json)$'
```

For further info see `locate`'s man page by entering `man plocate`.

## References {#refs}

- [glob] [What are wildcards and globbing?](@/blog/wildcards-and-globbing/index.md)
