---
title: "Hello World"
slug: "hello-world"
author: "tin-rabzelj"
tags: ["Angular", "Typescript", "Go"]
date: "2017-08-01"
thumbnail: "todo-angular-appengine"
---

Aenean fermentum condimentum eros, vitae pulvinar lacus pretium id. Donec sit amet dolor quis arcu ullamcorper imperdiet sit amet sed diam. Curabitur sed nunc sit amet turpis laoreet cursus non sit amet est. Proin dictum pharetra neque sit amet vulputate. Quisque ac dictum sem. In sodales a justo in dignissim. Phasellus mollis posuere erat, in volutpat libero aliquet eu.

{{< code lang="go" line="3-4" >}}
func delete(w http.ResponseWriter, r *http.Request, p httprouter.Params, ctx context.Context, userID string) {
	if _, key, err := getOwnTodo(ctx, userID, p.ByName("id")); err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
		return
	} else if err := datastore.Delete(ctx, key); err != nil {
		responseError(w, "could not delete", http.StatusBadRequest)
		return
	}
	responseJSON(w, "")
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

{{< terminal output="2" >}}
echo "hello, world"
hello, world
{{< /terminal >}}

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit nihil necessitatibus a quasi, consectetur repellendus vitae. Possimus atque ut provident?

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
