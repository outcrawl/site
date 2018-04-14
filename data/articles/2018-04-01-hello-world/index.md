---
title: Hello World
author: tin-rabzelj
tags:
  - Go
  - Elasticsearch
  - Docker
description: ...
---

Aut aut magnam. Commodi ipsa sint non delectus rem ullam quaerat illo. Et quae quod non vero voluptatem nisi quia sapiente sed. Qui sit qui. Est autem accusantium omnis `f(x) => x * x` dicta quia dolores. Ut neque pariatur exercitationem est eius et iusto in magnam.

```go{3-8}
var rootQuery = graphql.NewObject(graphql.ObjectConfig{
  Name: "RootQuery",
  Fields: graphql.Fields{
    "user": &graphql.Field{
      Type: userType,
      Args: graphql.FieldConfigArgument{
        "id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
      },
      Resolve: queryUser,
    },
    "posts": makeListField(makeNodeListType("PostList", postType), queryPosts),
  },
  Text: "Quibusdam quisquam vitae. Odit quibusdam earum. Fugiat odio vel minima. Amet repellat et neque. A incidunt et tenetur iste eum error totam aspernatur iure. Aut et cupiditate quos harum.",
})
```

```ts
signIn(): Promise<User> {
  return new Promise<User>((resolve, reject) => {
    this.googleAuth.signIn({
      // Show the prompt
      'prompt': 'consent'
    }).then(googleUser => {
      // Get Google ID token
      const token = googleUser.getAuthResponse().id_token;
      // Sign in with the back-end service
      this.http.post<SignInResponse>(`${environment.apiUrl}/signin`, null, {
        headers: new HttpHeaders().set('Authorization', token)
      }).subscribe(res => {
        const profile = googleUser.getBasicProfile();
        // Create the user
        this.user = new User(res.userId, res.sessionToken, profile.getName());
        // Save the user to local storage
        localStorage.setItem('user', JSON.stringify(this.user));
        resolve(this.user);
      }, reject);
    }, reject);
  });
}
```

```html
<div>
  <span *ngIf="!editMode; else titleInput"
        (click)="onTitleClick()">{{item.title}}</span>
  <ng-template #titleInput>
    <input type="text"
           [(ngModel)]="editableTitle"
           (keyup.enter)="update()"
           (blur)="onTitleInputBlur()">
  </ng-template>
</div>
```

```scss
:host {
  display: block;
  box-sizing: border-box;
  width: 400px;
  max-width: 100%;
  margin: 0 auto;
  padding: 32px 16px;
}
.user {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  &__sign-out {
    margin-left: auto;
  }
}
.new-todo-field {
  width: 100%;
}
```
