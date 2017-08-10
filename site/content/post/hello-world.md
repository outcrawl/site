---
title: "Hello World"
slug: "hello-world"
author: "tin-rabzelj"
tags: ["Angular", "Typescript", "Go"]
date: "2018-01-01"
thumbnail: "test"
---

Eu consectetur ad veniam quis ex minim. Anim laboris esse voluptate incididunt aliquip sunt ipsum anim pariatur excepteur ut. Qui officia quis laborum eu qui culpa dolore proident ullamco commodo aliqua nulla mollit. In culpa sunt ea deserunt exercitation aute velit laboris ipsum non. In tempor id eiusmod amet magna occaecat laboris irure eiusmod sit ullamco enim.

# Heading 1

Labore Lorem officia cillum anim sit nulla.

## Heading 2

Cillum dolor tempor ad commodo laborum esse.

### Heading 3

Et officia veniam est nulla deserunt nisi.

# Image

{{< image src="http://lorempixel.com/1280/720" >}}

# Code

Enim fugiat deserunt est consectetur `print("hello, world")` mollit incididunt excepteur adipisicing reprehenderit consequat id deserunt cillum.

{{< code lang="go" mark="1,5-7" >}}
func generateToken() string {
	data := make([]byte, 64)
	rand.Read(data)
	token := make([]rune, 64)
	for i := range data {
		token[i] = letters[int(data[i])%len(letters)]
	}
	return string(token)
}
{{< /code >}}

Occaecat consectetur occaecat anim laborum anim do quis duis sit amet culpa nulla commodo.

{{< code lang="javascript" >}}
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}
export  $initHighlight;
{{< /code >}}

{{< code lang="html" >}}
<div class="post__author">
  <img class="post__author-avatar" src="https://www.gravatar.com/avatar/cc6f46e1bb9eff9bc3d84337fd6b6507?s=120">
  <span class="post__author-info">
    <a class="post__author-name" href="http://localhost:3000/authors/tin-rabzelj" title="Tin Rabzelj">
      Tin Rabzelj
    </a>
    <span class="post__date">Sep 5, 2017</span>
  </span>
</div>
{{< /code >}}

# Elements

Lorem ea occaecat labore in pariatur amet id. Exercitation ullamco consequat esse ut dolor pariatur voluptate dolor sint nisi qui exercitation eiusmod labore. Sit pariatur do voluptate occaecat commodo tempor ullamco do Lorem irure minim velit exercitation.

## Emphasis

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

## Lists

1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses

## Tables

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

## Quotes

Enim irure elit ut aliqua ea reprehenderit do adipisicing.

{{< blockquote cite="Someone somewhere" >}}
Irure quis magna duis duis laboris nulla proident cupidatat adipisicing aliqua do laborum.
{{< /blockquote >}}

Irure nostrud nostrud laboris consectetur consequat laborum consectetur.

## Latex

Officia amet sunt {{< latex >}}\displaystyle\sum_{i=1}^{k+1}i{{< /latex >}} consequat ad nulla Lorem.

{{< blocklatex >}}
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} & = \frac{4\pi}{c}\vec{\mathbf{j}} \\[1em]   
\nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\[0.5em]
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\[1em]
\nabla \cdot \vec{\mathbf{B}} & = 0 \end{aligned}
{{< /blocklatex >}}

Minim do commodo sit aute irure voluptate amet incididunt laboris nisi aliqua sint.

## Notes

Pariatur mollit aliquip tempor dolor mollit anim dolore dolore dolore commodo consequat.

{{% note %}}
Minim **labore** ad irure amet officia aliqua laborum `print("yo!")` nulla voluptate nisi laboris <http://localhost:3000/hello-world/> ex et.
{{% /note %}}

Ad incididunt pariatur labore excepteur in consectetur minim quis nisi nulla.

## Embeds

Laborum do dolore ipsum magna eiusmod labore irure nisi officia proident labore veniam tempor.

{{< embed >}}
<iframe width="560" height="315" src="https://www.youtube.com/embed/wRWIsbSXoyQ?rel=0" frameborder="0" allowfullscreen></iframe>
{{< /embed >}}

Consectetur ex quis ex non in id ipsum cupidatat aliqua.

## Charts

Irure ut non sint officia.

{{< chart type="line" >}}
{
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  series: [
    [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9],
    [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null],
    [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null],
    [{x:3, y: 3},{x: 4, y: 3}, {x: 5, y: undefined}, {x: 6, y: 4}, {x: 7, y: null}, {x: 8, y: 4}, {x: 9, y: 4}]
  ]
}
{{< /chart >}}

{{< chart type="bar" >}}
{
  labels: ['First quarter of the year', 'Second quarter of the year', 'Third quarter of the year', 'Fourth quarter of the year'],
  series: [
    [60000, 40000, 80000, 70000],
    [40000, 30000, 70000, 65000],
    [8000, 3000, 10000, 6000]
  ],
  stackBars: true
}
{{< /chart >}}

{{< chart type="pie" >}}
{
  series: [20, 10, 30, 40]
}
{{< /chart >}}

Nostrud tempor minim do culpa.