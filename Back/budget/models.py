from django.db import models
from django.conf import settings
from decimal import Decimal


class ExpenseCategory(models.Model):
    """Expense categories for budget tracking"""
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, default='💰')  # Emoji or icon class
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Expense Categories"


class Budget(models.Model):
    """Monthly budget model"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    month = models.DateField()  # First day of the month
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Income sources
    scholarship = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    family_support = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    part_time_job = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_income = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('student', 'month')
    
    def __str__(self):
        return f"Budget {self.student.username} - {self.month.strftime('%B %Y')}"
    
    @property
    def total_income(self):
        return self.scholarship + self.family_support + self.part_time_job + self.other_income
    
    @property
    def total_expenses(self):
        return sum(expense.amount for expense in self.expenses.all())
    
    @property
    def remaining_budget(self):
        return self.total_budget - self.total_expenses
    
    @property
    def savings_potential(self):
        return self.total_income - self.total_expenses


class CategoryBudget(models.Model):
    """Budget allocation per category"""
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='category_budgets')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    allocated_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        unique_together = ('budget', 'category')
    
    def __str__(self):
        return f"{self.budget} - {self.category.name}: {self.allocated_amount}€"
    
    @property
    def spent_amount(self):
        return sum(
            expense.amount for expense in 
            self.budget.expenses.filter(category=self.category)
        )
    
    @property
    def remaining_amount(self):
        return self.allocated_amount - self.spent_amount
    
    @property
    def percentage_used(self):
        if self.allocated_amount == 0:
            return 0
        return (self.spent_amount / self.allocated_amount) * 100


class Expense(models.Model):
    """Individual expense tracking"""
    PAYMENT_METHODS = [
        ('CASH', 'Espèces'),
        ('CARD', 'Carte bancaire'),
        ('TRANSFER', 'Virement'),
        ('CHECK', 'Chèque'),
        ('MOBILE', 'Paiement mobile'),
    ]
    
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='CARD')
    location = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    receipt_image = models.ImageField(upload_to='receipts/', blank=True)
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.description} - {self.amount}€"
    
    class Meta:
        ordering = ['-date', '-created_at']


class RecurringExpense(models.Model):
    """Recurring monthly expenses like rent, subscriptions"""
    FREQUENCY_CHOICES = [
        ('WEEKLY', 'Hebdomadaire'),
        ('MONTHLY', 'Mensuel'),
        ('QUARTERLY', 'Trimestriel'),
        ('YEARLY', 'Annuel'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    next_due_date = models.DateField()
    auto_create_expense = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} - {self.amount}€ ({self.get_frequency_display()})"


class SavingsGoal(models.Model):
    """Savings goals for students"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    target_date = models.DateField()
    description = models.TextField(blank=True)
    is_achieved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.current_amount}/{self.target_amount}€"
    
    @property
    def progress_percentage(self):
        if self.target_amount == 0:
            return 0
        return min((self.current_amount / self.target_amount) * 100, 100)
    
    @property
    def monthly_savings_needed(self):
        from datetime import date
        if self.target_date <= date.today():
            return self.target_amount - self.current_amount
        
        months_remaining = (self.target_date.year - date.today().year) * 12 + \
                          (self.target_date.month - date.today().month)
        
        if months_remaining <= 0:
            return self.target_amount - self.current_amount
        
        return (self.target_amount - self.current_amount) / months_remaining


class BudgetAlert(models.Model):
    """Budget alerts and notifications"""
    ALERT_TYPES = [
        ('OVERSPEND', 'Dépassement de budget'),
        ('LOW_FUNDS', 'Fonds insuffisants'),
        ('GOAL_REMINDER', 'Rappel objectif'),
        ('RECURRING_DUE', 'Échéance récurrente'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=15, choices=ALERT_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional references
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE, null=True, blank=True)
    savings_goal = models.ForeignKey(SavingsGoal, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"Alerte: {self.title} pour {self.student.username}"
    
    class Meta:
        ordering = ['-created_at']
