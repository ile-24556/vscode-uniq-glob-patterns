# Uniq Glob Patterns

Visual Studio Code extension to make lines unique as glob patterns.

## Features

Compares selected lines and make them unique as glob patterns.
Supports three major [Bash pattern-matching patterns][1].

[1]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html#Pattern-Matching

No prior sorting is required.

## Usage

1.  Select lines.
    If no line is selected, the entire text is covered.
2.  Press Ctrl+Shift+P or F1 to show *Command Palett*.
3.  Execute **Uniq Glob Pattenrs**.

## Examples

Let's see unique-ing examples.

I originally made this to reduce the number of `shExpMatch` in PAC files,
so examles are hostname patterns.

### Example 1

```
*.google.com
www.google.com
```

will produces

```
*.google.com
```

### Example 2

```
clients1.google.com
clients2.google.com
clients3.google.com
clients4.google.com
clients[1-4].google.com
```

will produecs

```
clients[1-4].google.com
```
