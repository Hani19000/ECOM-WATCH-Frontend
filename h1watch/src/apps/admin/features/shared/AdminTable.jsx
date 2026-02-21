import React from 'react';

const AdminTable = ({ headers, data, renderRow, emptyMessage = "Aucune donnée trouvée." }) => {
    return (
        <div className="bg-white dark:bg-dark-card rounded-b-xl lg:rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden transition-colors duration-200">
            <div className="overflow-x-auto custom-scrollbar w-full">
                <table className="w-full sm:min-w-[800px] whitespace-nowrap text-sm text-left">
                    {/* L'en-tête du tableau : bg-gray-50 -> dark:bg-slate-800/50 */}
                    <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold transition-colors">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className={`px-4 sm:px-6 py-4 tracking-wider ${header.className || ''}`}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* Le corps du tableau : divide-gray-50 -> dark:divide-dark-border */}
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-border bg-white dark:bg-dark-card transition-colors">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <span className="block">{emptyMessage}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => renderRow(item, index))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTable;