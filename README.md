# Some notes on this site

The following are some notes to myself about how to work this site and create new content.

## How to create a new post?

- For each blog post create a dedicated folder for it in `content/blog`. The folder name should follow the following rules:
  - Only lowercase English letters and dash(`-`) are allowed.
  - Do not start with a dash.
  - Do not use multiple adjacent dashes.
- Do not use the `slug` frontmatter property of a post to change its slug.

<details>
<summary><b>Why these rules</b>: To make backlinks work as expected.</summary>

Backlink page information is fetched using `get_page`, which relies on the markdown file path derived from the `permalink` property. Since Zola 0.18.0(the latest version at the time of writing this page) lacks a property for obtaining the markdown file path directly, failure to follow the rules will result in inability to obtain the correct path from the `permalink` property, leading to build failure.

</details>

## Post frontmatter

### Optional extra meta tags

These should come in the `extra` section of post frontmatter. I have stolen the idea of `status`, `importance` and `certainty` from [https://gwern.net](https://gwern.net/).

- status: Possible values:
  - draft
  - in progress
  - finished
- importance: a 0 to 10 value from least important to very important.
- certainty: Possible values:
  - certain
  - highly likely
  - likely
  - possible
  - unlikely
  - highly unlikely
  - remote
  - impossible
- description: A description of the post, roughly between 150 to 160 characters. This is bascially for SEO.

## Shortcodes

### `img`

You can use it to easily scale an image and embed it with some handy features, especially when you have a large image but need a smaller version for faster rendering. Let's explore its usage:

The only required parameter is `name` where you provide the image name located in your post's folder. So if you have a image in `content/blog/my-pet/cat.png`, you can embed it like below:

```md
{{ img(name="cat.png") }}
```

It will embed the original image wrapped in a anchor element so that if you click on the image, it will open in a new tab(or window depending on how your browser treats `_blank` value of `target` attribue of anchors).

You have 4 optional parmeters for this shortcode. They are described below:

- `alt`: This for setting the `alt` attribute for an image. If not provided no `alt` attribute is set by default. Example:
  ```md
  {{ img(name="cat.png", alt="A cat trying to catch a fly") }}
  ```
- `scale`: Default is `1`. It allows you to easily resize the image maintaining it's aspect ratio. `1` means same as original size. For example to make an image half of it's original size, use a `scale` of `0.5`:
  ```md
  {{ img(name="cat.png", scale=0.5) }}
  ```
- `anchor`: By default embeded images are wrapped in an anchor element referring to the original image when scale is 1 and when scale is not 1 the resized image is referred. You can stop using the wrappping anchor element by setting its the value to `"none"`:
  ```md
  {{ img(name="cat.png", anchor="none") }}
  ```
- `target`: This is releated to the wrappped anchor's `target` attribute. If your image is wrapped in an anchor, then the default value of its `target` attribute is `_blank`. If you want to open the link in the current page use the value `_self`. In this case no `target` attribute is used because `_self` is the default value:
  ```md
  {{ img(name="cat.png", target="_self") }}
  ```
  You can't use any other value for `target`. If you try, it's equivalent to using the `_self` value with this exception: if you use any falsy value like `0` or `""` it will treated as `_blank`.

## Macros
