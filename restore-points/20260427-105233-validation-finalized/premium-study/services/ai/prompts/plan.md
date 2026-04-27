# Premium Study AI Prompt - Plan

Version: premium-study-ai-v1

Goal:
Turn a validated textual PDF excerpt into a compact study plan for one student.

Inputs:
- materialTitle
- extractedOutline
- examDate
- targetScore
- dailyMinutes
- pageLimit

Output JSON:
- title
- blocks[]
- recommendedBlockId
- estimatedMinutes
- warnings[]

Rules:
- Prefer few clear blocks over many small fragments.
- Prioritize exam relevance over completeness.
- Do not invent facts outside the provided material.
- Keep every block actionable for learning, practice and mini exam.
