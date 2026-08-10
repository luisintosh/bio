Feature: Contact and LinkedIn
  Visitors can use the Contact surface to send a note (Name + Message)
  via mailto handoff to hello@luisexpert.dev plus a local thanks
  acknowledgment, and open LinkedIn. Behavior covers happy path and
  empty, rapid, and missing-social counterparts.

  @S5
  Scenario: Contact section shows prompt, form, and LinkedIn
    Given the portfolio is available at the site root
    When a visitor views the Contact section
    Then they see a heading or prompt equivalent to "say hi"
    And they see supporting copy equivalent to "Drop a note — let's build something fun."
    And they see a form with Name and Message fields and a Send control
    And they see a LinkedIn control targeting "https://www.linkedin.com/in/luismendieta/"
    And the LinkedIn control opens in a new browsing context with noopener-safe rel behavior

  @S10
  Scenario: Valid Name and Message submission acknowledges success and initiates mailto
    Given the visitor is on the Contact section
    When they enter a non-empty Name and a non-empty Message
    And they activate Send
    Then they see a clear local success acknowledgment
    And a mailto handoff to "hello@luisexpert.dev" is initiated
    And the mailto subject and body are derived from the submitted Name and Message

  @S11
  Scenario: Empty required fields do not succeed
    Given the visitor is on the Contact section
    When Name is empty or Message is empty
    And they activate Send
    Then they do not see a success acknowledgment
    And they are informed that required fields are missing
    And no mailto handoff to "hello@luisexpert.dev" is initiated

  @S15
  Scenario: Rapid double submit does not leave a stuck multi-success state
    Given the visitor is on the Contact section
    And Name and Message are both non-empty
    When they activate Send twice in rapid succession
    Then at most one success acknowledgment remains visible after the interaction settles
    And the form does not remain in an indeterminate half-submitted state
    And the settled outcome is not multiple overlapping mailto launches

  @S12
  Scenario: Missing or invalid LinkedIn URL is not presented as a live link
    Given the content source has a LinkedIn URL that is missing or not a valid http(s) URL
    And the site is built from that content source
    When a visitor views the Contact section
    Then the page does not render a clickable LinkedIn control that navigates to an empty or invalid destination
    And the rest of the Contact prompt and form remain usable
