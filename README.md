# Uniq Glob Patterns

Visual Studio Code extension to make lines unique as glob patterns.

## Features

Compares selected lines and make them unique as glob patterns.
Supports three major [Bash pattern-matching patterns][1].

[1]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html#Pattern-Matching

No prior sorting is required.

## Usage

1.  Select lines.
    If no line is selected, the entire text is taken.
2.  Press Ctrl+Shift+P or F1 to show *Command Palett*.
3.  Execute **Uniq Glob Pattenrs**.

## Examples

Examples below show what are unique lines as glob patterns.

I originally made this to reduce the number of `shExpMatch` in PAC files,
so examles are hostname patterns.

### Example 1

```
*.example.com
www.example.com
```

produces

```
*.example.com
```

### Example 2

```
www.example.com
www1.example.com
www2.example.com
www3.example.com
www4.example.com
www[1-4].example.com
```

produecs

```
www.example.com
www[1-4].example.com
```
