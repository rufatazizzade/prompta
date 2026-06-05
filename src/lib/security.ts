export interface PIIEntity {
  category: "email" | "phone" | "credit_card" | "api_key" | "ssn";
  text: string;
  index: number;
}

const PII_RULES: { category: PIIEntity["category"]; pattern: RegExp }[] = [
  {
    category: "email",
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    category: "phone",
    pattern: /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g,
  },
  {
    category: "credit_card",
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})\b/g,
  },
  {
    category: "api_key",
    pattern: /\b(?:gsk_|sk-|aiza_)[a-zA-Z0-9-_]{24,60}\b/g,
  },
  {
    category: "ssn",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
];

/**
 * Scans input text and returns all found PII entities.
 */
export function scanForPII(text: string): PIIEntity[] {
  if (!text) return [];
  const entities: PIIEntity[] = [];

  for (const rule of PII_RULES) {
    // Reset regex lastIndex
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(text)) !== null) {
      entities.push({
        category: rule.category,
        text: match[0],
        index: match.index,
      });
    }
  }

  // Sort by index
  return entities.sort((a, b) => a.index - b.index);
}

/**
 * Redacts PII entities in the input text with standard labels.
 */
export function redactPII(text: string): string {
  if (!text) return "";
  let redacted = text;

  // Sort by length of matched text descending so we don't do partial overlaps incorrectly
  const entities = scanForPII(text).sort((a, b) => b.text.length - a.text.length);

  for (const entity of entities) {
    const replacement = `[REDACTED_${entity.category.toUpperCase()}]`;
    // Escape regex special chars in the entity text to avoid breaking replace
    const escapedText = entity.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    redacted = redacted.replace(new RegExp(escapedText, "g"), replacement);
  }

  return redacted;
}

/**
 * Returns a human-readable list of warnings if PII is detected.
 */
export function getPIIWarningMessage(entities: PIIEntity[]): string | null {
  if (entities.length === 0) return null;

  const categories = Array.from(new Set(entities.map((e) => e.category)));
  const list = categories.map((cat) => {
    switch (cat) {
      case "email": return "Email address";
      case "phone": return "Phone number";
      case "credit_card": return "Credit card info";
      case "api_key": return "AI SDK API key";
      case "ssn": return "Social Security number";
    }
  });

  return `Security Shield Warning: Detected potential sensitive data: ${list.join(", ")}. Please redact it before executing or submitting!`;
}
