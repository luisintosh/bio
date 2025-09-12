<script setup lang="ts">
import HeroSection from './components/HeroSection.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import DetailsLayout from './layouts/DetailsLayout.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import EducationSection from './components/EducationSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <DefaultLayout>
    <HeroSection />
    <DetailsLayout>
      <AboutSection />
      <EducationSection />
      <ProjectsSection />
      <FooterSection />
    </DetailsLayout>
  </DefaultLayout>
</template>

<style scoped></style>
