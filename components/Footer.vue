<template>
  <v-footer height="auto"
            class="grey darken-3">
    <v-layout row
              wrap
              justify-center>
      <v-btn color="white"
             flat>
        About
      </v-btn>
      <v-flex xs12
              py-3
              text-xs-center
              white--text>
        &copy;{{ new Date().getFullYear() }} —
        <strong>Outcrawl</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>
