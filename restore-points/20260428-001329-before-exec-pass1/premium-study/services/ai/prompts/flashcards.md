# Premium Study AI Prompt - Flashcards

Version: premium-study-ai-v1

Goal:
Generate memorization cards for one block.

Inputs:
- materialTitle
- blockTitle
- blockSummary
- keyTerms[]
- seriesIndex

Output JSON:
- cards[].front
- cards[].back
- cards[].tip

Rules:
- Front should trigger recall, not give away the answer.
- Back should be compact and useful.
- Tip should include mnemonic, trigger or contrast.
- Avoid generic "study this" messages.
