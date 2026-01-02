import type { ExpenseReportFiltersData } from "../../validators/data-validators/expense/expenseReportFilters";

// Helper to Build Applied Filters Info for PDF
export function buildAppliedFiltersInfo(filters: ExpenseReportFiltersData, metadata: any): any {
    const appliedFilters: any = {};

    if (filters.month) {
        const [year, month] = filters.month.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        appliedFilters.period = `${monthNames[parseInt(month) - 1]} ${year}`;
    } else if (filters.startDate || filters.endDate) {
        const start = filters.startDate ? new Date(filters.startDate).toLocaleDateString('en-IN') : 'Beginning';
        const end = filters.endDate ? new Date(filters.endDate).toLocaleDateString('en-IN') : 'Present';
        appliedFilters.period = `${start} - ${end}`;
    } else {
        appliedFilters.period = 'All Time';
    }

    if (filters.categoryId && metadata.categoryName) {
        appliedFilters.category = metadata.categoryName;
    }

    if (filters.type) {
        appliedFilters.type = filters.type;
    }

    if (filters.villaId && metadata.villaName) {
        appliedFilters.villa = metadata.villaName;
    }

    return appliedFilters;
};