<template>
  <v-toolbar absolute
             app>
    <nuxt-link to="/"
               style="height: 24px">
      <LogoText :height="24" />
    </nuxt-link>
    <v-spacer></v-spacer>
    <v-layout row
              align-center
              style="max-width: 400px">
      <v-text-field flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="hidden-xs-and-down"></v-text-field>
    </v-layout>
  </v-toolbar>
</template>
