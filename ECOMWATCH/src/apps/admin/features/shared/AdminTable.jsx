const AdminTable = ({
    headers,
    data = [],
    renderRow,
    emptyMessage = "Aucune donnée trouvée.",
    paginationData,
    onPageChange
}) => {
    return (
        <div className="bg-white dark:bg-dark-card rounded-b-xl lg:rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden transition-colors duration-200">
            <div className="overflow-x-auto custom-scrollbar w-full">
                <table className="w-full sm:min-w-[800px] whitespace-nowrap text-sm text-left">
                    {/* L'en-tête du tableau */}
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
                    {/* Le corps du tableau */}
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

            {/* --- SECTION PAGINATION INTÉGRÉE --- */}
            {paginationData && paginationData.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/30 px-4 sm:px-6 py-4 gap-4 transition-colors">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Page <span className="font-semibold">{paginationData.page}</span> sur <span className="font-semibold">{paginationData.totalPages}</span>
                        <span className="ml-1 text-gray-500 dark:text-gray-400">({paginationData.total} résultats)</span>
                    </span>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => onPageChange(paginationData.page - 1)}
                            disabled={paginationData.page === 1}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${paginationData.page === 1
                                ? 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm'
                                }`}
                        >
                            Précédent
                        </button>
                        <button
                            onClick={() => onPageChange(paginationData.page + 1)}
                            disabled={paginationData.page === paginationData.totalPages}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${paginationData.page === paginationData.totalPages
                                ? 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm'
                                }`}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTable;