const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const reUnescapedHtml = /[&<>"']/g;
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
const replacer = (chr: string): string => htmlEscapes[chr];

/**
   * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
   * corresponding HTML entities.
   */
function escape(string: string): string {
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, replacer)
    : (string || "");
}

export default escape;
