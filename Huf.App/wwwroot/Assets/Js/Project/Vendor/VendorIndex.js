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
    $("#createNewVendorForm").validate({
        rules: {
            VendorCode: {
                required: true,
                minlength: 5,
                maxlength: 15,
                pattern: /^[a-zA-Z0-9\s-._]+$/,
            },
            Vendor: {
                required: true,
                minlength: 5,
                maxlength: 50,
                pattern: /^[a-zA-Z0-9\s-._]+$/,
            },
        },
        messages: {
            VendorCode: {
                required: "Please enter a Vendor code",
                minlength: "Vendor code must be at least 5 characters long",
                maxlength: "Vendor code must be at most 15 characters long",
                pattern: "Special characters are not allowed",
            },
            Vendor: {
                required: "Please enter a Vendor Name",
                minlength: "Vendor must be at least 5 characters long",
                maxlength: "Vendor must be at most 50 characters long",
                pattern: "Special characters are not allowed",
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
            if (actionType === 'create division') {
                // Handle create action (insert)
                insertRecord();
            } else if (actionType === 'modify division') {
                // Handle update action
                updateRecord();
            }
        }
    });
    function bindTableData(data) {
        console.log(data);
        var resultData = data;
        var arrayReturn = [];
        srno = 1
        for (var i = 0; i < resultData.length; i++) {
            var result = resultData[i];
            var row = [];
            var internalId = result?.guid;
            row.push('<td style="padding: 0px; border: 0px;" data-id="' + internalId + '">' + srno + '</td>');
            row.push(result?.divisionCode);
            row.push(result?.division);
            row.push(result.isActive ? 'True' : 'False');
            arrayReturn.push(row);
            srno++
        }
        // Destroy existing DataTable instance (if it exists)
        var table = $('#TblVendor').DataTable();
        table.destroy();
        // Clear the table body
        $('#TblVendor tbody').empty();
        // Populate the table body with data
        var tbody = $('#TblVendor tbody');
        arrayReturn.forEach(function (rowData) {
            var row = $('<tr>');
            
            row.append('<td><input type="checkbox" class="rowCheckbox"></td>');
            
            rowData.forEach(function (cellData) {
                row.append($('<td>').html(cellData)); // Use html() to render HTML content
            });
            tbody.append(row);
        });
        // Initialize DataTable after binding data
        var table = $('#TblVendor').DataTable({
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
            var table = $('#TblVendor').DataTable(); // Initialize DataTable
            var isChecked = $(this).is(':checked');
            table.rows().select(isChecked);
            $('.rowCheckbox').prop('checked', isChecked);
        });
        // Handle individual row checkbox click
        $('#TblVendor tbody').on('click', '.rowCheckbox', function (e) {
            var table = $('#TblVendor').DataTable(); // Initialize DataTable
            e.stopPropagation();
            var isChecked = $(this).prop('checked');
            var row = $(this).closest('tr');
            // Toggle row selection
            table.row(row).select(isChecked);
        });
        // Handle individual row click (except the checkbox)
        $('#TblVendor tbody').on('click', 'tr:not(.select-checkbox)', function (e) {
            var table = $('#TblVendor').DataTable(); // Initialize DataTable
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
                var table = $('#TblVendor').DataTable(); // Initialize DataTable
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
        $('#VendorCode').val('');
        $('#Vendor').val('');
        $('#GUID').val('');
        $('#isActive').prop('checked', false).prop('disabled', false);
        $('#createNewVendorForm').find('.form-control').val('').removeClass('is-invalid');
        $('#createNewVendorForm').removeClass('was-validated');
    }
    // Handle the "Save" button click event
    $('#btnCancel').click(function () {
        resetModal();
        $('#createNewVendor').modal('hide');
    });
    $('#closemodal').click(function () {
        resetModal();
        $('#createNewVendor').modal('hide');
    });
    // Handle the "Add" button click event
    $('#btnCreateData').click(function () {
        // Reset modal fields
        resetModal();
        // Change modal title to "Create Vendor"
        $('#lblmodeltitle').text('Create Vendor');
        $('#isActive').prop('checked', true).prop('disabled', true);

        // Show the modal for creating
        $('#createNewVendor').modal('show');
    });
    $('#btnAddVendor').click(function () {
        // Reset modal fields
        resetModal();
        // Change modal title to "Create Vendor"
        $('#lblmodeltitle').text('Create Vendor');
        $('#isActive').prop('checked', true).prop('disabled', true);
        // Show the modal for creating
        $('#createNewVendor').modal('show');
    });
    function insertRecord() {
        var NewVendorCode = $('#VendorCode').val();
        var NewVendor = $('#Vendor').val().toLowerCase().trim();
        var table = $('#TblVendor').DataTable();
        var existingData = table.rows().data();
        var isDuplicate = false;
        existingData.each(function (row) {
            
            var VendorCode = row[2];
            var Vendor = row[3].toLowerCase().trim();
            
            if (VendorCode === NewVendorCode && Vendor === NewVendor) {
                isDuplicate = true;
                return false;
            }
        });
        if (isDuplicate) {
            showNotification("Duplicate entry: Vendor already exists", 'error');
        } else {
            // Continue with the insert action
            var requestData = {
                VendorCode: $('#VendorCode').val(),
                Vendor: $('#Vendor').val(),
                IsActive: $('#isActive').prop('checked'),
            };
            // Make an AJAX call to the insert action
            $.ajax({
                type: 'POST',
                url: '/Vendor/Insert',
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (response) {
                    // Handle success, e.g., show a notification
                    showNotification(response, 'success');
                    // Fetch and bind data again after successful insert
                    fetchDataAndBindTable();
                    resetModal();
                    $('#createNewVendor').modal('hide');
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
        var NewVendorCode = $('#VendorCode').val();
        var NewVendor = $('#Vendor').val().toLowerCase().trim();
        var newisActive = $('#isActive').prop('checked');
        // Check if the KPI Group Name or KPI Group Code already exists in DataTable
        var table = $('#TblVendor').DataTable();
        var existingData = table.rows().data();
        var isDuplicate = false;
        existingData.each(function (row) {
            
            var VendorCode = row[2];
            var Vendor = row[3].toLowerCase().trim();
            var isActive = row[4];
            
            // Convert isActive to boolean for comparison
            isActive = (isActive === 'True');
            if (VendorCode === NewVendorCode && Vendor === NewVendor && isActive === newisActive) {
                isDuplicate = true;
                return false;
            }
        });
        if (isDuplicate) {
            showNotification("Duplicate entry: Vendor already exists", 'error');
        } else {
            // Continue with the insert action
            var requestData = {
                GUID: $('#GUID').val(),
                VendorCode: $('#VendorCode').val(),
                Vendor: $('#Vendor').val(),
                IsActive: $('#isActive').prop('checked'),
            };
            // Make an AJAX call to the update action
            $.ajax({
                type: 'POST',
                url: '/Vendor/Update',
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (response) {
                    // Handle success, e.g., show a notification
                    showNotification(response, 'success');
                    // Fetch and bind data again after successful update
                    fetchDataAndBindTable();
                    resetModal();
                    $('#createNewVendor').modal('hide');
                },
                error: function (error) {
                    // Handle error, e.g., show an error notification
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
            url: '/Vendor/GetAllData',
            success: function (data) {
                // Bind the updated data to the table
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
    function validateExcelData(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var sheetName = workbook.SheetNames[0];
            var sheet = workbook.Sheets[sheetName];
            var excelData = XLSX.utils.sheet_to_json(sheet);
            // Perform validation on each row of Excel data
            var isValid = true;
            var errorMessages = [];
            if (isValid) {
                uploadFile(file); // Upload the file if data is valid
            } else {
                // Display error messages to the user
                errorMessages.forEach(function (errorMessage) {
                    showNotification(errorMessage, 'error');
                });
            }
        };
        reader.readAsBinaryString(file);
    }
    function validateExcelRow(row) {
        var errors = [];
        //Apply the same validation rules as defined in the createNewIndustryGroupForm
        if (!row.division) {
            errors.push("Row " + (index + 1) + ": Please enter a Vendor");
            return errors;
        }
        else {
            if (row.division.length < 3 || row.division.length > 50) {
                errors.push("Row " + (index + 1) + ": Vendor must be between 3 and 50 characters long");
                console.log(errors);
                return errors;
            }
            if (!/^[a-zA-Z0-9\s]+$/.test(row.division)) {
                errors.push("Row " + (index + 1) + ": Special characters are not allowed in Vendor");
                console.log(errors);
                return errors;
            }
        }
        return true;
    }
    function uploadFile(file) {
        var formData = new FormData();
        formData.append('file', $('#fileInput')[0].files[0]);
        $.ajax({
            url: '/Vendor/Upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // Handle success, e.g., show a notification
                showNotification(response, 'success');
                // Handle success
                fetchDataAndBindTable();
            },//success: function (response) 
            error: function () {
                // Handle error
            }//error: function ()
        });//$.ajax
    }
    $("#uploadFileButton").on("click", function () {
        $("#fileInput").click();
    });
    $('#fileInput').on('change', function () {
        var file = this.files[0];
        if (file) {
            uploadFile(file);
            //validateExcelData(file); // Validate Excel data before uploading
        }
    });
    
    $("#btnDeleteData").click(function () {
        var table = $('#TblVendor').DataTable();
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
        var DeleteRowsData = [];
        selectedRowsData.forEach(rowData => {
            const GuidElement = $(rowData[1]);
            const Guid = GuidElement.data("id");
            var DeleteRow = {
                Guid: Guid,
            };
            DeleteRowsData.push(DeleteRow);
        });
        console.log("DeleteRowsData:", DeleteRowsData);
        fetch("/Vendor/Delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(DeleteRowsData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Server response:", data);
                if (data.success) {
                    fetchDataAndBindTable();
                    showNotification("Data Deleted successfully.", "success");
                } else {
                    showNotification("An error occurred while Deleting data.", "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showNotification("An error occurred while Deleting data.", "error");
            });
    }
    $("#btnEditData").click(function () {
        resetModal();
        var newselectedRowsData = $('#TblVendor').DataTable().rows({ selected: true }).data();
        if (newselectedRowsData.length !== 1) {
            showNotification("Please select only one row.", "error");
            return;
        }
        var table = $('#tblVendor').DataTable();
        var rowData = newselectedRowsData[0];
        var internalId = $(rowData[1]).data('id'); // Assuming the ID is in the first column
        var VendorCode = rowData[2];
        var Vendor = rowData[3];
        var IsActive = rowData[4];
        // Populate modal fields
        $('#VendorCode').val(VendorCode);
        $('#Vendor').val(Vendor);
        $('#GUID').val(internalId);
        if (IsActive == 'True') {
            $('#isActive').prop('checked', true).prop('disabled', false);

        } else {
            $('#isActive').prop('checked', false).prop('disabled', false);

        }
        // Change modal title to "Modify Vendor"
        $('#lblmodeltitle').text('Modify Vendor');
        // Show the modal for editing
        $('#createNewVendor').modal('show');
    });
    
    return {
        init: function (data) {
            //fetchDataAndBindTable();
        }
    };
}(); //var GetForms