+++
title = "Linux command: `gzip`"
date = 2022-04-03
[taxonomies]
tags = ["linux"]
[extra]
status = "finished"
importance = 6
certainty = "certain"
description = "A note on the common usage of the gzip utility of Linux"
+++

`gzip` command is used to reduce the size of given files. This command is so common that you will most likely find it already installed on your Linux distro.

`gzip` only compresses regular files. Directories, symbolic links etc are not it's food. Files compressed with `gzip` are often called _gzipped_ files.

`gzip` also comes with the `gunzip`, `zcat` and `zless` commands for uncompressing and viewing gzipped files.

Let's start gzipping!

## Compressing one or more files

To compress one or more files we can simply do like below:

```zsh
gzip file1 file2 file3
```

It will compress each file and replace them with compressed versions of them which have a `gz` suffix:

```
file1.gz file2.gz file3.gz
```

## Compressing standard input

`gzip` can also be used via standard input and output:

```zsh
ls -l /bin | gzip > foo.txt.gz
```

## Uncompressing gzipped files

With the command `gunzip` we can uncompress them like below:

```zsh
gunzip file1.gz file2.gz file3.gz
```

It will replace each compressed file with it's uncompressed version. So you will get the following files:

```
file1 file2 file3
```

## Compress/Uncompress files recursively in a directory

We can use the `-r` option to recursively compress each file in a directory:

```zsh
gzip -r someDir
```

For a directory containing any gzipped files, we can use `gunzip` with `-r` to uncompress all of them recursively with a single command:

```zsh
gunzip -r someDir
```

## Output to standard output

The `-c` option can be used by both `gzip` and `gunzip` to write output to standard output and keep the original files:

```zsh
gzip -c some-file > some-file.gz
gunzip -c some-file.gz > some-file-copy
```

## Viewing the gzipped files

When a text file is compressed, it's sometimes handy to view the text without uncompressing and writing it to disk.

To view the contents of a compressed file, there are several ways.

We can simply use the `-c` option and pipe the output to `less` to view it:

```zsh
gunzip -c file1.gz | less
```

`zcat` can be used like `cat` on `gzip` compressed files. So we can be little more succinct:

```zsh
zcat file1.gz | less
```

The command `zless` allows us view gzipped files in the most clean way:

```zsh
zless file1.gz
```

That's for this article. Hope you have learned something useful. For digging deeper see the man page `man gzip`. Happy gzipping!
