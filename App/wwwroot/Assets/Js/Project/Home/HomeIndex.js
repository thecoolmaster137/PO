var GetForms = function () {
    function showLoader() {
        $('#loader').show(); // Show the loader
        // Show loader overlay
        document.querySelector('.loader-overlay').style.display = 'block';
    }
    // Function to hide loader
    function hideLoader() {
        $('#loader').hide(); // Hide the loader
        // Hide loader overlay
        document.querySelector('.loader-overlay').style.display = 'none';
    }

    document.querySelectorAll('#energyConsumptionTable th[data-sort]').forEach(header => {
        header.style.cursor = 'pointer'; // Add visual feedback for sortable columns

        header.addEventListener('click', function () {
            const table = header.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const index = Array.from(header.parentNode.children).indexOf(header);
            const type = header.getAttribute('data-sort');
            const isAscending = !header.classList.contains('asc');

            // Remove existing sorting classes
            table.querySelectorAll('th').forEach(th => th.classList.remove('asc', 'desc'));

            // Sort rows based on column type
            rows.sort((rowA, rowB) => {
                let cellA = rowA.children[index].innerText.trim();
                let cellB = rowB.children[index].innerText.trim();

                if (type === 'number') {
                    return isAscending ? cellA - cellB : cellB - cellA;
                } else if (type === 'date') {
                    return isAscending
                        ? new Date(cellA) - new Date(cellB)
                        : new Date(cellB) - new Date(cellA);
                } else {
                    return isAscending
                        ? cellA.localeCompare(cellB)
                        : cellB.localeCompare(cellA);
                }
            });

            // Append sorted rows to the table body
            rows.forEach(row => tbody.appendChild(row));

            // Add sorting classes to indicate direction
            header.classList.add(isAscending ? 'asc' : 'desc');
        });
    });

    return {
        init: function (data) {
            //fetchDataAndBindTable();
        }
    };
}(); //var GetForms
