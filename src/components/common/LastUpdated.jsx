import React from 'react';

export default function LastUpdated({ prefix = "Last updated: ", suffix = "" }) {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return (
        <span className="dynamic-date">
            {prefix}{dateStr}{suffix}
        </span>
    );
}
