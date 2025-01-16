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


    // Initialize the jQuery Validation plugin for your form
    $("#createNewMaterialForm").validate({
        rules: {
            MaterialCode: {
                required: true,
                minlength: 5,
                maxlength: 15,
                pattern: /^[a-zA-Z0-9\s-._]+$/,
            },
            Material: {
                required: true,
                minlength: 5,
                maxlength: 50,
                pattern: /^[a-zA-Z0-9\s-._]+$/,
            },
            LongText: {
                required: true,
                minlength: 5,
                maxlength: 50,
                pattern: /^[a-zA-Z0-9\s-._]+$/,
            },
            Unit: {
                required: true,
                minlength: 5,
                maxlength: 50,
                pattern: /^[a-zA-Z0-9\s-._]+$/,
            },
            ReorderLevel: {
                required: true,
            },
            MinOrderQty: {
                required: true,
            },
        },
        messages: {
            MaterialCode: {
                required: "Please enter a Material code",
                minlength: "Material code must be at least 5 characters long",
                maxlength: "Material code must be at most 15 characters long",
                pattern: "Special characters are not allowed",
            },
            Material: {
                required: "Please enter a Material Name",
                minlength: "Material must be at least 5 characters long",
                maxlength: "Material must be at most 50 characters long",
                pattern: "Special characters are not allowed",
            },
            LongText: {
                required: "Please enter a Long Text",
                minlength: "Long Text must be at least 5 characters long",
                maxlength: "Long Text must be at most 50 characters long",
                pattern: "Special characters are not allowed",
            },
            Unit: {
                required: "Please enter a Unit",
                minlength: "Unit must be at least 5 characters long",
                maxlength: "Unit must be at most 50 characters long",
                pattern: "Special characters are not allowed",
            },
            ReorderLevel: {
                required: "Please enter a Reorder Level",
            },
            MinOrderQty: {
                required: "Please enter a Min Order Qty",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.input-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        submitHandler: function (form) {
            // Handle form submission logic here
            var actionType = $('#lblmodeltitle').text().toLowerCase();
            if (actionType === 'create material') {
                // Handle create action (insert)
                insertRecord();
            } else if (actionType === 'modify material') {
                // Handle update action
                updateRecord();
            }
        }
    });
    function bindTableData(data) {
        console.log(data);
        var resultData = JSON.parse(data);;
        console.log(resultData.length);
        var arrayReturn = [];
        srno = 1
        for (var i = 0; i < resultData.length; i++) {
            var result = resultData[i];
            var row = [];
            var internalId = result?.id;
            row.push('<td style="padding: 0px; border: 0px;" data-id="' + internalId + '">' + srno + '</td>');
            row.push(result?.code);
            row.push(result?.shortText);
            row.push(result?.lognText);
            row.push(result?.unit);
            row.push(result?.reorderLevel);
            row.push(result?.minOrderQuantity);
            row.push(result?.createdDate);
            row.push(result?.updatedDate);
            row.push(result.isActive ? 'True' : 'False');
            arrayReturn.push(row);
            srno++
        }
        // Destroy existing DataTable instance (if it exists)
        var table = $('#TblMaterial').DataTable();
        table.destroy();
        // Clear the table body
        $('#TblMaterial tbody').empty();
        // Populate the table body with data
        var tbody = $('#TblMaterial tbody');
        arrayReturn.forEach(function (rowData) {
            var row = $('<tr>');
            row.append('<td><input type="checkbox" class="rowCheckbox"></td>');
            rowData.forEach(function (cellData) {
                row.append($('<td>').html(cellData)); // Use html() to render HTML content
            });
            tbody.append(row);
        });
        // Initialize DataTable after binding data
        var table = $('#TblMaterial').DataTable({
            paging: true,
            pagingType: 'simple_numbers',
            language: {
                paginate: {
                    first: '<<',
                    previous: '<',
                    next: '>',
                    last: '>>'
                }
            },
            lengthMenu: [10, 25, 50, 100],
            searching: true,
            select: {
                style: 'multi',
                selector: 'td:not(.select-checkbox)'
            },
            dom: "<'row'<'col-sm-12 col-md-4'B><'col-sm-12 col-md-8'<'float-right'l>f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            "lengthChange": true, "autoWidth": false,
            buttons: [
                {
                    extend: 'collection',
                    text: 'Export',
                    buttons: [
                        'copy', 'csv', 'excel', 'pdf', 'print'
                    ],
                    className: 'btn btn-secondary'
                },
                {
                    extend: 'colvis',
                    text: 'Grid <i class="fa fa-cog"></i>',
                    className: 'btn btn-secondary',
                },
            ],
            scrollX: true,
            scrollY: '300px',
            scrollCollapse: true,
            columnDefs: [
                {
                    targets: 0,
                    orderable: false
                },
                {
                    targets: 1,
                    visible: false
                },
                {
                    targets: [0, 1],
                    width: '30px'
                }
            ],
        }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
        

        function adjustTableColumns() {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        }
        adjustTableColumns();
        $(window).on('resize', function () {
            adjustTableColumns();
        });

        // Handle "Select All" checkbox click
        $('.selectAllCheckbox').on('click', function () {
            var table = $('#TblMaterial').DataTable(); // Initialize DataTable
            var isChecked = $(this).is(':checked');
            table.rows().select(isChecked);
            $('.rowCheckbox').prop('checked', isChecked);
        });
        // Handle individual row checkbox click
        $('#TblMaterial tbody').on('click', '.rowCheckbox', function (e) {
            var table = $('#TblMaterial').DataTable(); // Initialize DataTable
            e.stopPropagation();
            var isChecked = $(this).prop('checked');
            var row = $(this).closest('tr');
            // Toggle row selection
            table.row(row).select(isChecked);
        });
        // Handle individual row click (except the checkbox)
        $('#TblMaterial tbody').on('click', 'tr:not(.select-checkbox)', function (e) {
            var table = $('#TblMaterial').DataTable(); // Initialize DataTable
            e.stopPropagation(); // Prevent row click from triggering selection
            var checkbox = $(this).find('.rowCheckbox');
            var isChecked = !checkbox.prop('checked'); // Toggle checkbox state
            checkbox.prop('checked', isChecked);
            // Toggle row selection
            table.row(this).select(isChecked);
            // Add or remove the 'selected' class
            $(this).toggleClass('selected', isChecked);
        });
        // Highlight selected rows with a custom class
        table.on('select deselect', function (e, dt, type, indexes) {
            if (type === 'row') {
                var table = $('#TblMaterial').DataTable(); // Initialize DataTable
                var row = table.row(indexes).node();
                $(row).toggleClass('selected', dt.rows(indexes).any());
            }
        });

    }
    function showNotification(message, type) {
        new PNotify({
            text: message,
            type: type,
            delay: 2500,
            styling: "bootstrap3"
        });
    }
    function resetModal() {
        // Reset input fields in the modal
        $('#MaterialCode').val('');
        $('#Material').val('');
        $('#LongText').val('');
        $('#Unit').val('');
        $('#ReorderLevel').val('');
        $('#MinOrderQt').val('');
        $('#Internalid').val('');
        $('#isActive').prop('checked', false).prop('disabled', false);
        $('#createNewMaterialForm').find('.form-control').val('').removeClass('is-invalid');
        $('#createNewMaterialForm').removeClass('was-validated');
    }
    // Handle the "Save" button click event
    $('#btnCancel').click(function () {
        resetModal();
        $('#createNewMaterial').modal('hide');
    });
    $('#closemodal').click(function () {
        resetModal();
        $('#createNewMaterial').modal('hide');
    });
    // Handle the "Add" button click event
    $('#btnCreateData').click(function () {
        // Reset modal fields
        resetModal();
        // Change modal title to "Create Material"
        $('#lblmodeltitle').text('Create Material');
        $('#isActive').prop('checked', true).prop('disabled', true);

        // Show the modal for creating
        $('#createNewMaterial').modal('show');
    });
    $('#btnAddMaterial').click(function () {
        // Reset modal fields
        resetModal();
        // Change modal title to "Create Material"
        $('#lblmodeltitle').text('Create Material');
        $('#isActive').prop('checked', true).prop('disabled', true);
        // Show the modal for creating
        $('#createNewMaterial').modal('show');
    });
    function insertRecord() {
        var NewMaterialCode = $('#MaterialCode').val();
        var NewMaterial = $('#Material').val().toLowerCase().trim();
        var	NewLongText = $('#LongText').val().toLowerCase().trim();;
        var	NewUnit = $('#Unit').val();
        var	NewReorderLevel = $('#ReorderLevel').val();
        var	NewMinOrderQty = $('#MinOrderQty').val();

        var table = $('#TblMaterial').DataTable();
        var existingData = table.rows().data();
        var isDuplicate = false;
        existingData.each(function (row) {
            
            var MaterialCode = row[2];
            var Material = row[3].toLowerCase().trim();
            var LongText = row[4].toLowerCase().trim();
            
            if (MaterialCode === NewMaterialCode && Material === NewMaterial && NewLongText === LongText) {
                isDuplicate = true;
                return false;
            }
        });
        if (isDuplicate) {
            showNotification("Duplicate entry: Material already exists", 'error');
        } else {
            // Continue with the insert action
            var requestData = {
                id: 0,
                code: $('#MaterialCode').val(),
                shortText: $('#Material').val(),
                lognText: $('#LongText').val(),
                unit: $('#Unit').val(),
                reorderLevel: $('#ReorderLevel').val(),
                minOrderQuantity: $('#MinOrderQty').val(),
                createdDate: null,
                updatedDate: null,
                isActive: $('#isActive').prop('checked')                
            };

            console.log("Insert Req Data: ");
            console.log(requestData);

            // Make an AJAX call to the insert action
            $.ajax({
                type: 'POST',
                url: '/Material/Insert',
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (response) {
                    // Handle success, e.g., show a notification
                    showNotification(response, 'success');
                    // Fetch and bind data again after successful insert
                    fetchDataAndBindTable();
                    resetModal();
                    $('#createNewMaterial').modal('hide');
                },
                error: function (error) {
                    // Handle error, e.g., show an error notification
                    showNotification(error.responseText, 'error');
                }
            });
        }
    }
    // Function to handle the update action
    function updateRecord() {
        var NewMaterialCode = $('#MaterialCode').val();
        var NewMaterial = $('#Material').val().toLowerCase().trim();
        var	NewLongText = $('#LongText').val().toLowerCase().trim();;
        var	NewUnit = $('#Unit').val();
        var	NewReorderLevel = $('#ReorderLevel').val();
        var	NewMinOrderQty = $('#MinOrderQty').val();
        var newisActive = $('#isActive').prop('checked');
        
        var table = $('#TblMaterial').DataTable();
        var existingData = table.rows().data();
        var isDuplicate = false;
        existingData.each(function (row) {
            
            var MaterialCode = row[2];
            var Material = row[3].toLowerCase().trim();
            var LongText = row[4].toLowerCase().trim();
            var isActive = row[10];
            
            // Convert isActive to boolean for comparison
            isActive = (isActive === 'True');
            if (MaterialCode === NewMaterialCode && Material === NewMaterial && NewLongText === LongText && isActive === newisActive) {
                isDuplicate = true;
                return false;
            }
        });
        if (isDuplicate) {
            showNotification("Duplicate entry: Material already exists", 'error');
        } else {
            // Continue with the insert action
            var requestData = {
                id: $('#Internalid').val(),
                code: $('#MaterialCode').val(),
                shortText: $('#Material').val(),
                lognText: $('#LongText').val(),
                unit: $('#Unit').val(),
                reorderLevel: $('#ReorderLevel').val(),
                minOrderQuantity: $('#MinOrderQty').val(),
                createdDate: null,
                updatedDate: null,
                isActive: $('#isActive').prop('checked')  
            };

            $.ajax({
                type: 'POST', // Use POST since your controller is expecting POST
                url: `/Material/Update`, // No need for the id in the URL since you are sending it in the body
                contentType: 'application/json',
                data: JSON.stringify(requestData), // Send the request data as JSON
                success: function (response) {
                    showNotification(response, 'success');
                    fetchDataAndBindTable(); // Refresh the table
                    resetModal(); // Reset the modal form
                    $('#createNewMaterial').modal('hide'); // Close the modal
                },
                error: function (error) {
                    showNotification(error.responseText, 'error');
                }
            });
            

        }
    }
    // Function to fetch and bind data again
    function fetchDataAndBindTable() {
        showLoader();
        // Make an AJAX call to retrieve the updated data
        $.ajax({
            type: 'GET',
            url: '/Material/GetAllData',
            success: function (data) {
                // Bind the updated data to the table
                console.log(data);
                bindTableData(data);
                hideLoader();
            },
            error: function (error) {
                // Handle error, e.g., show an error notification
                showNotification(error.responseText, 'error');
                hideLoader();
            }
        });
    }
    
    $("#btnDeleteData").click(function () {
        var table = $('#TblMaterial').DataTable();
        if (table.rows().count() === 0) {
            showNotification("No rows are present in the DataTable.", "error");
            return; // Stop further processing
        }
        // Retrieve the selected rows' data
        selectedRowsData = table.rows({ selected: true }).data().toArray();
        // selectedRowsData = table.rows({ selected: true }).data().toArray();
        // Check if any rows are selected
        if (selectedRowsData.length === 0) {
            showNotification("Please select at least one row.", "error");
            return;
        }
        swal({
            title: "Are you sure?",
            text: "Are you sure you want to delete the selected record(s)?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Delete",
            closeOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                deleteRecord(selectedRowsData);
            }
        });
    });

    function deleteRecord(selectedRowsData) {
        let deletePromises = []; // To track all deletion requests
    
        selectedRowsData.forEach(rowData => {
            const IdElement = $(rowData[1]);
            const Id = IdElement.data("Internalid");
            console.log("Internalid is:", Id);
    
            // Send a DELETE request for each ID and track the promise
            const deletePromise = fetch(`/Material/Delete/${Id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (response.ok) {
                        console.log(`Record with ID ${Id} deleted successfully.`);
                    } else {
                        console.error(`Failed to delete record with ID ${Id}.`);
                    }
                })
                .catch(error => {
                    console.error(`Error while deleting record with ID ${Id}:`, error);
                });
    
            deletePromises.push(deletePromise);
        });
    
        // Once all delete requests are completed, refresh table and show notification
        Promise.all(deletePromises)
            .then(() => {
                fetchDataAndBindTable(); // Refresh table
                showNotification("Data Deleted successfully.", "success");
            })
            .catch(() => {
                showNotification("An error occurred while deleting data.", "error");
            });
    }
    

    $("#btnEditData").click(function () {
        resetModal();
        var newselectedRowsData = $('#TblMaterial').DataTable().rows({ selected: true }).data();
        if (newselectedRowsData.length !== 1) {
            showNotification("Please select only one row.", "error");
            return;
        }
        var table = $('#tblMaterial').DataTable();
        var rowData = newselectedRowsData[0];
        var internalId = $(rowData[1]).data('id'); // Assuming the ID is in the first column
        var MaterialCode = rowData[2];
        var Material = rowData[3];
        var LongText = rowData[4];
        var Unit = rowData[5];
        var ReorderLevel = rowData[6];
        var MinOrderQty = rowData[7];
        var IsActive = rowData[10];
        // Populate modal fields
        $('#MaterialCode').val(MaterialCode);
        $('#Material').val(Material);
        $('#LongText').val(LongText);
        $('#Unit').val(Unit);
        $('#ReorderLevel').val(ReorderLevel);
        $('#MinOrderQty').val(MinOrderQty);
        $('#Internalid').val(internalId);
        if (IsActive == 'True') {
            $('#isActive').prop('checked', true).prop('disabled', false);

        } else {
            $('#isActive').prop('checked', false).prop('disabled', false);

        }
        // Change modal title to "Modify Material"
        $('#lblmodeltitle').text('Modify Material');
        // Show the modal for editing
        $('#createNewMaterial').modal('show');
    });
    
    return {
        init: function (data) {
            fetchDataAndBindTable();
        }
    };
}(); //var GetForms