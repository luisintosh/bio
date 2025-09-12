<script setup lang="ts">
import aws from '../assets/icons/aws.webp'
import google from '../assets/icons/google.webp'
import tecnm from '../assets/icons/tecnm.webp'
import deeplearning from '../assets/icons/deeplearning.webp'
</script>

<template>
  <section class="p-9">
    <h2 class="text-4xl font-bold mb-6">Education</h2>
    <p class="text-2xl mb-6">
      Strong computer engineering foundation, sharpened with cloud certifications and GenAI
      expertise to stay ahead in software innovation.
    </p>
    <ul class="list bg-base-100">
      <li class="list-row">
        <div>
          <img class="size-10 border border-base-300" :src="deeplearning" />
        </div>
        <div>
          <div>Gen AI Training Path - Technical Track</div>
          <div class="text-xs uppercase font-semibold opacity-60">
            2025 - DeepLearning.AI + Coursera
          </div>
        </div>
        <a
          href="https://www.coursera.org/account/accomplishments/badge/JXA6AgzmQbuwOgIM5nG7pg"
          class="btn btn-sm btn-neutral btn-ghost"
        >
          certificate
        </a>
      </li>
      <li class="list-row">
        <div>
          <img class="size-10 border border-base-300" :src="google" />
        </div>
        <div>
          <div>Professional Cloud Developer</div>
          <div class="text-xs uppercase font-semibold opacity-60">2024 - Google Cloud</div>
        </div>
        <a
          href="https://www.credly.com/badges/7da9238b-4227-427d-aed6-bd89dbb05985/linked_in_profile"
          class="btn btn-sm btn-neutral btn-ghost"
        >
          certificate
        </a>
      </li>
      <li class="list-row">
        <div>
          <img class="size-10 border border-base-300" :src="aws" />
        </div>
        <div>
          <div>AWS Certified Developer - Associate</div>
          <div class="text-xs uppercase font-semibold opacity-60">
            2022 - Amazon Web Services (AWS)
          </div>
        </div>
        <a
          href="https://www.credly.com/badges/4ceaca1a-0a38-40d9-aa4b-1a8f08ebe52a?source=linked_in_profile"
          class="btn btn-sm btn-neutral btn-ghost"
        >
          certificate
        </a>
      </li>
      <li class="list-row">
        <div>
          <img class="size-10 border border-base-300" :src="tecnm" />
        </div>
        <div>
          <div>Computer Systems Engineer, Computer Science</div>
          <div class="text-xs uppercase font-semibold opacity-60">
            2017 - Tecnológico Nacional de México (TecNM)
          </div>
        </div>
        <a href="https://www.tecnm.mx/" class="btn btn-sm btn-neutral btn-ghost">website</a>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>
