---
title: "Hello World"
slug: "hello-world"
tags: ["Angular", "Typescript", "Go"]
categories: ["Web"]
date: "2017-07-01"
---

Aenean fermentum condimentum eros, vitae pulvinar lacus pretium id. Donec sit amet dolor quis arcu ullamcorper imperdiet sit amet sed diam. Curabitur sed nunc sit amet turpis laoreet cursus non sit amet est. Proin dictum pharetra neque sit amet vulputate. Quisque ac dictum sem. In sodales a justo in dignissim. Phasellus mollis posuere erat, in volutpat libero aliquet eu.

{{< highlight go >}}
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
{{< / highlight >}}

## Another section

Curabitur sodales sit amet velit vel egestas. Cras vitae commodo sem. In ac luctus dolor, rutrum aliquam dolor. Maecenas imperdiet id libero ut ultricies. Phasellus semper tellus at maximus sollicitudin. Mauris aliquam ipsum vel orci sagittis tincidunt ac non ligula. Sed imperdiet ullamcorper nunc ut vulputate. Integer volutpat at purus nec consequat. Morbi in convallis velit.

{{< highlight go "linenos=inline,hl_lines=2 3" >}}
var a string
var b string
var c string
var d string
{{< / highlight >}}
