// Create a global "markdown" variable
window.markdown = markdownit({html: true});

// Apply the header plugin
markdownItNamedHeadings(markdown)