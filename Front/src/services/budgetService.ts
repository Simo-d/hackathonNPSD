import { apiRequest, API_ENDPOINTS } from './api';
import type { 
  Budget, 
  Expense, 
  ExpenseCategory, 
  SavingsGoal 
} from '../types';

export interface BudgetRequest {
  month: string; // YYYY-MM-DD format (first day of month)
  total_budget: number;
  scholarship: number;
  family_support: number;
  part_time_job: number;
  other_income: number;
}

export interface ExpenseRequest {
  category: string; // Category ID
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD format
  payment_method: 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK' | 'MOBILE';
  location?: string;
  notes?: string;
}

export interface SavingsGoalRequest {
  name: string;
  target_amount: number;
  target_date: string;
  description?: string;
}

export class BudgetService {
  // Get budgets
  static async getBudgets(): Promise<Budget[]> {
    return await apiRequest(API_ENDPOINTS.BUDGETS);
  }

  // Get current month budget
  static async getCurrentBudget(): Promise<Budget> {
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
    const budgets = await apiRequest(`${API_ENDPOINTS.BUDGETS}?month=${currentMonth}`);
    return budgets.length > 0 ? budgets[0] : null;
  }

  // Create or update budget
  static async createBudget(budgetData: BudgetRequest): Promise<Budget> {
    return await apiRequest(API_ENDPOINTS.BUDGETS, {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  }

  // Update budget
  static async updateBudget(id: string, budgetData: Partial<BudgetRequest>): Promise<Budget> {
    return await apiRequest(`${API_ENDPOINTS.BUDGETS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(budgetData),
    });
  }

  // Get expenses
  static async getExpenses(filters?: {
    month?: string;
    category?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Expense[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.month) queryParams.append('month', filters.month);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.date_from) queryParams.append('date_from', filters.date_from);
    if (filters?.date_to) queryParams.append('date_to', filters.date_to);
    
    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.EXPENSES}?${queryParams.toString()}`
      : API_ENDPOINTS.EXPENSES;
    
    return await apiRequest(endpoint);
  }

  // Create expense
  static async createExpense(expenseData: ExpenseRequest): Promise<Expense> {
    return await apiRequest(API_ENDPOINTS.EXPENSES, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  // Update expense
  static async updateExpense(id: string, expenseData: Partial<ExpenseRequest>): Promise<Expense> {
    return await apiRequest(`${API_ENDPOINTS.EXPENSES}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(expenseData),
    });
  }

  // Delete expense
  static async deleteExpense(id: string): Promise<void> {
    await apiRequest(`${API_ENDPOINTS.EXPENSES}${id}/`, {
      method: 'DELETE',
    });
  }

  // Get expense categories
  static async getExpenseCategories(): Promise<ExpenseCategory[]> {
    return await apiRequest(API_ENDPOINTS.EXPENSE_CATEGORIES);
  }

  // Get savings goals
  static async getSavingsGoals(): Promise<SavingsGoal[]> {
    return await apiRequest(API_ENDPOINTS.SAVINGS_GOALS);
  }

  // Create savings goal
  static async createSavingsGoal(goalData: SavingsGoalRequest): Promise<SavingsGoal> {
    return await apiRequest(API_ENDPOINTS.SAVINGS_GOALS, {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  // Update savings goal
  static async updateSavingsGoal(id: string, goalData: Partial<SavingsGoalRequest & { current_amount: number }>): Promise<SavingsGoal> {
    return await apiRequest(`${API_ENDPOINTS.SAVINGS_GOALS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(goalData),
    });
  }

  // Add to savings goal
  static async addToSavingsGoal(id: string, amount: number): Promise<SavingsGoal> {
    return await apiRequest(`${API_ENDPOINTS.SAVINGS_GOALS}${id}/add/`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Get budget alerts
  static async getBudgetAlerts() {
    return await apiRequest(API_ENDPOINTS.BUDGET_ALERTS);
  }

  // Mark alert as read
  static async markAlertAsRead(id: string) {
    return await apiRequest(`${API_ENDPOINTS.BUDGET_ALERTS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: true }),
    });
  }

  // Get budget summary
  static async getBudgetSummary(month?: string) {
    const queryParams = month ? `?month=${month}` : '';
    return await apiRequest(`${API_ENDPOINTS.BUDGETS}summary/${queryParams}`);
  }

  // Get expense analytics
  static async getExpenseAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    return await apiRequest(`${API_ENDPOINTS.EXPENSES}analytics/?period=${period}`);
  }
}
