<script setup lang="ts">
import ultraCryptoWallet from '../assets/img/crypto-wallet-preview.webp'
import ultraGameStore from '../assets/img/game-store-preview.webp'
import ultraDesignSystem from '../assets/img/design-system-preview.webp'
import ultraWebsite from '../assets/img/website-preview.webp'
</script>

<template>
  <section class="p-9">
    <h2 class="text-4xl font-bold mb-6">Projects</h2>
    <p class="text-2xl mb-6">
      Proven experience delivering frontends, backends, and cloud-ready systems, below I show the
      most recent ones.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card card-lg bg-base-300">
        <figure>
          <div class="mockup-window w-full bg-base-100 border border-base-300">
            <a :href="ultraCryptoWallet">
              <img :src="ultraCryptoWallet" alt="Ultra Crypto Wallet" />
            </a>
          </div>
        </figure>
        <div class="card-body">
          <h3 class="card-title">Ultra Crypto Wallet</h3>
          <p class="card-text">
            Developed a browser extension and web wallet for the Ultra blockchain, with a strong
            focus on security, usability, and seamless user experience.
          </p>
          <div class="flex gap-2 flex-wrap">
            <div class="badge badge-neutral badge-sm">Angular</div>
            <div class="badge badge-neutral badge-sm">Chrome Extension API</div>
            <div class="badge badge-neutral badge-sm">OAuth2</div>
            <div class="badge badge-neutral badge-sm">GraphQL</div>
            <div class="badge badge-neutral badge-sm">EOS Blockchain</div>
          </div>
        </div>
      </div>
      <div class="card card-lg bg-base-300">
        <figure>
          <div class="mockup-window w-full bg-base-100 border border-base-300">
            <a :href="ultraGameStore">
              <img :src="ultraGameStore" alt="Ultra Game Store" />
            </a>
          </div>
        </figure>
        <div class="card-body">
          <h3 class="card-title">Ultra Game Store</h3>
          <p class="card-text">
            Built a storefront and desktop app for Ultra Games and NFTs, integrating both crypto and
            credit card payments to deliver a seamless purchasing experience.
          </p>
          <div class="flex gap-2 flex-wrap">
            <div class="badge badge-neutral badge-sm">Angular</div>
            <div class="badge badge-neutral badge-sm">GraphQL</div>
            <div class="badge badge-neutral badge-sm">WebSockets</div>
            <div class="badge badge-neutral badge-sm">Sass</div>
            <div class="badge badge-neutral badge-sm">ElectronJS</div>
            <div class="badge badge-neutral badge-sm">NX Monorepo</div>
            <div class="badge badge-neutral badge-sm">CI/CD</div>
          </div>
        </div>
      </div>
      <div class="card card-lg bg-base-300">
        <figure>
          <div class="mockup-window w-full bg-base-100 border border-base-300">
            <a :href="ultraDesignSystem">
              <img :src="ultraDesignSystem" alt="Ultra Design System" />
            </a>
          </div>
        </figure>
        <div class="card-body">
          <h3 class="card-title">Nebula Design System</h3>
          <p class="card-text">
            UI Design System for Ultra ecosystem, from foundations to complex components, well
            documented and ready to use in the entire company.
          </p>
          <div class="flex gap-2 flex-wrap">
            <div class="badge badge-neutral badge-sm">Figma</div>
            <div class="badge badge-neutral badge-sm">Style Dictionary</div>
            <div class="badge badge-neutral badge-sm">Sass</div>
            <div class="badge badge-neutral badge-sm">Storybook</div>
            <div class="badge badge-neutral badge-sm">Angular</div>
          </div>
        </div>
      </div>
      <div class="card card-lg bg-base-300">
        <figure>
          <div class="mockup-window w-full bg-base-100 border border-base-300">
            <a :href="ultraWebsite">
              <img :src="ultraWebsite" alt="Ultra Website" />
            </a>
          </div>
        </figure>
        <div class="card-body">
          <h3 class="card-title">Ultra Website</h3>
          <p class="card-text">
            Developed the public-facing website for Ultra’s products, focusing on SEO strategy and
            building custom WordPress plugins with React to enhance the UI.
          </p>
          <div class="flex gap-2 flex-wrap">
            <div class="badge badge-neutral badge-sm">WordPress</div>
            <div class="badge badge-neutral badge-sm">Plugins development</div>
            <div class="badge badge-neutral badge-sm">ReactJS</div>
            <div class="badge badge-neutral badge-sm">PHP</div>
            <div class="badge badge-neutral badge-sm">Security</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
