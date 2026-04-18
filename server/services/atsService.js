const { GoogleGenAI } = require('@google/genai');

const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

const evaluateResume = async (resumeText, jobDescription, jobSkills) => {
    try {
        if (!ai) {
            return { atsScore: null, missingSkills: [], presentSkills: [] };
        }

        const prompt = `
You are an advanced ATS (Applicant Tracking System) resume analyzer used by recruiters.

Your task is to evaluate how well the candidate's resume matches the given job description and required skills.

Analyze the following factors:
1. Skill match between resume and required skills
2. Relevant technologies mentioned
3. Experience related to the job description
4. Keyword similarity with the job description
5. Overall relevance of the resume to the role

Instructions:
- Compare the resume with the job description and required skills carefully.
- Identify important skills from the job description that are missing in the resume.
- Identify all notable technical, professional, and soft skills present in the resume.
- Calculate an ATS score between 0 and 100 representing the overall match percentage.
- Higher score = better match.
- Only list truly missing or weakly represented skills in "missingSkills" from the required skills.
- List all extracted skills found in the resume in "presentSkills".

Job Description:
${jobDescription}

Required Skills:
${jobSkills.join(", ")}

Resume Text:
${resumeText}

IMPORTANT:
Return ONLY valid JSON.
Do not include explanations, text, or markdown.

Expected JSON format:
{
  "atsScore": number,
  "missingSkills": ["skill1", "skill2", "skill3"],
  "presentSkills": ["skill4", "skill5", "skill6"]
}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const resultText = response.text;
        const resultJson = JSON.parse(resultText);
        return {
            atsScore: resultJson.atsScore || 0,
            missingSkills: resultJson.missingSkills || [],
            presentSkills: resultJson.presentSkills || []
        };
    } catch (error) {
        console.error('Error evaluating resume with Gemini:', error);
        return { atsScore: null, missingSkills: [], presentSkills: [] }; // Fallback
    }
};

module.exports = { evaluateResume };
