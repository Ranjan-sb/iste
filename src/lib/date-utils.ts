/**
 * Utility functions for consistent date formatting across the application
 * Prevents hydration mismatches by ensuring server and client render the same format
 */

export const formatDate = (
    date: string | Date,
    options?: {
        format?: 'short' | 'medium' | 'long';
        includeTime?: boolean;
    },
): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const { format = 'medium', includeTime = false } = options || {};

    // Use consistent locale to prevent hydration issues
    const locale = 'en-US';

    switch (format) {
        case 'short':
            return dateObj.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                ...(includeTime && {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });

        case 'medium':
            return dateObj.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                ...(includeTime && {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });

        case 'long':
            return dateObj.toLocaleDateString(locale, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                ...(includeTime && {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });

        default:
            return dateObj.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
    }
};

export const formatDeadline = (deadline: string): string => {
    return formatDate(deadline, { format: 'short' });
};

export const isDeadlinePassed = (deadline: string): boolean => {
    return new Date(deadline) < new Date();
};

export const getDaysUntilDeadline = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const getDeadlineStatus = (
    deadline: string,
): {
    status: 'open' | 'closing-soon' | 'closed';
    daysLeft: number;
    message: string;
} => {
    const daysLeft = getDaysUntilDeadline(deadline);

    if (daysLeft < 0) {
        return {
            status: 'closed',
            daysLeft: 0,
            message: 'Deadline passed',
        };
    }

    if (daysLeft <= 7) {
        return {
            status: 'closing-soon',
            daysLeft,
            message: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`,
        };
    }

    return {
        status: 'open',
        daysLeft,
        message: `${daysLeft} days left`,
    };
};
