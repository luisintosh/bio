Feature: Portfolio identity and content
  Visitors see Luis Mendieta’s software-engineer identity and the
  preserved About, Experience, Education, and Testimonials information
  on a Link Board–inspired single-page brand surface.

  @S1
  Scenario: First visit shows recruiter-facing identity in the first viewport
    Given the portfolio is available at the site root
    When a visitor opens the root URL
    Then they see the name "Luis Mendieta" as a hero-level brand signal in the first viewport
    And they see a strong Software Engineer / Lead Full-Stack AI Engineer (or equivalent senior/AI full-stack) role signal in the first viewport
    And the first-viewport framing reads as recruiter-compelling rather than the playful legacy greeting "hello, i'm Luis Mendieta"

  @S2
  Scenario: About section preserves meaning and skill chips
    Given the portfolio is available at the site root
    When a visitor views the About section
    Then they see copy conveying 8+ years as a full-stack engineer
    And they see React, Next.js, Node, and NestJS called out
    And they see AI product work involving LangGraph and LangChain
    And they see the stance "No vibe coding."
    And they see the GenAI initiative at ACT
    And they see openness to Senior/Lead Full-Stack and AI Engineering
    And they see hiking, photos, and coffee as outside-code interests
    And they see skill chips for React, Next.js, Node.js, NestJS, TypeScript, LangGraph, LangChain, and LLMs

  @S3
  Scenario: Experience section lists both roles with date ranges
    Given the portfolio is available at the site root
    When a visitor views the Experience section
    Then they see "Lead Full-Stack AI Engineer" with range "2025" to "Now"
    And they see GenAI content platform work with Node.js/LangGraph and Next.js/React meaning preserved
    And they see "Lead Frontend Engineer" with range "2020" to "2025"
    And they see Senior-to-Lead history across crypto, NFTs, ecommerce, and gaming with Electron, Angular, and Node.js/NestJS/Kafka meaning preserved

  @S4
  Scenario: Education section lists credentials with years
    Given the portfolio is available at the site root
    When a visitor views the Education section
    Then they see GenAI Agentic Track for 2025
    And they see GenAI Technical Track for 2025
    And they see Professional Cloud Developer for 2024
    And they see AWS Certified Developer — Associate for 2022
    And they see Computer Systems Engineer, Computer Science for 2017

  @S22
  Scenario: Testimonials section presents all five canonical entries
    Given the portfolio is available at the site root
    When a visitor views the Testimonials section
    Then they see an entry for Lance Blackstone with his role/title line and his ACT/collaborative quote meaning preserved
    And they see an entry for Paulo Lima with his role/title line and his front-end architecture / UX / security quote meaning preserved
    And they see an entry for Oleg Statnii with his role/title line and his professional/proactive explorer quote meaning preserved
    And they see an entry for Axel Ayigbede with his role/title line and his Ultra Lead Frontend / team-player quote meaning preserved
    And they see an entry for Nicolas Bouillet with his role/title line and his Ultra squad / blockchain platform quote meaning preserved
    And each of those five entries shows name, role/title, and quote

  @S16
  Scenario: Missing section content does not break the page shell
    Given the content source has one of About, Experience, Education, or Testimonials with empty content
    And the site is built from that content source
    When a visitor opens the root URL
    Then the page still presents identity and remaining populated sections
    And the visitor does not encounter a blank full-page error with no brand identity
    And empty sections do not show fabricated placeholder job, education, or testimonial entries

  @S23
  Scenario: Empty testimonials content source does not fabricate quotes
    Given the content source has Testimonials with empty content
    And the site is built from that content source
    When a visitor opens the root URL
    Then the page does not show fabricated testimonial names or quotes
    And identity and remaining populated sections remain usable

  @S7
  Scenario: Dark retro-futurist brand replaces the pastel Mario theme
    Given the portfolio is available at the site root
    When a visitor views the first viewport and primary sections
    Then the presentation is dark-mode with vibrant accent colors
    And the aesthetic reads as techie / retro-futurist rather than pastel Mario Wonder light theme
    And primary body text meets contrast of at least 4.5:1 against its immediate background
