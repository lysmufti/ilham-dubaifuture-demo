# ilham.ai — Dubai Future Foundation AI Assistant  

<p align="center">
  <a href="https://ilham-dubaifuture-demo.lovable.app/">
    <img src="https://i.imgur.com/Eqgf11L.gif" width="900" alt="Demo Animation">
  </a>
</p>

<p align="center">
  <a href="https://ilham-dubaifuture-demo.lovable.app/">
    <img src="https://img.shields.io/badge/Website-Live%20Demo-00BCD4?style=for-the-badge" alt="Live Demo">
  </a>
</p>

<p align="center">
  <a href="https://www.loom.com/share/e00cb22ed27e4ad89a7b333bf0033879">
    <img src="https://github.com/user-attachments/assets/5d569752-f326-40fc-bcc7-19e911b35c1e" width="900" alt="Demo Video">
  </a>
</p>

<p align="center">
  <a href="https://www.loom.com/share/e00cb22ed27e4ad89a7b333bf0033879">
    <img src="https://img.shields.io/badge/Loom-Watch%20Demo-FF4B4B?style=for-the-badge&logo=loom" alt="Watch Loom Demo">
  </a>
</p>



---

##  Introduction  
**ilham.ai** is an assistant designed for the **AI in Creative Industries initiative Guidlines** by the **Dubai Future Foundation**.   

