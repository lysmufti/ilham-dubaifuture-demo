# ilham.ai — Dubai Future Foundation AI Assistant  

<p align="center">
  <img src="https://i.imgur.com/Eqgf11L.gif" width="900" alt="Demo Animation">
</p>
<p align="center">
  <a href="https://ilham-dubaifuture-demo.lovable.app/">
    <img src="https://img.shields.io/badge/Website-Live%20Demo-00BCD4?style=for-the-badge" alt="Live Demo">
  </a>
</p>


---

##  Introduction  
**ilham.ai** is an assistant designed for the **AI in Creative Industries initiative Guidlines** by the **Dubai Future Foundation**.   

**Live Demo:** [https://ilham-dubaifuture-demo.lovable.app/](https://ilham-dubaifuture-demo.lovable.app/)  
**Knowledge Base:** [AI in Creative Industries (PDF)](https://www.dubaifuture.ae/wp-content/uploads/2024/10/AI-in-creative-industries-English.pdf)  

---

##  Demo Videos  
- [English Demo — Loom Placeholder](#)  
- [Arabic Demo — Loom Placeholder](#)  


---

##  Architecture  
ilham.ai is powered by a Retrieval-Augmented Generation (RAG) pipeline built based on my [ai-contextual-rag-agentic-arena](https://github.com/lysmufti/ai-contextual-rag-agentic-arena) project. 

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
ilham was benchmarked on **5 gold-standard questions** derived from the policy document. Evaluation was performed using both:  
- **Exact-match scoring** against gold answers.  
- **LLM-as-a-Judge** (an evaluation model checking correctness, completeness, and hallucination risk).  

| Question | Score | Notes |
|----------|-------|-------|
| 3 pillars of AI in Creative Industries | 5/5 | Perfect |
| Stakeholder groups collaboration | 5/5 | Perfect |
| Creative industries as testbed | 5/5 | Perfect |
| Risks without governance | 4/5 | Expanded beyond benchmark scope |
| Role of people in AI | 5/5 | Perfect |

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
