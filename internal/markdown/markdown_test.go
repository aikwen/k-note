package markdown

import (
	"testing"
	"k-note/internal/file"
)

func TestMarkdown(t *testing.T) {
	mc := NewMarkdownConverter()
	bytes, err := file.ReadFile("test.md")
	if err != nil {
		t.Fatalf("Failed to read test.md: %v", err)
	}
	html, err := mc.MdToHtml(bytes)
	if err != nil {
		t.Fatalf("Markdown to HTML conversion failed: %v", err)
	}
	t.Logf("%s", html)
}

