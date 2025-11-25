<script setup lang="ts">
import avatar from '../assets/img/avatar.webp'
import github from '../assets/icons/github.svg'
import linkedin from '../assets/icons/linkedin.svg'
import email from '../assets/icons/email.svg'
import arrow from '../assets/img/down-arrow.gif'
</script>

<template>
  <main class="relative min-h-screen flex items-center justify-center max-w-4xl mx-auto p-5">
    <div class="max-w-4xl bg-black -mr-2 sm:mr-0">
      <section
        class="border-2 border-black -translate-x-2 -translate-y-2 sm:-translate-x-3 sm:-translate-y-3 bg-white p-9 text-center"
      >
        <div class="avatar">
          <div class="ring-base-200 ring-offset-base-100 w-60 rounded-full ring-2 ring-offset-2">
            <img :src="avatar" />
          </div>
        </div>
        <h1 class="text-6xl font-bold my-6">Luis Mendieta</h1>
        <p class="text-3xl text-pretty">
          Frontend expert, full-stack capable, building clean, scalable apps with Cloud and GenAI.
        </p>
        <div class="socials flex justify-center gap-4 mt-6">
          <a href="https://github.com/luisintosh" class="hover:ring ring-base-200 ring-offset-2">
            <img :src="github" alt="GitHub" class="w-12 h-12" />
          </a>
          <a
            href="https://linkedin.com/in/luismendieta"
            class="hover:ring ring-base-200 ring-offset-2"
          >
            <img :src="linkedin" alt="LinkedIn" class="w-12 h-12" />
          </a>
          <a href="mailto:hello@luisexpert.dev" class="hover:ring ring-base-200 ring-offset-2">
            <img :src="email" alt="Email" class="w-12 h-12" />
          </a>
        </div>
      </section>
    </div>
    <div class="absolute bottom-0 left-0 right-0 grid place-items-center">
      <img :src="arrow" alt="Arrow" class="w-12 h-12" />
    </div>
  </main>
</template>

<style scoped></style>
