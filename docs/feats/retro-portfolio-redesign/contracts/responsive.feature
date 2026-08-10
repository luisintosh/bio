Feature: Responsive layout and motion preferences
  The redesign must work on desktop and mobile, and must not require
  motion to consume content or complete primary actions.

  @S8
  Scenario: Mobile viewport keeps content and actions usable
    Given a viewport of 390 CSS pixels wide by 844 CSS pixels tall
    When a visitor opens the portfolio root
    Then identity, About, Experience, Education, Testimonials, and Contact remain reachable by scrolling
    And primary text is not clipped horizontally off-screen
    And Name, Message, Send, and LinkedIn remain usable without requiring a desktop-only layout

  @S14
  Scenario: Very narrow mobile viewport does not hide primary actions
    Given a viewport of 320 CSS pixels wide
    When a visitor opens the portfolio root and navigates to Contact
    Then Send and LinkedIn remain visible and activatable
    And the visitor can complete Name and Message entry without horizontal pan as the only way to reach those controls

  @S19
  Scenario: Desktop viewport presents a cohesive recruiter-facing personal-brand composition
    Given a viewport of 1280 CSS pixels wide by 800 CSS pixels tall
    When a visitor opens the portfolio root
    Then the first viewport reads as one personal-brand composition with Luis Mendieta as a hero-level signal
    And the first viewport includes a strong senior/AI full-stack role signal that reads as recruiter-compelling
    And About, Experience, Education, Testimonials, and Contact are available as clear sections on the same page
    And the layout does not require mobile-only patterns to access primary content

  @S21
  Scenario: Reduced motion does not block content or contact
    Given the visitor prefers reduced motion
    When they open the portfolio and use Contact and LinkedIn
    Then all primary content remains readable without decorative motion
    And Name/Message/Send and LinkedIn remain completable
    And non-essential motion does not obscure or block those actions
