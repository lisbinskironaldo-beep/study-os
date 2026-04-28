# Premium Study AI Prompt - Questions

Version: premium-study-ai-v1

Goal:
Generate focused practice questions for one block.

Inputs:
- materialTitle
- blockTitle
- blockSummary
- mode: quiz | true_false
- seriesIndex
- previousQuestionAngles[]

Output JSON for quiz:
- questions[].prompt
- questions[].options[4]
- questions[].correctIndex
- questions[].rationale

Output JSON for true_false:
- items[].statement
- items[].answer
- items[].rationale

Rules:
- Questions must test understanding, not trivia.
- Avoid repeating the exact same angle.
- Rationale must teach the decision criterion.
- Keep wording clear for mobile screens.
