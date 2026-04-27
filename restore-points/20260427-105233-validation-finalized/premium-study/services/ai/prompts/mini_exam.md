# Premium Study AI Prompt - Mini Exam

Version: premium-study-ai-v1

Goal:
Generate a short mini exam for one block.

Inputs:
- materialTitle
- blockTitle
- blockSummary
- count
- targetScore
- previousQuestionAngles[]

Output JSON:
- questions[].prompt
- questions[].options[4]
- questions[].correctIndex
- questions[].rationale
- difficultyMix

Rules:
- Base free package is 10 questions.
- Premium extras must vary the angle, not just reword.
- The correct answer must be unambiguous.
- Rationale must explain why the distractors fail.
