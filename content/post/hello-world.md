---
title: "Hello World"
slug: "hello-world"
author: "tin-rabzelj"
tags: ["Angular", "Typescript", "Go"]
date: "2017-10-01"
thumbnail: "test"
---

Aenean fermentum condimentum eros, vitae pulvinar lacus pretium id. Donec sit amet dolor quis arcu ullamcorper imperdiet sit amet sed diam. Curabitur sed nunc sit amet turpis laoreet cursus non sit amet est. Proin dictum pharetra neque sit amet vulputate. Quisque ac dictum sem. In sodales a justo in dignissim. Phasellus mollis posuere erat, in volutpat libero aliquet eu.

{{< code lang="go" >}}
// This is a comment
/* This is a comment
on multiple lines */

// Numbers
42
0600
0xBadFace
170141183460469231731687303715884105727
0.
72.40
072.40
2.71828
1.e+0
6.67428e-11
1E6
.25
.12345E+5
0i
011i
0.i
2.71828i
1.e+0i
6.67428e-11i
1E6i
.25i
.12345E+5i

// Runes and strings
'\t'
'\000'
'\x07'
'\u12e4'
'\U00101234'
`abc`
`multi-line
string`
"Hello, world!"
"multi-line
string"

// Functions
func(a, b int, z float64) bool { return a*b < int(z) }

// Full example
package main
import "fmt"

func sum(a []int, c chan int) {
	sum := 0
	for _, v := range a {
		sum += v
	}
	c <- sum // send sum to c
}

func main() {
	a := []int{7, 2, 8, -9, 4, 0}

	c := make(chan int)
	go sum(a[:len(a)/2], c)
	go sum(a[len(a)/2:], c)
	x, y := <-c, <-c // receive from c

	fmt.Println(x, y, x+y)
}
{{< /code >}}

{{< code lang="html" >}}
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <base href="{{.Site.BaseURL}}">
  <link rel="canonical" href="{{.Permalink}}">
</head>
{{< /code >}}

Ullamco dolore enim sunt sint duis nostrud irure fugiat sunt sunt adipisicing dolor aute voluptate. Ipsum ut enim amet amet reprehenderit. Velit culpa ipsum do exercitation ex qui incididunt magna non nostrud Lorem. Dolor occaecat elit commodo consequat duis occaecat dolore deserunt. In occaecat fugiat cupidatat qui voluptate nisi est aliqua proident tempor ea in eu. Adipisicing cillum incididunt adipisicing enim cupidatat eu ex in duis adipisicing.

{{< code lang="scss" >}}
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
{{< /code >}}

{{< terminal output="2" >}}
echo "hello, world"
hello, world
{{< /terminal >}}

Do tempor dolore aliqua enim amet officia. Voluptate dolore do quis do Lorem Lorem. Fugiat id esse minim nisi id laborum excepteur cillum do ex ad. Anim anim id do ipsum aliquip nostrud aliqua voluptate consequat exercitation magna ut irure laboris. Est exercitation adipisicing reprehenderit anim in deserunt nisi deserunt mollit.

# Another section

Curabitur sodales sit amet velit vel egestas. Cras vitae commodo sem. In ac luctus dolor, rutrum aliquam dolor. Maecenas imperdiet id libero ut ultricies. Phasellus semper tellus at maximus sollicitudin.

{{< image src="http://superbwallpaper.website/wp-content/uploads/2017/01/Final-Fantasy-Advent-Children-Weapons-Anime-Abstract-Wallpaper-GVO157-854x480.jpg" >}}

Mauris aliquam ipsum vel orci sagittis tincidunt ac non ligula. Sed imperdiet ullamcorper nunc ut vulputate. Integer volutpat at purus nec consequat. Morbi in convallis velit.

# Markdown

This is intended as a quick reference and showcase

## Tables

Colons can be used to align columns.

Tables        | Are           | Cool  
--------------|---------------|-------:
col 3 is      | right-aligned | $1600 
col 2 is      | centered      |   $12 
zebra stripes | are neat      |    $1 

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

## Lists

1. First ordered list item
2. Another item
1. Actual numbers don't matter, just that it's a number
4. And another item.

* Unordered list can use asterisks
- Or minuses
+ Or pluses

## Blockquotes

{{< blockquote cite="Someone" >}}
Something something something.
{{< /blockquote >}}

## Links

There are two ways to create links.

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com
