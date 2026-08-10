Feature: SEO, crawlability, and static GitHub Pages delivery
  The redesign ships crawlable SEO essentials and a static React+Vite
  build that replaces the old stack on GitHub Pages. Production
  absolute SEO URLs stay locked to https://www.luisexpert.dev/.

  @S6
  Scenario: Document head includes title, description, social, and canonical tags
    Given the portfolio production document is loaded
    When a crawler or browser inspects the document head
    Then the title is equivalent to "Luis Mendieta — Software Engineer"
    And the meta description is equivalent to "Lead Full-Stack AI Engineer | React, Node.js, NestJS."
    And Open Graph tags include og:title, og:description, og:type=website, og:url, and og:image
    And Twitter tags include twitter:card=summary_large_image, twitter:title, twitter:description, twitter:image, and twitter:creator=@luisintosh
    And a canonical link points to "https://www.luisexpert.dev/"
    And og:url is "https://www.luisexpert.dev/"
    And og:image and twitter:image use "https://www.luisexpert.dev/preview-image.jpg"

  @S13
  Scenario: Absent SEO essentials fail acceptance
    Given a build missing title, meta description, canonical, or required OG/Twitter tags
    When SEO acceptance is evaluated
    Then the build is rejected as not meeting FR10
    And the missing fields are identifiable in the failure

  @S17
  Scenario: Primary content is available without interaction gates
    Given a non-JavaScript or limited-JS consumer fetches the root document
    When it inspects the response used for the site root
    Then identity (Luis Mendieta) and primary section substance (including Testimonials when populated) are present without requiring scroll-toy interaction
    And FR10 meta tags are present in the document head without depending solely on post-load client injection that typical crawlers miss

  @S18
  Scenario: Redesigned social preview image URL is reachable
    Given the production SEO image URL "https://www.luisexpert.dev/preview-image.jpg"
    When a client requests that URL
    Then the response is a successful image payload (HTTP 200 and an image content type)
    And the URL matches the og:image and twitter:image values in the document head
    And the image is a redesigned asset matching the dark retro-futurist brand (not the legacy preview art)

  @S9
  Scenario: Static React+Vite build deploys to GitHub Pages
    Given the repository mainline build pipeline for this feature
    When a production build runs
    Then the app is a React application built with Vite
    And the output is a static file artifact suitable for GitHub Pages
    And publishing that artifact to GitHub Pages serves the portfolio at the site root without a server runtime for page render

  @S20
  Scenario: Old Mario theme stack and Tweaks toolbar are gone
    Given the redesigned portfolio is published
    When a visitor uses the production site
    Then they do not see the Tweaks toolbar (sky palette, fall speed, or equivalent old-theme toys)
    And the primary experience is not the prior scroll-driven Mario/lagoon plain HTML/CSS/JS theme
    And the shipped stack is the React + Vite static site that replaced that origin stack
