// OpenRouter AI service for SmartCampus
class OpenRouterService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  async sendMessage(messages: ChatMessage[], studentContext?: StudentContext): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(studentContext);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://smartcampus.fp-ouarzazate.ma',
          'X-Title': 'SmartCampus - Assistant Intelligent',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter service error:', error);
      throw new Error('Erreur de communication avec l\'assistant IA');
    }
  }

  private buildSystemPrompt(studentContext?: StudentContext): string {
    const basePrompt = `Tu es l'Assistant Intelligent de SmartCampus, une plateforme dédiée aux étudiants de la Faculté Polydisciplinaire de Ouarzazate. Tu es un assistant bienveillant, intelligent et culturellement adapté au contexte marocain.

🎯 TON RÔLE :
- Aider les étudiants dans leur parcours académique et leur vie étudiante
- Donner des conseils personnalisés et pratiques
- Être empathique et encourageant
- Répondre en français avec parfois des expressions arabes/berbères familières

📚 DOMAINES D'EXPERTISE :
- Planification et organisation des études
- Gestion du temps et des priorités
- Conseils budgétaires pour étudiants
- Stratégies d'apprentissage et révisions
- Gestion du stress et motivation
- Orientation et choix de carrière
- Vie sociale et groupes d'étude
- Conseils pratiques pour la vie à Ouarzazate

💡 STYLE DE RÉPONSE :
- Utilise un ton amical et encourageant
- Donne des conseils concrets et actionables
- Adapte tes réponses au niveau d'études de l'étudiant
- Intègre des références culturelles marocaines quand approprié
- Utilise des emojis pour rendre les réponses plus vivantes
- Pose des questions de clarification si nécessaire`;

    if (studentContext) {
      const contextPrompt = `

📋 INFORMATIONS SUR L'ÉTUDIANT :
- Nom : ${studentContext.name}
- Niveau : ${studentContext.level} (${this.getLevelDescription(studentContext.level)})
- Filière : ${studentContext.filiere} (${this.getFiliereDescription(studentContext.filiere)})
- Année d'inscription : ${studentContext.enrollmentYear}
- Graduation prévue : ${studentContext.expectedGraduation}

📅 PLANNING ACTUEL :
${studentContext.schedule ? this.formatSchedule(studentContext.schedule) : '- Aucun emploi du temps configuré'}

💰 SITUATION BUDGÉTAIRE :
${studentContext.budget ? this.formatBudget(studentContext.budget) : '- Aucun budget configuré'}

👥 GROUPES D'ÉTUDE :
${studentContext.studyGroups ? this.formatStudyGroups(studentContext.studyGroups) : '- Aucun groupe d\'étude actif'}

⏰ TÂCHES EN COURS :
${studentContext.assignments ? this.formatAssignments(studentContext.assignments) : '- Aucune tâche en cours'}

Utilise ces informations pour personnaliser tes conseils et réponses.`;

      return basePrompt + contextPrompt;
    }

    return basePrompt;
  }

  private getLevelDescription(level: string): string {
    const levels = {
      'L1': 'Première année de licence',
      'L2': 'Deuxième année de licence', 
      'L3': 'Troisième année de licence',
      'M1': 'Première année de master',
      'M2': 'Deuxième année de master'
    };
    return levels[level as keyof typeof levels] || level;
  }

  private getFiliereDescription(filiere: string): string {
    const filieres = {
      'INFO': 'Informatique',
      'MATH': 'Mathématiques',
      'PHYS': 'Physique',
      'ECON': 'Économie',
      'GESTION': 'Gestion',
      'DROIT': 'Droit'
    };
    return filieres[filiere as keyof typeof filieres] || filiere;
  }

  private formatSchedule(schedule: any[]): string {
    if (!schedule || schedule.length === 0) return '- Aucun cours programmé';
    
    return schedule.map(course => 
      `- ${course.day}: ${course.subject} (${course.time}) - ${course.room}`
    ).join('\n');
  }

  private formatBudget(budget: any): string {
    return `- Budget mensuel : ${budget.total}€
- Dépenses actuelles : ${budget.spent}€
- Reste disponible : ${budget.remaining}€`;
  }

  private formatStudyGroups(groups: any[]): string {
    if (!groups || groups.length === 0) return '- Aucun groupe actif';
    
    return groups.map(group => 
      `- ${group.name} (${group.subject}) - ${group.members} membres`
    ).join('\n');
  }

  private formatAssignments(assignments: any[]): string {
    if (!assignments || assignments.length === 0) return '- Aucune tâche en cours';
    
    return assignments.map(assignment => 
      `- ${assignment.title} - Échéance: ${assignment.dueDate} (${assignment.priority})`
    ).join('\n');
  }
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StudentContext {
  name: string;
  level: string;
  filiere: string;
  enrollmentYear: number;
  expectedGraduation: number;
  schedule?: any[];
  budget?: any;
  studyGroups?: any[];
  assignments?: any[];
}

export const openRouterService = new OpenRouterService();
