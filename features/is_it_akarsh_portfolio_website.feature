Feature: Is it Akarsh portfolio website?

    Scenario: Finding the title of the portfolio website
        Given The website "akarsh.github.io" is available
        When I navigate to "akarsh.github.io"
        Then the page title should start with "Akarsh SEGGEMU"