##  Architecture  
ilham.ai is powered by a Retrieval-Augmented Generation (RAG) pipeline built based on my [ai-contextual-rag-agentic-arena](https://github.com/lysmufti/ai-contextual-rag-agentic-arena) project.   
The chatbot replies to user queries through a **webhook integration** with the an n8n backend, ensuring real-time responses directly from the RAG pipeline.

<img width="1198" height="604" alt="image" src="https://github.com/user-attachments/assets/093b7060-6f7f-494b-9e16-25814d0abaf8" />



1. **Two Streams of Input**  
   - **Conversational queries** (e.g., *“Hi, how are you?”*) are routed to a dedicated agent that responds warmly and politely without citations.  
   - **Knowledge-based queries** are routed through the RAG pipeline to generate answers grounded in the policy document.  

2. **RAG Flow**  
   - User query is vectorized and matched against the *AI in Creative Industries* knowledge base.  
   - Two retrieval contexts are produced:  
     - **Context A**: Pinecone retrieval + re-ranking with custom scoring (cosine, token overlap, jaccard, bigram, metadata boosts).  
     - **Context B**: Independent agent retrieval of relevant passages.  
   - An arbitration step compares both contexts and merges them into a single, concise answer.  

3. **Final Answer Generation**  
   - If both contexts agree → answer is merged directly.  
   - If they diverge → the arbitration favors the more accurate/relevant source.  
   - Responses are formatted in **Markdown** with concise citations to the official policy document.  

4. **Audit Log**
   - **Postgres (Supabase)** used as an **audit log**, where all chat logs are stored in a dedicated table for traceability and analysis.

---

## Evaluation Results  
ilham was benchmarked on **5 true-north** derived from the policy document. Evaluation was performed using both:  
- **Exact-match scoring** against gold answers.  
- **LLM-as-a-Judge** (an evaluation model checking correctness, completeness, and hallucination risk).  

| Question | Gold Answer | Agent Answer | Correctness |
|----------|-------------|--------------|-------------|
| **What are the three core pillars outlined for AI in the creative industries?** | Transparency, Inclusivity, and People-centrism. Transparency ensures explainable and understandable AI systems. Inclusivity ensures accessibility and participation from diverse communities. People-centrism ensures that human creativity and judgment remain at the center and that AI enhances, not replaces, people in culture and art. | "The three core pillars outlined for AI in the creative industries are:<br>- **Transparency**: Ensuring clear understanding of how AI tools are developed, trained, and used.<br>- **Inclusivity**: Promoting equitable access and participation for diverse voices in creative processes.<br>- **People-centrism (Human-centrism)**: Prioritizing human creativity, agency, and ethical considerations in the integration of AI.<br><br>*(AI in Creative Industries, p.4–5, 13–14)*" | 5 |
| **Which three stakeholder groups must collaborate to shape the responsible use of AI in the creative industries?** | Governments, the private sector, and creative professionals. Governments provide policy and governance frameworks. The private sector contributes innovation and investment. Creative professionals ensure cultural and artistic values are embedded and that AI serves creative purposes. | "The three key stakeholder groups that must collaborate are:<br>- **Technology developers** (AI developers and tech companies)<br>- **Creative professionals** (artists, writers, musicians, etc.)<br>- **Policymakers and regulators** (governments and regulatory bodies)<br><br>Their collaboration ensures responsible, ethical, and inclusive use of AI in the creative industries.<br>*(AI in Creative Industries, p.13–14)*" | 5 |
| **Which sector is described as a “test bed” for AI applications due to its openness to experimentation and innovation?** | The creative industries sector. Creative industries are naturally open to experimentation and adoption of new technologies. Artists, designers, and cultural institutions test new AI applications and act as early adopters, which makes the sector suitable for piloting AI approaches. | "The creative industries are described as a “test bed” for AI applications due to their openness to experimentation and innovation. This sector stands out because it embraces new tools and approaches, allowing AI-driven creativity to flourish and push boundaries in areas like art, design, music, and literature.<br>*(AI in Creative Industries, p.5, 215–236)*" | 5 |
| **What potential risks exist if AI is used without adequate governance in creative industries?** | Bias, exclusion, and erosion of trust. Bias can result from unrepresentative training data. Exclusion can occur if AI tools are only accessible to limited groups, increasing inequality. Erosion of trust happens when outputs are misleading, unauthentic, or opaque, undermining confidence in creative work. | "Potential risks of using AI without adequate governance in creative industries include:<br>- **Misinformation and hallucinations**: AI can generate plausible but inaccurate content, leading to the spread of misinformation.<br>- **Bias and cultural homogenisation**: AI may reinforce dominant cultural norms, marginalising less represented voices and reducing cultural diversity.<br>- **Unfair labour and IP practices**: Lack of clear regulation can result in disputes over ownership, compensation, and the protection of creators’ rights.<br>- **Socio-economic disparity**: Unequal access to AI tools can widen gaps between creators and communities.<br>- **Loss of trust and transparency**: Without clear processes, stakeholders may not understand how AI is used, eroding trust and accountability.<br>*(AI in Creative Industries, p.4, 8–9, 12, 14–16, 19)*" | 4 |
| **What is the main conclusion regarding the role of people in AI for creative industries?** | People must remain at the center. AI should enhance human creativity rather than replace it. AI systems should augment imagination, efficiency, and reach while preserving authorship, agency, and cultural values. | "The main conclusion is that people must remain at the center of AI’s integration in creative industries. A balanced, people-centred approach is essential—one that fosters innovation while safeguarding human creativity, agency, and cultural diversity. This requires transparent, ethical frameworks and multidisciplinary collaboration to ensure AI empowers creators, protects their rights, and enables more diverse voices, rather than replacing or marginalizing them.<br>*(AI in Creative Industries, p.4, 8–9, 19–20)*" | 5 |

---

| Metric | Value |
|--------|-------|
| **RAG Evaluation Score** | 24 |
| **Total Score (5 questions)** | 25 |
| **Diff.** | 1 |
| **Total Accuracy (%)** | 96.00% |


**Total Score: 24/25 (96% correctness & accuracy).**  

[View Full Evaluation Sheet](https://docs.google.com/spreadsheets/d/1cAPAI9YTIE12vPSM92xD51BEwpk0itRYMGICCDrahF0/edit?gid=0#gid=0)

---

## Technical Details  
The frontend is built with modern web technologies:  
- **Vite**  
- **TypeScript**  
- **React**  
- **shadcn-ui**  
- **Tailwind CSS**  

Other tools and platforms used:  
- **n8n** for orchestration  
- **Pinecone** for vector search  
- **Postgres** for memory persistence  
- **OpenAI** for embeddings and generation  
- **Lovable** for frontend design and deployment  

---

## Project Links  
- **Live Demo:** [ilham-dubaifuture-demo.lovable.app](https://ilham-dubaifuture-demo.lovable.app/)  
- **Knowledge Base:** [AI in Creative Industries (PDF)](https://www.dubaifuture.ae/wp-content/uploads/2024/10/AI-in-creative-industries-English.pdf)  
- **Backend Details:** [ai-contextual-rag-agentic-arena](https://github.com/lysmufti/ai-contextual-rag-agentic-arena)  
